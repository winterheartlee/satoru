/* ===================================================================
 * Satoru — cookie consent + tag gating
 *
 * The compliance model (UK GDPR / PECR):
 *   • GA4 runs under Google Consent Mode v2. The <head> sets every storage
 *     category to 'denied' by default, so GA loads but stores no cookies and
 *     only measures in cookieless mode until the visitor opts in. Accept flips
 *     analytics_storage (and the ad_* signals) to 'granted'.
 *   • The Meta Pixel has no cookieless mode, so it is NOT loaded at all until
 *     consent is given — no fbevents.js, no cookies, no PageView. (The usual
 *     <noscript> fallback pixel is deliberately omitted: it cannot respect
 *     consent, so it has no place on a consent-gated site.)
 *   • The choice is remembered in localStorage. "Cookie preferences" in the
 *     footer re-opens the banner so consent can be withdrawn as easily as given.
 *
 * British English throughout. Self-contained; no dependencies.
 * ------------------------------------------------------------------- */
(function () {
  "use strict";

  var STORAGE_KEY = "satoru_cookie_consent"; // 'granted' | 'denied'
  var PIXEL_ID = "1821960069008970";
  var pixelLoaded = false;

  function readChoice() {
    try { return window.localStorage.getItem(STORAGE_KEY); }
    catch (e) { return null; }
  }
  function saveChoice(v) {
    try { window.localStorage.setItem(STORAGE_KEY, v); } catch (e) {}
  }

  /* --- Google Consent Mode: flip analytics/ads on or off --- */
  function updateGoogle(state) {
    if (typeof window.gtag !== "function") return;
    window.gtag("consent", "update", {
      "ad_storage": state,
      "ad_user_data": state,
      "ad_personalization": state,
      "analytics_storage": state
    });
  }

  /* --- Meta Pixel: load only once, only on consent --- */
  function loadPixel() {
    if (pixelLoaded) return;
    pixelLoaded = true;
    /* Meta's standard loader, fired from here instead of the <head> so it never
       runs without consent. */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
  }

  function enableAll() {
    updateGoogle("granted");
    loadPixel();
  }

  /* --- banner UI --- */
  function buildBanner() {
    if (document.querySelector(".cc-banner")) return;
    var wrap = document.createElement("div");
    wrap.className = "cc-banner";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-label", "Cookie consent");
    wrap.setAttribute("aria-live", "polite");
    wrap.innerHTML =
      '<div class="cc-banner__inner">' +
        '<p class="cc-banner__text">We use cookies to see how the site is used and, if you opt in, ' +
        'to measure our marketing. You can accept or reject non-essential cookies at any time. ' +
        'See our <a href="privacy.html">Privacy &amp; Cookies</a> policy.</p>' +
        '<div class="cc-banner__actions">' +
          '<button type="button" class="cc-btn cc-btn--reject" data-cc="reject">Reject</button>' +
          '<button type="button" class="cc-btn cc-btn--accept" data-cc="accept">Accept</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);
    wrap.addEventListener("click", function (ev) {
      var choice = ev.target && ev.target.getAttribute && ev.target.getAttribute("data-cc");
      if (choice === "accept") { saveChoice("granted"); enableAll(); removeBanner(); }
      else if (choice === "reject") { saveChoice("denied"); updateGoogle("denied"); removeBanner(); }
    });
  }
  function removeBanner() {
    var el = document.querySelector(".cc-banner");
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }
  function showBanner() {
    if (document.body) buildBanner();
    else document.addEventListener("DOMContentLoaded", buildBanner);
  }

  /* --- "Cookie preferences" links (re-open the banner to change/withdraw) --- */
  function wireManageLinks() {
    document.addEventListener("click", function (ev) {
      var t = ev.target;
      while (t && t.getAttribute) {
        if (t.getAttribute("data-cc-manage") !== null) {
          ev.preventDefault();
          showBanner();
          return;
        }
        t = t.parentNode;
      }
    });
  }

  /* --- init --- */
  var choice = readChoice();
  if (choice === "granted") enableAll();      // returning visitor who opted in
  else if (choice !== "denied") showBanner(); // no decision yet → ask
  // choice === 'denied' → stay cookieless, no banner
  wireManageLinks();
})();
