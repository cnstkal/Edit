// ===== Google 검색 결과 생성기 =====
const grItems=[
 {site:'나무위키',link:'https://namu.wiki > 박성화',title:'박성화',body:'박성화 · 2014년 데뷔 · 한국 남배우 · 대한민국의 영화배우 · 한국의 드라마 배우 · 1998년 출생 · 경남 진주시 출신 인물',icon:null},
 {site:'레몬경제',link:'https://example.com > article',title:"박성화, 결혼 소식 직접 전해…'인생의 새로운 장'",body:'15년째 활동 중인 박성화는 공개 연애 중이던 연인과 결혼을 준비 중인 것으로 알려졌다. 두 사람은 서로에 대한 신뢰 …',icon:null},
 {site:'ohmynews',link:'https://ohmynews.com > news',title:"‘여름의 끝에서’ 박성화, 섬세한 연기로 시청자 호평…드라마 흥행 견인",body:'배우 박성화가 출연 중인 드라마가 시청자들의 호평 속에 꾸준한 상승세를 보이고 있다. 박성화는 극 중 복잡한 감정 …',icon:null},
 {site:'KBS 뉴스',link:'https://news.kbs.co.kr > article',title:'박성화, 화보 속 색다른 매력…성숙한 분위기',body:'배우 박성화가 패션 매거진 화보를 통해 색다른 매력을 선보였다.',icon:null}
];
const grPerson={name:'박성화',role:'대한민국 배우',desc:'박성화는 대한민국 배우이다. 2014년 KBS 드라마로 연예계에 데뷔했다.',source:'위키백과',birth:'1999년 4월 04일 (27세)',height:'178cm',imgs:[null,null,null]};
function grEsc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function grPlaceholder(){return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#eee"/></svg>');}
function grRenderEditor(){
 const box=document.getElementById('grItems');if(!box)return;
 box.innerHTML=grItems.map((it,i)=>`<div class="gr-item-card"><h3>검색 결과 ${i+1}</h3><div class="gr-upload"><img src="${it.icon||grPlaceholder()}"><input type="file" accept="image/*" data-gr-icon="${i}"></div><div class="field"><label>사이트 이름</label><input type="text" value="${grEsc(it.site)}" data-gr="site" data-i="${i}"></div><div class="field"><label>링크</label><input type="text" value="${grEsc(it.link)}" data-gr="link" data-i="${i}"></div><div class="field"><label>제목</label><input type="text" value="${grEsc(it.title)}" data-gr="title" data-i="${i}"></div><div class="field"><label>본문</label><textarea data-gr="body" data-i="${i}">${grEsc(it.body)}</textarea></div></div>`).join('');
}
function grRenderPreview(){
 const q=document.getElementById('grQueryPreview'); if(q){q.textContent=document.getElementById('grQuery').value||'박성화';}
 const out=document.getElementById('grResultsPreview');
 if(out)out.innerHTML=grItems.map(it=>`<div class="gpr-result"><div class="gpr-result-head"><img class="gpr-result-icon" src="${it.icon||grPlaceholder()}"><div><div class="gpr-site">${grEsc(it.site)}</div><div class="gpr-link">${grEsc(it.link)}</div></div></div><div class="gpr-title-link">${grEsc(it.title)}</div><div class="gpr-snippet">${grEsc(it.body)}</div></div>`).join('');
 const ids=[['grPersonName','grPersonNameOut','value'],['grPersonRole','grPersonRoleOut','value'],['grPersonDesc','grPersonDescOut','value'],['grPersonSource','grPersonSourceOut','value'],['grPersonBirth','grPersonBirthOut','value'],['grPersonHeight','grPersonHeightOut','value']];
 ids.forEach(([a,b])=>{const x=document.getElementById(a),y=document.getElementById(b);if(x&&y)y.textContent=x.value;});
 grPerson.imgs.forEach((src,i)=>{const el=document.getElementById('grPersonImg'+(i+1));if(el){el.src=src||grPlaceholder();}});
}
document.getElementById('grItems')?.addEventListener('input',e=>{const el=e.target;if(!el.dataset.gr)return;grItems[+el.dataset.i][el.dataset.gr]=el.value;grRenderPreview();});
document.getElementById('grItems')?.addEventListener('change',e=>{const el=e.target;if(!el.dataset.grIcon)return;const f=el.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{grItems[+el.dataset.grIcon].icon=ev.target.result;grRenderEditor();grRenderPreview();};r.readAsDataURL(f);});
document.getElementById('grAdd')?.addEventListener('click',()=>{grItems.push({site:'사이트 이름',link:'https://example.com > page',title:'검색 결과 제목',body:'검색 결과 본문을 입력하세요.',icon:null});grRenderEditor();grRenderPreview();});
['grQuery'].forEach(id=>document.getElementById(id)?.addEventListener('input',grRenderPreview));
['grPersonName','grPersonRole','grPersonDesc','grPersonSource','grPersonBirth','grPersonHeight'].forEach(id=>document.getElementById(id)?.addEventListener('input',grRenderPreview));
[1,2,3].forEach(i=>document.getElementById('grPersonImgInput'+i)?.addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{grPerson.imgs[i-1]=ev.target.result;grRenderPreview();};r.readAsDataURL(f);}));
document.getElementById('grSave')?.addEventListener('click',()=>{const el=document.getElementById('grCanvas');html2canvas(el,{scale:2,useCORS:true,backgroundColor:'#fff'}).then(c=>{const a=document.createElement('a');a.download='google_person_search.png';a.href=c.toDataURL('image/png');a.click();});});
grRenderEditor();grRenderPreview();

