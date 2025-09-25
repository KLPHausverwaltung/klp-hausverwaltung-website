// -----------------------------
// Cookie/Consent + Jahr im Footer
// -----------------------------
const CONSENT_KEY = 'klp_consent';
const banner = document.getElementById('cookieBanner');

function hasConsent(){ return localStorage.getItem(CONSENT_KEY) === 'true'; }
function showBanner(){ if (banner) banner.style.display = 'block'; }
function hideBanner(){ if (banner) banner.style.display = 'none'; }
function acceptConsent(){ localStorage.setItem(CONSENT_KEY,'true'); hideBanner(); enableOptional(); }
function denyConsent(){ localStorage.setItem(CONSENT_KEY,'false'); hideBanner(); }

function enableOptional(){
  // Externe Inhalte erst nach Einwilligung laden (z. B. Google Maps)
  document.querySelectorAll('iframe[data-src]').forEach(el=>{
    el.src = el.getAttribute('data-src');
    el.removeAttribute('data-src');
  });
}

// Jahr im Footer automatisch setzen
(function(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// Consent-Status initial anwenden
if (localStorage.getItem(CONSENT_KEY) === null){
  showBanner();
} else if (hasConsent()){
  enableOptional();
}

// -----------------------------
// AJAX-Submit für Kontaktformulare (deutsche Meldung, kein Redirect)
// -----------------------------
function wireForm(formId, msgId){
  const form = document.getElementById(formId);
  const msg  = document.getElementById(msgId);
  if (!form) return;

  form.addEventListener('submit', async (e)=>{
    e.preventDefault(); // Seitenwechsel verhindern
    if (msg) msg.textContent = 'Senden …';
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try{
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' } // bevorzugt JSON
      });

      const ct = (res.headers.get('content-type') || '').toLowerCase();
      if (ct.includes('application/json')) { 
        await res.json();
      } else { 
        await res.text(); // Fallback – verhindert JSON.parse-Fehler
      }

      if (res.ok){
        if (msg) msg.textContent = 'Danke! Wir melden uns zeitnah.';
        form.reset();
      } else {
        if (msg) msg.textContent = 'Fehler beim Senden. Bitte später erneut versuchen.';
      }
    } catch (err){
      if (msg) msg.textContent = 'Netzwerkfehler. Bitte später erneut versuchen.';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// Formulare aktivieren
wireForm('contactFormHome','contactMsgHome'); // Startseite (index.html)
wireForm('contactForm','contactMsg');         // Kontaktseite (kontakt.html)
// (später für Monteursunterkunft möglich: wireForm('monteurForm','monteurMsg');)

