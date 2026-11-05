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
| Portfolio « Our recent work » (4 projets par secteur, 1 image moodboard par projet) | `config/site.ts` → `portfolio` (images dans `public/work/`) |
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
- Ne jamais afficher ni écrire les clés secrètes (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, `STRIPE_WEBHOOK_SECRET`) dans le code ou dans la conversation. Elles vont uniquement dans Vercel → Settings → Environments → Production (variables d’environnement).
- Garder le site responsive (téléphone, tablette, ordinateur) : utiliser les classes Tailwind `sm:`, `md:`, `lg:` comme dans le reste du code.

## Portfolio (images uniques pour chaque élève)

Le kit est livré **sans images de portfolio** : chaque élève crée les siennes. Les projets de `config/site.ts` → `portfolio` sont des exemples à remplacer entièrement.
Quand l'élève demande son portfolio, suis **docs/PORTFOLIO-PROMPTS.md** : tu inventes 36 marques fictives uniques, tu écris les 36 prompts, tu crées le PDF pour ChatGPT, puis tu intègres les images.

## Étape 3 · Aider à l’installation

Suivre `INSTALLATION.md` avec l’élève, étape par étape. Lui demander une capture d’écran s’il bloque.

Problèmes fréquents :
- **Variables obligatoires** (bouton Deploy) : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, `ADMIN_EMAILS`. Ajoutées ensuite : `STRIPE_WEBHOOK_SECRET` (étape 6), `EMAIL_FROM` (seulement après vérification du domaine dans Resend). `NEXT_PUBLIC_SITE_URL` est **facultative** : le site détecte tout seul son adresse (ne pas la remplir avec une adresse supposée).
- **Le paiement ne crée pas de commande** : la page `/welcome` crée la commande après le paiement, et le webhook la crée aussi si le client ferme la page. Vérifier `STRIPE_SECRET_KEY` (mode test = `sk_test_`), puis `STRIPE_WEBHOOK_SECRET`, l’URL du webhook (`https://ADRESSE/api/stripe/webhook`) et l’événement `checkout.session.completed`, puis Redeploy.
- **Aucun e-mail reçu** : regarder les spams. Sans `EMAIL_FROM`, l’expéditeur de test `onboarding@resend.dev` est utilisé et Resend n’envoie **qu’à l’adresse du compte Resend** : l’élève teste donc avec cette adresse (client et admin). Pour écrire aux vrais clients : vérifier son domaine dans Resend, puis ajouter `EMAIL_FROM`.
- **Les boutons ne répondent plus / page 404 après un paiement** : la page était ouverte avant un redéploiement. Recharger (Cmd/Ctrl + Shift + R) et recommencer.
- **Même e-mail pour client et admin** : c’est prévu. Le téléchargement final est bien enregistré (fin du remboursement) quand c’est le client de la commande qui télécharge, même s’il est aussi admin.
- **« Payments are not connected yet »** : `STRIPE_SECRET_KEY` manquante, puis Redeploy.
- **Pas d’accès à /admin** : l’e-mail doit être dans `ADMIN_EMAILS`, se connecter via `/login`.
- **Erreur de table ou de bucket** : relancer `supabase/schema.sql` dans le SQL Editor de Supabase.
- **Les variables ne sont pas prises en compte** : toujours faire **Redeploy** après les avoir modifiées dans Vercel (Deployments → ⋯ → Redeploy), puis recharger le site.
- **Clés Supabase** : utiliser l’onglet **Legacy API Keys** (anon + service_role). Ne pas cliquer sur les intégrations proposées par Vercel (Stripe, Resend, Supabase) : elles créent des variables en double.

## Nom de domaine

Quand l'élève passe en réel : suis **docs/DOMAINE.md** étape par étape (achat, connexion à Vercel, e-mails Resend avec `EMAIL_FROM`, redirection de `hello@` vers son Gmail, mise à jour de `domain` et `contactEmail` dans `config/site.ts`).

## Comment fonctionne une commande (pour expliquer à l’élève)

1. Le client choisit une offre → donne son e-mail (`/start`) → choisit ou non l’option payante (`/start/options`) → paie sur Stripe.
2. Après le paiement, il est connecté automatiquement et remplit son brief (`/account/orders/[id]`). L’élève reçoit un e-mail.
3. L’élève envoie le brief à son freelance, puis dépose les concepts dans l’admin (`/admin/orders/[id]`). Le client reçoit un e-mail.
4. Le client voit les concepts en filigrane et met une note sur 10 : 6 ou plus = validé, sinon révision (le nombre de révisions dépend de l’offre).
5. L’élève dépose les fichiers finaux. Le client les télécharge après avoir coché qu’il renonce au remboursement ; la date est enregistrée.
6. Les remboursements se font dans Stripe, puis l’élève passe la commande en « Refunded » dans l’admin.
