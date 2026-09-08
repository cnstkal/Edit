// ===== 알림 미리보기 생성기 =====
const NT_STORAGE_KEY = "virtual_notification_draft_v1";
const NT_PHONE_ICON_DEFAULT = '이미지/img-d49c1584a6eb.webp';
const NT_DEFAULT = { avatar:null, name:"떵화형", message:"전화 좀 받아ㅠㅠ", time:"지금", bgColor:"#dedede", bgOpacity:90, radius:22, icon:"kakao", customIcon:null, phoneIcon:null };
const NT_ICONS = { kakao:"이미지/img-480912f6802d.webp", instagram:"이미지/img-57f1bac77df5.webp", message:"이미지/img-531dae335faf.webp" };
function ntCloneDefault(){ return JSON.parse(JSON.stringify(NT_DEFAULT)); }
let ntState=ntCloneDefault();
try { const saved=sessionStorage.getItem(NT_STORAGE_KEY); if(saved) ntState={...ntCloneDefault(),...JSON.parse(saved)}; } catch(e){}
if(!ntState.phoneIcon) ntState.phoneIcon=NT_PHONE_ICON_DEFAULT;
function ntSave(){ try{sessionStorage.setItem(NT_STORAGE_KEY,JSON.stringify(ntState));}catch(e){} }
function ntHexToRgba(hex, opacityPct){
  const raw=String(hex||"#dedede").replace("#","");
  const h=raw.length===3 ? raw.split("").map(c=>c+c).join("") : raw;
  const r=parseInt(h.slice(0,2),16)||0, g=parseInt(h.slice(2,4),16)||0, b=parseInt(h.slice(4,6),16)||0;
  const a=Math.max(0,Math.min(100,Number(opacityPct??90)))/100;
  return `rgba(${r},${g},${b},${a})`;
}
function ntRender(){
  const card=document.getElementById("ntOutCard"), avatar=document.getElementById("ntOutAvatar");
  const iconKey=(ntState.icon==="custom" && ntState.customIcon) ? "custom" : (ntState.icon==="phone" ? "phone" : (NT_ICONS[ntState.icon] ? ntState.icon : "kakao"));
  document.getElementById("ntOutIcon").src=iconKey==="custom" ? ntState.customIcon : (iconKey==="phone" ? (ntState.phoneIcon || NT_PHONE_ICON_DEFAULT) : NT_ICONS[iconKey]);
  const phoneThumb=document.getElementById("ntPhoneIconThumb");
  if(phoneThumb){ phoneThumb.src=ntState.phoneIcon || NT_PHONE_ICON_DEFAULT; phoneThumb.style.display="block"; }
  document.querySelectorAll("#ntIconPicker .notification-icon-option").forEach(btn=>btn.classList.toggle("active",btn.dataset.icon===iconKey));
  const customThumb=document.getElementById("ntCustomIconThumb");
  customThumb.src=ntState.customIcon||"";
  customThumb.style.display=ntState.customIcon?"block":"none";
  avatar.src=ntState.avatar||""; avatar.style.display=ntState.avatar?"block":"none";
  document.getElementById("ntOutName").textContent=ntState.name||"";
  document.getElementById("ntOutMessage").textContent=ntState.message||"";
  document.getElementById("ntOutTime").textContent=ntState.time||"";
  const opacity=Math.max(0,Math.min(100,Number(ntState.bgOpacity??90)));
  // 배경 도형만 투명해지도록 rgba 배경을 사용하고 카드 자체 opacity는 건드리지 않음.
  card.style.background=ntHexToRgba(ntState.bgColor||"#dedede", opacity);
  card.style.opacity="1";
  const radiusPct=Math.max(0,Math.min(100,Number(ntState.radius??22)));
  card.style.borderRadius=(radiusPct * 1.24).toFixed(1)+"px";
  document.getElementById("ntBgOpacityLabel").textContent=Math.round(opacity)+"%";
  document.getElementById("ntRadiusLabel").textContent=Math.round(radiusPct);
}
function ntFillForm(){ document.getElementById("ntName").value=ntState.name; document.getElementById("ntMessage").value=ntState.message; document.getElementById("ntTime").value=ntState.time; document.getElementById("ntBgColor").value=ntState.bgColor; document.getElementById("ntBgOpacity").value=ntState.bgOpacity; document.getElementById("ntRadius").value=ntState.radius??22; document.getElementById("ntRadiusNumber").value=ntState.radius??22; }
[["ntName","name"],["ntMessage","message"],["ntTime","time"],["ntBgColor","bgColor"]].forEach(([id,key])=>{ const el=document.getElementById(id); el.addEventListener("input",e=>{ntState[key]=e.target.value;ntSave();ntRender();}); el.addEventListener("change",e=>{ntState[key]=e.target.value;ntSave();ntRender();}); });
document.getElementById("ntBgOpacity").addEventListener("input",e=>{ntState.bgOpacity=Number(e.target.value);ntSave();ntRender();});
document.getElementById("ntRadius").addEventListener("input",e=>{ntState.radius=Math.max(0,Math.min(100,Number(e.target.value)||0));document.getElementById("ntRadiusNumber").value=ntState.radius;ntSave();ntRender();});
document.getElementById("ntRadiusNumber").addEventListener("input",e=>{let v=Number(e.target.value);if(!Number.isFinite(v))return;v=Math.max(0,Math.min(100,Math.round(v)));ntState.radius=v;document.getElementById("ntRadius").value=v;ntSave();ntRender();});
document.querySelectorAll("#ntIconPicker .notification-icon-option").forEach(btn=>btn.addEventListener("click",()=>{ntState.icon=btn.dataset.icon;ntSave();ntRender();if(btn.dataset.icon==="phone"&&!ntState.phoneIcon)document.getElementById("ntPhoneIconInput")?.click();}));
document.getElementById("ntCustomIconBtn").addEventListener("click",()=>{
  if(ntState.customIcon){ ntState.icon="custom"; ntSave(); ntRender(); }
  document.getElementById("ntCustomIconInput").click();
});
document.getElementById("ntCustomIconInput").addEventListener("change",e=>{
  const file=e.target.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{ ntState.customIcon=ev.target.result; ntState.icon="custom"; ntSave(); ntRender(); };
  reader.readAsDataURL(file); e.target.value="";
});
document.getElementById("ntPhoneIconInput")?.addEventListener("change",e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{ntState.phoneIcon=ev.target.result;ntState.icon="phone";ntSave();ntRender();};reader.readAsDataURL(file);});
document.getElementById("ntAvatarInput").addEventListener("change",e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{ntState.avatar=ev.target.result;ntSave();ntRender();};reader.readAsDataURL(file);});
document.getElementById("ntRemoveAvatarBtn").addEventListener("click",()=>{ntState.avatar=null;document.getElementById("ntAvatarInput").value="";ntSave();ntRender();});
document.getElementById("ntResetBtn").addEventListener("click",()=>{if(!confirm("알림 미리보기 입력 내용을 기본값으로 되돌릴까요?"))return;ntState=ntCloneDefault();try{sessionStorage.removeItem(NT_STORAGE_KEY);}catch(e){}document.getElementById("ntAvatarInput").value="";document.getElementById("ntCustomIconInput").value=""; const pi=document.getElementById("ntPhoneIconInput"); if(pi) pi.value=""; ntFillForm();ntRender();});
document.getElementById("ntSavePngBtn").addEventListener("click",()=>{const target=document.getElementById("notificationPreview"),btn=document.getElementById("ntSavePngBtn"),originalText=btn.textContent;if(typeof html2canvas==="undefined"){alert("이미지 생성 기능을 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.");return;}btn.textContent="이미지 생성 중...";btn.disabled=true;const ready=(document.fonts&&document.fonts.ready)?document.fonts.ready:Promise.resolve();ready.then(()=>html2canvas(target,{backgroundColor:null,scale:3,useCORS:true,allowTaint:true,logging:false,imageTimeout:15000})).then(canvas=>{canvas.toBlob(blob=>{if(!blob)throw new Error("blob 생성 실패");const url=URL.createObjectURL(blob),link=document.createElement("a");link.download="notification_preview.png";link.href=url;document.body.appendChild(link);link.click();document.body.removeChild(link);setTimeout(()=>URL.revokeObjectURL(url),2000);btn.textContent=originalText;btn.disabled=false;},"image/png");}).catch(err=>{console.error("PNG 저장 실패:",err);alert("이미지 생성에 실패했습니다. 사진 파일 용량을 줄이거나 다른 사진으로 바꿔서 다시 시도해보세요.");btn.textContent=originalText;btn.disabled=false;});});
ntFillForm();ntRender();

