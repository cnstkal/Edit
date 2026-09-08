
(function(){
  const profiles=[
    {name:"프로필 1",img:null},
    {name:"프로필 2",img:null},
    {name:"프로필 3",img:null}
  ];
  const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  const placeholder="data:image/svg+xml;charset=UTF-8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="205" height="205"><rect width="205" height="205" fill="#181818"/></svg>');

  function render(){
    const title=document.getElementById("nfTitle");
    const titleOut=document.getElementById("nfTitleOut");
    if(title&&titleOut) titleOut.textContent=title.value;
    const out=document.getElementById("nfProfilesOut");
    if(out) out.innerHTML=profiles.map((p,i)=>`
      <div class="nf-profile">
        <div class="nf-photo" style="background-image:url('${p.img||placeholder}')"></div>
        <div class="nf-profile-name">${esc(p.name)}</div>
      </div>`).join("");
  }

  function editors(){
    const box=document.getElementById("nfProfileEditors");
    if(!box)return;
    box.innerHTML=profiles.map((p,i)=>`
      <div class="nf-editor">
        <div class="nf-editor-head">
          <strong>프로필 ${i+1}</strong>
          <button type="button" class="nf-remove" data-nf-remove="${i}">삭제</button>
        </div>
        <div class="row">
          <div class="field">
            <label>프로필 이름</label>
            <input value="${esc(p.name)}" data-nf-name="${i}">
          </div>
          <div class="field">
            <label>프로필 사진</label>
            <input type="file" accept="image/*" data-nf-img="${i}">
          </div>
        </div>
        ${p.img?`<div class="nf-editor-preview" style="background-image:url('${p.img}')"></div>`:""}
      </div>`).join("");
  }

  document.getElementById("nfTitle")?.addEventListener("input",render);

  document.getElementById("nfProfileEditors")?.addEventListener("input",e=>{
    const i=e.target.dataset.nfName;
    if(i==null)return;
    profiles[+i].name=e.target.value;
    render();
  });

  document.getElementById("nfProfileEditors")?.addEventListener("change",e=>{
    const i=e.target.dataset.nfImg;
    if(i==null)return;
    const f=e.target.files[0];
    if(!f)return;
    const r=new FileReader();
    r.onload=ev=>{profiles[+i].img=ev.target.result;editors();render();};
    r.readAsDataURL(f);
  });

  document.getElementById("nfProfileEditors")?.addEventListener("click",e=>{
    const i=e.target.dataset.nfRemove;
    if(i==null)return;
    profiles.splice(+i,1);
    editors();
    render();
  });

  document.getElementById("nfAddProfile")?.addEventListener("click",()=>{
    if(profiles.length>=4){alert("프로필은 최대 4개까지 추가할 수 있습니다.");return;}
    profiles.push({name:"새 프로필",img:null});
    editors();
    render();
  });

  document.getElementById("netflixSavePng")?.addEventListener("click",()=>{
    const target=document.getElementById("netflixCanvas");
    if(typeof html2canvas==="undefined"){alert("이미지 생성 기능을 불러오지 못했습니다.");return;}
    html2canvas(target,{scale:2,backgroundColor:"#000",useCORS:true}).then(c=>{
      const a=document.createElement("a");
      a.download="netflix_profiles.png";
      a.href=c.toDataURL("image/png");
      a.click();
    });
  });

  editors();
  render();
})();
