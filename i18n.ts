"use client";

import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { getServerLang } from "./utils/serverCookies";

import en from "./public/locales/en.json";
import ae from "./public/locales/ae.json";
import da from "./public/locales/da.json";
import de from "./public/locales/de.json";
import el from "./public/locales/el.json";
import es from "./public/locales/es.json";
import fr from "./public/locales/fr.json";
import hu from "./public/locales/hu.json";
import it from "./public/locales/it.json";
import ja from "./public/locales/ja.json";
import pl from "./public/locales/pl.json";
import pt from "./public/locales/pt.json";
import ru from "./public/locales/ru.json";
import sv from "./public/locales/sv.json";
import tr from "./public/locales/tr.json";
import zh from "./public/locales/zh.json";

const langObj: any = { en, ae, da, de, el, es, fr, hu, it, ja, pl, pt, ru, sv, tr, zh };

const getLang = () => {
  if (typeof window !== "undefined") {
    // ✅ Client-side: Use universal-cookie
    const cookies = new Cookies();
    return cookies.get("i18nextLng") || "en";
  }
  return "en"; // Default language for initial render
};

export const getTranslation = () => {
  const [lang, setLang] = useState(getLang());

  useEffect(() => {
    if (typeof window === "undefined") {
      // ✅ Fetch server-side language only after the first render
      getServerLang().then((serverLang: string) => setLang(serverLang));
    }
  }, []);

  const data: any = langObj[lang || "en"];

  const t = (key: string) => {
    return data[key] ? data[key] : key;
  };

  const initLocale = (themeLocale: string) => {
    i18n.changeLanguage(lang || themeLocale);
  };

  const i18n = {
    language: lang,
    changeLanguage: (newLang: string) => {
      setLang(newLang);
      if (typeof window !== "undefined") {
        const cookies = new Cookies();
        cookies.set("i18nextLng", newLang, { path: "/" });
      }
    },
  };

  return { t, i18n, initLocale };
};