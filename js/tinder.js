
(function(){
 const fields={
  tinderStatus:["tinderStatus","tinderStatusPreview"],
  tinderName:["tinderName","tinderNamePreview"],
  tinderAge:["tinderAge","tinderAgePreview"],
  tinderRelation:["tinderRelation","tinderRelationPreview"],
  tinderBio:["tinderBio","tinderBioPreview"],
  tinderEmoji:["tinderEmoji","tinderEmojiPreview"]
 };
 Object.keys(fields).forEach(k=>{
  const [a,b]=fields[k],el=document.getElementById(a),pv=document.getElementById(b);
  el?.addEventListener("input",()=>{if(pv)pv.textContent=el.value;});
 });
 [["tinderMessageName","tinderMessageNamePreview"],["tinderMessageText","tinderMessageTextPreview"]].forEach(([a,b])=>{
  const el=document.getElementById(a),pv=document.getElementById(b);
  el?.addEventListener("input",()=>{if(pv)pv.textContent=el.value;});
 });
 const photo=document.getElementById("tinderPhoto"), preview=document.getElementById("tinderPhotoPreview"), avatar=document.getElementById("tinderMessageAvatar");
 if(avatar&&preview) avatar.src=preview.src||"";
 photo?.addEventListener("change",e=>{
  const f=e.target.files&&e.target.files[0]; if(!f)return;
  const r=new FileReader(); r.onload=()=>{if(preview)preview.src=r.result;if(avatar)avatar.src=r.result;}; r.readAsDataURL(f);
 });
})();


(function(){
  const defaults = {
    status:"최근 접속", name:"우영이", age:"27", relation:"내가 찾는 관계",
    bio:"캐주얼하게 만날 친구", emoji:"🎉", messageName:"정윤호", messageText:"안녕하세요 ㅎㅎ"
  };
  const bind = (inputId, previewId) => {
    const input=document.getElementById(inputId), preview=document.getElementById(previewId);
    if(!input||!preview)return;
    preview.textContent=input.value;
    input.addEventListener("input",()=>preview.textContent=input.value);
  };
  bind("tinderStatus","tinderStatusPreview");
  bind("tinderName","tinderNamePreview");
  bind("tinderAge","tinderAgePreview");
  bind("tinderRelation","tinderRelationPreview");
  bind("tinderBio","tinderBioPreview");
  bind("tinderEmoji","tinderEmojiPreview");
  bind("tinderMessageName","tinderMessageNamePreview");
  bind("tinderMessageText","tinderMessageTextPreview");

  const photo=document.getElementById("tinderPhoto");
  const preview=document.getElementById("tinderPhotoPreview");
  const avatar=document.getElementById("tinderMessageAvatar");
  if(photo){
    photo.addEventListener("change",e=>{
      const f=e.target.files&&e.target.files[0]; if(!f)return;
      const r=new FileReader();
      r.onload=()=>{if(preview)preview.src=r.result;if(avatar)avatar.src=r.result;};
      r.readAsDataURL(f);
    });
  }

  document.getElementById("tinderResetBtn")?.addEventListener("click",()=>{
    if(!confirm("틴더 입력 내용을 기본값으로 복원할까요?"))return;
    const vals={
      tinderStatus:defaults.status,tinderName:defaults.name,tinderAge:defaults.age,
      tinderRelation:defaults.relation,tinderBio:defaults.bio,tinderEmoji:defaults.emoji,
      tinderMessageName:defaults.messageName,tinderMessageText:defaults.messageText
    };
    Object.entries(vals).forEach(([id,v])=>{
      const e=document.getElementById(id); if(e){e.value=v;e.dispatchEvent(new Event("input",{bubbles:true}));}
    });
    if(photo)photo.value="";
    if(preview)preview.removeAttribute("src");
    if(avatar)avatar.removeAttribute("src");
  });

  document.getElementById("tinderSavePng")?.addEventListener("click",()=>{
    const target=document.querySelector(".tinder-phone");
    const btn=document.getElementById("tinderSavePng");
    if(!target||typeof html2canvas==="undefined"){alert("이미지 생성 기능을 불러오지 못했습니다.");return;}
    const old=btn.textContent;btn.textContent="이미지 생성 중...";btn.disabled=true;
    Promise.resolve(document.fonts?.ready).then(()=>html2canvas(target,{
      backgroundColor:"#fff",scale:3,useCORS:true,allowTaint:true,logging:false,imageTimeout:15000
    })).then(c=>c.toBlob(blob=>{
      if(!blob)throw new Error("blob");
      const u=URL.createObjectURL(blob),a=document.createElement("a");
      a.href=u;a.download="tinder_preview.png";document.body.appendChild(a);a.click();document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(u),1500);btn.textContent=old;btn.disabled=false;
    },"image/png")).catch(()=>{alert("PNG 저장에 실패했습니다.");btn.textContent=old;btn.disabled=false;});
  });
})();
