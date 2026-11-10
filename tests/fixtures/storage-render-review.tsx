import React, {useLayoutEffect, useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {Canvas, useFrame} from '@react-three/fiber';
import {Box3, Group, Vector3} from 'three';
import {getComponent} from '../../src/data/catalog';
import {getStorageProfile, MM} from '../../src/data/visualProfiles';
import {StorageModel} from '../../src/components/scene/HardwareModels';

function Model({id}:{id:string}) {
  const ref=useRef<Group>(null);
  const component=getComponent(id)!;
  const profile=getStorageProfile(component)!;
  useLayoutEffect(()=>{
    const box=new Box3().setFromObject(ref.current!);const size=box.getSize(new Vector3());
    const card=document.getElementById(id)!;
    card.dataset.thinSpreader=String(!!ref.current!.getObjectByName('thin-ssd-heatspreader'));
    card.dataset.renderedHeightMm=String(size.x/MM);
    card.dataset.documentedHeightMm=String(profile.heightMm);
    card.dataset.dimensions=JSON.stringify([profile.lengthMm,profile.widthMm,profile.heightMm]);
  },[id,profile.heightMm,profile.lengthMm,profile.widthMm]);
  useFrame(({gl})=>{const card=document.getElementById(id)!;card.dataset.calls=String(gl.info.render.calls);card.dataset.triangles=String(gl.info.render.triangles);});
  return <group ref={ref}><StorageModel component={component} profile={profile}/></group>;
}

function App(){return <main>{['import-ssd-750788872ce5','import-ssd-fa2c155af873'].map(id=><article key={id} id={id}><h1>{getComponent(id)?.name}</h1><p>Échelle commune · dimensions documentées, détails de surface reconstitués.</p><Canvas camera={{position:[.85,.52,.68],fov:35,near:.01,far:20}} dpr={1} gl={{antialias:true,alpha:false,preserveDrawingBuffer:true}}><color attach="background" args={['#17221e']}/><ambientLight intensity={1.8}/><directionalLight position={[2,3,3]} intensity={3}/><directionalLight position={[-2,1,2]} intensity={1}/><Model id={id}/></Canvas></article>)}</main>}
createRoot(document.getElementById('root')!).render(<App/>);
