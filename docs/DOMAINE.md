# Nom de domaine : acheter, connecter, envoyer les e-mails

> Ce fichier est pour Claude. Guide l'élève **une étape à la fois**, avec une capture d'écran à chaque étape.
> À faire quand le site fonctionne en mode test (commande test réussie), au moment de passer en réel.

Résultat attendu : le site s'ouvre sur `https://tamarque.com`, les e-mails partent de `hello@tamarque.com` vers **tous** les clients (plus seulement vers l'adresse du compte Resend), et `hello@tamarque.com` arrive dans sa boîte Gmail.

---

## Étape 1 · Choisir le nom

- Idéalement le nom de la marque en **.com** (clients américains). Sinon `.co` ou `.studio`.
- Court, facile à épeler, sans tiret ni chiffre.
- Vérifie la disponibilité au moment de l'achat (étape 2). Prévois 2 ou 3 variantes.
- Budget : environ **10 à 15 $ par an** pour un `.com`. Méfie-toi des prix « 1re année à 1 $ » : regarde le prix du renouvellement.

## Étape 2 · Acheter le domaine

Demande à l'élève où il veut l'acheter. **Recommande l'option A** (la plus simple : rien à configurer pour le site).

### Option A (recommandée) · Directement dans Vercel
1. Vercel → son projet → **Settings** → **Domains** → **Buy** (ou **Add Domain** → **Buy a new domain**).
2. Tape le nom → choisis l'extension disponible → **Buy** → paiement par carte.
3. Vercel relie le domaine au site **automatiquement**. Passe directement à l'étape 4.

### Option B · Chez un autre site (Hostinger, Namecheap, Porkbun, Cloudflare, OVH…)
1. Sur le site choisi : cherche le nom → ajoute au panier → **décoche les options inutiles** (hébergement, site builder, « protection premium » payante ; garde la protection de la vie privée si elle est gratuite) → paie.
2. Ouvre la gestion du domaine → trouve la page **DNS** (souvent « DNS / Nameservers », « Zone DNS » ou « Advanced DNS »). Garde cet onglet ouvert : on y revient à l'étape 3 et à l'étape 5.

## Étape 3 · Connecter le domaine au site (option B uniquement)

1. Vercel → **Settings** → **Domains** → **Add Domain** → tape `tamarque.com` → **Add**. Accepte la proposition d'ajouter aussi `www.tamarque.com` (redirigé vers `tamarque.com`).
2. Vercel affiche les enregistrements DNS à créer (« Invalid Configuration » est normal à ce stade). **Copie exactement les valeurs affichées par Vercel**, en général :
   - Type **A**, Nom/Host `@`, Valeur l'adresse IP indiquée par Vercel
   - Type **CNAME**, Nom/Host `www`, Valeur l'adresse indiquée par Vercel (se termine par `vercel-dns.com`)
3. Chez le vendeur du domaine, page DNS : **supprime** les anciens enregistrements A et CNAME `www` qui pointent ailleurs (page « parking » du vendeur), puis **ajoute** ceux de Vercel. TTL : laisse la valeur par défaut.
4. Reviens sur Vercel : le statut passe à **Valid Configuration** (quelques minutes, parfois jusqu'à 1 h). Le certificat HTTPS se crée tout seul.
5. Ouvre `https://tamarque.com` : le site s'affiche.

## Étape 4 · Mettre le nom à jour dans le site

Toi (Claude), dans `config/site.ts` : `domain` = `tamarque.com`, `contactEmail` = `hello@tamarque.com`. Commit et push (Vercel redéploie tout seul).
Le site détecte son adresse tout seul : **inutile** de remplir `NEXT_PUBLIC_SITE_URL`.

## Étape 5 · Envoyer les e-mails depuis le domaine (Resend)

1. Resend → **Domains** → **Add Domain** → `tamarque.com` → Region **North Virginia (us-east-1)** → **Add**.
2. Resend affiche des enregistrements DNS (en général : **MX** et **TXT** pour `send`, **TXT** pour `resend._domainkey`). Ajoute-les **exactement** comme affichés :
   - Domaine acheté dans **Vercel** (option A) : Vercel → l'onglet **Domains** du compte (en haut, pas celui du projet) → ton domaine → **DNS Records** → **Add** pour chacun.
   - Domaine acheté **ailleurs** (option B) : sur sa page DNS.
   - Le champ « Nom/Host » : mets seulement la partie avant le domaine (ex. `send`, `resend._domainkey`), sans `tamarque.com` si le site l'ajoute déjà.
3. Resend → **Verify DNS Records**. Attends le statut **Verified** (quelques minutes à quelques heures).
4. Vercel → **Settings** → **Environments** → **Production** → **Add Environment Variable** :
   - Key `EMAIL_FROM` · Value `Ta Marque <hello@tamarque.com>` → **Save** → **Redeploy**.
5. Test : commande test avec **une autre adresse e-mail** que celle du compte Resend. L'e-mail « Order confirmed » doit arriver (boîte principale, pas les spams).

## Étape 6 · Recevoir les e-mails envoyés à hello@tamarque.com

Les clients répondront à `hello@tamarque.com` : il faut que ça arrive dans sa boîte Gmail.

- **Le plus simple (gratuit)** : une redirection d'e-mail.
  - Domaine chez Cloudflare, Namecheap, Porkbun ou OVH : active la **redirection e-mail** (Email Routing / Email Forwarding) de `hello@` vers son Gmail.
  - Domaine dans Vercel ou chez un vendeur sans redirection : utilise un service de redirection gratuit (par ex. ImprovMX) et ajoute les enregistrements **MX** qu'il donne pour le domaine principal (`@`). Ne touche pas aux MX de `send` (Resend).
- **Option payante** : une vraie boîte mail (Google Workspace, Zoho, Hostinger Email…) si l'élève veut écrire depuis `hello@`.
- Test : envoie un e-mail à `hello@tamarque.com` depuis une autre adresse : il doit arriver dans Gmail.

## Étape 7 · Finir

- Stripe → **Paramètres** → **Informations sur l'entreprise** → site web : `https://tamarque.com`.
- Webhook Stripe : si l'adresse change pour le domaine, mets à jour l'URL de la destination (`https://tamarque.com/api/stripe/webhook`) en mode test et en mode réel. (L'ancienne adresse `….vercel.app` continue de fonctionner, mais autant utiliser la nouvelle.)
- Refais une commande test complète sur `https://tamarque.com`.

## Problèmes fréquents

| Problème | Solution |
|---|---|
| Vercel reste sur « Invalid Configuration » | Vérifie qu'il n'y a qu'**un seul** enregistrement A pour `@` (supprime celui du vendeur) et attends jusqu'à 1 h. |
| Resend reste « Pending » | Vérifie que le Nom/Host ne contient pas deux fois le domaine (`send.tamarque.com.tamarque.com`). Attends, puis **Verify** à nouveau. |
| Les e-mails arrivent en spam | Vérifie que le domaine est **Verified** dans Resend et que `EMAIL_FROM` utilise bien ce domaine, puis Redeploy. |
| Le site s'ouvre sur `www` mais pas sans `www` (ou l'inverse) | Ajoute les deux dans Vercel → Domains (l'un redirige vers l'autre). |
