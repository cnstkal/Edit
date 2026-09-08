
(function(){
 const q=id=>document.getElementById(id), panel=document.querySelector('#naverApp .naver-settings'), canvas=q('naverCanvas');
 if(!panel||!canvas)return;
 const first=x=>x?.firstElementChild;
 // 1) 기존 고정값으로 묶여 있던 '구독언론사 옆 문구'는 사용자 편집 가능으로 전환
 const middle=q('nvNewsbarMiddle'); if(middle)middle.classList.remove('nv-fixed-text');
 // 2) 설정 최상단에 사용자 편집 영역 하나만 만든다. 기존 입력 DOM은 그대로 이동시켜 이벤트를 보존한다.
 let top=q('nvUserEditableTop');
 if(!top){
   top=document.createElement('div'); top.id='nvUserEditableTop';
   top.innerHTML='<h3>네이버 메인 편집 설정</h3>';
   const direct=q('nvDirectEditorFinal');
   const ruler=panel.querySelector('.nv-guide-tools');
   panel.insertBefore(top, direct ? direct.nextSibling : (ruler ? ruler.nextSibling : panel.firstElementChild));
 }
 // 기존 기본 설정 제목/구조에서 사용자가 편집할 항목을 뽑아 최상단으로 이동
 const moveField=id=>{
   const el=q(id); if(!el)return;
   const p=el.closest('.field'); if(p && !top.contains(p)) top.appendChild(p);
 };
 const moveRowIds=ids=>{
   const nodes=ids.map(q).filter(Boolean);
   if(!nodes.length)return;
   const row=nodes[0].closest('.row');
   if(row && !top.contains(row))top.appendChild(row);
 };
 moveField('nvSearch');
 moveRowIds(['nvAccountName','nvEmail']);
 moveRowIds(['nvFeatureTitleInput','nvFeatureMetaInput']);
 moveField('nvRightText');
 moveField('nvHeadlineList');
 moveField('nvPressName1');
 // The press-name field is moved above; add position controls beside its inputs.
 const pressField=q('nvPressName1')?.closest('.field');
 if(pressField){
   const wrap=pressField.querySelector('.nv-press-name-settings');
   if(wrap){
     // existing four name inputs remain; add x/y controls only once
     for(let i=1;i<=4;i++){
       const name=q('nvPressName'+i); if(!name)continue;
       let row=q('nvPressPos'+i);
       if(!row){
         row=document.createElement('div');row.className='nv-press-pos-row';row.id='nvPressPos'+i;
         row.innerHTML='<input id="nvPressName'+i+'X" type="number" value="115" aria-label="언론사 '+i+' X"><input id="nvPressName'+i+'Y" type="number" value="570" aria-label="언론사 '+i+' Y">';
         name.insertAdjacentElement('afterend',row);
       }
     }
     const lab=pressField.querySelector('label'); if(lab)lab.textContent='언론사 이름 / X / Y (최대 4개)';
     let note=pressField.querySelector('.nv-press-pos-note');
     if(!note){note=document.createElement('small');note.className='nv-press-pos-note';note.textContent='각 언론사 이름과 위치를 따로 설정할 수 있습니다.';pressField.appendChild(note);}
   }
 }
 moveRowIds(['nvSubscribedCount','nvSubscribedX','nvSubscribedY']);
 moveRowIds(['nvOtherNewsCount','nvOtherNewsTotal','nvOtherNewsX','nvOtherNewsY']);
 moveField('nvPressLogoImage'); moveField('nvFeatureImage');
 // 3) 오른쪽 카드 사진 업로드 입력 추가
 let rightImageField=q('nvRightCardImage')?.closest('.field');
 if(!rightImageField){
   rightImageField=document.createElement('div');rightImageField.className='field';rightImageField.id='nvRightCardImageField';
   rightImageField.innerHTML='<label>오른쪽 카드 사진 (선택)</label><input accept="image/*" id="nvRightCardImage" type="file"><small>사진을 넣으면 오른쪽 카드 영역을 사진으로 꽉 채웁니다. 텍스트는 위에 표시됩니다.</small>';
   const textField=q('nvRightText')?.closest('.field');
   if(textField && textField.parentElement===top)textField.insertAdjacentElement('afterend',rightImageField); else top.appendChild(rightImageField);
 }
 // 4) 대표 제목/메타/검색어/뉴스목록의 현재 요청값을 설정창에도 반영
 const vals={nvFeatureSize:'23',nvFeatureWeight:'560',nvFeatureLineHeight:'1.35',nvHeadlineSize:'25',nvHeadlineWeight:'430',nvHeadlineLineHeight:'2',nvSearch:'박성화'};
 // 스타일 inputs themselves are below; force values when present so UI agrees with preview.
 const setVal=(id,v)=>{const e=q(id);if(e)e.value=v;};
 setVal('nvFeatureSize',23);setVal('nvFeatureWeight',560);setVal('nvFeatureLineHeight',1.35);
 setVal('nvHeadlineSize',25);setVal('nvHeadlineWeight',430);setVal('nvHeadlineLineHeight',2);
 // 5) 오른쪽 카드 이미지 overlay
 let img=q('nvRightCardImageOverlay');
 if(!img){img=document.createElement('img');img.id='nvRightCardImageOverlay';img.alt='';canvas.appendChild(img);}
 const syncRightImage=()=>{
   const file=q('nvRightCardImage')?.files?.[0];
   if(!file){img.style.display='none';return;}
   const reader=new FileReader(); reader.onload=e=>{img.src=e.target.result;img.style.display='block';};reader.readAsDataURL(file);
 };
 q('nvRightCardImage')?.addEventListener('change',syncRightImage);
 img.style.left='1370px';img.style.top='640px';img.style.width='648px';img.style.height='511px';
 // 6) '구독언론사 옆 문구'를 위한 실제 편집 input을 최상단에 추가
 let middleField=q('nvNewsbarMiddleInput')?.closest('.field');
 if(!middleField){
   middleField=document.createElement('div');middleField.className='field';middleField.id='nvNewsbarMiddleField';
   middleField.innerHTML='<label>구독언론사 옆 문구</label><input id="nvNewsbarMiddleInput" value="ANEWZ · 넌 대체 뭐하는 남자길래"><small>구독언론사 오른쪽에 표시되는 문구입니다.</small>';
   top.appendChild(middleField);
 }
 const midIn=q('nvNewsbarMiddleInput');
 if(midIn && middle){const sync=()=>{middle.textContent=midIn.value;middle.classList.remove('nv-fixed-text');};sync();midIn.addEventListener('input',sync);}
 // 7) 대표 제목 줄바꿈 유지
 const title=q('nvFeatureTitle'), titleIn=q('nvFeatureTitleInput');
 if(title){title.style.setProperty('white-space','pre-wrap','important');title.style.setProperty('line-height','1.35','important');}
 if(titleIn){titleIn.rows=3;titleIn.style.minHeight='70px';}
 // 8) 강제 좌표/스타일. 사용자가 이후 직접 편집 패널에서 바꾸면 그 값이 우선하도록 !important는 기본값용으로만 사용.
 const force=(id,styles)=>{const e=q(id);if(!e)return;Object.entries(styles).forEach(([p,v])=>e.style.setProperty(p,v,'important'));};
 force('nvSearchOut',{left:'591px',top:'133px',fontSize:'28px'});
 force('nvHeadlinesOut',{left:'682px',top:'593px',fontSize:'25px',fontWeight:'430',letterSpacing:'-1.5px',lineHeight:'2',color:'#000',width:'max-content',maxWidth:'none',whiteSpace:'pre'});
 force('nvFeatureMeta',{left:'401px',top:'555px',fontSize:'21px',fontWeight:'400',letterSpacing:'-0.5px',width:'max-content'});
 force('nvFeatureTitle',{left:'343px',top:'821px',fontSize:'23px',fontWeight:'560',letterSpacing:'-0.5px',lineHeight:'1.35',width:'310px',maxWidth:'310px',whiteSpace:'pre-wrap'});
 force('nvAccountNameOut',{left:'1517px',top:'390px',fontSize:'22px',fontWeight:'700',letterSpacing:'-0.5px'});
 // 9) counts: 숫자 + 위치는 기존 overlay를 직접 갱신. 위치값 입력은 상단에서 가능.
 const subIn=q('nvSubscribedCount'), subX=q('nvSubscribedX'), subY=q('nvSubscribedY'), otherIn=q('nvOtherNewsCount'), totalIn=q('nvOtherNewsTotal'), otherX=q('nvOtherNewsX'), otherY=q('nvOtherNewsY');
 const subOv=q('nvSubscribedOverlay'), otherOv=q('nvOtherNewsOverlay');
 const pos=(e,x,y)=>{if(!e)return;e.style.setProperty('left',(Number(x)||0)+'px','important');e.style.setProperty('top',(Number(y)||0)+'px','important');};
 function syncCounts(){
   if(subOv){subOv.innerHTML='구독중 <b>'+String(subIn?.value||8)+'</b>';pos(subOv,subX?.value||115,subY?.value||835);subOv.style.setProperty('pointer-events','none','important');}
   if(otherOv){otherOv.innerHTML='<span style="color:#1675e8">다른 언론사 뉴스</span> <span style="color:#111">더보기</span> <span style="color:#111">'+String(otherIn?.value||7)+'/'+String(totalIn?.value||8)+'</span>';pos(otherOv,otherX?.value||580,otherY?.value||945);otherOv.style.setProperty('pointer-events','none','important');}
 }
 [subIn,subX,subY,otherIn,totalIn,otherX,otherY].forEach(e=>e?.addEventListener('input',syncCounts));syncCounts();
 // 10) 언론사 이름 overlay의 이름/위치 연결
 const pressDefs=[1,2,3,4];
 pressDefs.forEach((i,idx)=>{
   const input=q('nvPressName'+i); let out=q('nvPressEditable'+i); if(!input||!out)return;
   const xi=q('nvPressName'+i+'X'), yi=q('nvPressName'+i+'Y');
   const sync=()=>{out.textContent=input.value;pos(out,xi?.value||115,yi?.value||(570+idx*57));out.style.pointerEvents='none';};
   input.addEventListener('input',sync);xi?.addEventListener('input',sync);yi?.addEventListener('input',sync);sync();
 });
 // 11) direct editor가 새로 추가된 editable targets까지 선택할 수 있게 옵션을 보강
 const sel=q('nvFinalTarget');
 if(sel){
   const add=(id,name)=>{if(!q(id)||[...sel.options].some(o=>o.value===id))return;const o=document.createElement('option');o.value=id;o.textContent=name;sel.appendChild(o);};
   add('nvNewsbarMiddle','구독언론사 옆 문구');
   for(let i=1;i<=4;i++)add('nvPressEditable'+i,'언론사 이름 '+i);
   add('nvSubscribedOverlay','구독중 숫자');add('nvOtherNewsOverlay','다른 언론사 뉴스 더보기');
 }
 // direct editor's choose function is closure-private, so selecting via dropdown is handled by its listener.
 // 12) 오래된 설정 중복은 숨기되 텍스트 꾸미기 영역은 유지
 const oldH=panel.querySelector(':scope > h2');if(oldH)oldH.style.display='none';
})();
