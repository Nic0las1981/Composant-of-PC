# Classement chronologique du catalogue

`src/data/releaseTimeline.ts` ajoute des repères de lancement indépendants du
catalogue technique. Le dataset principal des références importées ne fournit pas
de date de sortie par produit. Sa date de mise à jour, le **23 juillet 2025**,
n’est donc jamais employée comme date de commercialisation. Les prix, la
performance, la capacité, le débit RAM et l’ordre d’import ne servent pas non
plus à déterminer l’âge d’un composant.

Les références OEM issues de relevés SPD suivent la même règle : la date de
fabrication d’une barrette Samsung ou la date d’observation du relevé n’est pas
la date de lancement commercial de son modèle. Elles restent sans repère
chronologique tant qu’aucune date commerciale distincte n’est établie.

## Trois niveaux de précision

| Niveau | Signification | Exemples |
| --- | --- | --- |
| Modèle | Lancement du modèle identifié ou millésime explicitement nommé | Ryzen 7 9800X3D : novembre 2024 ; RM750x (2021) : révision 2021 |
| Génération | Introduction de la puce GPU ou du chipset de carte mère | RTX 4070 SUPER : janvier 2024 ; chipset B650 : 2022 |
| Gamme | Première commercialisation de la gamme concernée | Samsung 990 PRO : 2022 ; Corsair Dominator Titanium DDR5 : 2023 |

Le champ `label` nomme le modèle, la puce ou la gamme. Les champs `year`, `month`
et `day` expriment la précision disponible. Aucun jour précis n’est renseigné
dans cette première version. Les CPU connus et une grande partie des GPU ont
un mois ; les chipsets et gammes commerciales n’ont qu’une année. L’interface
doit conserver le niveau de précision et ne pas transformer une année en
« 1er janvier » ni en une date exacte de la référence.

Une carte graphique ASUS/MSI/Sapphire peut sortir après sa puce. Une carte mère
B650 lancée en 2024 reste associée au repère de génération B650 de 2022. De même,
le 990 PRO 4 To et certaines variantes à dissipateur sont apparus après les
premières capacités de la gamme 990 PRO. Ces distinctions sont signalées dans
les notes retournées par `getReleaseInfo` ; la date individuelle de ces variantes
n’est pas prétendue connue.

Le tri compare les repères renseignés, avec mois quand il est disponible, puis
un ordre stable pour les égalités. À année égale, les mois connus précèdent les
mois inconnus dans les deux sens de tri ; la même règle vaut pour les jours.
Cette position est une convention de présentation, pas la preuve qu’une date
imprécise est antérieure ou postérieure aux dates précises de la même année.
Les égalités restantes sont départagées par marque, nom puis identifiant.
Les références sans repère connu restent
présentes et sont placées après les références datées. Le classement est donc
un outil de navigation par chronologie connue, pas un inventaire certifié de la
date de première vente de chaque SKU, révision, capacité ou couleur.

## Origine des repères

Les années et mois historiques du tableau sont des **repères éditoriaux**,
maintenus explicitement dans le code et revus pour éviter les confusions de
génération ou de variante. Ils ne constituent pas un relevé automatisé de
communiqués fabricants effectué pendant cette mise à jour. Les accès disponibles
n’ont pas fourni de source de dates complète exploitable ; aucun faux lien de
communiqué, date de consultation ou statut « vérifié en ligne » n’est ajouté.
Le champ `sourceName` indique cette origine éditoriale et `sourceUrl` reste absent
pour ces repères.

Pour les alimentations portant un millésime explicite, par exemple
`CX (2023)` ou `Focus GX V4 ATX 3 (2024)`, ce millésime est repris comme année de
révision cataloguée. Lorsqu’il s’agit d’une référence importée, `sourceUrl`
pointe alors vers le fichier du snapshot immuable contenant ce nom. La
[provenance de ces lignes](CATALOGUE.md) et leurs empreintes sont conservées.
Le millésime ne prouve pas un jour ou un mois de disponibilité commerciale.

## Cas à ne pas fusionner

- Ryzen 5700X3D : janvier 2024, malgré son appartenance à la famille Ryzen 5000.
  Ryzen 9800X3D : novembre 2024 ; Ryzen 9600X/9700X : août 2024.
- RTX 4070 : avril 2023 ; RTX 4070 SUPER : janvier 2024 ; RTX 4090 : octobre
  2022. Les suffixes `Ti`, `SUPER`, `XT`, `XTX` et `GRE` sont examinés avant de
  rechercher une entrée exacte dans la chronologie.
- RTX 3050 6 Go : février 2024, contre janvier 2022 pour la 8 Go ; RTX 3080
  12 Go : janvier 2022, contre septembre 2020 pour la 10 Go.
- RTX 4060 Ti 16 Go : juillet 2023, contre mai 2023 pour la 8 Go ; RTX 3060
  8 Go : octobre 2022, contre février 2021 pour la 12 Go ; RTX 2060 12 Go :
  décembre 2021, contre janvier 2019 pour la 6 Go.
- RX 7600 XT : janvier 2024 ; RX 7600 : mai 2023. Le repère RX 7900 GRE de
  juillet 2023 correspond au premier marché régional ; son lancement mondial
  de 2024 ne remplace pas rétroactivement cette première introduction.
- Une révision LHR n’hérite pas d’une fausse date de sortie individuelle : sauf
  variante explicitement traitée, le repère reste celui de la puce initiale.
- Corsair Vengeance RGB DDR4 et DDR5, ou Trident Z5 RGB et Trident Z5 Neo RGB,
  disposent de règles distinctes. DDR4/DDR5 seuls ne suffisent pas à dater un kit.
- Les noms d’alimentations RM750e, SF750 et FOCUS GX-850 peuvent couvrir plusieurs
  révisions. Ils restent sans date plutôt que de supposer la génération vendue.
- Les boîtiers H7 Flow (2022), H9 Flow (2023) et le refroidissement NH-D15
  chromax.black ne sont pas confondus avec leurs générations ultérieures.
- Quadro RTX 4000/5000 : génération 2018 ; RTX 4000 SFF, 4500 et 5000 Ada :
  génération 2023. La variante RTX 2000E Ada reste non datée ; elle ne reprend
  pas automatiquement la date de la RTX 2000 Ada.

## Recalculer la couverture du catalogue courant

Le catalogue contient maintenant plusieurs milliers de variantes regroupées par
modèle. Les quantités changent lors des imports ; la couverture chronologique
n’est donc pas figée dans un tableau de 1 500 références. Cette commande calcule
les nombres actuels de variantes datées et non datées, par catégorie, ainsi que
le nombre de groupes de modèles :

```sh
npx tsx -e '
import { catalog, categories } from "./src/data/catalog.ts";
import { getReleaseInfo } from "./src/data/releaseTimeline.ts";
import { getCatalogGroups } from "./src/lib/catalogVariants.ts";
for (const { id } of categories) {
  const variants = catalog.filter((part) => part.category === id);
  const dated = variants.filter((part) => getReleaseInfo(part)).length;
  console.log(id, { datees: dated, nonDatees: variants.length - dated, variantes: variants.length });
}
console.log({ variantes: catalog.length, groupesDeModeles: getCatalogGroups().length });
'
```

Certaines cartes mères sans repère n’ont que des codes internes comme
`N7-Z69XT-B1` et `N7-Z69XT-W1` dans la source. La chronologie ne suppose pas leur
chipset à partir d’un fragment du code. Les refroidissements Phantom Spirit 120 SE, Peerless
Assassin 120 SE et EK Nucleus AIO CR360 restent sans date dans cette version,
faute de distinction suffisamment établie entre annonce et disponibilité pour
ces variantes précises. Les autres absences concernent notamment les gammes
mémoire/SSD moins documentées et les alimentations à révisions ambiguës.

Pour enrichir une entrée, conserver le modèle ou la gamme exacte, la précision
réellement connue, le périmètre de la date et, si elle a été consultée, une source
traçable. Ne pas étendre une règle générique à un suffixe nouveau sans en vérifier
la chronologie. Les tests `tests/releaseTimeline.test.ts` protègent notamment ces
confusions, les variantes mémoire GPU et l’absence de repli sur la date source.
