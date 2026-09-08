===== ChatGPT 미리보기 =====
const GPT_DEFAULT={brand:"ChatGPT Auto",user:"멘트",assistant:"멘트\n멘트",input:""};
let gptState={...GPT_DEFAULT};
try{const saved=sessionStorage.getItem("virtual_gpt_draft_v1");if(saved)gptState={...GPT_DEFAULT,...JSON.parse(saved)}}catch(e){}
function gptSave(){try{sessionStorage.setItem("virtual_gpt_draft_v1",JSON.stringify(gptState))}catch(e){}}
function gptRender(){
  document.getElementById("gptOutBrand").innerHTML=(gptState.brand||"ChatGPT Auto").replace(/(Auto)$/,'<span> $1</span>');
  document.getElementById("gptOutUser").textContent=gptState.user||"";
  document.getElementById("gptOutUser").style.display=gptState.user?"block":"none";
  const a=document.getElementById("gptOutAssistant");a.innerHTML="";
  (gptState.assistant||"").split("\n").forEach(t=>{const d=document.createElement("div");d.className="gpt-assistant-line";d.textContent=t;a.appendChild(d)});
  document.getElementById("gptOutAssistant").style.display=gptState.assistant?"block":"none";
  const actions=document.getElementById("gptOutActions");
  actions.style.display=gptState.assistant?"block":"none";
  const lineCount=Math.max(1,(gptState.assistant||"").split("\n").length);
  actions.style.top=`calc(30% + ${lineCount*16 + 8}px)`;
  const inputOut=document.getElementById("gptOutInput");
  inputOut.textContent=gptState.input||"";
  inputOut.style.display=gptState.input?"block":"none";
}
function gptFill(){document.getElementById("gptBrand").value=gptState.brand;document.getElementById("gptUser").value=gptState.user;document.getElementById("gptAssistant").value=gptState.assistant;document.getElementById("gptInput").value=gptState.input||"";}
[["gptBrand","brand"],["gptUser","user"],["gptAssistant","assistant"],["gptInput","input"]].forEach(([id,key])=>document.getElementById(id).addEventListener("input",e=>{gptState[key]=e.target.value;gptSave();gptRender()}));
document.getElementById("gptResetBtn").addEventListener("click",()=>{gptState={...GPT_DEFAULT};gptFill();gptSave();gptRender()});
document.getElementById("gptSavePngBtn").addEventListener("click",()=>{const target=document.getElementById("gptPreview"),btn=document.getElementById("gptSavePngBtn");if(typeof html2canvas==="undefined"){alert("이미지 생성 기능을 불러오지 못했습니다.");return}btn.disabled=true;btn.textContent="이미지 생성 중...";html2canvas(target,{backgroundColor:"#fff",scale:3,useCORS:true,logging:false}).then(c=>c.toBlob(b=>{const u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download="chatgpt_preview.png";a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);btn.disabled=false;btn.textContent="PNG로 저장"})).catch(()=>{alert("이미지 생성에 실패했습니다.");btn.disabled=false;btn.textContent="PNG로 저장"})});
gptFill();gptRender();



// 