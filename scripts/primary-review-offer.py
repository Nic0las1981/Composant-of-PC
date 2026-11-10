"""Parse only the primary offer; aggregate minima never become a quote."""
import re

def main_offer(p,page,mpn):
 offer=p.get('offers') or {}
 if not isinstance(offer,dict):return None
 if str(offer.get('@type','')).lower()=='aggregateoffer':offer=offer.get('offers') or {}
 if not isinstance(offer,dict) or str(offer.get('@type','')).lower()!='offer':return None
 if offer.get('priceCurrency')!='EUR':return None
 try:amount=float(offer['price'])
 except (ValueError,TypeError,KeyError):return None
 if amount<=0 or amount!=amount or amount==float('inf'):return None
 seller=offer.get('offeredBy') or offer.get('seller') or {}
 seller=seller.get('name') if isinstance(seller,dict) else None
 if not isinstance(seller,str) or not seller.strip():return None
 availability=str(offer.get('availability','')).split('/')[-1]
 stock={'InStock':'in_stock','OutOfStock':'out_of_stock','Discontinued':'discontinued'}.get(availability,'unknown')
 conditions={str(value).split('/')[-1] for value in [p.get('itemCondition'),offer.get('itemCondition')] if value}
 state='refurbished' if conditions & {'RefurbishedCondition','UsedCondition'} else 'new' if conditions=={'NewCondition'} else 'unknown'
 if re.search(r'reconditionn|reacondicion|refurbished|\bused\b|\boccasion\b',p.get('name','')+' '+page['url'],re.I):state='refurbished'
 shipping=None
 details=offer.get('shippingDetails') or {}
 if isinstance(details,dict):
  rate=details.get('shippingRate') or {}
  if isinstance(rate,dict) and rate.get('currency')=='EUR':
   try:
    candidate=float(rate['value'])
    if 0<=candidate<float('inf'):shipping=candidate
   except (ValueError,KeyError,TypeError):pass
 return {'retailer':'PcComponentes','seller':seller,'url':page['url'],'productName':p.get('name',''),
  'mpn':mpn,'amount':amount,'currency':'EUR','market':'FR','condition':state,'availability':stock,
  'priceKind':'current','shipping':shipping,'shippingNote':f'Frais affichés : {shipping:g} € ; destination et conditions à confirmer.' if shipping is not None else 'Frais de livraison non confirmés.',
  'checkedAt':page['checkedAt']}
