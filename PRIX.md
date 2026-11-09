# Prix : estimations, signalements publics et archives

Le site distingue trois provenances. Aucune n’est présentée comme une offre marchande vérifiée directement, et aucun achat n’est effectué sur FORGE.

## Signalements en euros d’une source publique

Une autre voie que l’accès aux boutiques est maintenant utilisée : les JSON natifs du projet public [xxderen/pc-build](https://github.com/xxderen/pc-build). Son collecteur lit les prix HTML de Geizhals ; FORGE lit les données déjà publiées sur GitHub, sans lancer ce collecteur ni contacter les marchands.

Le snapshot intégré contient **10 correspondances explicites** : un processeur, une carte mère, quatre GPU et quatre SSD. Il indique des prix en **EUR pour l’Allemagne**, des marchands, des pages produits et un état de disponibilité rapporté. La mise à jour globale déclarée est le **9 novembre 2026 à 19:00:10 UTC**. Les variantes noires, non-OC, autres capacités, conditionnements ou références ambiguës ne reçoivent aucun prix par rapprochement automatique. Les particularités des dix correspondances figurent dans [MARKET-SOURCES.md](docs/MARKET-SOURCES.md).

Le navigateur peut actualiser ces dix correspondances au chargement, puis avec « Actualiser les relevés ». Il valide les identités, URL, montants et dates avant de remplacer les données conservées. Un échec laisse le catalogue utilisable. L’accès natif à ces JSON a été testé avec une réponse HTTP 200 et CORS autorisé ; aucun compte, clé API ou serveur applicatif n’est nécessaire. Voir [le fonctionnement du flux](docs/MARKET-FEED.md).

Les dates ne sont pas interchangeables : `priceSince` date le début du prix inchangé ; `sourceUpdatedAt` date le fichier global ; `retrievedAt` date sa lecture par FORGE. **Aucune ne prouve une vérification actuelle de ce produit chez le marchand.** `checkedAt` reste `null`. Le stock est rapporté, l’état du produit, les frais, la fiscalité applicable et la livraison en France restent à confirmer.

Un montant signalé sert de **repère indicatif au budget** seulement si la source rapporte `in_stock` et si son fichier a au plus 14 jours, sans date future. Cette règle ne certifie pas le stock. Sinon, le site conserve l’ancienne estimation éventuelle ou affiche un prix inconnu. Les signalements exclus du budget restent consultables dans la fiche. Au snapshot intégré, **7 des 10** remplissent cette condition ; les trois autres annoncent une disponibilité prochaine.

## Estimations initiales en euros

Les 200 montants initiaux sont des estimations non vérifiées pour le marché français, hors livraison. Ils restent des valeurs de repli lorsqu’aucun signalement admissible ne correspond exactement à la variante. Le prix de référence centralisé est utilisé pour le catalogue, le tri, le budget, l’export et les kits mémoire ; la configuration est recalculée après une actualisation.

Les liens Idealo et Google Shopping sont des recherches sans affiliation. Ils ne constituent pas une preuve du montant affiché. Les liens des signalements mènent à une page produit de comparateur, pas à une offre validée ni à un paiement.

## Archives en dollars

**3 265 variantes** disposent d’un montant positif dans le snapshot public docyx/pc-part-dataset du **23 juillet 2025**. Le site les affiche désormais comme **archives USD**, avec un lien vers la source immuable et un tri distinct. Le montant est lié à la variante et à sa ligne exacte ; aucune couleur voisine n’en hérite.

La date du snapshot n’est pas la date de relevé de chaque prix, qui reste inconnue. Marchand, condition, frais et disponibilité ne sont pas renseignés. Ces archives ne sont ni converties en euros ni ajoutées au budget. Un prix absent reste absent, jamais zéro ou gratuit. La provenance et l’import reproductible sont décrits dans [DATA-ENRICHMENT.md](docs/DATA-ENRICHMENT.md).

## Budget et limites

Une sélection avec des références sans prix EUR de référence conserve un « Budget partiel ». Les filtres de budget et les tris de prix EUR ignorent les montants inconnus ; les tris d’archives USD sont séparés. Pour la RAM, les achats comptent des kits entiers : trois modules provenant de kits de deux nécessitent deux kits, avec une barrette restante.

Les accès directs à Idealo, LDLC, Alternate, Amazon France et Corsair ont été bloqués par le réseau de l’environnement lors de la revue du 9 novembre 2026. Cette alternative apporte des données sourcées, mais **ne certifie pas les prix exacts actuels de tous les composants**. Le registre d’un autre projet qui marquait ses prix comme candidats issus de recherches par IA n’a pas été utilisé pour remplir les prix.

Une future offre vérifiée devra conserver le modèle/MPN/GTIN, la variante, le marchand et le vendeur, l’URL de l’offre, le montant TTC, la condition, le stock, les frais de livraison et la date de consultation effective. Une date d’import, une mise à jour globale ou un lien de recherche ne remplace pas ces preuves.
