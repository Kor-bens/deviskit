function renderAppFrame(inner) {
  return `
  <aside class="sidebar">
    <div class="brand" style="margin:6px 8px 18px"><div class="logo">D</div> DevisKit</div>
    <button class="side-link ${view === "app" ? "active" : ""}" onclick="setView('app')">Tableau de bord</button>
    <button class="side-link ${view === "docs" ? "active" : ""}" onclick="setView('docs')">Documents</button>
    <button class="side-link ${view === "clients" ? "active" : ""}" onclick="setView('clients')">Clients</button>
    <button class="side-link ${view === "settings" ? "active" : ""}" onclick="setView('settings')">Mon entreprise</button>
    <div style="flex:1"></div>
    <button class="side-link" onclick="setView('landing')">← Site public</button>
    <div class="muted" style="padding:10px 12px;color:#9bb5a6">Plan ${state.plan}</div>
  </aside>
  <section class="main">
    ${inner}
  </section>`;
}
function renderDashboard() {
  const paid = state.docs.filter((d) => d.status === "paid").reduce((s, d) => s + totals(d).ttc, 0);
  const pending = state.docs.filter((d) => d.type === "facture" && d.status !== "paid").reduce((s, d) => s + totals(d).ttc, 0);
  const accepted = state.docs.filter((d) => d.status === "accepted").length;
  return renderAppFrame(`
    <div class="topbar">
      <div>
        <h2 style="font-family:var(--display);font-size:32px">Bonjour ${state.company.owner.split(" ")[0]}</h2>
        <p class="muted">${state.docs.length} document(s) · plan ${state.plan}</p>
      </div>
      <button class="btn forest" onclick="newDoc('devis')">Nouveau devis</button>
    </div>
    <div class="stats">
      <div class="stat"><span class="muted">Encaissé</span><b>${euro(paid)}</b></div>
      <div class="stat"><span class="muted">Facturé à encaisser</span><b>${euro(pending)}</b></div>
      <div class="stat"><span class="muted">Devis acceptés</span><b>${accepted}</b></div>
      <div class="stat"><span class="muted">Quota gratuit</span><b>${state.plan === "free" ? `${state.docs.length}/${FREE_LIMIT}` : "∞"}</b></div>
    </div>
    ${renderDocTable(state.docs.slice().reverse().slice(0, 6))}
  `);
}
function renderDocTable(list) {
  if (!list.length) return `<div class="card">Aucun document pour l'instant.</div>`;
  return `<table class="table">
    <thead><tr><th>N°</th><th>Type</th><th>Client</th><th>Objet</th><th>Total TTC</th><th>Statut</th><th></th></tr></thead>
    <tbody>
      ${list.map((d) => `<tr>
        <td>${d.number}</td>
        <td>${d.type}</td>
        <td>${clientById(d.clientId).name}</td>
        <td>${d.title || "—"}</td>
        <td>${euro(totals(d).ttc)}</td>
        <td><span class="badge ${d.status}">${statusLabel(d.status)}</span></td>
        <td><button class="btn ghost sm" onclick="setView('editor','${d.id}')">Ouvrir</button></td>
      </tr>`).join("")}
    </tbody>
  </table>`;
}
function renderDocs() {
  return renderAppFrame(`
    <div class="topbar">
      <h2 style="font-family:var(--display);font-size:32px">Documents</h2>
      <div style="display:flex;gap:8px">
        <button class="btn ghost" onclick="newDoc('facture')">Nouvelle facture</button>
        <button class="btn forest" onclick="newDoc('devis')">Nouveau devis</button>
      </div>
    </div>
    ${renderDocTable(state.docs.slice().reverse())}
  `);
}
function renderClients() {
  return renderAppFrame(`
    <div class="topbar">
      <h2 style="font-family:var(--display);font-size:32px">Clients</h2>
      <button class="btn forest" onclick="addClient()">Ajouter</button>
    </div>
    <div class="grid-3">
      ${state.clients.map((c) => `
        <article class="card">
          <h3>${c.name}</h3>
          <p class="muted">${c.email || "Pas d'email"}<br>${(c.address || "").replaceAll("\n", "<br>")}</p>
          <div style="margin-top:12px;display:flex;gap:8px">
            <button class="btn ghost sm" onclick="editClient('${c.id}')">Modifier</button>
            <button class="btn danger sm" onclick="removeClient('${c.id}')">Supprimer</button>
          </div>
        </article>`).join("")}
    </div>
  `);
}
function renderSettings() {
  const c = state.company;
  return renderAppFrame(`
    <div class="topbar"><h2 style="font-family:var(--display);font-size:32px">Mon entreprise</h2>
      <button class="btn forest" onclick="saveCompany()">Enregistrer</button></div>
    <div class="card">
      <div class="form-grid">
        <label>Nom commercial <input id="co-name" value="${esc(c.name)}"></label>
        <label>Nom du dirigeant <input id="co-owner" value="${esc(c.owner)}"></label>
        <label>Email <input id="co-email" value="${esc(c.email)}"></label>
        <label>Téléphone <input id="co-phone" value="${esc(c.phone)}"></label>
        <label>SIRET <input id="co-siret" value="${esc(c.siret)}"></label>
        <label>N° TVA <input id="co-tva" value="${esc(c.tva)}"></label>
        <label style="grid-column:1/-1">Adresse <textarea id="co-address" rows="3">${esc(c.address)}</textarea></label>
        <label style="grid-column:1/-1">IBAN <input id="co-iban" value="${esc(c.iban)}"></label>
        <label style="grid-column:1/-1">Mentions légales <textarea id="co-legal" rows="4">${esc(c.legal)}</textarea></label>
      </div>
    </div>
  `);
}
function esc(s) {
  return String(s || "")
    .replaceAll("&", "&")
    .replaceAll("<", "<")
    .replaceAll(">", ">")
    .replaceAll('"', """);
}
