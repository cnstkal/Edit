
(function(){
 const results=[
  {name:"쭈니쭈니의 3분 꿀정보!",date:"2024.11.07",title:"가까운 누군가를 좋아하게 되었을 때 가장 효과적인 방법!",body:"안녕하세요 오늘은 누군가를 좋아하게 됐을 때 가장 효과적인 방법을 알려드릴게요 누구는 친한 오빠/누나일 수도 있고 누구는 친한 동생일 수도 있겠죠! 성공하신 분들이 있다면 댓글로 후기 부탁드려용! 그럼 ...",avatar:null,image:null},
  {name:"취미로 글쓰는 귤쟁이입니다><",date:"2025.02.04",title:"[에이티즈 팬픽/몽원] 금단의 사랑",body:"홍중은 몸통사이로 윤호를 밀어넣었다. 그리고 윤호의 입술을 향해 돌진했다. \"하, 읍!\" 윤호의 하얀 입술이 빨갛게 부어올랐다. \"이러지마 형에겐 철현이가 있잖아 돌아가!\" \"싫어!\" \"왜!!!!\" \"넌 이제 나의 노예니까!\"....",avatar:null,image:null},
  {name:"이슈 정리소",date:"2026.01.21",title:"세계를 떠들썩하게 만든 ‘에드워드 킴’ 그는 누구인가?",body:"최근 에드워드 킴의 범행 행각이 구체적으로 드러났다는 정황이 확인되었습니다. 그동안 일부 커뮤니티와 업계 내부에서 의혹 수준으로 제기되던 사안이었으나, 관련 자료와 증언이 확보되면서 사실관계가 보다 명확해졌습니다. 확인된 내용에 따르면 ...",avatar:null,image:null},
  {name:"JJUNIJJUNI OUT",date:"2025.07.30",title:"쭈니쭈니 믿지마세요 쭈니쭈니의 3분 꿀팁 절대 믿지마세요!!",body:"모두를 위해 글 공유합니다. 더는 피해자가 나오지 않았으면 좋겠습니다. 쭈니쭈니의 3분 꿀팁에 올라오는 글을...",avatar:null,image:null}
 ];
 function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
 function render(){
   const q=document.getElementById("nsQuery");
   const out=document.getElementById("nsResultsOut");
   if(q) document.title=q.value||document.title;
   if(!out)return;
   out.innerHTML=results.map((r,i)=>`<article class="ns-result ${r.image?"has-image":""}">
     <div class="ns-meta">
       ${r.avatar?`<img class="ns-avatar" src="${r.avatar}">`:`<span class="ns-avatar"></span>`}
       <b>${esc(r.name)}</b><span class="ns-date">· ${esc(r.date)}</span>
     </div>
     <div class="ns-menu">⋮</div>
     <div class="ns-title">${esc(r.title)}</div>
     <div class="ns-body">${esc(r.body)}</div>
     ${r.image?`<img class="ns-thumb" src="${r.image}">`:""}
   </article>`).join("");
 }
 function editors(){
   const box=document.getElementById("nsResultEditors");if(!box)return;
   box.innerHTML="";
   results.forEach((r,i)=>{
    const d=document.createElement("div");d.className="ns-result-editor"+(r.image?" photo-attached":"");
    d.innerHTML=`<div class="row">
      <div class="field"><label>작성자</label><input data-ns="name" data-i="${i}" value="${esc(r.name)}"></div>
      <div class="field"><label>날짜</label><input data-ns="date" data-i="${i}" value="${esc(r.date)}"></div>
    </div>
    <div class="field"><label>제목</label><input data-ns="title" data-i="${i}" value="${esc(r.title)}"></div>
    <div class="field"><label>본문</label><textarea data-ns="body" data-i="${i}" rows="4">${esc(r.body)}</textarea></div>
    <div class="row">
      <div class="field"><label>프로필 사진</label><input type="file" accept="image/*" data-ns-avatar="${i}"></div>
      <div class="field"><label>게시글 사진</label>
        <div class="ns-photo-control">
          <button type="button" class="ns-photo-label" data-photo-btn="${i}">사진 첨부</button>
          <input class="ns-photo-input" type="file" accept="image/*" data-ns-image="${i}">
          <span class="ns-photo-name" data-photo-name="${i}">${r.image?"사진 첨부됨":"기본값: 사진 없음"}</span>
          <button type="button" class="ns-photo-remove" data-photo-remove="${i}">사진 제거</button>
        </div>
      </div>
    </div>`;
    box.appendChild(d);
   });
 }
 const editorsBox=document.getElementById("nsResultEditors");
 editorsBox?.addEventListener("input",e=>{
   if(!e.target.dataset.ns)return;
   results[+e.target.dataset.i][e.target.dataset.ns]=e.target.value;
   render();
 });
 editorsBox?.addEventListener("click",e=>{
   const b=e.target.closest("[data-photo-btn]"), rm=e.target.closest("[data-photo-remove]");
   if(b){const i=+b.dataset.photoBtn;editorsBox.querySelector(`input[data-ns-image="${i}"]`)?.click();}
   if(rm){const i=+rm.dataset.photoRemove;results[i].image=null;editors();render();}
 });
 editorsBox?.addEventListener("change",e=>{
   const ai=e.target.dataset.nsAvatar,ii=e.target.dataset.nsImage;
   if(ai==null&&ii==null)return;
   const f=e.target.files?.[0];if(!f)return;
   const r=new FileReader();
   r.onload=ev=>{
     const i=+(ai??ii);
     results[i][ai!=null?"avatar":"image"]=ev.target.result;
     editors();render();
   };
   r.readAsDataURL(f);
 });
 document.getElementById("nsQuery")?.addEventListener("input",render);
 document.getElementById("nsAddResult")?.addEventListener("click",()=>{
   results.push({name:"새 블로그",date:"2026.09.08",title:"새로운 검색 결과 제목",body:"검색 결과 본문을 입력하세요.",avatar:null,image:null});
   editors();render();
 });
 document.getElementById("naverSearchSavePng")?.addEventListener("click",()=>{
   const t=document.getElementById("naverSearchCanvas"),b=document.getElementById("naverSearchSavePng");
   if(!t||typeof html2canvas==="undefined"){alert("이미지 생성 기능을 불러오지 못했습니다.");return;}
   const old=b.textContent;b.textContent="이미지 생성 중...";b.disabled=true;
   Promise.resolve(document.fonts?.ready).then(()=>html2canvas(t,{scale:2,backgroundColor:"#fff",useCORS:true,allowTaint:true,logging:false,imageTimeout:15000}))
   .then(c=>c.toBlob(blob=>{
     if(!blob)throw new Error("blob");
     const u=URL.createObjectURL(blob),a=document.createElement("a");
     a.href=u;a.download="naver_search.png";document.body.appendChild(a);a.click();document.body.removeChild(a);
     setTimeout(()=>URL.revokeObjectURL(u),1500);b.textContent=old;b.disabled=false;
   },"image/png")).catch(err=>{console.error(err);alert("PNG 저장에 실패했습니다.");b.textContent=old;b.disabled=false;});
 });
 editors();render();
})();
