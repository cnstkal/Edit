
(function(){
  const canvas=document.getElementById('naverCanvas');
  const panel=document.querySelector('#naverApp .naver-settings');
  if(!canvas||!panel)return;

  /* 혹시 이전 버전이 동적으로 남아 있을 경우 제거 */
  panel.querySelectorAll('.nv-edit-toggle,.nv-coord-panel,.nv-direct-editor-recovery').forEach(el=>el.remove());

  const box=document.createElement('div');
  box.id='nvDirectEditorSingle';
  box.className='nv-single-editor';
  box.innerHTML=`
    <h3>프리뷰에서 글자 직접 편집</h3>
    <div class="nv-se-row"><button type="button" id="nvSingleToggle" class="active">편집모드 켜짐</button><span class="nv-single-help">글자를 클릭하면 선택됩니다. 선택한 글자를 드래그하면 이동하고, 초록 점을 드래그하면 크기가 바뀝니다.</span></div>
    <div class="nv-se-row"><strong id="nvSingleName">선택한 글자 없음</strong></div>
    <div class="nv-se-row">
      <label>X <input id="nvSingleX" type="number" step="1"></label>
      <label>Y <input id="nvSingleY" type="number" step="1"></label>
      <label>크기 <input id="nvSingleSize" type="number" min="1" step="1"> px</label>
      <button type="button" id="nvSingleApply">적용</button>
      <button type="button" id="nvSingleUp">↑</button><button type="button" id="nvSingleDown">↓</button><button type="button" id="nvSingleLeft">←</button><button type="button" id="nvSingleRight">→</button>
    </div>
    <div class="nv-se-row">
      <label>두께 <input id="nvSingleWeight" type="range" min="100" max="900" step="10" value="400"><output id="nvSingleWeightVal">400</output></label>
      <label>자간 <input id="nvSingleSpacing" type="range" min="-10" max="30" step="0.1" value="0"><output id="nvSingleSpacingVal">0px</output></label>
      <label>줄간격 <input id="nvSingleLineHeight" type="range" min="0.8" max="3" step="0.05" value="1.5"><output id="nvSingleLineHeightVal">1.5</output></label>
    </div>`;
  panel.insertBefore(box,panel.firstElementChild);

  const $=id=>document.getElementById(id);
  let editing=true, selected=null, drag=null;
  canvas.classList.add('nv-direct-single');

  const visible=el=>{
    if(!el||el.classList.contains('nv-fixed-text'))return false;
    const s=getComputedStyle(el); return s.display!=='none'&&s.visibility!=='hidden';
  };
  const overlays=()=>[...canvas.querySelectorAll('.nv-edit-overlay')].filter(visible);
  const pos=el=>({x:parseFloat(el.style.left)||0,y:parseFloat(el.style.top)||0});
  const scale=()=>{
    const r=canvas.getBoundingClientRect();
    return {x:canvas.offsetWidth/r.width,y:canvas.offsetHeight/r.height};
  };
  const point=e=>{const r=canvas.getBoundingClientRect(),sc=scale();return {x:(e.clientX-r.left)*sc.x,y:(e.clientY-r.top)*sc.y};};
  function panelSync(el){
    if(!el)return;
    const cs=getComputedStyle(el), fs=parseFloat(cs.fontSize)||16, wt=parseFloat(cs.fontWeight)||400;
    let sp=parseFloat(cs.letterSpacing); if(!Number.isFinite(sp))sp=0;
    let lh=parseFloat(cs.lineHeight); if(!Number.isFinite(lh))lh=1.5; else if(lh>6)lh/=fs;
    const p=pos(el);
    $('nvSingleName').textContent=el.id||'텍스트';
    $('nvSingleX').value=Math.round(p.x); $('nvSingleY').value=Math.round(p.y); $('nvSingleSize').value=Math.round(fs);
    $('nvSingleWeight').value=Math.max(100,Math.min(900,wt)); $('nvSingleWeightVal').textContent=Math.round(wt);
    $('nvSingleSpacing').value=Math.max(-10,Math.min(30,sp)); $('nvSingleSpacingVal').textContent=(Math.round(sp*10)/10)+'px';
    $('nvSingleLineHeight').value=Math.max(.8,Math.min(3,lh)); $('nvSingleLineHeightVal').textContent=(Math.round(Math.max(.8,Math.min(3,lh))*100)/100);
  }
  function handle(el){
    let h=el.querySelector(':scope > .nv-single-handle');
    if(!h){h=document.createElement('span');h.className='nv-single-handle';h.setAttribute('aria-hidden','true');el.appendChild(h);}
    return h;
  }
  function select(el){
    if(!visible(el))return;
    overlays().forEach(x=>x.classList.remove('nv-single-selected'));
    selected=el; el.classList.add('nv-single-selected'); handle(el); panelSync(el);
  }
  function hit(e){
    /* pointer-events/overlap에 의존하지 않고 실제 화면상의 bounding box로 찾는다. */
    const candidates=overlays().map(el=>({el,r:el.getBoundingClientRect()})).filter(o=>
      e.clientX>=o.r.left && e.clientX<=o.r.right && e.clientY>=o.r.top && e.clientY<=o.r.bottom
    );
    candidates.sort((a,b)=>{
      const za=parseInt(getComputedStyle(a.el).zIndex)||0, zb=parseInt(getComputedStyle(b.el).zIndex)||0;
      return zb-za;
    });
    return candidates[0]?.el||null;
  }
  function startMove(el,e){
    const p=point(e), xy=pos(el);
    drag={type:'move',el,startX:p.x,startY:p.y,startLeft:xy.x,startTop:xy.y};
  }
  function startResize(el,e){
    const p=point(e), fs=parseFloat(getComputedStyle(el).fontSize)||16;
    drag={type:'resize',el,startX:p.x,startY:p.y,startSize:fs};
  }

  canvas.addEventListener('pointerdown',e=>{
    if(!editing)return;
    const handleEl=e.target.closest?.('.nv-single-handle');
    const el=handleEl?.parentElement || hit(e);
    if(!el||!visible(el))return;
    e.preventDefault(); e.stopPropagation();
    select(el);
    if(handleEl) startResize(el,e); else startMove(el,e);
    try{canvas.setPointerCapture(e.pointerId)}catch(_){ }
  },true);

  canvas.addEventListener('pointermove',e=>{
    if(!drag||!editing)return;
    e.preventDefault();
    const p=point(e),d=drag;
    if(d.type==='move'){
      d.el.style.left=Math.round(d.startLeft+p.x-d.startX)+'px';
      d.el.style.top=Math.round(d.startTop+p.y-d.startY)+'px';
    }else{
      const delta=(p.y-d.startY);
      const size=Math.max(6,Math.min(120,d.startSize*(1+delta/120)));
      d.el.style.fontSize=size.toFixed(1)+'px';
    }
    d.el.classList.add('nv-edited'); panelSync(d.el);
  },true);
  canvas.addEventListener('pointerup',()=>{drag=null;},true);
  canvas.addEventListener('pointercancel',()=>{drag=null;},true);

  $('nvSingleToggle').addEventListener('click',()=>{
    editing=!editing; canvas.classList.toggle('nv-direct-single',editing);
    $('nvSingleToggle').classList.toggle('active',editing);
    $('nvSingleToggle').textContent=editing?'편집모드 켜짐':'편집모드 꺼짐';
  });
  function apply(){
    if(!selected)return;
    const x=parseFloat($('nvSingleX').value),y=parseFloat($('nvSingleY').value),z=parseFloat($('nvSingleSize').value);
    if(Number.isFinite(x))selected.style.left=Math.round(x)+'px';
    if(Number.isFinite(y))selected.style.top=Math.round(y)+'px';
    if(Number.isFinite(z))selected.style.fontSize=Math.max(1,z)+'px';
    selected.classList.add('nv-edited');panelSync(selected);
  }
  $('nvSingleApply').addEventListener('click',apply);
  ['nvSingleX','nvSingleY','nvSingleSize'].forEach(id=>$(id).addEventListener('change',apply));
  const move=(dx,dy)=>{if(!selected)return;selected.style.left=((parseFloat(selected.style.left)||0)+dx)+'px';selected.style.top=((parseFloat(selected.style.top)||0)+dy)+'px';selected.classList.add('nv-edited');panelSync(selected);};
  $('nvSingleUp').addEventListener('click',()=>move(0,-1)); $('nvSingleDown').addEventListener('click',()=>move(0,1)); $('nvSingleLeft').addEventListener('click',()=>move(-1,0)); $('nvSingleRight').addEventListener('click',()=>move(1,0));
  $('nvSingleWeight').addEventListener('input',e=>{if(!selected)return;selected.style.fontWeight=e.target.value;selected.classList.add('nv-edited');$('nvSingleWeightVal').textContent=e.target.value;});
  $('nvSingleSpacing').addEventListener('input',e=>{if(!selected)return;selected.style.letterSpacing=e.target.value+'px';selected.classList.add('nv-edited');$('nvSingleSpacingVal').textContent=(Math.round(Number(e.target.value)*10)/10)+'px';});
  $('nvSingleLineHeight').addEventListener('input',e=>{if(!selected)return;selected.style.lineHeight=e.target.value;selected.classList.add('nv-edited');$('nvSingleLineHeightVal').textContent=(Math.round(Number(e.target.value)*100)/100);});
})();
