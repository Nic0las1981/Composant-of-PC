import type { Component } from '../data/catalog.ts';
import { getVerifiedOffer, getVerifiedProduct, isCurrentVerifiedOffer } from '../lib/verifiedOffers.ts';

const euro = (value: number) => new Intl.NumberFormat('fr-FR', {style:'currency',currency:'EUR'}).format(value);
const date = (value: string) => new Intl.DateTimeFormat('fr-FR', {dateStyle:'short',timeStyle:'short',timeZone:'Europe/Paris'}).format(new Date(value));
const availability = {in_stock:'Disponible lors du relevé',out_of_stock:'Rupture de stock',discontinued:'Retiré de la vente',unknown:'Disponibilité non confirmée'};

export default function VerifiedProductPanel({component}:{component:Component}) {
  const product = getVerifiedProduct(component);
  if (!product) return null;
  const best = getVerifiedOffer(component);
  return <section className="cp-verified" aria-label="Références et offres vérifiées">
    <h3>Référence contrôlée auprès des sources</h3>
    <p><strong>{product.identityKind === 'manufacturer-model' ? product.manufacturerModel : product.mpn}</strong> · {product.identityNote}</p>
    {product.identityKind === 'manufacturer-model' && <p>Le fabricant documente ce modèle précis. Sa référence commerciale MPN reste à confirmer avant d’y rattacher une offre.</p>}
    <div className="cp-verified-sources">{product.sources.map((source,index) => <a key={`${source.url}-${index}`} href={source.url} target="_blank" rel="noopener noreferrer">
      {source.kind === 'manufacturer' ? 'Fabricant' : 'Fiche marchand'} · {source.name}<small>Consulté le {date(source.checkedAt)} (Paris)</small>
    </a>)}</div>
    {product.mpn && product.identityKind !== 'manufacturer-model' && product.offers.length > 0 ? <>
      <h4>Prix TTC relevés en France</h4>
      <p>Le budget retient le plus petit prix produit neuf disponible parmi ces relevés pendant 24 h. Les frais de livraison restent séparés ; ce choix ne compare pas les totaux livrés.</p>
      <ul className="cp-verified-offers">{product.offers.map((offer,index) => <li key={`${offer.url}-${index}`} data-retailer={offer.retailer} data-price-kind={offer.priceKind}>
        <div><a href={offer.url} target="_blank" rel="noopener noreferrer">{offer.retailer} · {euro(offer.amount)}</a><strong>{best === offer ? 'Retenu dans le budget' : offer.priceKind === 'last_known' ? 'Dernier prix historique · hors budget' : !isCurrentVerifiedOffer(offer) ? 'Hors budget' : 'Autre relevé disponible'}</strong></div>
        <p>Vendu par {offer.seller} · {offer.condition === 'new' ? 'Neuf' : offer.condition === 'refurbished' ? 'Reconditionné' : 'État non confirmé'} · {availability[offer.availability]}</p>
        <p>{offer.shippingNote} Relevé le {date(offer.checkedAt)} (Paris).</p>
        <small>{offer.productName} · {offer.mpn}</small>
      </li>)}</ul>
    </> : <p>Aucune offre correspondant exactement à cette référence n’a été confirmée dans les pages consultées.</p>}
  </section>;
}
