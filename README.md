# DevisKit

Micro-SaaS de devis et factures pour indépendants et TPE françaises.

## Pourquoi ça peut générer des revenus

- **Problème réel** : les freelances perdent du temps sur Word / Canva pour envoyer un devis, puis recréent une facture à la main.
- **Offre claire** : 0 € (5 documents) → **9 €/mois Pro** → **19 €/mois Studio**.
- **Marché** : 1,8+ million d'indépendants en France. Des outils existent (Henrri, Freebe, Abby) mais restent lourds pour un usage simple.
- **Unité économique** : 200 clients Pro = ~1 800 € MRR. Acquisition possible via SEO « générateur de devis freelance », communautés Slack / LinkedIn, Product Hunt, Indie Hackers.

## Fonctionnalités du MVP

- Landing + application complète
- Devis et factures avec TVA, numérotation, mentions légales FR
- Conversion devis → facture
- Clients, entreprise, tableau de bord CA
- Export PDF via impression navigateur
- Freemium (plafond 5 documents) + paywall
- Stockage local (aucune donnée envoyée)

## Suite pour encaisser vraiment

1. Compte utilisateur (Supabase / Clerk)
2. Stripe Checkout sur les boutons Pro / Studio
3. Sauvegarde cloud
4. Envoi email du PDF
5. Relances J+7 / J+15 (plan Studio)

## Lancer en local

Ouvrir `index.html` ou servir le dossier :

```bash
npx serve .
```
