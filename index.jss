(function () {
  "use strict";

  /* ---------- language toggle (EN / AR) ---------- */
  var STORAGE_KEY = "invincible-mc-lang";
  var html = document.documentElement;
  var toggleBtn = document.getElementById("langToggle");

  function applyLang(lang) {
    var isAr = lang === "ar";
    html.setAttribute("lang", isAr ? "ar" : "en");
    html.setAttribute("dir", isAr ? "rtl" : "ltr");

    document.querySelectorAll("[data-en]").forEach(function (el) {
      var text = isAr ? el.getAttribute("data-ar") : el.getAttribute("data-en");
      if (text !== null) el.textContent = text;
    });

    document.querySelectorAll("[data-en-alt]").forEach(function (el) {
      var alt = isAr ? el.getAttribute("data-ar-alt") : el.getAttribute("data-en-alt");
      if (alt !== null) el.setAttribute("alt", alt);
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
  }

  var savedLang = "en";
  try { savedLang = localStorage.getItem(STORAGE_KEY) || "en"; } catch (e) { /* ignore */ }
  applyLang(savedLang);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      var current = html.getAttribute("lang") === "ar" ? "ar" : "en";
      applyLang(current === "ar" ? "en" : "ar");
    });
  }

  /* ---------- copy to clipboard (IP / port) ---------- */
  var toast = document.getElementById("toast");
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 1800);
  }

  function copyText(text) {
    var isAr = html.getAttribute("lang") === "ar";
    var successMsg = isAr ? "تم النسخ: " + text : "Copied: " + text;
    var failMsg = isAr ? "تعذر النسخ" : "Couldn't copy";

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast(successMsg);
      }, function () {
        showToast(failMsg);
      });
    } else {
      var temp = document.createElement("textarea");
      temp.value = text;
      temp.style.position = "fixed";
      temp.style.opacity = "0";
      document.body.appendChild(temp);
      temp.select();
      try {
        document.execCommand("copy");
        showToast(successMsg);
      } catch (e) {
        showToast(failMsg);
      }
      document.body.removeChild(temp);
    }
  }

  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy");
      if (value) copyText(value);
    });
  });

  /* ---------- decorative floating pixels ---------- */
  var field = document.getElementById("pixelField");
  if (field && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var count = window.innerWidth < 640 ? 14 : 28;
    for (var i = 0; i < count; i++) {
      var pixel = document.createElement("span");
      pixel.style.left = Math.random() * 100 + "%";
      pixel.style.bottom = -10 - Math.random() * 40 + "px";
      pixel.style.animationDuration = 12 + Math.random() * 14 + "s";
      pixel.style.animationDelay = Math.random() * 10 + "s";
      pixel.style.opacity = String(0.15 + Math.random() * 0.3);
      field.appendChild(pixel);
    }
  }
})();
