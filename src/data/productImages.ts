import type {Component} from './catalog';
import {manufacturerImageAssets} from './manufacturerImageAssets';

export type ProductImage={
  imageURL:string;
  sourceURL:string;
  inspection:'visually-inspected'|'manufacturer-catalogue';
  mpn?:string;
  revision?:string;
};
const images:Readonly<Record<string,ProductImage>>=manufacturerImageAssets;

/** Only explicit per-ID assets are eligible. A similar name never selects a photo. */
export function getProductImage(component:Component|string|null|undefined):ProductImage|undefined{
 const id=typeof component==='string'?component:component?.id;
 if(!id||!Object.hasOwn(images,id))return undefined;
 const image=images[id];
 if(typeof component==='object'&&image.mpn
   &&component?.manufacturerPartNumber?.trim().toUpperCase()!==image.mpn.trim().toUpperCase())return undefined;
 return image;
}
