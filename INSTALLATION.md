# Installation — étape par étape

Compte environ 45 minutes la première fois. Tout est gratuit pour démarrer (sauf ton nom de domaine plus tard, environ 10 à 15 $ par an).

Garde un bloc-notes ouvert : tu vas copier plusieurs clés. **Ne les partage jamais** (ni en vidéo, ni en capture d’écran, ni sur Discord, ni par message).

---

## Étape 1 · Créer tes comptes

| Service | À quoi il sert | Comment te connecter |
|---|---|---|
| GitHub | Stocker le code de ton site | github.com |
| Vercel | Mettre ton site en ligne | vercel.com → **Continue with GitHub** |
| Supabase | Comptes clients, commandes, fichiers | supabase.com |
| Stripe | Encaisser les paiements | stripe.com |
| Resend | Envoyer les e-mails automatiques | resend.com → **avec ton adresse Gmail** (celle que tu consultes) |

> **Important pour Resend** : tant que tu n’as pas ton nom de domaine, Resend n’envoie les e-mails **qu’à l’adresse de ton compte Resend**. Utilise donc cette même adresse pour l’admin et pour tes commandes test.

---

## Étape 2 · Supabase (la base de données)

> Le plan gratuit autorise **2 projets actifs**. Si tu en as déjà 2 : ouvre le moins utilisé → ⚙️ **Project Settings** → **General** → tout en bas **Pause project** (rien n’est supprimé).

1. Clique **New project** et remplis :
   - **Project name** : le nom de ta marque (ex. `brandsmith`)
   - **Database password** : clique **Generate a password**, puis **Copy**, et garde-le dans ton bloc-notes
   - **Region** : **Americas → East US (North Virginia)** (tes clients sont américains)
   - **Security** : **ne touche à rien** (les 2 premières cases cochées, la 3ᵉ décochée)
2. Clique **Create new project** et attends 1 à 2 minutes.
3. Menu de gauche → **SQL Editor** (icône `>_`) → **+** → **New snippet**.
4. Ouvre le fichier [`supabase/schema.sql`](./supabase/schema.sql) de ce dépôt, copie **tout** son contenu, colle-le, clique **Run**.
   Si Supabase affiche un avertissement, clique **Run this query**. Résultat attendu : **Success. No rows returned**.
5. ⚙️ **Project Settings** → **API Keys** → onglet **Legacy API Keys** (« Legacy anon, service_role API keys »). Copie dans ton bloc-notes :
   - la clé **anon / public** → ce sera `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - la clé **service_role / secret** (clique **Reveal**) → ce sera `SUPABASE_SERVICE_ROLE_KEY` (**ultra secrète**)
6. Copie aussi l’adresse du projet (sur la page d’accueil du projet, ex. `https://abcdefgh.supabase.co`) → ce sera `NEXT_PUBLIC_SUPABASE_URL`.

---

## Étape 3 · Stripe (les paiements) — en mode TEST d’abord

1. En haut à gauche, clique sur le nom de ton compte → **Passer sur un environnement de test** → **Mode test**. Une bande « Mode test » apparaît.
2. Tape **Clés API** dans la barre de recherche → à la ligne **Clé secrète**, clique pour la révéler et copie-la (`sk_test_…`) → ce sera `STRIPE_SECRET_KEY`.
   (La clé publique `pk_test_…` ne sert pas.)

---

## Étape 4 · Resend (les e-mails)

1. Menu de gauche **API Keys** → **Create API Key** :
   - **Name** : le nom de ta marque
   - **Permission** : **Full access**
   - **Domain** : **All domains**
2. Clique **Add** et copie la clé (`re_…`) → ce sera `RESEND_API_KEY`. Elle ne s’affiche qu’une fois.

---

## Étape 5 · Mettre le site en ligne avec Vercel

1. Ouvre le fichier [README.md](./README.md) et clique sur le bouton **Deploy with Vercel**.
2. **Create Git Repository** : choisis ton compte GitHub, donne le nom de ta marque, laisse **Private** coché → **Create**.
3. Vercel te demande 6 valeurs. Colle celles de ton bloc-notes :

| Variable | Ce que tu colles |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | l’adresse du projet Supabase (`https://….supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | la clé **anon** |
| `SUPABASE_SERVICE_ROLE_KEY` | la clé **service_role** |
| `STRIPE_SECRET_KEY` | ta clé `sk_test_…` |
| `RESEND_API_KEY` | ta clé `re_…` |
| `ADMIN_EMAILS` | l’adresse de ton compte Resend (c’est elle qui aura accès à l’admin) |

4. Si Vercel propose des **intégrations** (Stripe, Resend, Supabase) : **ne clique pas sur Add**, tu as déjà mis les clés.
5. Clique **Deploy** et attends 1 à 2 minutes.
6. Clique **Visit** et note l’adresse exacte de ton site dans la barre du navigateur (ex. `https://ta-marque-abc.vercel.app`). Vercel ajoute parfois des lettres au nom : c’est normal, le site s’adapte tout seul.

---

## Étape 6 · Le webhook Stripe (sécurité des paiements)

Il confirme chaque paiement à ton site, même si le client ferme la page trop tôt.

1. Stripe (toujours en mode test) → tape **Webhooks** dans la recherche → **Ajouter une destination**.
2. Événements : cherche `checkout.session.completed`, coche-le → **Continuer**.
3. Type : **Endpoint webhook** → **Continuer**.
4. URL de l’endpoint : `https://TON-ADRESSE.vercel.app/api/stripe/webhook` (ton adresse de l’étape 5).
5. **Créer la destination**, puis à **Clé secrète de signature** clique **Révéler** et copie la clé `whsec_…`.
6. Vercel → ton projet → **Settings** → **Environments** → **Production** → **Add Environment Variable** :
   - Key : `STRIPE_WEBHOOK_SECRET`
   - Value : ta clé `whsec_…`
   - **Save**
7. Clique **Redeploy** dans le message qui apparaît (ou **Deployments** → **⋯** sur la première ligne → **Redeploy**). Attends que le statut soit **Ready**.

> Après chaque redéploiement, **recharge les pages déjà ouvertes** du site (Cmd + Shift + R sur Mac, Ctrl + Shift + R sur Windows). Une page ouverte avant le redéploiement peut avoir des boutons qui ne répondent plus.

---

## Étape 7 · Faire une commande test complète

Utilise **l’adresse de ton compte Resend** comme client (c’est la seule qui reçoit les e-mails pour l’instant). Pense à regarder les **spams** et à cliquer sur **Non spam**.

1. Ouvre ton site → **Pricing** → choisis une offre → mets ton e-mail → **See my options** → choisis une option → paiement.
2. Carte de test Stripe : `4242 4242 4242 4242` · date `12/34` · CVC `123` · code postal `10001`.
3. Tu arrives dans ton espace client (et tu reçois « Order confirmed »). Remplis le **brief** et envoie-le (tu reçois « Brief received » en tant qu’admin).
4. Clique **Admin** en haut → ouvre la commande → **Upload concepts** → choisis une image → **Upload file**. Le client reçoit « Your concepts are ready ».
5. Côté client : le concept s’affiche avec le filigrane (nom de ta marque, numéro de commande et e-mail du client).
6. Note **4/10** avec un commentaire → statut **Revision requested** (e-mail admin). Dépose un 2ᵉ concept côté admin.
7. Note **8/10** → statut **Approved**.
8. Côté admin : **Upload final files** → envoie un fichier.
9. Côté client : coche la case → **Download**. Tu reçois « Final files downloaded » et, côté admin, le bloc devient noir : **Not refundable**.

Si tout fonctionne : ton site est prêt.

---

## Étape 8 · Personnaliser et créer ton portfolio

1. Ouvre Claude, donne-lui ce dépôt et le fichier [GUIDE.md](./GUIDE.md) : il change ton nom de marque, tes prix, tes offres et tes textes.
2. Dis-lui : **« Crée mon portfolio en suivant docs/PORTFOLIO-PROMPTS.md »**. Il invente 36 marques fictives **uniques**, te prépare un PDF de prompts pour ChatGPT, puis met tes images sur le site.

---

## Étape 9 · Passer en réel (quand tu es prêt à vendre)

1. **Vercel Pro (20 $/mois)** : le plan gratuit de Vercel est réservé aux projets non commerciaux. Avant ta première vraie vente : Vercel → **Settings** → **Billing** → passe au plan **Pro**.
2. **Nom de domaine et e-mails** (≈ 12 $/an) : suis **[docs/DOMAINE.md](./docs/DOMAINE.md)** (ou dis à Claude : « Guide-moi pour mon nom de domaine avec docs/DOMAINE.md ») : acheter le domaine (dans Vercel ou chez Hostinger, Namecheap…), le connecter au site, envoyer tes e-mails depuis `hello@tondomaine.com` à **tous** tes clients, et recevoir les réponses dans ta boîte Gmail.
3. **Stripe en réel** : active ton compte (infos de ta société), quitte le mode test, copie la clé `sk_live_…` et remplace `STRIPE_SECRET_KEY` dans Vercel. Recrée le webhook (étape 6) en mode réel et remplace `STRIPE_WEBHOOK_SECRET` par le nouveau `whsec_…`.
4. **Pages légales** : complète `legalName` et `legalAddress` dans `config/site.ts` et fais relire Terms, Privacy et Refund policy.
5. **Redeploy**, puis refais une commande avec une vraie carte et rembourse-la depuis Stripe pour vérifier.

---

### Quand les outils deviennent payants

| Outil | Gratuit | Payant quand… |
|---|---|---|
| Claude | — | abonnement payant dès le départ (≈ 20 $/mois) |
| Vercel | pour préparer et tester | dès ta 1re vraie vente : Pro 20 $/mois |
| Supabase | 500 Mo de données, 1 Go de fichiers | plus de 1 Go de fichiers clients (≈ 100 à 200 commandes) : Pro 25 $/mois |
| Resend | 3 000 e-mails/mois, 100/jour | plus de ≈ 10 commandes par jour : Pro 20 $/mois |
| Stripe | pas d'abonnement | ≈ 5 % par vente avec une carte américaine (3,15 % + 0,25 € + 2 % de conversion) |
| Nom de domaine | — | ≈ 12 $/an |

Le site garde ton projet Supabase gratuit actif tout seul (une petite vérification automatique chaque jour), même sans commande pendant une semaine.

---

## En cas de souci

| Problème | Solution |
|---|---|
| Les boutons ne répondent plus | Recharge la page (Cmd/Ctrl + Shift + R) : elle date d’avant le dernier déploiement. |
| Aucun e-mail reçu | Regarde les spams. Sans domaine vérifié, seuls les e-mails vers l’adresse de ton compte Resend arrivent. |
| Le bouton Admin n’apparaît pas | Vérifie `ADMIN_EMAILS` dans Vercel (même adresse que celle avec laquelle tu te connectes), puis Redeploy. |
| Vercel ne trouve pas ton dépôt GitHub | Vercel → **Adjust GitHub App Permissions** → ajoute ton dépôt → **Save**. |
| Supabase : pas d’onglet « Legacy API Keys » | Donne une capture à Claude avec le fichier GUIDE.md. |
| Autre chose | Ouvre Claude, donne-lui le fichier `GUIDE.md` et décris ce qui bloque (avec une capture d’écran, **sans clé visible**). |
