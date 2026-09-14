import './lib/model-viewer.min.js';

export function mount(figure, nodes) {
  const spanish={
    'Zoom out':'Alejar','Zoom in':'Acercar','Reset':'Restablecer','Reset view':'Restablecer vista',
    'Rotate':'Girar','Rotate model':'Girar modelo','Fullscreen':'Pantalla completa','Exit fullscreen':'Salir de pantalla completa',
    '3D model controls':'Controles del modelo 3D','Interactive 3D health network':'Red de salud 3D interactiva',
    'The 3D model could not load.':'No se pudo cargar el modelo 3D.','Retry':'Reintentar',
    'A three-dimensional network connecting a care team, patient and health services':'Una red tridimensional que conecta al equipo de salud, al paciente y a los servicios de salud'
  };
  const t=text=>document.documentElement.lang==='es'?(spanish[text]||text):text;
  const viewer = document.createElement('model-viewer');
  viewer.src = '/web/health-network.glb?v=1';
  viewer.poster = '/web/health-network-poster.png?v=1';
  const description='A three-dimensional network connecting a care team, patient and health services';
  viewer.alt = t(description);
  viewer.setAttribute('camera-controls', '');
  viewer.setAttribute('touch-action', 'pan-y');
  viewer.setAttribute('interaction-prompt', 'none');
  viewer.setAttribute('camera-orbit', '24deg 76deg 4.6m');
  viewer.setAttribute('min-camera-orbit', 'auto 15deg 2.7m');
  viewer.setAttribute('max-camera-orbit', 'auto 165deg 8m');
  viewer.setAttribute('field-of-view', '32deg');
  viewer.setAttribute('shadow-intensity', '1');
  viewer.setAttribute('shadow-softness', '1');
  viewer.setAttribute('environment-image', 'neutral');
  viewer.setAttribute('exposure', '.9');
  viewer.setAttribute('loading', 'eager');
  viewer.setAttribute('aria-label', 'Interactive 3D health network');
  viewer.className = 'network-model';

  const player = document.createElement('div'); player.className = 'network-player';
  const toolbar = document.createElement('div'); toolbar.className = 'network-tools';
  toolbar.setAttribute('role', 'toolbar'); toolbar.setAttribute('aria-label', '3D model controls');
  const caption = document.createElement('div'); caption.className = 'network-caption';
  caption.setAttribute('role', 'status');
  const buttons = [];
  function control(text, label, action) {
    const b = document.createElement('button'); b.type='button'; b.textContent=text;
    b.setAttribute('aria-label',label); b.title=label; b.addEventListener('click',action);
    toolbar.append(b); buttons.push({b,text,label}); return b;
  }
  function zoom(factor) {
    const orbit=viewer.getCameraOrbit();
    viewer.cameraOrbit=`${orbit.theta}rad ${orbit.phi}rad ${Math.max(2.7,Math.min(8,orbit.radius*factor))}m`;
  }
  control('−','Zoom out',()=>zoom(1.2));
  control('+','Zoom in',()=>zoom(1/1.2));
  control('Reset','Reset view',()=>{
    viewer.cameraOrbit='24deg 76deg 4.6m'; viewer.cameraTarget='auto auto auto';
    viewer.autoRotate=false; spin.setAttribute('aria-pressed','false');
    viewer.resetTurntableRotation();
    selected=null;
    caption.textContent='';
  });
  const spin=control('Rotate','Rotate model',()=>{
    viewer.autoRotate=!viewer.autoRotate;
    spin.setAttribute('aria-pressed',String(viewer.autoRotate));
  });
  spin.setAttribute('aria-pressed','false');
  let oldOverflow='';
  const inertSiblings=[];
  function collapse(){
    player.classList.remove('is-expanded');player.removeAttribute('aria-modal');player.removeAttribute('role');
    document.body.style.overflow=oldOverflow;full.focus();localize();
    inertSiblings.splice(0).forEach(([el,inert])=>{el.inert=inert;});
  }
  function expand(){
    oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
    player.classList.add('is-expanded');player.setAttribute('role','dialog');player.setAttribute('aria-modal','true');
    player.setAttribute('aria-label',t('Interactive 3D health network'));full.focus();localize();
    for(let branch=player;branch.parentElement;branch=branch.parentElement){
      for(const sibling of branch.parentElement.children){
        if(sibling!==branch){inertSiblings.push([sibling,sibling.inert]);sibling.inert=true;}
      }
      if(branch.parentElement===document.body)break;
    }
  }
  const full=control('⛶','Fullscreen',async()=>{
    if(player.classList.contains('is-expanded')) return collapse();
    if(document.fullscreenElement) await document.exitFullscreen();
    else {
      try { if(player.requestFullscreen) await player.requestFullscreen(); else expand(); }
      catch { expand(); }
    }
  });
  document.addEventListener('keydown',e=>{
    if(!player.classList.contains('is-expanded'))return;
    if(e.key==='Escape'){e.preventDefault();collapse();}
    if(e.key==='Tab'){
      const first=viewer,last=full;
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  document.addEventListener('focusin',e=>{
    if(player.classList.contains('is-expanded')&&!player.contains(e.target))full.focus();
  });
  function localize(){
    buttons.forEach(({b,text,label})=>{b.textContent=t(text);b.setAttribute('aria-label',t(label));b.title=t(label);});
    full.setAttribute('aria-label',t(document.fullscreenElement||player.classList.contains('is-expanded')?'Exit fullscreen':'Fullscreen'));
    full.textContent=document.fullscreenElement||player.classList.contains('is-expanded')?'×':'⛶';
    full.title=full.getAttribute('aria-label');viewer.alt=t(description);
    toolbar.setAttribute('aria-label',t('3D model controls'));viewer.setAttribute('aria-label',t('Interactive 3D health network'));
  }
  document.addEventListener('fullscreenchange',localize);
  window.addEventListener('human-rounds:language',localize);

  // Hotspots belong to the model's exact coordinates and retain live country data.
  const positions=[[-1.05,.5,.15],[-.38,1.03,-.32],[.62,.86,.1],[1.15,.08,-.1],[.73,-.82,.40],[-.25,-.99,-.12],[-1.04,-.42,-.25]];
  let selected=null;
  nodes.filter(n=>n.kind==='inst').forEach((node,i)=>{
    const hotspot=document.createElement('button'); hotspot.type='button';
    hotspot.className='network-hotspot'; hotspot.slot='hotspot-'+i;
    hotspot.setAttribute('data-position',positions[i].join(' '));
    hotspot.setAttribute('data-normal',positions[i].join(' '));
    const label=()=>{
      const name=node.el.querySelector('.ichip-label')?.textContent || '';
      const note=node.el.querySelector('.ichip-note')?.textContent;
      return name+(note?' ('+note+')':'');
    };
    const update=()=>{hotspot.setAttribute('aria-label',label());hotspot.title=label();if(selected===node)caption.textContent=label();};
    update(); new MutationObserver(update).observe(node.el,{childList:true,subtree:true,characterData:true});
    hotspot.addEventListener('click',()=>{selected=node;caption.textContent=label();});
    viewer.append(hotspot);
  });
  player.append(viewer,toolbar,caption); figure.append(player);
  localize();
  figure.classList.add('has-model-player');
  viewer.addEventListener('load',()=>{figure.dataset.modelLoaded='true';});
  viewer.addEventListener('error',()=>{
    caption.textContent=t('The 3D model could not load.');
    const retry=document.createElement('button');retry.type='button';retry.textContent=t('Retry');
    retry.onclick=()=>{viewer.src='/web/health-network.glb?retry='+Date.now();caption.textContent='';};
    caption.append(' ',retry);
  });
}
