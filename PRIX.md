# Revue des prix du catalogue

Les 200 montants du catalogue initial servent à estimer un budget en euros pour le marché français, hors livraison. Ils ne représentent pas des offres marchandes vérifiées, et la disponibilité n’est pas connue.

La revue du 9 novembre 2026 n’a pas pu relever de nouveaux prix : les accès publics à Idealo, LDLC, Alternate, Amazon France et Corsair ont tous été bloqués par la politique réseau de l’environnement (réponse de connexion HTTP 403). Une nouvelle tentative sur Idealo France, LDLC et Amazon France à 15:14 UTC a confirmé ce blocage. Aucun montant n’a été changé sur la base d’une supposition. Cette date est celle de la revue des données, pas celle d’une vérification des prix.

Le contrôle interne des 200 références initiales n’a trouvé aucun montant non numérique, nul, négatif ou identifiant dupliqué. Les écarts de prix entre générations, marques, variantes et capacités ne suffisent pas à établir une erreur de prix : ils exigent une offre correspondant à la même référence et à la même condition de vente.

`src/data/pricing.ts` expose pour ces 200 produits un statut d’estimation, `checkedAt: null` et `source: null`. Les liens Idealo et Google Shopping sont des recherches de la marque et du modèle, avec les spécifications explicites du kit mémoire lorsque disponibles. Ce sont des liens de recherche sans affiliation, pas des sources attestant le montant affiché. Le modèle exact, la capacité, la couleur, la révision et l’état neuf ou d’occasion doivent correspondre pour comparer deux prix.

Pour publier à l’avenir un montant vérifié, conserver au minimum le prix TTC observé, la référence exacte, le marchand, l’URL de l’offre, la date de consultation, la condition du produit et le traitement des frais de livraison. Ne pas confondre prix de lancement, prix promotionnel expiré et offre disponible.

## Ajouts issus du catalogue public

Les 10 359 variantes importées disposent parfois de prix historiques en dollars dans la source du 23 juillet 2025. Ces montants sont archivés pour tracer les données, mais ne sont ni affichés ni convertis en euros. Les cinq modules Samsung OEM ajoutés n’ont pas non plus de prix marchand vérifié. Le site utilise le statut `unknown` et affiche « Prix non renseigné ». Le zéro stocké pour ces références est une valeur technique, jamais une offre gratuite.

Le regroupement des coloris conserve le prix de chaque variante : changer de finition ne reprend pas arbitrairement le montant d’une autre couleur. Une future offre vérifiée devra identifier cette variante, et si possible son MPN ou GTIN, ainsi que le vendeur, l’état, le stock, les taxes et les frais de livraison.

Si une sélection comprend des prix absents, son budget devient « Budget partiel » et indique le nombre de références à renseigner. Les filtres de budget excluent les prix inconnus. Pour la RAM, le budget compte les kits entiers nécessaires : trois modules provenant de kits de deux exigent deux kits, avec une barrette restante. Un mélange de références conserve les prix connus et signale les prix manquants.

Voir [la provenance des références](docs/CATALOGUE.md) et les tests de prix et de mémoire.
