// ===== DBA — Captura de leads (formulários do site) =====
//
// ENDPOINT: URL do Google Apps Script (Web App) ligado à planilha de leads dela.
// Enquanto não for substituído, os formulários caem de volta no comportamento antigo
// (abre o e-mail do visitante já preenchido) para não quebrar nada em produção.
// Depois que ela criar a planilha + publicar o Apps Script (ver instruções internas),
// troque a linha abaixo pela URL real (algo como
// "https://script.google.com/macros/s/AKfycb.../exec") e pronto: os 2 formulários do
// site passam a gravar direto na planilha dela.
window.DBA_LEADS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxxrzQk0FuPaKjj9RC5jXUZ7vPfXH8jO1-YKDYwl3Ko9CZN1xNnLxEhKoHBbt8wSPP1gQ/exec";

function dbaLeadsConfigured() {
  return window.DBA_LEADS_ENDPOINT && window.DBA_LEADS_ENDPOINT.indexOf("COLE_AQUI") !== 0;
}

// Envia o lead pra planilha via Apps Script. Usa no-cors (Apps Script Web App não
// libera CORS de leitura pra fetch de outro domínio), então não dá pra ler a resposta,
// só assumir sucesso se a chamada de rede não falhar.
function dbaSendLead(payload) {
  if (!dbaLeadsConfigured()) return Promise.resolve(false);
  return fetch(window.DBA_LEADS_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  }).then(function () { return true; }).catch(function () { return false; });
}

function dbaWhatsappUrl(text) {
  return "https://wa.me/5531992971725?text=" + encodeURIComponent(text);
}
