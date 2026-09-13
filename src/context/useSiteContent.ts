import { useContext } from "react";
import { SiteContentContext } from "./siteContentContextDef";

export const useSiteContent = () => useContext(SiteContentContext);

