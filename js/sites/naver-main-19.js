
(function(){
  const canvas=document.getElementById('naverCanvas');
  if(!canvas || canvas.dataset.guideDragReady)return;
  canvas.dataset.guideDragReady='1';
  const wrap=canvas.querySelector('.nv-ruler-wrap');
  if(!wrap)return;

  // 가이드 전용 레이어를 줄자보다 아래, 실제 콘텐츠보다 위에 둔다.
  const layer=document.createElement('div');
  layer.className='nv-guide-layer';
  layer.style.cssText='position:absolute;inset:0;z-index:9975;pointer-events:none;';
  canvas.appendChild(layer);

  let guides=[];
  let drag=null;
  let guideId=0;

  const point=e=>{
    const r=canvas.getBoundingClientRect();
    return {
      x:(e.clientX-r.left)*(canvas.offsetWidth/r.width),
      y:(e.clientY-r.top)*(canvas.offsetHeight/r.height)
    };
  };
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

  function makeGuide(type,pos){
    const el=document.createElement('div');
    el.className='nv-guide-line '+type;
    el.dataset.guideId=String(++guideId);
    el.style.display='block';
    el.style.pointerEvents='auto';
    if(type==='h')el.style.top=clamp(pos,0,1151)+'px';
    else el.style.left=clamp(pos,0,2048)+'px';
    layer.appendChild(el);
    const g={id:guideId,type,el};
    guides.push(g);
    bindGuide(g);
    return g;
  }

  function bindGuide(g){
    g.el.addEventListener('pointerdown',e=>{
      if(!canvas.classList.contains('nv-show-ruler'))return;
      e.preventDefault();e.stopPropagation();
      const p=point(e);
      drag={kind:'guide',guide:g,offset:g.type==='h'?(p.y-(parseFloat(g.el.style.top)||0)):(p.x-(parseFloat(g.el.style.left)||0))};
      g.el.classList.add('nv-guide-dragging');
      try{g.el.setPointerCapture(e.pointerId);}catch(_){ }
    });
    g.el.addEventListener('dblclick',e=>{
      e.preventDefault();e.stopPropagation();
      g.el.remove();guides=guides.filter(x=>x!==g);
    });
  }

  function startFromRuler(e,type){
    if(!canvas.classList.contains('nv-show-ruler'))return;
    e.preventDefault();e.stopPropagation();
    const p=point(e);
    const pos=type==='h'?clamp(p.y,0,1151):clamp(p.x,0,2048);
    const g=makeGuide(type,pos);
    drag={kind:'guide',guide:g,offset:0,pointerId:e.pointerId};
    g.el.classList.add('nv-guide-dragging');
  }

  const top=wrap.querySelector('.nv-ruler-top');
  const left=wrap.querySelector('.nv-ruler-left');
  const corner=wrap.querySelector('.nv-ruler-corner');
  top?.addEventListener('pointerdown',e=>startFromRuler(e,'h'));
  left?.addEventListener('pointerdown',e=>startFromRuler(e,'v'));
  // 모서리에서 끌면 직관적으로 가로 가이드가 만들어지도록 한다.
  corner?.addEventListener('pointerdown',e=>startFromRuler(e,'h'));

  window.addEventListener('pointermove',e=>{
    if(!drag || drag.kind!=='guide')return;
    const g=drag.guide,p=point(e);
    if(g.type==='h')g.el.style.top=clamp(p.y-drag.offset,0,1151)+'px';
    else g.el.style.left=clamp(p.x-drag.offset,0,2048)+'px';
  },true);

  window.addEventListener('pointerup',e=>{
    if(!drag || drag.kind!=='guide')return;
    const g=drag.guide;
    g.el.classList.remove('nv-guide-dragging');
    const p=point(e);
    // 줄자 밖으로 완전히 끌어내리면 가이드를 삭제할 수 있게 한다.
    if(e.clientX<canvas.getBoundingClientRect().left-20 || e.clientX>canvas.getBoundingClientRect().right+20 ||
       e.clientY<canvas.getBoundingClientRect().top-20 || e.clientY>canvas.getBoundingClientRect().bottom+20){
      g.el.remove();guides=guides.filter(x=>x!==g);
    }
    drag=null;
  },true);

  // 줄자 토글이 꺼져 있으면 가이드도 작업 화면에서 숨기지만 삭제하지 않는다.
  const rulerToggle=document.getElementById('nvRulerToggle');
  rulerToggle?.addEventListener('change',()=>{
    layer.style.display=rulerToggle.checked?'block':'none';
  });
  layer.style.display=rulerToggle?.checked?'block':'none';
})();
