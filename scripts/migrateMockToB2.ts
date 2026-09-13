import { INITIAL_NAIL_COLORS } from "../src/components/color-palette/mockData.ts";
import { uploadToB2, saveJsonToB2 } from "../server/b2Service.ts";

async function migrate() {
  console.log(`Starting migration of ${INITIAL_NAIL_COLORS.length} mock colors to Backblaze B2 (bucket: goldhandsbusket)...`);

  const updatedColors = [];

  for (let i = 0; i < INITIAL_NAIL_COLORS.length; i++) {
    const item = INITIAL_NAIL_COLORS[i];
    console.log(`\n[${i + 1}/${INITIAL_NAIL_COLORS.length}] Migrating: "${item.title}" (${item.shade_code})...`);

    // 1. Download & upload swatch image
    console.log(`  Downloading swatch: ${item.swatch_image_url}`);
    const swatchRes = await fetch(item.swatch_image_url);
    if (!swatchRes.ok) {
      throw new Error(`Failed to fetch swatch: ${swatchRes.status}`);
    }
    const swatchBuffer = Buffer.from(await swatchRes.arrayBuffer());
    const swatchUpload = await uploadToB2(
      swatchBuffer,
      `swatch_${item.id}_${item.shade_code}.jpg`,
      "image/jpeg"
    );
    console.log(`  Uploaded swatch to B2: ${swatchUpload.key}`);

    // 2. Download & upload manicure image
    console.log(`  Downloading manicure: ${item.manicure_image_url}`);
    const maniRes = await fetch(item.manicure_image_url);
    if (!maniRes.ok) {
      throw new Error(`Failed to fetch manicure: ${maniRes.status}`);
    }
    const maniBuffer = Buffer.from(await maniRes.arrayBuffer());
    const maniUpload = await uploadToB2(
      maniBuffer,
      `manicure_${item.id}_${item.shade_code}.jpg`,
      "image/jpeg"
    );
    console.log(`  Uploaded manicure to B2: ${maniUpload.key}`);

    updatedColors.push({
      ...item,
      swatch_image_url: swatchUpload.url,
      manicure_image_url: maniUpload.url,
      b2_swatch_key: swatchUpload.key,
      b2_manicure_key: maniUpload.key,
    });
  }

  // 3. Save the full collection database as data/colors.json in B2
  console.log("\nSaving complete colors dataset into Backblaze B2 at 'data/colors.json'...");
  const jsonResult = await saveJsonToB2("data/colors.json", updatedColors);
  console.log("SUCCESS! Saved colors data in B2:", jsonResult);

  console.log("\nMigration completed successfully!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
