const CONSENT_KEY='klp_consent';
const banner=document.getElementById('cookieBanner');

function hasConsent(){
  return localStorage.getItem(CONSENT_KEY)==='true';
}
function showBanner(){
  if(banner) banner.style.display='block';
}
function hideBanner(){
  if(banner) banner.style.display='none';
}
function acceptConsent(){
  localStorage.setItem(CONSENT_KEY,'true');
  hideBanner();
  enableOptional();
}
function denyConsent(){
  localStorage.setItem(CONSENT_KEY,'false');
  hideBanner();
}
function enableOptional(){
  document.querySelectorAll('iframe[data-src]').forEach(el=>{
    el.src=el.getAttribute('data-src');
    el.removeAttribute('data-src');
  });
}

// Jahr im Footer automatisch einsetzen
(function(){
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();
})();

// Banner zeigen, wenn noch keine Entscheidung getroffen wurde
if(localStorage.getItem(CONSENT_KEY)===null){
  showBanner();
} else if(hasConsent()){
  enableOptional();
}
wireForm('contactFormHome','contactMsgHome'); // Startseite
wireForm('contactForm','contactMsg');         // Kontaktseite
