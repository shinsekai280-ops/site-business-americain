# GUIDE pour Claude — personnaliser et installer ce site

> **Élève : copie tout ce fichier dans une conversation avec Claude, puis réponds à ses questions.**
> Claude : ce fichier t’explique le site et comment aider l’élève. Lis-le en entier avant de répondre.

## Contexte

Ce dépôt est un site Next.js 14 (App Router, TypeScript, Tailwind) qui vend un service de création de logo / identité de marque à des clients américains, en anglais.
- Paiement : Stripe Checkout (prix définis dans le code, pas de produits à créer dans Stripe).
- Base de données, connexion des clients et stockage des fichiers : Supabase (`supabase/schema.sql`).
- E-mails : Resend. Connexion des clients par lien magique envoyé par le site.
- Hébergement : Vercel. Chaque modification poussée sur GitHub remet le site en ligne automatiquement.

L’élève est débutant : parle simplement, en français, une étape à la fois, et dis exactement où cliquer et quoi copier.

## Étape 1 · Poser ces questions à l’élève (une seule fois, toutes ensemble)

1. Le nom de sa marque, et son nom de domaine s’il en a un.
2. Son e-mail de contact public.
3. Le nom et l’adresse de sa société (pour le footer et les pages légales). S’il n’en a pas encore, garder les crochets `[...]`.
4. Ses 3 offres : nom, prix en dollars, contenu, nombre de révisions, délai. S’il ne sait pas, garder celles en place.
5. S’il garde les options payantes (upsell) et à quel prix.
6. Le nombre de commandes qu’il peut gérer par jour (0 pour masquer « spots left »).
7. Un lien de prise de rendez-vous (Calendly…) ou rien (le bouton « Book a call » disparaît).
8. Ses couleurs : garder le dégradé jaune → vert, ou en choisir un autre.
9. S’il a de VRAIES réalisations (images) et de VRAIS avis clients.

## Étape 2 · Modifier les fichiers

| Demande | Fichier |
|---|---|
| Nom, domaine, e-mail, société, SEO, offres, prix, upsells, places par jour, lien de rendez-vous, avis, chiffres | `config/site.ts` (tout est commenté) |
| Couleurs du dégradé | `app/globals.css` (`.text-gradient`, `.bg-gradient-brand`) et `tailwind.config.ts` (`lemon`, `lime`, `leaf`) |
| Logo de la marque (en haut à gauche) | `components/ui.tsx` → `BrandLogo` |
| Textes de la page de vente | `components/landing/Hero.tsx`, `Sections.tsx`, `Work.tsx` |
| Portfolio « Our recent work » (projets, secteurs, 2 images par projet) | `config/site.ts` → `portfolio` (images dans `public/work/`) |
| Images de la section « A logo is one piece » | `config/site.ts` → `includedImages` (images dans `public/included/`) |
| Photos du haut de page | `components/landing/Hero.tsx` → `Showcase` (mettre les images dans `public/showcase/` et utiliser `<img>`) |
| Questions du brief | `lib/brief.ts` |
| Pages légales | `app/terms`, `app/privacy`, `app/refund-policy` |
| Langue de l’admin (anglais par défaut) | `app/admin/**` et `components/Uploader.tsx` : traduire uniquement les textes affichés |

Après chaque série de modifications : `npm run build` doit réussir, puis commit et push sur la branche `main`. Vercel met le site à jour tout seul.

## Règles à respecter (important)

- **Jamais de faux avis, faux chiffres, faux logos clients ou fausses mentions presse.** Les avis et chiffres restent vides dans `config/site.ts` tant que l’élève n’en a pas de vrais ; les sections correspondantes se masquent toutes seules.
- Ne jamais écrire « 100 % fait par nous », « designers salariés » ou « sans IA » si ce n’est pas vrai. Les prestataires sont présentés comme « partner designers ».
- Les marques du portfolio de démonstration sont fictives : les remplacer par de vraies réalisations dès que possible.
- Ne jamais afficher ni écrire les clés secrètes (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, `STRIPE_WEBHOOK_SECRET`) dans le code ou dans la conversation. Elles vont uniquement dans Vercel → Settings → Environment Variables.
- Garder le site responsive (téléphone, tablette, ordinateur) : utiliser les classes Tailwind `sm:`, `md:`, `lg:` comme dans le reste du code.

## Ajouter des projets au portfolio

L’élève prépare ses projets à l’avance avec ChatGPT (logo + mise en situation) et te donne les images. Pour chaque projet :
1. Renommer les 2 images en `nom-du-projet-1.jpg` et `nom-du-projet-2.jpg` (minuscules, tirets) et les mettre dans `public/work/`.
2. Ajouter une ligne dans `portfolio` de `config/site.ts` : `{ name: "Nom", industry: "Secteur", featured: true, images: ["/work/nom-du-projet-1.jpg", "/work/nom-du-projet-2.jpg"] }`.
3. `featured: true` = visible dans l’onglet « Featured » (en mettre 4 à 6). Un onglet par secteur se crée tout seul.
4. Supprimer les projets de démonstration qui n’ont pas d’image.
5. `npm run build`, puis commit et push.

## Étape 3 · Aider à l’installation

Suivre `INSTALLATION.md` avec l’élève, étape par étape. Lui demander une capture d’écran s’il bloque.

Problèmes fréquents :
- **Le paiement ne crée pas de commande** : vérifier `STRIPE_WEBHOOK_SECRET`, l’URL du webhook (`/api/stripe/webhook`), l’événement `checkout.session.completed`, puis Redeploy.
- **Aucun e-mail reçu** : vérifier `RESEND_API_KEY` et `EMAIL_FROM`. Avec `onboarding@resend.dev`, Resend n’envoie qu’à l’adresse du compte Resend : vérifier son domaine dans Resend pour écrire aux clients.
- **« Payments are not connected yet »** : `STRIPE_SECRET_KEY` manquante, puis Redeploy.
- **Pas d’accès à /admin** : l’e-mail doit être dans `ADMIN_EMAILS`, se connecter via `/login`.
- **Erreur de table ou de bucket** : relancer `supabase/schema.sql` dans le SQL Editor de Supabase.
- **Les variables ne sont pas prises en compte** : toujours faire **Redeploy** après les avoir modifiées dans Vercel.

## Comment fonctionne une commande (pour expliquer à l’élève)

1. Le client choisit une offre → donne son e-mail (`/start`) → choisit ou non l’option payante (`/start/options`) → paie sur Stripe.
2. Après le paiement, il est connecté automatiquement et remplit son brief (`/account/orders/[id]`). L’élève reçoit un e-mail.
3. L’élève envoie le brief à son freelance, puis dépose les concepts dans l’admin (`/admin/orders/[id]`). Le client reçoit un e-mail.
4. Le client voit les concepts en filigrane et met une note sur 10 : 6 ou plus = validé, sinon révision (le nombre de révisions dépend de l’offre).
5. L’élève dépose les fichiers finaux. Le client les télécharge après avoir coché qu’il renonce au remboursement ; la date est enregistrée.
6. Les remboursements se font dans Stripe, puis l’élève passe la commande en « Refunded » dans l’admin.
