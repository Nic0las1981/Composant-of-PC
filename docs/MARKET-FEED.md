# Actualisation du registre public de prix

Le site peut lire les fichiers publics natifs `parts.json` et `prices.json` du
projet [xxderen/pc-build](https://github.com/xxderen/pc-build). Ils sont déjà
publiés sur GitHub : le navigateur ne contacte aucun marchand et n’exécute pas
le collecteur de ce projet. Aucun compte, serveur ou secret n’est nécessaire.

Le chargement explicite de l’application appelle `refreshMarketFeed()`. Une
seule requête par fichier est partagée par les appels simultanés, notamment le
double montage de développement React. Le catalogue reste utilisable pendant
la requête et reprend les données embarquées en cas d’indisponibilité. Après
une actualisation réussie, un échec ultérieur conserve le dernier relevé accepté.
Cette conservation s’applique aussi référence par référence lors d’une réponse
partielle : une ligne absente, nulle ou rejetée ne rétablit pas un ancien prix ou
un ancien stock de l’archive initiale. Ses dates restent inchangées. Les compteurs
de succès/rejet décrivent le dernier essai, pas la taille du cache conservé.

## Correspondance des modèles

Le rafraîchissement ne découvre pas automatiquement de nouveaux produits. Il
reste limité aux correspondances explicites de `MARKET_MAPPINGS`, examinées
dans [MARKET-SOURCES.md](MARKET-SOURCES.md). L’identifiant, la catégorie, le nom
exact et le slug de la fiche Geizhals doivent toujours correspondre à l’identité
auditée. Une référence dont le nom, la capacité, la finition ou la destination
change exige une nouvelle revue ; aucun rapprochement par famille n’est fait.
Le MPN fourni par le mapping provient du slug audité : son égalité intégrale
préserve donc aussi cette référence, sans reconstruire le MPN à partir des
espaces ou majuscules du nom. Un éventuel champ MPN explicite ajouté à la source
sera refusé s’il contredit l’identifiant audité.

L’URL de chaque prix doit désigner la même fiche HTTPS `geizhals.de`, sans
identifiants, fragment, autre domaine ni paramètre commercial ajouté. Les
montants doivent être des nombres positifs finis en euros, au centime, les
dates doivent être valides et non futures et le fichier source ne doit pas
être plus ancien que le dernier document accepté (initialement l’archive
embarquée). La date de début du prix inchangé ne
peut pas être postérieure à celle du fichier source.

Les réponses sont limitées à 256 Kio chacune et à 500 références. La lecture
est interrompue au bout de huit secondes. Les erreurs réseau, données invalides,
changements de schéma et réponses trop volumineuses conservent une référence
connue ; ils ne deviennent jamais un prix nul ou une offre gratuite.

## Trois dates distinctes

- `sourceUpdatedAt` : mise à jour globale déclarée par le fichier public.
- `priceSince` : début du prix inchangé selon l’historique du collecteur.
- `retrievedAt` : lecture de ce fichier par FORGE.

Aucune de ces dates ne prouve une vérification actuelle de la fiche marchande.
`checkedAt` reste `null`. Le stock est rapporté par la source ; l’état du produit,
les frais de port et la livraison en France ne sont pas confirmés. Le pays du
signalement reste l’Allemagne. La présentation et le calcul du budget doivent
conserver ce caractère indicatif.

Une actualisation de la branche `main` utilise son lien public et
`sourceCommit: null` : elle n’est pas présentée comme un fichier figé au commit
de l’archive initiale. Le repli embarqué conserve son lien immuable d’origine.

## Intégration et vérification

`src/lib/marketFeed.ts` expose le lecteur, son état et une révision numérique.
`useMarketFeedRevision()` permet aux calculs React mémorisés de suivre une
actualisation ; appeler ce hook ne déclenche pas une requête. Tant qu’au moins
un composant est abonné, une horloge partagée invalide également les calculs au
terme exact de la fenêtre indicative de 14 jours, à la milliseconde suivante.
Un contrôle par minute et les événements de retour à l’onglet (`visibilitychange`
et `pageshow`) couvrent les changements d’horloge et les minuteries suspendues.
Cette horloge ne contacte aucune source et cesse entièrement après le dernier
désabonnement. La constante de validité est partagée avec le calcul du budget
dans `src/data/marketPolicy.ts`.

Les tests de
`tests/marketFeed.test.ts` utilisent des réponses contrôlées pour vérifier la
correspondance exacte, les limites, la déduplication, les échecs, la conservation
par référence et la provenance. Une horloge contrôlée vérifie l’expiration et
le retour à l’onglet sans attendre réellement quatorze jours.
