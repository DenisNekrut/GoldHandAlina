import { useContext } from "react";
import { SiteContentContext } from "./SiteContentContext";

export const useSiteContent = () => useContext(SiteContentContext);
