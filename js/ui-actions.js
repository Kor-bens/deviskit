function blankDoc(type) {
  return {
    id: uid(),
    type,
    number: nextNumber(type),
    status: "draft",
    clientId: state.clients[0]?.id || "",
    date: today(),
    validUntil: type === "devis" ? new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10) : "",
    title: "",
    notes: "",
    lines: [{ desc: "", qty: 1, unit: 0, tva: 20 }],
  };
}
function newDoc(type) {
  if (!canCreate()) return openPaywall();
  const doc = blankDoc(type);
  state.docs.push(doc);
  save(state);
  setView("editor", doc.id);
}
function patchDoc(id, patch) {
  const d = state.docs.find((x) => x.id === id);
  Object.assign(d, patch);
  save(state);
  render();
}
function patchLine(id, i, patch) {
  const d = state.docs.find((x) => x.id === id);
  Object.assign(d.lines[i], patch);
  save(state);
  render();
}
function addLine(id) {
  state.docs.find((x) => x.id === id).lines.push({ desc: "", qty: 1, unit: 0, tva: 20 });
  save(state);
  render();
}
function removeLine(id, i) {
  const d = state.docs.find((x) => x.id === id);
  d.lines.splice(i, 1);
  save(state);
  render();
}
function persistEditor() {
  save(state);
  toast("Document enregistré");
}
function convertToInvoice(id) {
  if (!canCreate()) return openPaywall();
  const src = state.docs.find((d) => d.id === id);
  const copy = {
    ...JSON.parse(JSON.stringify(src)),
    id: uid(),
    type: "facture",
    number: nextNumber("facture"),
    status: "sent",
    date: today(),
    validUntil: "",
  };
  src.status = "invoiced";
  state.docs.push(copy);
  save(state);
  setView("editor", copy.id);
  toast("Facture créée à partir du devis");
}
function addClient() {
  const name = prompt("Nom du client ?");
  if (!name) return;
  state.clients.push({ id: uid(), name, email: "", address: "", siret: "" });
  save(state);
  render();
}
function editClient(id) {
  const c = state.clients.find((x) => x.id === id);
  const name = prompt("Nom", c.name);
  if (name == null) return;
  c.name = name;
  c.email = prompt("Email", c.email) || "";
  c.address = prompt("Adresse", c.address) || "";
  save(state);
  render();
}
function removeClient(id) {
  if (!confirm("Supprimer ce client ?")) return;
  state.clients = state.clients.filter((c) => c.id !== id);
  save(state);
  render();
}
function saveCompany() {
  state.company = {
    ...state.company,
    name: document.getElementById("co-name").value,
    owner: document.getElementById("co-owner").value,
    email: document.getElementById("co-email").value,
    phone: document.getElementById("co-phone").value,
    siret: document.getElementById("co-siret").value,
    tva: document.getElementById("co-tva").value,
    address: document.getElementById("co-address").value,
    iban: document.getElementById("co-iban").value,
    legal: document.getElementById("co-legal").value,
  };
  save(state);
  toast("Entreprise mise à jour");
}
function render() {
  const root = document.getElementById("app");
  root.className = view === "landing" ? "" : "app-shell";
  if (view === "landing") root.innerHTML = renderLanding();
  else if (view === "docs") root.innerHTML = renderDocs();
  else if (view === "clients") root.innerHTML = renderClients();
  else if (view === "settings") root.innerHTML = renderSettings();
  else if (view === "editor") root.innerHTML = renderEditor();
  else root.innerHTML = renderDashboard();
}
window.addEventListener("hashchange", () => {
  const h = location.hash.replace("#", "") || "landing";
  if (!ROUTES.has(h)) {
    if (view !== "landing") {
      view = "landing";
      render();
    }
    return;
  }
  view = h;
  render();
});
document.addEventListener("DOMContentLoaded", render);
