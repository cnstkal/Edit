
(function(){
  const canvas=document.getElementById('naverCanvas');
  const panel=document.querySelector('#naverApp .naver-settings');
  if(!canvas||!panel)return;

  /* 이전 버전의 직접편집 패널은 하나도 남기지 않는다. */
  panel.querySelectorAll('.nv-single-editor,.nv-edit-toggle,.nv-coord-panel,.nv-direct-editor-recovery').forEach(el=>el.remove());
  canvas.querySelectorAll('.nv-single-handle,.nv-single-selected').forEach(el=>el.classList.remove('nv-single-selected'));
  canvas.classList.remove('nv-direct-single','nv-direct-editing');
  canvas.classList.add('nv-right-panel-edit-only');

  /* 줄자 도구가 항상 패널 최상단, 직접편집은 그 바로 아래가 되도록 순서를 강제한다. */
  const rulerTools=panel.querySelector('.nv-guide-tools');
  if(rulerTools)panel.insertBefore(rulerTools,panel.firstElementChild);

  const box=document.createElement('div');
  box.id='nvDirectEditorFinal';
  box.className='nv-single-editor nv-final-direct';
  box.innerHTML=`
    <h3>프리뷰에서 글자 직접 편집</h3>
    <div class="nv-f-row">
      <select id="nvFinalTarget">
        <option value="">편집할 글자를 선택하세요</option>
      </select>
    </div>
    <div class="nv-f-help">프리뷰에서 움직이지 않아도 됩니다. 위에서 글자를 선택한 뒤 오른쪽 패널의 X/Y/크기/두께/자간/줄간격을 조절하면 즉시 반영됩니다.</div>
    <div class="nv-f-row">
      <label>X <input id="nvFinalX" type="number" step="1"></label>
      <label>Y <input id="nvFinalY" type="number" step="1"></label>
      <label>크기 <input id="nvFinalSize" type="number" min="1" step="1"> px</label>
      <button type="button" id="nvFinalApply" class="primary">적용</button>
    </div>
    <div class="nv-f-row">
      <button type="button" id="nvFinalUp">↑</button><button type="button" id="nvFinalDown">↓</button><button type="button" id="nvFinalLeft">←</button><button type="button" id="nvFinalRight">→</button>
    </div>
    <div class="nv-f-row">
      <label>두께 <input id="nvFinalWeight" type="range" min="100" max="900" step="10" value="400"><output id="nvFinalWeightVal">400</output></label>
      <label>자간 <input id="nvFinalSpacing" type="range" min="-20" max="30" step="0.1" value="0"><output id="nvFinalSpacingVal">0px</output></label>
      <label>줄간격 <input id="nvFinalLineHeight" type="range" min="0.8" max="3" step="0.05" value="1.5"><output id="nvFinalLineHeightVal">1.5</output></label>
    </div>`;
  panel.insertBefore(box, rulerTools ? rulerTools.nextSibling : panel.firstElementChild);

  const $=id=>document.getElementById(id);
  const targets=[
    ['nvSearchOut','검색어'],
    ['nvAccountNameOut','프로필 이름'],
    ['nvEmailOut','이메일'],
    ['nvFeatureMeta','대표기사 날짜/출처'],
    ['nvFeatureTitle','대표뉴스 제목'],
    ['nvHeadlinesOut','뉴스 제목 목록'],
    ['nvRightTextOut','오른쪽 카드']
  ];
  const get=id=>document.getElementById(id);
  const editableTargets=targets.map(([id,name])=>[id,name,get(id)]).filter(x=>x[2] && !x[2].classList.contains('nv-fixed-text'));
  const select=$('nvFinalTarget');
  editableTargets.forEach(([id,name,el])=>{
    const o=document.createElement('option');o.value=id;o.textContent=name;select.appendChild(o);
  });

  let selected=null;
  const num=v=>Number.isFinite(parseFloat(v))?parseFloat(v):0;
  function setImportant(el,prop,value){el.style.setProperty(prop,String(value), 'important');}
  function currentLineHeight(el){
    const cs=getComputedStyle(el),fs=num(cs.fontSize)||16;
    let lh=num(cs.lineHeight);
    if(!Number.isFinite(lh))lh=1.5;
    else if(lh>6)lh/=fs;
    return Math.max(.8,Math.min(3,lh));
  }
  function sync(){
    if(!selected){
      $('nvFinalX').value='';$('nvFinalY').value='';$('nvFinalSize').value='';
      $('nvFinalWeight').value=400;$('nvFinalWeightVal').textContent='400';
      $('nvFinalSpacing').value=0;$('nvFinalSpacingVal').textContent='0px';
      $('nvFinalLineHeight').value=1.5;$('nvFinalLineHeightVal').textContent='1.5';
      return;
    }
    const cs=getComputedStyle(selected);
    $('nvFinalX').value=Math.round(num(selected.style.left));
    $('nvFinalY').value=Math.round(num(selected.style.top));
    $('nvFinalSize').value=Math.round(num(cs.fontSize)||16);
    const wt=num(cs.fontWeight)||400;
    $('nvFinalWeight').value=Math.max(100,Math.min(900,wt));$('nvFinalWeightVal').textContent=Math.round(wt);
    let sp=num(cs.letterSpacing);if(!Number.isFinite(sp))sp=0;
    $('nvFinalSpacing').value=Math.max(-20,Math.min(30,sp));$('nvFinalSpacingVal').textContent=(Math.round(sp*10)/10)+'px';
    const lh=currentLineHeight(selected);$('nvFinalLineHeight').value=lh;$('nvFinalLineHeightVal').textContent=(Math.round(lh*100)/100).toString();
  }
  function choose(id){
    const el=get(id);if(!el)return;
    selected=el;select.value=id;
    el.classList.add('nv-edited');
    sync();
  }
  select.addEventListener('change',()=>choose(select.value));

  function apply(){
    if(!selected)return;
    const x=parseFloat($('nvFinalX').value),y=parseFloat($('nvFinalY').value),s=parseFloat($('nvFinalSize').value);
    if(Number.isFinite(x))setImportant(selected,'left',Math.round(x)+'px');
    if(Number.isFinite(y))setImportant(selected,'top',Math.round(y)+'px');
    if(Number.isFinite(s))setImportant(selected,'font-size',Math.max(1,s)+'px');
    selected.classList.add('nv-edited');sync();
  }
  $('nvFinalApply').addEventListener('click',apply);
  ['nvFinalX','nvFinalY','nvFinalSize'].forEach(id=>$(id).addEventListener('change',apply));

  function move(dx,dy){
    if(!selected)return;
    const x=num(selected.style.left),y=num(selected.style.top);
    setImportant(selected,'left',(x+dx)+'px');setImportant(selected,'top',(y+dy)+'px');selected.classList.add('nv-edited');sync();
  }
  $('nvFinalUp').addEventListener('click',()=>move(0,-1));
  $('nvFinalDown').addEventListener('click',()=>move(0,1));
  $('nvFinalLeft').addEventListener('click',()=>move(-1,0));
  $('nvFinalRight').addEventListener('click',()=>move(1,0));
  $('nvFinalWeight').addEventListener('input',e=>{if(!selected)return;setImportant(selected,'font-weight',e.target.value);$('nvFinalWeightVal').textContent=e.target.value;selected.classList.add('nv-edited');});
  $('nvFinalSpacing').addEventListener('input',e=>{if(!selected)return;setImportant(selected,'letter-spacing',e.target.value+'px');$('nvFinalSpacingVal').textContent=(Math.round(Number(e.target.value)*10)/10)+'px';selected.classList.add('nv-edited');});
  $('nvFinalLineHeight').addEventListener('input',e=>{if(!selected)return;setImportant(selected,'line-height',e.target.value);$('nvFinalLineHeightVal').textContent=(Math.round(Number(e.target.value)*100)/100);selected.classList.add('nv-edited');});

  /* 기본 선택: 검색어. 즉시 조작 가능하도록 한다. */
  if(get('nvSearchOut'))choose('nvSearchOut');
})();
