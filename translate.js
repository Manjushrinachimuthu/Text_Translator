document.addEventListener("DOMContentLoaded", () => {

  // ----------------- LOAD LOGGED-IN USER DATA -----------------
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "index.html";  // Redirect if not logged in
    return;
  }

  // Set Avatar — first letter of username
  const avatar = document.getElementById("userAvatar");
  if (avatar) {
    avatar.textContent = user.username.charAt(0).toUpperCase();
  }

  // Set Email
  const emailField = document.getElementById("userEmail");
  if (emailField) {
    emailField.textContent = user.email;
  }

  // ----------------- SAVE HISTORY FUNCTION -----------------
  async function saveHistory(input_text, translated_text, source_language, target_language) {
    try {
      await fetch("http://localhost:3000/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          input_text,
          translated_text,
          source_language,
          target_language
        })
      });

      console.log("History saved");
    } catch (err) {
      console.error("Error saving history:", err);
    }
  }

  // ----------------- INDIAN TRANSLATOR -----------------
  const inputIndian = document.getElementById("inputTextIndian");
  const targetIndian = document.getElementById("targetLanguageIndian"); // Correct ID
  const translateBtnIndian = document.getElementById("translateBtnIndian");
  const translatedIndian = document.getElementById("translatedTextIndian");
  const charCountIndian = document.getElementById("charCountIndian");

  inputIndian.addEventListener("input", () => {
    charCountIndian.textContent = `${inputIndian.value.length} characters`;
  });

  translateBtnIndian.addEventListener("click", async () => {
    const text = inputIndian.value.trim();
    const targetLang = targetIndian.value;

    if (!text || !targetLang) {
      translatedIndian.textContent = "Please enter text and select a language.";
      return;
    }

    translatedIndian.textContent = "Translating...";

    try {
      const response = await fetch("http://127.0.0.1:5000/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang })
      });

      const data = await response.json();
      const translated = data.translatedText || data.error || "Failed.";

      translatedIndian.textContent = translated;

      // Save history
      saveHistory(text, translated, "English", targetLang);

    } catch (err) {
      translatedIndian.textContent = "Error fetching translation.";
    }
  });

  // ----------------- NON-INDIAN TRANSLATOR -----------------
  const inputOther = document.getElementById("inputTextOther");
  const targetOther = document.getElementById("targetLanguageOther");
  const dialectOther = document.getElementById("dialectVariantOther");
  const translateBtnOther = document.getElementById("translateBtnOther");
  const translatedOther = document.getElementById("translatedTextOther");
  const charCountOther = document.getElementById("charCountOther");

  const dialects = {
    en: ["American", "British", "Indian"],
    es: ["Latin American", "Spain"],
    fr: ["Parisian", "Canadian"],
    zh: ["Simplified", "Traditional"]
  };

  targetOther.addEventListener("change", () => {
    const lang = targetOther.value;

    dialectOther.innerHTML = '<option value="">Select dialect</option>';
    if (dialects[lang]) {
      dialects[lang].forEach(d => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        dialectOther.appendChild(opt);
      });
      dialectOther.disabled = false;
    } else {
      dialectOther.disabled = true;
    }
  });

  inputOther.addEventListener("input", () => {
    charCountOther.textContent = `${inputOther.value.length} characters`;
  });

  translateBtnOther.addEventListener("click", async () => {
    const text = inputOther.value.trim();
    const targetLang = targetOther.value;
    const dialect = dialectOther.value;

    if (!text || !targetLang) {
      translatedOther.textContent = "Please enter text and select a language.";
      return;
    }

    translatedOther.textContent = "Translating...";

    try {
      const response = await fetch("http://127.0.0.1:5000/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang, targetDialect: dialect })
      });

      const data = await response.json();
      const translated = data.translatedText || data.error || "Failed.";

      translatedOther.textContent = translated;

      // Save history
      saveHistory(text, translated, "English", targetLang);

    } catch (err) {
      translatedOther.textContent = "Error fetching translation.";
    }
  });

});
