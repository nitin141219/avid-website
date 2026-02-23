"use client";

import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    // Prevent duplicate injection
    if (document.querySelector("#google-translate-script")) return;

    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.id = "google-translate-script";
    document.body.appendChild(script);

    // Define the callback globally
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en" },
        "google_translate_element"
      );
    };
  }, []);

  return <div id="google_translate_element"></div>;
}

// Extend TS types
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}
