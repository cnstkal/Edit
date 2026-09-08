
(function(){
 const q=id=>document.getElementById(id);
 const set=(id,props)=>{const e=q(id);if(!e)return;Object.assign(e.style,props);};
 // 값/스타일 고정
 const search=q('nvSearch'); if(search){search.value=search.value||'박성화';}
 const meta=q('nvFeatureMetaInput'); if(meta){meta.value=meta.value||'2월 24일 9:30 직접 편집';}
 const hs=q('nvHeadlineSize'), hw=q('nvHeadlineWeight'); if(hs)hs.value='25'; if(hw)hw.value='400';
 const ms=q('nvFeatureMetaInput');
 set('nvSearchOut',{left:'591px',top:'130px',fontSize:'28px',letterSpacing:'-0.5px',fontWeight:'490'});
 set('nvFeatureMeta',{left:'398px',top:'559px',fontSize:'22px',fontWeight:'400',letterSpacing:'-0.5px',width:'max-content'});
 set('nvHeadlinesOut',{left:'668px',top:'590px',fontSize:'25px',fontWeight:'430',letterSpacing:'-0.5px',color:'#000',width:'max-content',maxWidth:'none',whiteSpace:'pre',lineHeight:'1.85'});
 set('nvFeatureTitle',{whiteSpace:'pre-wrap',width:'310px',maxWidth:'310px',wordBreak:'keep-all',overflowWrap:'normal',lineHeight:'1.45'});
 // 대표뉴스 제목은 입력한 줄바꿈을 그대로 허용
 const titleIn=q('nvFeatureTitleInput'),titleOut=q('nvFeatureTitle');
 if(titleIn&&titleOut){const sync=()=>{titleOut.textContent=titleIn.value;};sync();titleIn.addEventListener('input',sync);}
 // 대표 기사 날짜/출처
 if(meta){const out=q('nvFeatureMeta');const sync=()=>{if(out)out.textContent=meta.value;};sync();meta.addEventListener('input',sync);}
 // 뉴스 제목 목록 좌표/스타일이 기존 스타일 설정에 의해 바뀌어도 최종값 유지
 const headlineOut=q('nvHeadlinesOut');
 ['input','change'].forEach(ev=>{q('nvHeadlineSize')?.addEventListener(ev,()=>set('nvHeadlinesOut',{fontSize:'25px'}));q('nvHeadlineWeight')?.addEventListener(ev,()=>set('nvHeadlinesOut',{fontWeight:'430'}));});
 // 언론사 이름 4개: 배경 이미지에 박힌 기존 이름을 덮고 입력값을 표시
 const wrap=q('naverCanvas');
 if(wrap){
   let pressLayer=q('nvPressEditableLayer');
   if(!pressLayer){
     pressLayer=document.createElement('div');pressLayer.id='nvPressEditableLayer';
     pressLayer.style.cssText='position:absolute;inset:0;z-index:20;pointer-events:none;';wrap.appendChild(pressLayer);
   }
   const defs=[
     ['nvPressName1','nvPressEditable1',115,570,false],
     ['nvPressName2','nvPressEditable2',115,627,false],
     ['nvPressName3','nvPressEditable3',115,684,false],
     ['nvPressName4','nvPressEditable4',115,741,true]
   ];
   defs.forEach(([inId,outId,left,top,selected])=>{
     let el=q(outId);
     if(!el){el=document.createElement('div');el.id=outId;pressLayer.appendChild(el);}
     el.style.cssText=`position:absolute;left:${left}px;top:${top}px;width:150px;height:40px;box-sizing:border-box;padding:7px 12px;pointer-events:none;font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:22px;font-weight:400;line-height:26px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:left;color:${selected?'#fff':'#111'};background:${selected?'#4a58e8':'#fff'};`;
     const inp=q(inId); if(inp){const sync=()=>el.textContent=inp.value;sync();inp.addEventListener('input',sync);}
   });
 }
 // 구독중 N / 다른 언론사 뉴스 N/N: 숫자만 편집 가능, 나머지는 고정
 const subIn=q('nvSubscribedCount'), otherIn=q('nvOtherNewsCount');
 const sub=q('nvPressSub'), footer=q('nvFooterMore');
 function updateNumbers(){
   if(sub){sub.textContent='구독중 '+(subIn?.value||'8')+'　⚙';}
   if(footer){footer.textContent='더보기 '+(otherIn?.value||'7')+'/8';}
 }
 updateNumbers(); subIn?.addEventListener('input',updateNumbers); otherIn?.addEventListener('input',updateNumbers);
 // 해당 숫자 외의 문구는 직접편집에서 고정
 if(sub)sub.classList.add('nv-fixed-text'); if(footer)footer.classList.add('nv-fixed-text');
 // 기존 직접편집 선택기가 고정 텍스트를 선택하지 못하게 방어
 wrap?.addEventListener('pointerdown',e=>{if(e.target.closest('#nvPressEditableLayer')){e.stopPropagation();}},true);
})();
