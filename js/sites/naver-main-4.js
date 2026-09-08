
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
