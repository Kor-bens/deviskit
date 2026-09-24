function renderLanding() {
  return `
  <header class="nav wrap">
    <div class="brand"><div class="logo">D</div> DevisKit</div>
    <div class="nav-links">
      <a href="#features">Produit</a>
      <a href="#pricing">Tarifs</a>
      <a href="#faq">FAQ</a>
      <button class="btn ghost sm" onclick="setView('app')">Ouvrir l'app</button>
    </div>
    <button class="btn forest" onclick="setView('editor')">Créer un devis</button>
  </header>
  <section class="hero wrap">
    <div>
      <div class="kicker">Pour indépendants & TPE</div>
      <h1>Des devis qui se signent.<br>Des factures qui se paient.</h1>
      <p class="lede">Créez un devis professionnel conforme en 2 minutes, convertissez-le en facture, suivez vos paiements. Sans logiciel usine à gaz, sans formation.</p>
      <div class="hero-cta">
        <button class="btn forest" onclick="setView('editor')">Essayer gratuitement</button>
        <button class="btn ghost" onclick="document.getElementById('pricing').scrollIntoView()">Voir les tarifs</button>
      </div>
      <div class="proof">
        <span>5 documents offerts</span>
        <span>Données locales, privées</span>
        <span>PDF en 1 clic</span>
      </div>
    </div>
    <div class="preview">
      <div class="row"><strong>DEVIS D-2026-001</strong><span class="muted">12 sept. 2026</span></div>
      <div class="muted" style="margin:8px 0 14px">Maison Lumière — Identité visuelle et site vitrine</div>
      <table>
        <tr><td>Direction artistique</td><td style="text-align:right">1 800,00 €</td></tr>
        <tr><td>Site vitrine 5 pages</td><td style="text-align:right">2 400,00 €</td></tr>
        <tr><td>Réseaux sociaux × 8</td><td style="text-align:right">720,00 €</td></tr>
      </table>
      <div class="line"></div>
      <div class="row"><span class="muted">Total TTC</span><span class="total">5 904,00 €</span></div>
    </div>
  </section>
  <section class="section wrap" id="features">
    <h2>Un seul outil. Le bon.</h2>
    <p class="lede">Henrri, Freebe et Indy sont excellents — et trop lourds si vous voulez juste envoyer un devis ce soir.</p>
    <div class="grid-3">
      <article class="card"><div class="icon">1</div><h3>Devis → facture</h3><p class="muted">Un bouton convertit le devis accepté en facture numérotée, avec historique.</p></article>
      <article class="card"><div class="icon">2</div><h3>Conforme FR</h3><p class="muted">SIRET, TVA, mentions légales, pénalités de retard et indemnité de 40 € déjà préremplis.</p></article>
      <article class="card"><div class="icon">3</div><h3>Zéro friction</h3><p class="muted">Pas de compte obligatoire pour tester. Vos données restent dans le navigateur.</p></article>
    </div>
  </section>
  <section class="section wrap" id="pricing">
    <h2>Simple comme un devis.</h2>
    <div class="pricing">
      <div class="price-card">
        <div>Découverte</div>
        <div class="amount">0 €</div>
        <div class="muted">pour démarrer</div>
        <ul>
          <li>5 documents</li>
          <li>2 clients</li>
          <li>Export PDF</li>
          <li>Mentions légales FR</li>
        </ul>
        <button class="btn ghost" onclick="setView('app')">Commencer</button>
      </div>
      <div class="price-card featured">
        <div>Pro</div>
        <div class="amount">9 €</div>
        <div class="muted">par mois, sans engagement</div>
        <ul>
          <li>Documents illimités</li>
          <li>Clients illimités</li>
          <li>Numérotation auto</li>
          <li>Suivi des statuts & CA</li>
        </ul>
        <button class="btn gold" onclick="upgrade('pro')">Choisir Pro</button>
      </div>
      <div class="price-card">
        <div>Studio</div>
        <div class="amount">19 €</div>
        <div class="muted">pour les petites agences</div>
        <ul>
          <li>Tout Pro</li>
          <li>Logo & charte</li>
          <li>Relances (bientôt)</li>
          <li>2 utilisateurs</li>
        </ul>
        <button class="btn ghost" onclick="upgrade('studio')">Choisir Studio</button>
      </div>
    </div>
  </section>
  <section class="section wrap faq" id="faq">
    <h2>Questions fréquentes</h2>
    <details open><summary>Est-ce un vrai logiciel de facturation ?</summary><p>C'est un MVP pensé pour les indépendants qui envoient peu de documents. Il génère devis et factures conformes aux mentions courantes. Il ne remplace pas encore une liasse fiscale ni l'envoi à l'administration.</p></details>
    <details><summary>Où sont stockées mes données ?</summary><p>Dans votre navigateur (localStorage). Rien n'est envoyé sur un serveur dans cette version. Pensez à exporter / ne pas vider le cache.</p></details>
    <details><summary>Comment encaisser vraiment ?</summary><p>Le bouton « Passer Pro » active le plan en mode démo. Pour un vrai SaaS, il reste à brancher Stripe + un compte utilisateur. Le modèle économique est déjà en place : freemium 9 € / 19 €.</p></details>
  </section>
  <footer class="wrap">
    <span>© 2026 DevisKit — micro-SaaS pour indépendants.</span>
    <span>Fait pour servir. Fait pour vendre.</span>
  </footer>`;
}
