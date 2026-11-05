# Site de vente de logos — Module Business Américain

Site complet pour vendre un service (logo, identité de marque…) à des clients américains, sur le modèle des meilleures agences en ligne :

- **Page de vente** en anglais, optimisée pour Google, 100 % responsive (téléphone, tablette, ordinateur).
- **Tunnel de commande** : e-mail → option payante (upsell) → paiement Stripe → brief de 10 questions.
- **Espace client** : concepts en filigrane, note sur 10 pour valider ou demander une révision, téléchargement des fichiers finaux (le téléchargement met fin au droit de remboursement, avec preuve enregistrée).
- **Espace admin** : liste des commandes, brief du client, dépôt des concepts et des fichiers finaux, e-mails automatiques.

## Installer le site (sans coder)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshinsekai280-ops%2Fsite-business-americain&project-name=my-brand-studio&repository-name=my-brand-studio&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,STRIPE_SECRET_KEY,RESEND_API_KEY,ADMIN_EMAILS&envDescription=Les%20cl%C3%A9s%20de%20tes%20comptes%20Supabase%2C%20Stripe%20et%20Resend%20(voir%20INSTALLATION.md)&envLink=https%3A%2F%2Fgithub.com%2Fshinsekai280-ops%2Fsite-business-americain%2Fblob%2Fmain%2FINSTALLATION.md)

Suis le fichier **[INSTALLATION.md](./INSTALLATION.md)** étape par étape.

## Personnaliser le site avec Claude

Donne le fichier **[GUIDE.md](./GUIDE.md)** à Claude : il change le nom de ta marque, tes prix, tes offres et tes textes à ta place.

## Les fichiers importants

| Fichier | Ce qu’il contient |
|---|---|
| `config/site.ts` | **Tous les réglages** : nom, prix, offres, options payantes, places par jour, lien de rendez-vous, vrais avis |
| `lib/brief.ts` | Les 10 questions du brief |
| `supabase/schema.sql` | La base de données, à coller une seule fois dans Supabase |
| `docs/PORTFOLIO-PROMPTS.md` | La méthode pour créer ton portfolio unique (36 marques, prompts ChatGPT, images) |
| `app/terms`, `app/privacy`, `app/refund-policy` | Les pages légales (modèles à faire valider) |
