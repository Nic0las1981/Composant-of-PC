import type {Component} from '../data/catalog.ts';
import {catalogControlOutcomes} from '../data/catalogControl.ts';
import {getVerifiedProduct} from '../lib/verifiedOffers.ts';

const descriptions: Record<string,string> = {
  primary_match:'Une page produit correspond aux critères distinctifs de cette référence. Les sources et les offres admissibles sont indiquées ci-dessous.',
  ambiguous_variants:'Plusieurs références marchandes correspondent au nom et à une partie des caractéristiques. Leur MPN doit être départagé avant de retenir un prix.',
  conflicting_reference:'Une même référence marchande apparaît pour plusieurs variantes différentes du catalogue. Cette correspondance est écartée.',
  no_exact_match:'Aucune correspondance exacte n’a été conservée parmi les pages consultées. Cela ne prouve pas que ce composant est indisponible chez tous les vendeurs.',
  search_unreadable:'La recherche n’a pas fourni de page exploitable pour confirmer cette variante.',
  access_failed:'La source n’a pas pu être consultée. Le prix et les caractéristiques non documentées restent à confirmer.',
  collector_error:'Le contrôle de cette référence doit être repris ; aucune nouvelle donnée n’est validée.',
  pending:'La recherche individuelle de cette variante est encore en cours.',
};
export default function CatalogControlNotice({component}:{component:Component}) {
  const control=catalogControlOutcomes[component.id];
  if (!control) return null;
  const verified=getVerifiedProduct(component);
  return <section className="cp-control-notice" aria-label="État du contrôle de la référence" data-control-status={control.status}>
    <strong>{verified ? 'Référence documentée par une page primaire' : 'Référence à confirmer'}</strong>
    <p>{descriptions[control.status] ?? 'Le contrôle de cette variante reste à confirmer.'}</p>
    {control.checkedAt && <small>Recherche PcComponentes effectuée le {new Intl.DateTimeFormat('fr-FR',{dateStyle:'short',timeStyle:'short',timeZone:'Europe/Paris'}).format(new Date(control.checkedAt))} (Paris).</small>}
    {!verified && <p>Les caractéristiques archivées ci-dessous restent partielles. Les valeurs absentes ne sont pas considérées comme confirmées.</p>}
  </section>;
}
