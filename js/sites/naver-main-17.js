
(function(){
 const q=id=>document.getElementById(id), c=q('naverCanvas'), panel=document.querySelector('#naverApp .naver-settings');
 if(!c||!panel)return;
 const fixed={
  nvSearchOut:{left:591,top:133,fontSize:28},
  nvAccountNameOut:{left:1517,top:390,fontSize:22,fontWeight:700,letterSpacing:-0.5},
  nvEmailOut:{left:1517,top:428},
  nvHeadlinesOut:{left:684,top:593,fontSize:25,fontWeight:430,letterSpacing:-2,lineHeight:2},
  nvFeatureTitle:{left:345,top:821,fontSize:22,fontWeight:520,letterSpacing:-0.5,lineHeight:1.35},
  nvFeatureMeta:{left:401,top:552,fontSize:22,fontWeight:400,letterSpacing:-1}
 };
 const applyFixed=(id,st)=>{const e=q(id);if(!e)return; for(const [k,v] of Object.entries(st)) e.style.setProperty(k, typeof v==='number' && ['left','top','fontSize'].includes(k)?v+'px':typeof v==='number'&&k==='letterSpacing'?v+'px':k==='fontWeight'?String(v):k==='lineHeight'?String(v):String(v),'important'); e.classList.add('nv-fixed-text');};
 Object.entries(fixed).forEach(([id,st])=>applyFixed(id,st));
 // 내용 입력은 그대로 가능. 위치/스타일만 다시 고정.
 const contentMap={nvSearch:'nvSearchOut',nvAccountName:'nvAccountNameOut',nvEmail:'nvEmailOut',nvFeatureTitleInput:'nvFeatureTitle',nvFeatureMetaInput:'nvFeatureMeta'};
 Object.entries(contentMap).forEach(([iid,oid])=>{const a=q(iid),b=q(oid);if(!a||!b)return; const sync=()=>{b.textContent=a.value;applyFixed(oid,fixed[oid]);}; a.addEventListener('input',sync); sync();});
 // 뉴스 제목 렌더링/입력 스크립트가 다시 그려도 위치는 즉시 복원.
 const restore=()=>Object.entries(fixed).forEach(([id,st])=>applyFixed(id,st));
 const mo=new MutationObserver(()=>{if(!window.__nvRestoring){window.__nvRestoring=true;restore();window.__nvRestoring=false;}});
 Object.keys(fixed).forEach(id=>{const e=q(id);if(e)mo.observe(e,{attributes:true,attributeFilter:['style','class']});});
 // 직접 편집 패널을 하나만 유지하고, 고정 요소는 목록에서 완전히 제외.
 const editors=panel.querySelectorAll('.nv-single-editor');
 editors.forEach((e,i)=>{if(i>0)e.remove();});
 const box=q('nvDirectEditorFinal');
 if(box){
   const sel=q('nvFinalTarget');
   if(sel){
     const fixedIds=new Set(Object.keys(fixed));
     [...sel.options].forEach(o=>{if(fixedIds.has(o.value))o.remove();});
     // 허용 대상만 유지
     const allowed=new Set(['nvRightTextOut','nvNewsbarMiddle','nvPressEditable1','nvPressEditable2','nvPressEditable3','nvPressEditable4','nvSubscribedOverlay','nvOtherNewsOverlay']);
     [...sel.options].forEach(o=>{if(o.value && !allowed.has(o.value))o.remove();});
   }
   // 패널 안내문을 명확히 변경
   const help=box.querySelector('.nv-f-help'); if(help)help.textContent='오른쪽 패널에서 선택한 항목만 위치와 스타일을 수정할 수 있습니다. 프로필/검색어/이메일/대표뉴스/뉴스목록/기사 날짜·출처는 고정입니다.';
 }
 // 구독언론사 옆 문구: 실제 화면에 보이게 하고 입력과 강제 연결.
 const mid=q('nvNewsbarMiddle'), midIn=q('nvNewsbarMiddleInput');
 if(mid){mid.classList.remove('nv-fixed-text');mid.style.setProperty('display','block','important');mid.style.setProperty('position','absolute','important');mid.style.setProperty('left','285px','important');mid.style.setProperty('top','465px','important');mid.style.setProperty('z-index','40','important');mid.style.setProperty('pointer-events','none','important');mid.style.setProperty('white-space','nowrap','important');}
 if(mid&&midIn){const sync=()=>{mid.textContent=midIn.value;mid.classList.remove('nv-fixed-text');mid.style.setProperty('display','block','important');};midIn.addEventListener('input',sync);sync();}
 // 언론사 이름 4개: 기존 숨김 fixed span 대신 별도 overlay를 사용.
 let layer=q('nvPressEditableLayer');
 if(!layer){layer=document.createElement('div');layer.id='nvPressEditableLayer';c.appendChild(layer);}
 layer.style.cssText='position:absolute;inset:0;z-index:40;pointer-events:none;';
 for(let i=1;i<=4;i++){
   let out=q('nvPressEditable'+i);if(!out){out=document.createElement('div');out.id='nvPressEditable'+i;layer.appendChild(out);}
   const inp=q('nvPressName'+i),xi=q('nvPressName'+i+'X'),yi=q('nvPressName'+i+'Y');
   const sync=()=>{
     out.textContent=inp?.value||'';
     out.style.cssText='position:absolute;display:block!important;left:'+(Number(xi?.value)||115)+'px;top:'+(Number(yi?.value)||570+(i-1)*57)+'px;width:150px;height:42px;box-sizing:border-box;padding:7px 12px;background:'+(i===4?'#4a58e8':'#fff')+';color:'+(i===4?'#fff':'#111')+';font-family:Pretendard,sans-serif;font-size:22px;font-weight:400;line-height:28px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none;z-index:40;';
   };
   [inp,xi,yi].forEach(e=>e?.addEventListener('input',sync));sync();
 }
 // 드롭다운에 동적으로 다시 추가되는 경우도 고정 요소는 제거하고 허용 항목만 남긴다.
 setTimeout(()=>{
   const sel=q('nvFinalTarget');if(!sel)return;
   const fixedIds=new Set(Object.keys(fixed)); const allowed=new Set(['nvRightTextOut','nvNewsbarMiddle','nvPressEditable1','nvPressEditable2','nvPressEditable3','nvPressEditable4','nvSubscribedOverlay','nvOtherNewsOverlay']);
   [...sel.options].forEach(o=>{if(fixedIds.has(o.value)||(!allowed.has(o.value)&&o.value))o.remove();});
 },0);
})();
