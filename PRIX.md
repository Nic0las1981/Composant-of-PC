# Revue des prix du catalogue

Les 200 montants servent à estimer un budget en euros pour le marché français, hors livraison. Ils ne représentent pas des offres marchandes vérifiées, et la disponibilité n’est pas connue.

La revue du 9 novembre 2026 n’a pas pu relever de nouveaux prix : les accès publics à Idealo, LDLC, Alternate, Amazon France et Corsair ont tous été bloqués par la politique réseau de l’environnement (réponse de connexion HTTP 403). Aucun montant n’a été changé sur la base d’une supposition. Cette date est celle de la revue des données, pas celle d’une vérification des prix.

Le contrôle interne n’a trouvé aucun montant non numérique, nul, négatif ou identifiant dupliqué. Les écarts de prix entre générations, marques, variantes et capacités ne suffisent pas à établir une erreur de prix : ils exigent une offre correspondant à la même référence et à la même condition de vente.

`src/data/pricing.ts` expose donc pour chaque produit un statut d’estimation, `checkedAt: null` et `source: null`. Les liens Idealo et Google Shopping sont des recherches de la marque et du modèle, avec les spécifications explicites du kit mémoire lorsque disponibles. Ce sont des liens de recherche sans affiliation, pas des sources attestant le montant affiché. Le modèle exact, la capacité, la couleur, la révision et l’état neuf ou d’occasion doivent correspondre pour comparer deux prix.

Pour publier à l’avenir un montant vérifié, conserver au minimum le prix TTC observé, la référence exacte, le marchand, l’URL de l’offre, la date de consultation, la condition du produit et le traitement des frais de livraison. Ne pas confondre prix de lancement, prix promotionnel expiré et offre disponible.
