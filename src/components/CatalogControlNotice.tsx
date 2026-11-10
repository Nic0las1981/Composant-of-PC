import type {Component} from '../data/catalog.ts';
import {catalogControlOutcomes} from '../data/catalogControl.ts';
import {getVerifiedProduct} from '../lib/verifiedOffers.ts';
import {individualProducts} from '../data/individualCatalog.ts';
import {getMissingCompatibilityFields} from '../lib/componentCoverage.ts';
import {catalogQuarantine} from '../data/catalogQuarantine.ts';
import {comprehensiveProducts} from '../data/comprehensiveCatalog.ts';
import {deepProducts} from '../data/deepCatalog.ts';
import {getCatalogCompletion} from '../lib/catalogCompletion.ts';

const descriptions: Record<string,string> = {
  primary_match:'Une page produit correspond aux critères distinctifs de cette référence. Les sources et les offres admissibles sont indiquées ci-dessous.',
  ambiguous_variants:'Plusieurs références marchandes correspondent au nom et à une partie des caractéristiques. Leur MPN doit être départagé avant de retenir un prix.',
  conflicting_reference:'Une même référence marchande apparaît pour plusieurs variantes différentes du catalogue. Cette correspondance est écartée.',
  no_exact_match:'Aucune correspondance exacte n’a été conservée parmi les pages consultées. Cela ne prouve pas que ce composant est indisponible chez tous les vendeurs.',
  search_unreadable:'La recherche n’a pas fourni de page exploitable pour confirmer cette variante.',
  access_failed:'La source n’a pas pu être consultée. Le prix et les caractéristiques non documentées restent à confirmer.',
  collector_error:'Le contrôle de cette référence doit être repris ; aucune nouvelle donnée n’est validée.',
  pending:'La recherche individuelle de cette variante est encore en cours.',
  candidate_pending_review:'Une nouvelle page candidate a été trouvée. Sa référence et ses caractéristiques doivent être revues individuellement avant de retenir son prix.',
};
export default function CatalogControlNotice({component}:{component:Component}) {
  const control=catalogControlOutcomes[component.id];
  if (!control) return null;
  const verified=getVerifiedProduct(component);
  const quarantine=catalogQuarantine[component.id];
  if(quarantine&&!verified)return <section className="cp-control-notice" aria-label="État du contrôle de la référence" data-control-status="identity_conflict">
    <strong>Référence exacte à identifier</strong><p>{quarantine.reason}</p><p>La fiche et le prix du produit différent ont été écartés. Les données de cette variante restent à confirmer.</p>
  </section>;
  const individual=deepProducts[component.id]??comprehensiveProducts[component.id]??individualProducts[component.id];
  if(individual&&verified){
    const missing=getMissingCompatibilityFields(component);
    const completion=getCatalogCompletion(component,verified);
    const undocumented=completion.technical.fields.filter(field=>field.state!=='documented');
    return <section className="cp-control-notice" aria-label="État du contrôle de la référence" data-control-status="individual_review">
      <strong>Fiche technique sourcée · {verified.identityKind === 'manufacturer-model' ? verified.manufacturerModel : verified.mpn}</strong>
      <p>Les caractéristiques confirmées ci-dessous alimentent les contrôles de compatibilité.</p>
      {missing.length>0?<p>À confirmer : {missing.map(field=>field.label).join(', ')}.</p>:<p>Les champs nécessaires aux contrôles de ce composant sont renseignés. Les contraintes de montage de l’ensemble restent vérifiées séparément.</p>}
      {undocumented.length>0&&<details><summary>Caractéristiques restant à documenter</summary><p>{undocumented.map(field=>field.label+(field.state==='conflicting'?' (sources divergentes)':'')).join(' · ')}.</p></details>}
    </section>;
  }
  return <section className="cp-control-notice" aria-label="État du contrôle de la référence" data-control-status={control.status}>
    <strong>{verified ? 'Référence documentée par une page primaire' : 'Référence à confirmer'}</strong>
    <p>{descriptions[control.status] ?? 'Le contrôle de cette variante reste à confirmer.'}</p>
    {control.checkedAt && <small>Recherche PcComponentes effectuée le {new Intl.DateTimeFormat('fr-FR',{dateStyle:'short',timeStyle:'short',timeZone:'Europe/Paris'}).format(new Date(control.checkedAt))} (Paris).</small>}
    {!verified && <p>Les caractéristiques archivées ci-dessous restent partielles. Les valeurs absentes ne sont pas considérées comme confirmées.</p>}
  </section>;
}
