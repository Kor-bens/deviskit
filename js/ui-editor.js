function renderEditor() {
  let doc = state.docs.find((d) => d.id === editingId);
  if (!doc) {
    doc = blankDoc("devis");
    editingId = doc.id;
    state.docs.push(doc);
    save(state);
  }
  const t = totals(doc);
  const clientOpts = state.clients.map((c) => `<option value="${c.id}" ${c.id === doc.clientId ? "selected" : ""}>${esc(c.name)}</option>`).join("");
  return renderAppFrame(`
    <div class="topbar no-print">
      <div>
        <h2 style="font-family:var(--display);font-size:28px">${doc.type === "facture" ? "Facture" : "Devis"} ${doc.number}</h2>
        <p class="muted">Modifiez à gauche, prévisualisez à droite.</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${doc.type === "devis" ? `<button class="btn ghost" onclick="convertToInvoice('${doc.id}')">Convertir en facture</button>` : ""}
        <button class="btn ghost" onclick="window.print()">Exporter PDF</button>
        <button class="btn forest" onclick="persistEditor('${doc.id}')">Enregistrer</button>
      </div>
    </div>
    <div class="editor">
      <div class="card no-print">
        <div class="form-grid">
          <label>Type
            <select onchange="patchDoc('${doc.id}',{type:this.value})">
              <option value="devis" ${doc.type === "devis" ? "selected" : ""}>Devis</option>
              <option value="facture" ${doc.type === "facture" ? "selected" : ""}>Facture</option>
            </select>
          </label>
          <label>Statut
            <select onchange="patchDoc('${doc.id}',{status:this.value})">
              ${["draft","sent","accepted","invoiced","paid"].map((s) => `<option value="${s}" ${doc.status===s?"selected":""}>${statusLabel(s)}</option>`).join("")}
            </select>
          </label>
          <label>Client
            <select onchange="patchDoc('${doc.id}',{clientId:this.value})">${clientOpts}</select>
          </label>
          <label>Date <input type="date" value="${doc.date}" onchange="patchDoc('${doc.id}',{date:this.value})"></label>
          <label>Validité <input type="date" value="${doc.validUntil || ""}" onchange="patchDoc('${doc.id}',{validUntil:this.value})"></label>
          <label>Objet <input value="${esc(doc.title)}" onchange="patchDoc('${doc.id}',{title:this.value})"></label>
        </div>
        <div style="margin-top:16px;display:flex;justify-content:space-between;align-items:center">
          <strong>Lignes</strong>
          <button class="btn sm ghost" onclick="addLine('${doc.id}')">+ Ligne</button>
        </div>
        ${(doc.lines || []).map((l, i) => `
          <div class="form-grid" style="margin-top:10px;grid-template-columns:2fr .6fr .8fr .6fr auto">
            <input value="${esc(l.desc)}" placeholder="Désignation" onchange="patchLine('${doc.id}',${i},{desc:this.value})">
            <input type="number" min="0" step="0.25" value="${l.qty}" onchange="patchLine('${doc.id}',${i},{qty:+this.value})">
            <input type="number" min="0" step="0.01" value="${l.unit}" onchange="patchLine('${doc.id}',${i},{unit:+this.value})">
            <input type="number" min="0" value="${l.tva}" onchange="patchLine('${doc.id}',${i},{tva:+this.value})">
            <button class="btn danger sm" onclick="removeLine('${doc.id}',${i})">×</button>
          </div>`).join("")}
        <label style="margin-top:14px">Notes
          <textarea rows="3" onchange="patchDoc('${doc.id}',{notes:this.value})">${esc(doc.notes)}</textarea>
        </label>
      </div>
      ${renderPaper(doc, t)}
    </div>
  `);
}
function renderPaper(doc, t) {
  const co = state.company;
  const cl = clientById(doc.clientId);
  return `<article class="doc-paper" id="paper">
    <div class="row">
      <div>
        <div class="brand"><div class="logo">D</div> <strong>${esc(co.name)}</strong></div>
        <p class="muted" style="margin-top:8px;white-space:pre-line">${esc(co.address)}\n${esc(co.email)} · ${esc(co.phone)}</p>
      </div>
      <div style="text-align:right">
        <div style="font-family:var(--display);font-size:28px">${doc.type === "facture" ? "FACTURE" : "DEVIS"}</div>
        <div>${esc(doc.number)}</div>
        <div class="muted">${new Date(doc.date).toLocaleDateString("fr-FR")}</div>
      </div>
    </div>
    <div class="line"></div>
    <div class="row">
      <div>
        <div class="muted">Émetteur</div>
        <strong>${esc(co.owner)}</strong>
        <div class="muted">SIRET ${esc(co.siret)}</div>
      </div>
      <div style="text-align:right">
        <div class="muted">Client</div>
        <strong>${esc(cl.name)}</strong>
        <div class="muted" style="white-space:pre-line">${esc(cl.address)}</div>
      </div>
    </div>
    <p style="margin:18px 0 8px"><strong>${esc(doc.title)}</strong></p>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead><tr style="text-align:left;color:var(--ink-soft)">
        <th style="padding:8px 0">Désignation</th><th>Qté</th><th>PU HT</th><th>TVA</th><th style="text-align:right">Total HT</th>
      </tr></thead>
      <tbody>
        ${(doc.lines || []).map((l) => `<tr>
          <td style="padding:8px 0;border-top:1px solid var(--line)">${esc(l.desc)}</td>
          <td>${l.qty}</td><td>${euro(l.unit)}</td><td>${l.tva}%</td>
          <td style="text-align:right">${euro(l.qty * l.unit)}</td>
        </tr>`).join("")}
      </tbody>
    </table>
    <div style="margin-top:18px;margin-left:auto;width:240px">
      <div class="row"><span class="muted">Total HT</span><span>${euro(t.ht)}</span></div>
      <div class="row"><span class="muted">TVA</span><span>${euro(t.tva)}</span></div>
      <div class="row" style="margin-top:6px"><strong>Total TTC</strong><strong>${euro(t.ttc)}</strong></div>
    </div>
    ${doc.notes ? `<p style="margin-top:22px;white-space:pre-line">${esc(doc.notes)}</p>` : ""}
    ${doc.type === "facture" ? `<p class="muted" style="margin-top:16px">IBAN : ${esc(co.iban)}</p>` : `<p class="muted" style="margin-top:16px">Valable jusqu'au ${doc.validUntil ? new Date(doc.validUntil).toLocaleDateString("fr-FR") : "—"}</p>`}
    <p class="muted" style="margin-top:28px;font-size:11px">${esc(co.legal)}</p>
  </article>`;
}
