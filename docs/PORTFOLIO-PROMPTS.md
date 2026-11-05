# Portfolio : créer tes 36 images uniques

> Ce fichier est pour Claude. L'élève dit simplement : « Crée mon portfolio en suivant docs/PORTFOLIO-PROMPTS.md ».

Le site affiche 4 projets par secteur, chacun avec **une seule image « moodboard »** (format paysage 3:2, 4 ou 5 panneaux : logo, site sur ordinateur, appli, carte de visite, packaging, photo…).
Chaque élève doit avoir **ses propres marques et ses propres images**. Ne réutilise jamais les noms de marques déjà présents dans `config/site.ts`.

## Étape 1 · Inventer 36 marques fictives

- 9 secteurs × 4 marques : AI startups, SaaS, E-commerce, Beauty, Health & wellness, Real estate, Consulting, Agencies, Hospitality (l'élève peut en changer).
- Pour chaque marque : un nom anglais court et crédible (1 à 3 mots), une activité précise, un logo décrit précisément (symbole + typographie), une palette de 3 ou 4 couleurs avec codes hex.
- Toutes les marques doivent être différentes entre elles (noms, symboles, palettes, styles).
- Vérifie que le nom ne ressemble pas à une grande marque connue.
- Alterne les 4 layouts ci-dessous dans chaque secteur (A, B, C, D).

## Étape 2 · Écrire un prompt par marque

Utilise **exactement** la structure de l'exemple en bas de ce fichier (sections LAYOUT, BRAND, PANELS, TEXT RULES, STYLE AND QUALITY, AVOID), en anglais.
- Le nombre de panneaux décrits doit correspondre au layout choisi.
- Chaque panneau est décrit précisément : objet, matière, angle, lumière, texte affiché.
- Dans TEXT RULES, liste tous les mots qui apparaissent sur l'image (textes courts, 6 mots maximum par texte).
- Jamais de vrai logo (Apple, Google…) ni de vraie personne connue.

Layouts disponibles :
- **Layout A** (5 panneaux) : 5 panels in 2 rows. Top row (40% of the height): panel 1 on the left (50% of the width) and panel 2 on the right (50% of the width). Bottom row (60% of the height): panel 3 (30% of the width), panel 4 (32% of the width) and panel 5 (38% of the width).
- **Layout B** (4 panneaux) : 4 panels. Left: panel 1 is a tall portrait panel taking the full height and 42% of the width. Right side (58% of the width): top row with panel 2 and panel 3 side by side (each half of the right side, 50% of the height); bottom row with panel 4 spanning the full right side (50% of the height).
- **Layout C** (5 panneaux) : 5 panels in 2 rows. Top row (40% of the height): panel 1 (50% of the width) and panel 2 (50% of the width). Bottom row (60% of the height): panel 3 narrow (24% of the width), panel 4 wide (52% of the width), panel 5 narrow (24% of the width).
- **Layout D** (5 panneaux) : 5 panels in 2 rows. Top row (48% of the height): three equal panels 1, 2 and 3. Bottom row (52% of the height): panel 4 (50% of the width) and panel 5 (50% of the width).

## Étape 3 · Créer le PDF pour ChatGPT

Un PDF A4 : page 1 = les consignes ci-dessous, puis un prompt par page avec « PROMPT n / 36 », le secteur, le nom de la marque et le nom de fichier (`nom-de-la-marque.jpg`, minuscules, tirets, sans accents ni `&`).

Consignes page 1 (en anglais) :
1. Generate the images one by one, in order, starting with PROMPT 1.
2. For each image, follow the prompt exactly: the 3:2 landscape format, the panel layout, the palette and the exact spelling of every text.
3. Generate only one image per reply. Above it, write the prompt number and the file name.
4. When I write "next", generate the next prompt.

L'élève envoie le PDF à ChatGPT, écrit « Follow the instructions on page 1. Start with PROMPT 1. », puis « next » à chaque image.
Si un nom est mal écrit : « Fix the spelling of the brand name, keep everything else identical ».

## Étape 4 · Mettre les images sur le site

1. L'élève te donne les images (un zip).
2. Redimensionne si besoin à 1536 × 1024, en JPEG qualité ~84, et mets-les dans `public/work/`.
3. Remplace toute la liste `portfolio` de `config/site.ts` par les 36 nouvelles marques (`featured: true` sur 8 d'entre elles).
4. `npm run build`, vérifie l'affichage, puis commit et push.

## Exemple de prompt complet (structure à reproduire)

```
Create ONE single landscape image in 3:2 ratio (1536 x 1024 px): a premium brand identity case-study moodboard, as published on Behance by a world-class branding studio (Pentagram, Koto or Collins level of craft).

LAYOUT
5 panels in 2 rows. Top row (40% of the height): panel 1 on the left (50% of the width) and panel 2 on the right (50% of the width). Bottom row (60% of the height): panel 3 (30% of the width), panel 4 (32% of the width) and panel 5 (38% of the width).
Panels are separated by thin pure-white gutters of about 12 px, with the same 12 px white border around the whole image. Panel edges are perfectly straight with very slightly rounded corners (6 px). No captions, titles or labels outside the panels.

BRAND
"Tasklane" is a project management tool for small agencies (SaaS).
Logo: three horizontal rounded bars of decreasing length stacked to the left (blue, blue, yellow), next to the wordmark 'Tasklane' in a clean geometric sans-serif, bold.
Palette: ink #101828, sky blue #3E8BFF, sunny yellow #FFC93C, cloud grey #F2F5FA.
Every panel uses exactly this logo and this palette, so the board reads as one coherent, finished identity system.

PANELS
1. Hero logo: the full logo in color, centered on a cloud grey background with a very subtle shadow under the symbol.
2. A large desktop monitor with no visible brand on a white desk, showing a kanban board with three columns titled 'To do', 'Doing' and 'Done', filled with white task cards marked by small blue and yellow tags.
3. A smartphone home screen close-up showing the Tasklane app icon: a sky blue rounded square with the three white bars, among blurred generic icons.
4. A laptop lid covered with die-cut stickers of the Tasklane symbol and wordmark in blue, yellow and white, photographed from above in daylight.
5. A hand holding a white ceramic coffee cup printed with the Tasklane logo, a bright modern office softly blurred behind.

TEXT RULES
The only readable text allowed in the whole image is: "Tasklane", "To do", "Doing", "Done". Spell each one exactly, letter by letter, with clean kerning. Any other small text (interface labels, card details, fine print) must be tiny, out of focus or shown as abstract grey lines, never invented words.

STYLE AND QUALITY
Photorealistic, art-directed product and mockup photography mixed with clean flat brand panels. Soft natural studio lighting, realistic shadows, reflections and material textures (paper grain, glass, metal, fabric). Shallow depth of field on photo panels. Logo edges vector-sharp. Same color grading across all panels. Editorial, premium, minimal, high-end agency quality, 8K detail.

AVOID
Real brand names or logos (no Apple, Google or other logos on devices), watermarks, colored borders, clutter, distorted or misspelled letters, extra logos, cartoon or clip-art look, cheesy stock-photo poses, text outside the panels.
```
