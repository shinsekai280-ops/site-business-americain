# Installation — étape par étape

Compte environ 45 minutes la première fois. Tout est gratuit pour démarrer (sauf ton nom de domaine, environ 10 à 15 $ par an).

Garde un bloc-notes ouvert : tu vas copier plusieurs clés. **Ne les partage jamais** (ni en vidéo, ni sur Discord, ni par message).

---

## Étape 1 · Créer tes comptes

| Service | À quoi il sert | Lien |
|---|---|---|
| GitHub | Stocker le code de ton site | github.com |
| Vercel | Mettre ton site en ligne | vercel.com (connecte-toi avec GitHub) |
| Supabase | Comptes clients, commandes, fichiers | supabase.com |
| Stripe | Encaisser les paiements | stripe.com |
| Resend | Envoyer les e-mails automatiques | resend.com |

> Supabase gratuit = 2 projets actifs maximum. Si tu en as déjà 2, mets-en un en pause.

---

## Étape 2 · Supabase (la base de données)

1. **New project** → donne un nom (ex. `brand-studio`), choisis un mot de passe (garde-le), région **East US** (tes clients sont américains) → **Create**.
2. Quand le projet est prêt : menu de gauche **SQL Editor** → **New query**.
3. Ouvre le fichier `supabase/schema.sql` de ce dépôt, copie **tout** son contenu, colle-le, clique **Run**. Tu dois voir « Success ».
4. Menu **Project Settings → API** (ou **API Keys**). Copie dans ton bloc-notes :
   - `Project URL` → ce sera **NEXT_PUBLIC_SUPABASE_URL**
   - clé `anon` `public` → **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - clé `service_role` `secret` → **SUPABASE_SERVICE_ROLE_KEY** (secrète !)

---

## Étape 3 · Stripe (les paiements) — en mode TEST d’abord

1. En haut à droite de Stripe, active **Mode test** (ou « Environnement de test »).
2. **Développeurs → Clés API** → copie la **clé secrète** (`sk_test_…`) → **STRIPE_SECRET_KEY**.
3. Le webhook se crée à l’étape 6 (il faut d’abord l’adresse de ton site).

---

## Étape 4 · Resend (les e-mails)

1. **API Keys → Create API Key** → copie la clé (`re_…`) → **RESEND_API_KEY**.
2. **EMAIL_FROM** :
   - pour tester tout de suite : `Brand Studio <onboarding@resend.dev>` (ça n’envoie qu’à ta propre adresse e-mail Resend) ;
   - pour tes vrais clients : **Domains → Add domain**, ajoute ton nom de domaine et suis les instructions, puis utilise par exemple `Brandsmith <hello@tondomaine.com>`.

---

## Étape 5 · Mettre le site en ligne avec Vercel

1. Clique sur le bouton **Deploy with Vercel** du fichier README.
2. Vercel crée une copie du site sur **ton** GitHub. Donne-lui un nom.
3. Vercel te demande les clés une par une. Colle celles de ton bloc-notes :

| Clé | Ce que tu mets |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Étape 2 |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Étape 2 |
| SUPABASE_SERVICE_ROLE_KEY | Étape 2 |
| STRIPE_SECRET_KEY | Étape 3 |
| STRIPE_WEBHOOK_SECRET | Mets `a-remplir` pour l’instant (étape 6) |
| RESEND_API_KEY | Étape 4 |
| EMAIL_FROM | Étape 4 |
| ADMIN_EMAILS | Ton adresse e-mail (celle qui aura accès à l’admin) |
| NEXT_PUBLIC_SITE_URL | Mets `a-remplir` pour l’instant (étape 6) |

4. Clique **Deploy**. Attends 2 à 3 minutes. Ton site est en ligne sur une adresse du type `ton-projet.vercel.app`.

---

## Étape 6 · Finir les réglages

1. **Adresse du site** : dans Vercel → ton projet → **Settings → Environment Variables** → modifie `NEXT_PUBLIC_SITE_URL` avec l’adresse de ton site (ex. `https://ton-projet.vercel.app`, sans `/` à la fin).
2. **Webhook Stripe** (en mode test) : Stripe → **Développeurs → Webhooks → Ajouter un endpoint** :
   - URL : `https://ton-projet.vercel.app/api/stripe/webhook`
   - Événement : `checkout.session.completed`
   - Enregistre, puis copie le **Secret de signature** (`whsec_…`) et colle-le dans Vercel à la place de `STRIPE_WEBHOOK_SECRET`.
3. Vercel → **Deployments** → sur le dernier déploiement, menu **⋯ → Redeploy**, pour prendre en compte les nouvelles valeurs.

---

## Étape 7 · Faire une commande test

1. Ouvre ton site, choisis une offre, mets ton e-mail.
2. Au paiement, utilise la carte de test Stripe : `4242 4242 4242 4242`, date future, CVC `123`.
3. Tu arrives dans ton espace client : remplis le brief.
4. Va sur `/login` avec ton e-mail admin → **Admin** → ouvre la commande → dépose une image dans « Upload concepts ».
5. Reviens côté client : note le concept, puis dépose un fichier final côté admin et teste le téléchargement.

Si tout fonctionne : bravo, ton site est prêt.

---

## Étape 8 · Passer en réel

1. **Nom de domaine** : Vercel → **Settings → Domains** → ajoute ton domaine et suis les instructions. Mets ensuite à jour `NEXT_PUBLIC_SITE_URL`.
2. **Stripe en mode réel** : active ton compte Stripe (infos de ta société), puis remplace `STRIPE_SECRET_KEY` par la clé `sk_live_…` et recrée le webhook en mode réel (nouveau `whsec_…`).
3. **Pages légales** : complète `legalName` et `legalAddress` dans `config/site.ts` et fais relire tes pages Terms, Privacy et Refund policy.
4. **Redeploy**.

## En cas de souci

Ouvre Claude, donne-lui le fichier `GUIDE.md` et décris ce qui bloque (avec une capture d’écran).
