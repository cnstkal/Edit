
(function(){
  const btn=document.getElementById("discordSavePng");
  if(!btn)return;
  btn.addEventListener("click",()=>{
    const target=document.getElementById("discordCanvas");
    if(!target||typeof html2canvas==="undefined"){alert("이미지 생성 기능을 불러오지 못했습니다.");return;}
    const old=btn.textContent;btn.textContent="이미지 생성 중...";btn.disabled=true;
    Promise.resolve(document.fonts?.ready).then(()=>html2canvas(target,{
      backgroundColor:"#36393f",scale:2,useCORS:true,allowTaint:true,logging:false,imageTimeout:15000
    })).then(c=>c.toBlob(blob=>{
      if(!blob)throw new Error("blob");
      const u=URL.createObjectURL(blob),a=document.createElement("a");
      a.href=u;a.download="discord_preview.png";document.body.appendChild(a);a.click();document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(u),1500);btn.textContent=old;btn.disabled=false;
    },"image/png")).catch(err=>{
      console.error(err);alert("PNG 저장에 실패했습니다.");btn.textContent=old;btn.disabled=false;
    });
  });
})();
