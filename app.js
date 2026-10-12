const root=document.querySelector('#site-content'),dialog=document.querySelector('#work-dialog'),body=document.querySelector('#work-body');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const siteBase=new URL('./',document.currentScript?.src||new URL('app.js',location.href).href);
const url=s=>{if(!s)return '';if(/^\/(assets|media)\/[\w./-]+$/.test(s))return new URL(s.slice(1),siteBase).href;try{let u=new URL(s);return ['http:','https:'].includes(u.protocol)?u.href:''}catch{return ''}};
const videoUrl=s=>/^\/media\/[\w./-]+\.mp4$/i.test(s)?`${url(s)}?v=20261012-mobile`:url(s);
const image=(src,alt)=>src?`<img src="${esc(url(src))}" alt="${esc(alt)}" loading="lazy">`:'';
const categories={films:'视频作品',decks:'策划案',products:'产品详情页',accounts:'运营账号'};
let content,revision='',animationCleanup=()=>{},slideIndex=0,slideTitle='',lastFocus;
let deckPreviews={version:1,documents:{}},deckState=null,mediaCleanup=()=>{},videoController=null;
const demo=i=>i.demo?'<span class="demo-badge">示例封面</span>':'';
const empty='<p class="empty-section">作品整理中，即将更新。</p>';
function renderProducts(items){return window.PortfolioProductPages?.render(items,{esc,url,image,achievements:content.productAchievements})||`<section class="section" id="products"><div class="section-title"><h2>产品详情页</h2></div>${items.map(item=>`<p><a href="${esc(url(item.url))}" target="_blank" rel="noopener noreferrer">${esc(item.title)} ↗</a></p>`).join('')}</section>`;}
function renderDeckCard(item,index){
  const caseStudy=item.caseStudy;
  const cover=item.cover?image(item.cover,item.title):`<span class="deck-label">CREATIVE PROPOSAL</span><h3>${esc(item.title)}</h3><span class="deck-fallback-index">${String(index+1).padStart(2,'0')}</span>`;
  const award=caseStudy?.award?`<span class="deck-card-award"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="7" r="4.5" stroke="currentColor" stroke-width="1.2"/><path d="m7 11-1 6 4-2 4 2-1-6" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg><span>${esc(caseStudy.award)}</span></span>`:'';
  return `<button type="button" class="work-card deck-card reveal${caseStudy?' has-case-study':''}" data-kind="decks" data-id="${esc(item.id)}" aria-label="查看策划案：${esc(item.title)}"><div class="deck-cover ${item.cover?'has-cover':''}">${cover}</div><div class="deck-card-copy"><div class="deck-card-kicker"><span>PROPOSAL</span><span>${String(index+1).padStart(2,'0')}</span></div><h3>${esc(item.title)}</h3><p class="deck-card-subtitle">${esc(item.subtitle)}</p><div class="deck-card-bottom">${award}<span class="deck-card-action"><span>查看方案</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 16 16 4M5 4h11v11" stroke="currentColor" stroke-width="1.25"/></svg></span></div></div></button>`;
}
function caseStudySummary(item){
  const study=item.caseStudy;
  if(!study)return '';
  const roles=Array.isArray(study.roles)?study.roles:[];
  return `<div class="case-study-summary"><p class="case-study-type">${esc(study.type)}</p>${study.award?`<div class="case-study-award"><span>获奖成果</span><strong>${esc(study.award)}</strong></div>`:''}${roles.length?`<div class="case-study-roles"><span>我的职责</span><ul>${roles.map(role=>`<li>${esc(role)}</li>`).join('')}</ul></div>`:''}</div>`;
}
function caseStudyDetails(item){
  const sections=item.caseStudy?.sections;
  if(!Array.isArray(sections)||!sections.length)return '';
  return `<section class="case-study-details" aria-label="策划案详细介绍"><div class="case-study-details-heading"><span>项目思路</span><p>从人群洞察到体验与活动构思</p></div><div class="case-study-grid">${sections.map(section=>`<section class="case-study-section"><h3>${esc(section.title)}</h3><p>${esc(section.body)}</p></section>`).join('')}</div></section>`;
}
function render(d){d={...d,products:Array.isArray(d.products)?d.products:[]};content=d;const productSection=renderProducts(d.products);const p=d.profile;document.title=`${p.name} · 视频、策划与内容`;document.querySelector('.wordmark span').textContent=p.name;
root.innerHTML=`<section class="hero" id="intro"><div class="hero-sticky"><div class="hero-haze"></div><div class="hero-upper"><p class="hero-roles">${esc(p.roles)}</p><p class="hero-meta">${esc(p.location)}<br>${esc(p.note)}</p></div><div class="hero-main"><p class="hello">${esc(p.hello)}</p><h1>${esc(p.name)}<span class="name-en">${esc(p.englishName.replace(/YU$/i,'').trim()||p.englishName)}</span></h1><p class="hero-intro">${esc(p.intro)}</p></div><div class="hero-bottom"><span class="scroll-hint"><i class="scroll-line" aria-hidden="true"></i>向下探索我的作品</span><span>FILM · STRATEGY · CONTENT</span></div><a class="hero-image" href="${esc(url(p.heroImage))}" target="_blank" rel="noopener noreferrer" aria-label="查看高清个人简介">${image(p.heroImage,`${p.name}的一页纸个人简介：工作经历与能力`)}</a></div></section><div class="wrap"><section class="manifesto"><span class="eyebrow reveal">A LITTLE ABOUT MY WORK</span><div class="reveal"><h2>${esc(p.about)}</h2><p>${esc(p.aboutDetail)}</p></div></section><section class="section" id="films"><div class="films-layout"><div class="films-caption reveal"><span class="section-number">01 / SELECTED WORK</span><div class="section-title"><h2>视频作品<em>Films.</em></h2></div><p>从创意到执行，都行</p></div><div class="film-list">${d.films.map((i,n)=>`<button class="work-card reveal" data-kind="films" data-id="${esc(i.id)}"><div class="film-cover">${image(i.cover,i.title)}${demo(i)}<span class="play-control"><b aria-hidden="true">▶</b>观看作品</span></div><div class="work-meta"><div><h3>${esc(i.title)}</h3><p>${esc(i.subtitle)}</p></div><span>${String(n+1).padStart(2,'0')}</span></div></button>`).join('')||empty}</div></div></section><section class="section" id="decks"><span class="section-number reveal">02 / IDEAS & STRATEGY</span><div class="section-title reveal"><h2>策划案<em>Proposals.</em></h2><span class="count">${String(d.decks.length).padStart(2,'0')} PROJECTS</span></div><div class="decks-grid">${d.decks.map(renderDeckCard).join('')||empty}</div></section>${productSection}<section class="section" id="accounts"><span class="section-number reveal">04 / SOCIAL PRESENCE</span><div class="section-title reveal"><h2>运营账号<em>Accounts.</em></h2><span class="count">${String(d.accounts.length).padStart(2,'0')} ACCOUNTS</span></div><div class="account-list">${d.accounts.map(i=>`<button class="account-row reveal" data-kind="accounts" data-id="${esc(i.id)}"><span class="account-mark">${i.cover?image(i.cover,i.title):esc((i.platform||i.title).slice(0,2).toUpperCase())}</span><span><h3>${esc(i.title)}</h3><span class="account-platform">${esc(i.platform)}</span></span><p>${esc(i.subtitle)}</p><span class="account-action">${i.url?'查看账号':'了解更多'}</span></button>`).join('')||empty}</div></section><footer class="closing"><h2 class="reveal">Thanks for scrolling.</h2><div class="footer-row"><span>${esc(p.name)} / ${esc(p.englishName)}<br>视频 · 策划 · 内容</span>${p.email?`<a class="contact" href="mailto:${esc(p.email)}">${esc(p.email)}</a>`:''}<a href="#intro">回到顶部</a></div>${Object.values(categories).some((_,n)=>d[Object.keys(categories)[n]].some(x=>x.demo))?'<p class="sample-note">部分作品为版式示例，真实内容待更新。</p>':''}</footer></div>`;setupMotion();}
function setupMotion(){
  animationCleanup();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.toggle('motion-on',!reduced);
  const reveals=[...document.querySelectorAll('.reveal')];
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pending');observer.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -15px 0px'});
  if(!reduced)reveals.forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pending');observer.observe(el)}});
  let ticking=false;
  const hero=document.querySelector('.hero'),stage=document.querySelector('.hero-sticky'),scene=document.querySelector('.hero-image');
  const texts=[...document.querySelectorAll('.hero-upper,.hero-main,.hero-bottom')];
  const clamp=value=>Math.max(0,Math.min(1,value));
  function update(){
    ticking=false;
    const max=document.documentElement.scrollHeight-innerHeight;
    document.querySelector('.reading-progress').style.transform=`scaleX(${max>0?scrollY/max:0})`;
    document.querySelector('.topbar').classList.toggle('scrolled',scrollY>60);
    if(!reduced){
      const progress=clamp(-hero.getBoundingClientRect().top/Math.max(1,hero.offsetHeight-stage.offsetHeight));
      const appear=clamp((progress-.3)/.25),eased=appear*appear*(3-2*appear);
      scene.style.opacity=String(eased);
      scene.style.transform=`translate(-50%,-50%) translateY(${(1-eased)*18}px) scale(${.97+eased*.03})`;
      scene.style.pointerEvents=eased>.95?'auto':'none';
      scene.tabIndex=eased>.95?0:-1;
      scene.setAttribute('aria-hidden',String(eased===0));
      texts.forEach(el=>{el.style.opacity=String(1-clamp(progress/.32));el.style.transform=`translateY(${-Math.min(progress/.32,1)*24}px)`;});
    }
    let active='';
    document.querySelectorAll('section[id]').forEach(s=>{if(s.getBoundingClientRect().top<innerHeight*.42)active=s.id});
    document.querySelectorAll('.topbar nav a').forEach(a=>a.classList.toggle('active',a.hash===`#${active}`));
  }
  const onScroll=()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}};
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);update();
  animationCleanup=()=>{observer.disconnect();removeEventListener('scroll',onScroll);removeEventListener('resize',onScroll)};
}
function embed(raw){try{const u=new URL(raw);let id;if(u.hostname==='youtu.be')id=u.pathname.slice(1);if(['youtube.com','www.youtube.com','m.youtube.com'].includes(u.hostname))id=u.searchParams.get('v')||u.pathname.match(/^\/(?:shorts|embed)\/([\w-]+)/)?.[1];if(id&&/^[\w-]{11}$/.test(id))return `https://www.youtube-nocookie.com/embed/${id}`;if(['vimeo.com','www.vimeo.com'].includes(u.hostname)&&/^\/\d+$/.test(u.pathname))return `https://player.vimeo.com/video${u.pathname}`;}catch{}return '';}
function previewInfo(kind,item){
  const pdf=kind==='decks'&&(item.preview||(/\.pdf(?:\?|$)/i.test(item.file)?item.file:''));
  return `<div class="preview-info"><h2 id="work-title">${esc(item.title)}</h2><p>${esc(item.description)}</p>${caseStudySummary(item)}${item.url?`<a href="${esc(url(item.url))}" target="_blank" rel="noopener noreferrer">${kind==='accounts'?'打开账号主页':kind==='products'?'查看线上详情页':'前往原始链接'}</a>`:''}${pdf?`<a href="${esc(url(pdf))}" target="_blank" rel="noopener noreferrer">查看完整 PDF</a>`:''}${item.file&&kind==='decks'?`<a href="${esc(url(item.file))}" target="_blank" rel="noopener noreferrer">下载原始策划案</a>`:''}</div>`;
}
function openPreviewDialog(){
  if(typeof dialog.showModal==='function')dialog.showModal();
  else{dialog.setAttribute('open','');dialog.classList.add('dialog-fallback');document.body.classList.add('preview-fallback');}
  document.body.classList.add('preview-open');document.body.style.overflow='hidden';
  dialog.setAttribute('aria-modal','true');
  document.querySelector('#close-dialog').focus();
}
function closePreviewDialog(){
  if(dialog.classList.contains('dialog-fallback')){dialog.removeAttribute('open');finishPreviewClose();}
  else if(dialog.open)dialog.close();
}
function finishPreviewClose(){
  mediaCleanup();mediaCleanup=()=>{};videoController=null;deckState=null;
  body.innerHTML='';dialog.classList.remove('dialog-fallback');document.body.classList.remove('preview-open','preview-fallback');
  dialog.removeAttribute('aria-modal');
  document.body.style.overflow='';lastFocus?.focus({preventScroll:true});
}
function deckDocument(pdf){
  const document=deckPreviews.documents?.[pdf];
  if(!document||!Array.isArray(document.pages)||document.pages.length<1||document.pages.length>200)return null;
  if(!document.pages.every(p=>/^\/media\/deck-pages\/[a-f0-9]{64}\/page-\d+\.jpg$/.test(p.src)&&Number.isFinite(p.width)&&p.width>0&&Number.isFinite(p.height)&&p.height>0))return null;
  return document;
}
function openDeckReader(item,document){
  const state=deckState={item,pages:document.pages,index:0,displayedIndex:null,zoom:false,request:0,disposed:false,cache:new Map(),image:null,previousImage:null,loadingTimer:null,transitionTimer:null,transitionFrame:0};
  body.innerHTML=`${item.caseStudy?previewInfo('decks',item):''}<div class="deck-reader"><div class="deck-toolbar"><span class="deck-position" aria-live="polite"></span><label class="deck-jump"><span>跳至</span><select aria-label="选择策划案页码">${document.pages.map((_,i)=>`<option value="${i}">第 ${i+1} 页</option>`).join('')}</select></label><button type="button" data-deck-action="zoom" aria-pressed="false">放大</button><a class="deck-full-page" target="_blank" rel="noopener noreferrer">高清页</a></div><div class="deck-viewport" tabindex="0" aria-label="策划案页面，左右滑动翻页"><div class="deck-page-frame"></div><p class="deck-page-status" role="status" hidden></p></div><div class="deck-reader-nav"><button type="button" data-deck-action="prev">上一页</button><span>左右滑动翻页</span><button type="button" data-deck-action="next">下一页</button></div></div>${item.caseStudy?caseStudyDetails(item):previewInfo('decks',item)}`;
  const viewport=state.viewport=body.querySelector('.deck-viewport');
  state.frame=body.querySelector('.deck-page-frame');state.status=body.querySelector('.deck-page-status');
  let start=null;
  const onStart=e=>{if(deckState===state&&!state.zoom&&e.touches.length===1)start={x:e.touches[0].clientX,y:e.touches[0].clientY};else start=null;};
  const onEnd=e=>{if(!start||deckState!==state||state.zoom||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;start=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.4)changeDeckPage(dx<0?1:-1);};
  const onKey=e=>{if(deckState!==state||e.target.tagName==='SELECT'||state.zoom)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();changeDeckPage(e.key==='ArrowRight'?1:-1);}};
  viewport.addEventListener('touchstart',onStart,{passive:true});viewport.addEventListener('touchend',onEnd,{passive:true});dialog.addEventListener('keydown',onKey);
  mediaCleanup=()=>{state.disposed=true;state.request++;clearTimeout(state.loadingTimer);finishDeckTransition(state);for(const entry of state.cache.values())entry.cancel();state.cache.clear();viewport.removeEventListener('touchstart',onStart);viewport.removeEventListener('touchend',onEnd);dialog.removeEventListener('keydown',onKey);};
  updateDeckPage();
}
function finishDeckTransition(state){
  clearTimeout(state.transitionTimer);cancelAnimationFrame(state.transitionFrame);state.transitionFrame=0;
  if(state.image){state.image.classList.add('is-settled');state.image.classList.remove('is-entering');state.image.getBoundingClientRect();}
  state.previousImage?.remove();state.previousImage=null;state.image?.classList.remove('is-settled');
}
function loadDeckPage(state,index){
  const cached=state.cache.get(index);
  if(cached){state.cache.delete(index);state.cache.set(index,cached);return cached.promise;}
  const page=state.pages[index],img=new Image(),entry={image:img,pending:true,cancel:()=>{},promise:null};
  img.decoding='async';img.width=page.width;img.height=page.height;
  entry.promise=new Promise((resolve,reject)=>{
    let decoding=false;
    const fail=()=>{if(!entry.pending)return;entry.pending=false;img.onload=null;img.onerror=null;reject(Error('Deck page failed to load'));};
    const ready=async()=>{
      if(!entry.pending||decoding)return;decoding=true;
      try{if(typeof img.decode==='function')await img.decode();}
      catch{if(!img.complete||!img.naturalWidth){fail();return;}}
      if(!entry.pending)return;
      if(!img.naturalWidth){fail();return;}
      entry.pending=false;img.onload=null;img.onerror=null;resolve(img);
    };
    entry.cancel=()=>{if(entry.pending){fail();img.removeAttribute('src');}};
    img.onload=ready;img.onerror=fail;img.src=url(page.src);
    if(img.complete&&img.naturalWidth)ready();
  }).catch(error=>{if(state.cache.get(index)===entry)state.cache.delete(index);throw error;});
  state.cache.set(index,entry);
  while(state.cache.size>5){
    const key=[...state.cache.keys()].find(key=>key!==state.index&&key!==state.displayedIndex&&state.cache.get(key).image!==state.previousImage);
    if(key===undefined)break;const removed=state.cache.get(key);state.cache.delete(key);removed.cancel();
  }
  return entry.promise;
}
function updateDeckControls(state){
  const shown=state.displayedIndex??state.index;
  body.querySelector('.deck-position').textContent=`${shown+1} / ${state.pages.length} 页`;
  body.querySelector('.deck-jump select').value=String(state.index);
  body.querySelector('[data-deck-action="prev"]').disabled=state.index===0;
  body.querySelector('[data-deck-action="next"]').disabled=state.index===state.pages.length-1;
  const zoomButton=body.querySelector('[data-deck-action="zoom"]');zoomButton.disabled=!state.image||state.index!==state.displayedIndex;zoomButton.textContent=state.zoom?'适应屏幕':'放大';zoomButton.setAttribute('aria-pressed',String(state.zoom));
  body.querySelector('.deck-full-page').href=url(state.pages[shown].src);state.viewport.classList.toggle('is-zoomed',state.zoom);
}
function updateDeckPage(){
  const state=deckState;if(!state||state.disposed)return;
  const index=state.index,token=++state.request;
  clearTimeout(state.loadingTimer);state.status.hidden=true;updateDeckControls(state);
  if(state.displayedIndex===index){state.viewport.setAttribute('aria-busy','false');return;}
  state.viewport.setAttribute('aria-busy','true');
  state.loadingTimer=setTimeout(()=>{if(deckState===state&&!state.disposed&&state.request===token){state.status.hidden=false;state.status.textContent=`正在加载第 ${index+1} 页…`; }},350);
  loadDeckPage(state,index).then(img=>{
    if(deckState!==state||state.disposed||state.request!==token)return;
    clearTimeout(state.loadingTimer);state.status.hidden=true;state.viewport.setAttribute('aria-busy','false');
    finishDeckTransition(state);
    const previous=state.image,animate=previous&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
    img.className='deck-page-image';img.alt=`${state.item.title}，第 ${index+1} 页，共 ${state.pages.length} 页`;
    if(animate)img.classList.add('is-entering');
    state.frame.append(img);state.image=img;state.previousImage=previous;state.displayedIndex=index;state.zoom=false;
    state.viewport.scrollTop=0;state.viewport.scrollLeft=0;updateDeckControls(state);
    if(animate){
      // Only the decoded incoming page fades in; the old page stays fully visible underneath.
      img.getBoundingClientRect();state.transitionFrame=requestAnimationFrame(()=>{
        state.transitionFrame=0;if(deckState!==state||state.disposed||state.image!==img)return;
        img.classList.remove('is-entering');state.transitionTimer=setTimeout(()=>{if(state.image===img)finishDeckTransition(state);},180);
      });
    }else finishDeckTransition(state);
    for(const neighbor of [index-1,index+1])if(neighbor>=0&&neighbor<state.pages.length)loadDeckPage(state,neighbor).catch(()=>{});
  }).catch(()=>{
    if(deckState!==state||state.disposed||state.request!==token)return;
    clearTimeout(state.loadingTimer);state.viewport.setAttribute('aria-busy','false');state.index=state.displayedIndex??0;updateDeckControls(state);
    state.status.textContent=`第 ${index+1} 页暂时未能加载${state.image?'，已保留当前页':''}。可以重试翻页，或查看完整 PDF。`;state.status.hidden=false;
  });
}
function changeDeckPage(delta){if(!deckState)return;deckState.index=Math.max(0,Math.min(deckState.pages.length-1,deckState.index+delta));updateDeckPage();}
function setupVideoPlayback(){
  const video=body.querySelector('video'),button=body.querySelector('[data-video-action="toggle"]'),status=body.querySelector('.video-status');
  let timeout,disposed=false,wantsPlay=false,attempt=0;
  const message=text=>{status.textContent=text;status.hidden=!text;};
  const sync=()=>{button.textContent=video.paused?'播放视频':'暂停';button.setAttribute('aria-label',video.paused?'播放视频':'暂停视频');};
  const waiting=()=>{clearTimeout(timeout);message('视频加载中…');timeout=setTimeout(()=>message('加载时间较长，可以点「直接打开视频」观看。'),12000);};
  const playing=()=>{clearTimeout(timeout);message('');sync();};
  const pause=()=>{wantsPlay=false;clearTimeout(timeout);message('');sync();};
  const error=()=>{clearTimeout(timeout);message('暂时无法在此播放，可以点「直接打开视频」，或在 Safari 中打开本页。');sync();};
  const start=()=>{wantsPlay=true;const token=++attempt;waiting();try{const result=video.play();if(result&&typeof result.catch==='function')result.catch(()=>{if(disposed||!wantsPlay||token!==attempt)return;clearTimeout(timeout);message('请点「播放视频」重试，或点「直接打开视频」观看。');sync();});}catch{error();}};
  const toggle=()=>{if(video.paused||video.ended)start();else video.pause();};
  video.addEventListener('playing',playing);video.addEventListener('pause',pause);video.addEventListener('ended',sync);video.addEventListener('waiting',waiting);video.addEventListener('error',error);
  videoController={toggle};mediaCleanup=()=>{disposed=true;clearTimeout(timeout);video.removeEventListener('playing',playing);video.removeEventListener('pause',pause);video.removeEventListener('ended',sync);video.removeEventListener('waiting',waiting);video.removeEventListener('error',error);video.pause();video.removeAttribute('src');video.load();};
  // This remains in the original card click, before any await or timer.
  start();
}
function openWork(kind,id){
  const item=content[kind]?.find(i=>i.id===id);if(!item)return;
  mediaCleanup();mediaCleanup=()=>{};videoController=null;deckState=null;
  lastFocus=document.activeElement;document.querySelector('#work-category').textContent=categories[kind];
  const info=previewInfo(kind,item),embedded=embed(item.url);let media='';
  if(kind==='products'){
    const roles=Array.isArray(item.roles)?item.roles:[];
    const work=roles.length?`<div class="product-project-roles"><span>我的工作</span><ul>${roles.map(role=>`<li>${esc(role)}</li>`).join('')}</ul></div>`:'';
    const desktopPreview=url(item.preview),mobilePreview=url(item.mobilePreview);
    let page='';
    if(item.previewMode==='image'&&(desktopPreview||mobilePreview))page=`<div class="product-preview-media"><picture>${mobilePreview?`<source media="(max-width:700px)" srcset="${esc(mobilePreview)}">`:''}<img class="product-preview-image" src="${esc(desktopPreview||mobilePreview)}" alt="${esc(item.title)}网页截图预览" loading="eager"></picture></div>`;
    else if(item.previewMode==='embed'&&url(item.preview||item.url))page=`<div class="product-live-preview"><iframe title="${esc(item.title)}网页预览" src="${esc(url(item.preview||item.url))}" sandbox="allow-scripts allow-same-origin allow-popups" referrerpolicy="no-referrer"></iframe></div>`;
    else page=`<div class="preview-placeholder"><p>点击上方链接查看完整线上详情页。</p></div>`;
    body.innerHTML=`${info}${work}${page}`;
    const screenshot=body.querySelector('.product-preview-image');
    if(screenshot){const error=()=>{const notice=document.createElement('p');notice.className='product-preview-notice';notice.textContent='截图暂时无法加载，可通过上方链接查看线上详情页。';screenshot.parentElement.replaceWith(notice);};screenshot.addEventListener('error',error,{once:true});mediaCleanup=()=>screenshot.removeEventListener('error',error);}
  }else if(kind==='decks'&&item.demo&&!item.file&&!item.preview){slideIndex=0;slideTitle=item.title;renderSlide();}
  else if(kind==='decks'&&(item.preview||/\.pdf(?:\?|$)/i.test(item.file))){
    const document=deckDocument(item.preview||item.file);
    if(document)openDeckReader(item,document);
    else body.innerHTML=`<div class="preview-placeholder"><b>策划案</b><p>逐页预览暂时无法加载，可在下方查看完整 PDF。</p></div>${info}${caseStudyDetails(item)}`;
  }else{
    if(kind==='films'&&item.file)media=`<div class="preview-media"><video controls playsinline webkit-playsinline preload="metadata" ${item.cover?`poster="${esc(url(item.cover))}"`:''} src="${esc(videoUrl(item.file))}"></video></div><div class="video-toolbar"><button type="button" data-video-action="toggle">播放视频</button><a href="${esc(videoUrl(item.file))}" target="_blank" rel="noopener noreferrer">直接打开视频</a></div><p class="video-status" role="status" hidden></p>`;
    else if(embedded)media=`<div class="preview-media"><iframe title="${esc(item.title)}" src="${embedded}" allow="fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
    else if(item.cover)media=`<div class="preview-media">${image(item.cover,item.title)}${item.demo?'<span class="preview-label">示例封面 · 真实作品待添加</span>':''}</div>`;
    else media=`<div class="preview-placeholder"><b>${esc(categories[kind])}</b><p>${item.file?'原始文件可在下方下载':item.url?'通过下方链接查看完整内容':'内容整理中'}</p></div>`;
    body.innerHTML=media+info;
  }
  openPreviewDialog();if(kind==='films'&&item.file)setupVideoPlayback();
}
function renderSlide(){const slides=[['01 / 封面',slideTitle,'策划案翻页体验 · 当前为示例内容。'],['02 / 策略','从一个想法开始','填入项目背景、策略思考与核心创意。'],['03 / 执行','让创意，真正落地','填入内容规划、执行节奏与项目成果。']];let s=slides[slideIndex];body.innerHTML=`<div class="slide"><span class="eyebrow">${s[0]}</span><h2 id="work-title">${esc(s[1])}</h2><p>${s[2]}</p></div><div class="slide-nav"><button data-slide="prev" ${slideIndex===0?'disabled':''}>上一页</button><span>${slideIndex+1} / 3</span><button data-slide="next" ${slideIndex===2?'disabled':''}>下一页</button></div>`;}
root.addEventListener('click',e=>{const card=e.target.closest('[data-kind]');if(card)openWork(card.dataset.kind,card.dataset.id)});
body.addEventListener('click',e=>{const b=e.target.closest('[data-slide]');if(b){slideIndex+=b.dataset.slide==='next'?1:-1;renderSlide();}const action=e.target.closest('[data-deck-action]')?.dataset.deckAction;if(action==='prev')changeDeckPage(-1);if(action==='next')changeDeckPage(1);if(action==='zoom'&&deckState){deckState.zoom=!deckState.zoom;updateDeckPage();}if(e.target.closest('[data-video-action="toggle"]'))videoController?.toggle();});
body.addEventListener('change',e=>{if(e.target.matches('.deck-jump select')&&deckState){const index=Number(e.target.value);if(Number.isInteger(index)&&index>=0&&index<deckState.pages.length){deckState.index=index;updateDeckPage();}}});
document.querySelector('#close-dialog').addEventListener('click',closePreviewDialog);
dialog.addEventListener('click',e=>{const rect=dialog.getBoundingClientRect();if(e.target===dialog&&e.clientX&&(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom))closePreviewDialog();});
dialog.addEventListener('close',finishPreviewClose);
document.addEventListener('keydown',e=>{if(!dialog.classList.contains('dialog-fallback'))return;if(e.key==='Escape')closePreviewDialog();if(e.key==='Tab'){const focusable=[...dialog.querySelectorAll('a[href],button,select,[tabindex="0"]')].filter(el=>!el.disabled&&el.getClientRects().length);const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}});
document.addEventListener('focusin',e=>{if(dialog.classList.contains('dialog-fallback')&&!dialog.contains(e.target))document.querySelector('#close-dialog').focus();});
async function loadDeckPreviews(){const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),8000);try{const response=await fetch(new URL('media/deck-previews.json',siteBase),{cache:'no-store',signal:controller.signal});if(!response.ok)return;const result=await response.json();if(result.version===1&&result.documents&&typeof result.documents==='object')deckPreviews=result;}catch{}finally{clearTimeout(timeout);}}
async function load(initial=false){try{const r=await fetch(new URL('content.json',siteBase),{cache:'no-store'});if(!r.ok)throw Error('load');const result=await r.json();const nextRevision=JSON.stringify(result);if(!content||nextRevision!==revision){if(!initial&&dialog.open)return;await loadDeckPreviews();revision=nextRevision;render(result);if(initial&&location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());}else if(result.decks.some(item=>(item.preview||/\.pdf(?:\?|$)/i.test(item.file))&&!deckDocument(item.preview||item.file)))await loadDeckPreviews();}catch{if(!content)root.innerHTML='<section class="loading-surface"><h1>暂时无法加载</h1><p>请稍后刷新，作品内容仍在保留。</p></section>';}}
load(true);addEventListener('focus',()=>load());setInterval(()=>{if(!document.hidden)load()},30000);
