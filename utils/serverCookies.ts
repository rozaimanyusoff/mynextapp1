"use server"; // This ensures the file is treated as server-only

import { cookies } from "next/headers";

export const getServerLang = async (): Promise<string> => {
  const cookieStore = await cookies();
  return cookieStore.get("i18nextLng")?.value || "en";
};