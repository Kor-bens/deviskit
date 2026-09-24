const FREE_LIMIT = 5;
const KEY = "deviskit.v1";
const defaultState = () => ({
  plan: "free",
  company: {
    name: "Studio Atelier Nord",
    owner: "Camille Morel",
    address: "18 rue des Teinturiers\n59000 Lille",
    email: "camille@atelier-nord.fr",
    phone: "06 12 34 56 78",
    siret: "839 221 445 00017",
    tva: "FR42839221445",
    iban: "FR76 3000 6000 0112 3456 7890 189",
    legal: "SIRET 839 221 445 00017 — TVA intracommunautaire FR42839221445. En cas de retard de paiement, une pénalité égale à 3 fois le taux d'intérêt légal sera appliquée, ainsi qu'une indemnité forfaitaire de 40 € pour frais de recouvrement.",
  },
  clients: [
    { id: "c1", name: "Maison Lumière", email: "hello@maisonlumiere.fr", address: "4 quai de la Loire, 75019 Paris", siret: "812 334 221 00029" },
    { id: "c2", name: "Boulangerie Holtzer", email: "contact@holtzer.fr", address: "9 place du Marché, 67000 Strasbourg", siret: "" },
  ],
  docs: [
    {
      id: "d1", type: "devis", number: "D-2026-001", status: "accepted",
      clientId: "c1", date: "2026-09-12", validUntil: "2026-10-12",
      title: "Identité visuelle et site vitrine",
      notes: "Acompte de 30 % à la commande. Livraison sous 4 semaines après validation des maquettes.",
      lines: [
        { desc: "Direction artistique + charte", qty: 1, unit: 1800, tva: 20 },
        { desc: "Site vitrine 5 pages", qty: 1, unit: 2400, tva: 20 },
        { desc: "Déclinaisons réseaux sociaux", qty: 8, unit: 90, tva: 20 },
      ],
    },
    {
      id: "d2", type: "facture", number: "F-2026-014", status: "paid",
      clientId: "c2", date: "2026-09-04", validUntil: "",
      title: "Reportage photo ouverture",
      notes: "Merci. Paiement reçu le 08/09/2026.",
      lines: [{ desc: "Demi-journée shooting + 25 photos retouchées", qty: 1, unit: 650, tva: 20 }],
    },
  ],
});
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}
function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}
let state = load();
let view = (() => {
  const h = location.hash.replace("#", "") || "landing";
  return ["landing", "app", "docs", "clients", "settings", "editor"].includes(h) ? h : "landing";
})();
let editingId = null;
const euro = (n) => (Number(n) || 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);
const nextNumber = (type) => {
  const prefix = type === "facture" ? "F" : "D";
  const year = new Date().getFullYear();
  const count = state.docs.filter((d) => d.type === type && d.number.includes(String(year))).length + 1;
  return `${prefix}-${year}-${String(count).padStart(3, "0")}`;
};
function totals(doc) {
  const ht = (doc.lines || []).reduce((s, l) => s + l.qty * l.unit, 0);
  const tva = (doc.lines || []).reduce((s, l) => s + l.qty * l.unit * (l.tva / 100), 0);
  return { ht, tva, ttc: ht + tva };
}
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(() => (el.style.display = "none"), 2400);
}
const ROUTES = new Set(["landing", "app", "docs", "clients", "settings", "editor"]);
function setView(v, extra) {
  view = ROUTES.has(v) ? v : "landing";
  if (extra) editingId = extra;
  location.hash = view === "landing" ? "" : view;
  render();
  window.scrollTo(0, 0);
}
function canCreate() {
  if (state.plan !== "free") return true;
  return state.docs.length < FREE_LIMIT;
}
function openPaywall() {
  document.getElementById("paywall").style.display = "grid";
}
function closePaywall() {
  document.getElementById("paywall").style.display = "none";
}
function upgrade(plan) {
  state.plan = plan;
  save(state);
  closePaywall();
  toast(plan === "pro" ? "Plan Pro activé (démo)" : "Plan Studio activé (démo)");
  render();
}
function clientById(id) {
  return state.clients.find((c) => c.id === id) || { name: "Client", address: "", email: "" };
}
function statusLabel(s) {
  return { draft: "Brouillon", sent: "Envoyé", accepted: "Accepté", invoiced: "Facturé", paid: "Payé" }[s] || s;
}
