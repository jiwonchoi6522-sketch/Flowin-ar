# 전체 코드 · FLOW:IN AR 퀴즈

실행할 때 각 파일로 분리하세요. 모델과 썸네일은 ZIP에 포함되어 있습니다.

## index.html

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#0D3052">
  <meta name="description" content="보드 속 이야기를 발견하고 세 가지 AR 오브제를 모아 보세요. 팀 FLOW:IN">
  <title>《눈, 눈, 눈》 AR 퀴즈 · FLOW:IN</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./style.css">
  <script type="importmap">
  {"imports":{
    "three":"https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/":"https://unpkg.com/three@0.160.0/examples/jsm/",
    "mindar-image-three":"https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js"
  }}
  </script>
</head>
<body>
  <div id="ar-stage" aria-hidden="true"></div>
  <div id="viewer" aria-label="획득한 오브제의 3D 미리보기" hidden></div>
  <div class="snow" aria-hidden="true"><i>·</i><i>·</i><i>·</i><i>·</i><i>·</i><i>·</i><i>·</i><i>·</i></div>
  <main id="app">
    <header><span class="brand">FLOW:IN</span><span id="mode-tag">BOARD → OBJECT</span></header>
    <section id="start" class="screen intro" aria-labelledby="title">
      <p class="eyebrow">이자람 판소리 · 전시 연계 체험</p>
      <div class="title-mark" aria-hidden="true">❄</div>
      <h1 id="title">《눈, 눈, 눈》<br><span>AR 퀴즈</span></h1>
      <p class="lead">보드를 비추고 퀴즈 3개를 풀면<br>오브제 3개를 모을 수 있어요 · 약 5분</p>
      <div id="inapp" class="notice" hidden>Safari 또는 Chrome에서 열어 주세요.<br>브라우저 메뉴에서 ‘외부 브라우저로 열기’를 선택하거나 주소를 복사해 붙여 넣어 주세요.<button id="copy-url" class="text-button">현재 주소 복사</button></div>
      <p class="small">카메라로 보드 01 → 02 → 03을 비춰 주세요.<br>팀원이 현장에서 체험을 안내해 드려요.</p>
      <div class="start-actions"><button id="start-button" class="primary">시작하기 <span aria-hidden="true">↗</span></button><button id="start-flat" class="secondary">카메라 없이 체험하기</button></div>
    </section>
    <section id="experience" class="screen experience" hidden aria-label="퀴즈 체험">
      <div class="step-heading"><p class="eyebrow" id="step-count">OBJECT 01 / 03</p><h2 id="instruction">01 보드를 비춰 주세요</h2></div>
      <p id="status" class="status" role="status" aria-live="polite"></p>
      <div id="scan-frame" class="scan-frame" aria-hidden="true"><span>보드 전체를 화면 안에</span></div>
      <div class="experience-bottom">
        <article id="quiz" class="quiz" hidden aria-labelledby="question"><p class="eyebrow" id="quiz-number"></p><h3 id="question" tabindex="-1"></h3><div id="answers"></div><p id="feedback" class="feedback" role="status" aria-live="polite"></p></article>
        <p id="reward-text" class="reward-text" role="status" aria-live="polite" hidden></p>
        <button id="flat-button" class="secondary" hidden>카메라 없이 계속하기</button>
      </div>
    </section>
    <section id="complete" class="screen complete" hidden aria-labelledby="complete-title">
      <p class="eyebrow">COLLECTION COMPLETE</p><div class="title-mark" aria-hidden="true">✦</div>
      <h2 id="complete-title" tabindex="-1">모든 오브제를<br>모았어요!</h2><p class="lead">눈 속에서 만난 이야기,<br>이제 공연으로 이어 보세요.</p>
      <p class="staff-note">이 화면을 팀원에게 보여 주세요</p>
      <a class="primary" href="https://www.ggac.or.kr/ggac/M0000155/show/view.do?idx=SM000207" target="_blank" rel="noopener noreferrer">공연 예매하기 ↗</a>
      <p class="small" id="share-text"></p><button class="text-button" id="copy-share">공유 문구 복사</button><p class="small">다음은 팀원의 안내에 따라 VR을 체험해 주세요.</p>
    </section>
    <div class="collection-area">
      <div id="asset-loading" class="asset-loading" role="status"><span id="load-label">3D 오브제 준비 중…</span><progress id="load-progress" max="100" value="0" aria-label="3D 모델 다운로드 진행률"></progress><button id="retry-models" class="text-button" hidden>3D 로딩 다시 시도</button></div>
      <ol id="collection" class="collection" aria-label="모은 오브제">
        <li><div class="slot" id="slot-0"><span class="slot-number">1</span><img src="./assets/thumbs/snowflake.png" alt="눈송이" hidden></div><span class="slot-label">1 눈송이</span></li>
        <li><div class="slot" id="slot-1"><span class="slot-number">2</span><img src="./assets/thumbs/fan.png" alt="부채" hidden></div><span class="slot-label">2 부채</span></li>
        <li><div class="slot" id="slot-2"><span class="slot-number">3</span><img src="./assets/thumbs/buk.png" alt="소리북" hidden></div><span class="slot-label">3 소리북</span></li>
      </ol>
      <footer><p>본 콘텐츠는 생성형 AI를 활용하여 제작되었으며,<br>기획·검수·편집은 제작팀이 수행하였습니다.</p><p>3D 모델: Meshy로 제작 · 제작: FLOW:IN</p><p>개인정보는 수집하지 않습니다.</p></footer>
    </div>
  </main>
  <div id="toast" role="status" aria-live="polite" hidden></div>
  <noscript>이 체험은 JavaScript가 필요합니다. Safari 또는 Chrome에서 JavaScript를 허용해 주세요.</noscript>
  <script type="module" src="./main.js"></script>
</body>
</html>

```

## style.css

```css
:root{color-scheme:dark;--bg:#0D3052;--mid:#4E73A3;--accent:#D1E0F0;--text:#fff;--line:rgba(209,224,240,.24);font-family:'Gowun Batang',serif;font-synthesis:none}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text)}[hidden]{display:none!important}button,a{-webkit-tap-highlight-color:transparent}button,a.primary{font:700 17px 'Gowun Batang',serif;min-height:52px;border-radius:15px;touch-action:manipulation}button{cursor:pointer;color:inherit}button:disabled{cursor:wait;opacity:.62}button:focus-visible,a:focus-visible{outline:3px solid white;outline-offset:4px}button.primary,a.primary{display:flex;align-items:center;justify-content:center;gap:20px;width:100%;background:var(--accent);border:0;color:var(--bg);text-decoration:none;padding:15px}.secondary{width:100%;background:#294f77;border:1px solid #92afcf;padding:12px}.text-button{border:0;background:none;text-decoration:underline;text-underline-offset:4px;padding:8px 12px;font-size:14px}.small{font-size:13px;line-height:1.7;color:var(--accent)}#app{position:relative;z-index:2;min-height:100svh;min-height:100dvh;max-width:560px;margin:auto;padding: max(18px,env(safe-area-inset-top)) 22px max(10px,env(safe-area-inset-bottom));display:flex;flex-direction:column;pointer-events:none}#app button,#app a,#app .screen,#app .collection-area{pointer-events:auto}header{display:flex;justify-content:space-between;align-items:center;padding-bottom:20px}.brand{font:700 16px Arial,sans-serif;letter-spacing:.16em}#mode-tag{font:10px Arial,sans-serif;letter-spacing:.17em;color:var(--accent)}.screen{flex:1}.intro,.complete{text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px 0 18px}.eyebrow{font-size:11px;letter-spacing:.16em;color:var(--accent);margin:0 0 14px}.title-mark{font-size:52px;color:var(--accent);line-height:1.25;margin:0 0 12px}h1{font-size:clamp(30px,7.5vw,42px);line-height:1.45;margin:0;letter-spacing:-.05em}h1 span{font-size:.74em;letter-spacing:.12em}h2{font-size:29px;line-height:1.45;margin:0}p{word-break:keep-all}.lead{font-size:17px;line-height:1.8;color:var(--accent);margin:18px 0}.start-actions{width:100%;display:grid;gap:10px;margin-top:12px}.notice{width:100%;border:1px solid var(--accent);background:#294f77;padding:14px;font-size:14px;line-height:1.6;margin:10px 0}.notice button{display:block;margin:auto}.collection-area{margin-top:12px}.collection{list-style:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px;margin:10px 0 0;padding:0;text-align:center}.slot{background:#fff;aspect-ratio:1.28;border:2px dashed #cdd5de;border-radius:18px;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}.slot-number{color:#a6b0ba;font-size:25px}.slot img{width:100%;height:100%;object-fit:contain;background:#fff}.slot.filled{border:2px solid #fff}.slot.filled .slot-number{display:none}.slot-label{display:block;font-size:12px;margin-top:7px;color:var(--accent)}footer{font-family:Arial,sans-serif;font-size:9px;line-height:1.5;text-align:center;color:#c2d1e2;padding-top:12px}footer p{margin:2px 0}.asset-loading{font-size:11px;color:var(--accent);display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}.asset-loading .text-button{min-height:36px;font-size:12px}progress{width:70px;height:5px;accent-color:var(--accent)}.experience{display:flex;flex-direction:column;min-height:330px}.step-heading{padding:8px 0 4px}.step-heading h2{font-size:25px}.status{min-height:24px;line-height:1.6;font-size:14px;margin:8px 0;text-shadow:0 1px 4px #000}.scan-frame{border:1px solid #d1e0f077;border-radius:20px;min-height:100px;flex:1;margin:10px 20px;display:flex;align-items:center;justify-content:center}.scan-frame span{font-size:12px;background:#0d3052b0;padding:8px 12px;border-radius:24px}.experience-bottom{margin-top:auto;display:grid;gap:10px}.quiz{background:#0d3052f2;border:1px solid #6f8caf;border-radius:22px;padding:20px;box-shadow:0 14px 40px #0003}.quiz h3{font-size:21px;line-height:1.55;margin:0 0 17px}#answers{display:grid;gap:9px}#answers button{background:#244b72;border:1px solid #6687ac;text-align:left;padding:13px 16px;font-size:18px;width:100%}#answers button.correct{background:var(--accent);color:var(--bg)}.feedback{font-size:14px;line-height:1.55;min-height:22px;margin:12px 0 0;color:var(--accent)}.reward-text{text-align:center;background:#0d3052ed;padding:16px;border-radius:16px;font-size:17px;line-height:1.6}.staff-note{background:#4e73a355;border:1px solid var(--line);border-radius:12px;padding:15px;width:100%;font-size:17px}.complete>.primary{margin:8px 0}#ar-stage{position:fixed;inset:0;overflow:hidden;z-index:0}body.ar #app{background:linear-gradient(#0d3052d9,transparent 50%,#0d3052 88%)}#ar-stage canvas,#ar-stage video{position:absolute}#viewer{position:fixed;left:0;right:0;top:20dvh;height:35dvh;z-index:1;pointer-events:none}#viewer canvas{width:100%;height:100%}body.revealing .scan-frame{visibility:hidden}body.flat .scan-frame{display:none}body.flat.revealing .experience{min-height:330px}.flying-thumb{position:fixed;z-index:20;width:90px;height:90px;object-fit:contain;border-radius:18px;background:#fff;pointer-events:none;box-shadow:0 6px 30px #0003}#toast{position:fixed;z-index:30;bottom:30%;left:50%;transform:translateX(-50%);background:#fff;color:var(--bg);padding:14px 22px;border-radius:14px;width:max-content;max-width:88%;text-align:center;box-shadow:0 5px 25px #0005}.snow{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:1}.snow i{position:absolute;top:-30px;font:32px serif;opacity:.3;animation:snowfall 17s linear infinite;left:8%}.snow i:nth-child(2){left:24%;animation-delay:-9s}.snow i:nth-child(3){left:39%;animation-delay:-3s}.snow i:nth-child(4){left:51%;animation-delay:-14s}.snow i:nth-child(5){left:64%;animation-delay:-6s}.snow i:nth-child(6){left:77%;animation-delay:-11s}.snow i:nth-child(7){left:91%;animation-delay:-1s}.snow i:nth-child(8){left:16%;animation-delay:-16s}.shake{animation:shake .32s}.pop{animation:pop .4s}@keyframes snowfall{to{transform:translate(20px,110dvh)}}@keyframes shake{25%,75%{transform:translateX(-5px)}50%{transform:translateX(5px)}}@keyframes pop{50%{transform:scale(1.12)}}@media(prefers-reduced-motion:reduce){.snow{display:none}*,*::before,*::after{animation-duration:.01ms!important;scroll-behavior:auto!important}}@media(max-height:740px){#app{padding-top:12px}header{padding-bottom:10px}.intro,.complete{padding-top:2px}.title-mark{font-size:35px;margin-bottom:6px}h1{font-size:29px}.lead{font-size:15px;margin:12px 0}.intro .small{margin:6px 0}.slot{aspect-ratio:1.7}.experience{min-height:260px}.quiz{padding:14px}.quiz h3{font-size:19px;margin-bottom:10px}footer{font-size:8px;padding-top:8px}}@media(min-width:700px){.intro{padding-top:30px}.slot{max-height:100px}.collection{gap:18px}}@media(orientation:landscape) and (max-height:550px){#app{max-width:600px}.experience{min-height:300px}#viewer{top:70px;height:200px}.collection .slot{height:60px;aspect-ratio:auto}.intro .title-mark,.complete .title-mark{display:none}}
/* Keep the collection and disclosure visible while the content scrolls. */
#app{height:100vh;height:100dvh;min-height:0}header,.collection-area{flex-shrink:0}.screen{min-height:0;overflow-y:auto;overscroll-behavior:contain}.intro,.complete{justify-content: flex-start}.intro{padding-top:clamp(6px,3vh,30px)}.experience{min-height:0}.experience-bottom{flex-shrink:0}.scan-frame{flex-shrink:0}.complete{padding-top:8px}body.revealing .experience-bottom{margin-top:auto}

```

## main.js

```javascript
/* FLOW:IN · buildless ES module · no analytics / no camera upload */
export const SHARE_TEXT = '《눈, 눈, 눈》 AR 오브제를 모두 모았어요!';
export const QUIZZES = [
  { id:'snowflake', name:'눈송이', question:'두 사람은 무엇 속에서 길을 잃었을까요?', choices:['눈보라','바닷속','사막'], correct:'눈보라', success:'맞아요! 눈보라를 모았어요. 눈송이를 얻었어요', bytes:1883336 },
  { id:'fan', name:'부채', question:'이자람은 어떤 공연을 하는 사람일까요?', choices:['판소리','발레','마술'], correct:'판소리', success:'맞아요! 소리꾼의 대표 소품, 부채를 얻었어요', bytes:1432104 },
  { id:'buk', name:'소리북', question:'고수는 무엇으로 장단을 맞출까요?', choices:['북','피아노','바이올린'], correct:'북', success:'맞아요! 이야기의 장단을 만드는 소리북을 얻었어요', bytes:1190820 }
];
const $ = id => document.getElementById(id);
const KEY = 'flowin-ar-v1';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
export function shuffled(values, random = Math.random) {
  const result = [...values];
  for (let i=result.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [result[i],result[j]]=[result[j],result[i]]; }
  return result;
}
export function validCount(value) { return Number.isInteger(value) && value>=0 && value<=3 ? value : 0; }
function readCount() { try { return validCount(JSON.parse(sessionStorage.getItem(KEY))?.count); } catch { return 0; } }
let count=readCount(), mode='idle', phase='idle', currentQuiz=-1, attempt=0;
let THREE, GLTFLoader, enginePromise, loadPromise, mind=null, arReady=false;
let anchors=[], models=[null,null,null], seen=new Set(), timer=null, scanStarted=0;
let viewer=null, rewardRoot=null, rewardIndex=-1, toastTimer;
const byteLoaded=[0,0,0];
let loadingDone=false, previousCorrectSlot=-1;
function toast(text) { $('toast').textContent=text; $('toast').hidden=false; clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('toast').hidden=true,3500); }
function saveCount() { try { sessionStorage.setItem(KEY,JSON.stringify({count})); } catch { toast('이 브라우저에서는 진행 상태를 저장할 수 없어요. 새로고침하지 말고 계속해 주세요.'); } }
function paintCollection(n=count) {
  QUIZZES.forEach((q,i)=>{ const slot=$(`slot-${i}`); slot.classList.toggle('filled',i<n); slot.querySelector('img').hidden=i>=n; slot.setAttribute('aria-label',`${q.name} ${i<n?'획득 완료':'아직 모으지 않음'}`); });
}
function instruction() { $('instruction').textContent=mode==='flat'?`0${count+1} 이야기를 읽고 풀어 주세요`:`0${count+1} 보드를 비춰 주세요`; $('step-count').textContent=`OBJECT 0${count+1} / 03`; }
function setStatus(text) { if($('status').textContent!==text)$('status').textContent=text; }
function stopScanTimer() { clearInterval(timer); timer=null; }
function armScanTimer() {
  stopScanTimer(); scanStarted=performance.now();
  timer=setInterval(()=>{
    if (mode!=='ar' || phase!=='scanning' || document.hidden) return;
    const sec=(performance.now()-scanStarted)/1000;
    if(sec>=10) setStatus('조명이 밝은 곳에서 보드 전체가 화면에 들어오게 비춰 주세요');
    if(sec>=20) $('flat-button').hidden=false;
  },500);
}
async function engine() {
  if(!enginePromise) enginePromise=Promise.all([import('three'),import('three/addons/loaders/GLTFLoader.js')]).then(([three,loader])=>{THREE=three;GLTFLoader=loader.GLTFLoader;}).catch(error=>{enginePromise=null;throw error;});
  return enginePromise;
}
function progress() {
  const total=QUIZZES.reduce((sum,q)=>sum+q.bytes,0), loaded=byteLoaded.reduce((a,b)=>a+b,0);
  const pct=Math.min(99,Math.floor(loaded/total*100));
  $('load-progress').value=pct;
  $('load-label').textContent=`3D 오브제 ${pct}% · ${(loaded/1e6).toFixed(1)}MB`;
}
async function fetchModel(q,i) {
  const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),30000);
  try {
    const response=await fetch(`./assets/models/${q.id}.glb`,{signal:controller.signal});
    if(!response.ok) throw new Error(`model HTTP ${response.status}`);
    let buffer;
    if(response.body?.getReader) {
      const reader=response.body.getReader(), chunks=[];let bytes=0;
      while(true) { const {done,value}=await reader.read();if(done)break;chunks.push(value);bytes+=value.length;byteLoaded[i]=bytes;progress(); }
      const data=new Uint8Array(bytes);let offset=0;for(const c of chunks){data.set(c,offset);offset+=c.length;}buffer=data.buffer;
    } else { buffer=await response.arrayBuffer();byteLoaded[i]=buffer.byteLength;progress(); }
    const gltf=await new GLTFLoader().parseAsync(buffer,new URL('./assets/models/',location.href).href);
    // Center all Meshy assets and fit their longest axis to one scene unit.
    const box=new THREE.Box3().setFromObject(gltf.scene), center=box.getCenter(new THREE.Vector3()), size=box.getSize(new THREE.Vector3());
    gltf.scene.position.sub(center);
    const normalized=new THREE.Group();normalized.add(gltf.scene);normalized.scale.setScalar(1/Math.max(size.x,size.y,size.z,0.001));
    models[i]=normalized;
  } finally {clearTimeout(timeout);}
}
async function preloadModels() {
  if(loadPromise)return loadPromise;
  $('retry-models').hidden=true;loadingDone=false;
  loadPromise=(async()=>{
    try {
      await engine();
      await Promise.allSettled(QUIZZES.map((q,i)=>models[i]?Promise.resolve():fetchModel(q,i)));
      const n=models.filter(Boolean).length;
      $('load-progress').value=n===3?100:$('load-progress').value;
      $('load-label').textContent=n===3?'3D 오브제 준비 완료':`3D ${n}/3개 준비 · 로딩 실패 시 썸네일로 보여 드려요`;
      $('retry-models').hidden=n===3;
    } catch(error) {
      console.warn('3D dependencies unavailable',error);
      $('load-label').textContent='3D를 불러오지 못했어요 · 퀴즈는 계속할 수 있어요';$('retry-models').hidden=false;
    } finally {loadingDone=true;loadPromise=null;}
  })();
  return loadPromise;
}
function lightScene(scene) {scene.add(new THREE.HemisphereLight(0xffffff,0x496581,2.5));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(1,2,3);scene.add(light);}
function safeStop(ar) {
  if(!ar)return;
  try{ar.stop();}catch(error){console.debug('AR stop before ready',error);}
  try{ar.renderer.setAnimationLoop(null);}catch{}
  ar.video?.srcObject?.getTracks().forEach(track=>track.stop());
}
function discardAR(ar) {
  safeStop(ar);try{ar.renderer.dispose();ar.cssRenderer?.domElement?.remove();ar.renderer.domElement.remove();ar.video?.remove();}catch{}
}
function finishCamera() {attempt++;arReady=false;stopScanTimer();seen.clear();safeStop(mind);document.body.classList.remove('ar');}
function found(index) {
  if(mode!=='ar')return;
  seen.add(index);
  if(!arReady)return;
  if(phase!=='scanning')return;
  if(index===count) showQuiz();
  else setStatus(`먼저 0${count+1} 보드를 비춰 주세요`);
}
function lost(index) {
  seen.delete(index);
  // A quiz stays available once found; moving the phone never erases an answer.
  // If tracking drops during the celebration, show the object in the 3D viewer.
  if(mode==='ar' && phase==='reward' && index===rewardIndex && $('viewer').hidden) showViewerReward().catch(()=>setStatus('오브제를 모았어요. 잠시 후 박스로 이동해요.'));
}
async function startAR() {
  const ticket=++attempt;mode='ar';phase='scanning';arReady=false;currentQuiz=-1;
  $('start').hidden=true;$('experience').hidden=false;$('mode-tag').textContent='AR · 카메라';
  $('quiz').hidden=true;$('flat-button').hidden=true;instruction();setStatus('카메라를 준비하고 있어요…');armScanTimer();
  let instance, targetURL;
  try {
    if(!window.isSecureContext || !navigator.mediaDevices?.getUserMedia)throw new Error('HTTPS / camera API required');
    await engine();
    if(ticket!==attempt)return;
    const {MindARThree}=await import('mindar-image-three');
    if(ticket!==attempt)return;
    // Preflight catches missing targets before MindAR's async executor starts.
    const targetController=new AbortController();
    const targetTimeout=setTimeout(()=>targetController.abort(),20000);
    let targetResponse, targetData;
    try {
      targetResponse=await fetch('./assets/targets.mind',{signal:targetController.signal});
      if(!targetResponse.ok || targetResponse.headers.get('content-type')?.includes('text/html'))throw new Error('targets.mind missing');
      targetData=await targetResponse.arrayBuffer();
      if(targetData.byteLength<100)throw new Error('targets.mind empty');
    } finally {clearTimeout(targetTimeout);}
    if(ticket!==attempt)return;
    targetURL=URL.createObjectURL(new Blob([targetData]));
    instance=new MindARThree({container:$('ar-stage'),imageTargetSrc:targetURL,maxTrack:3,uiLoading:'no',uiScanning:'no',uiError:'no'});
    mind=instance;lightScene(instance.scene);
    // If the visitor switches modes while a permission prompt is pending,
    // release the eventual stream before tracking can start.
    const startVideo=instance._startVideo.bind(instance);
    instance._startVideo=async()=>{await startVideo();if(ticket!==attempt){instance.video?.srcObject?.getTracks().forEach(track=>track.stop());throw new Error('Camera start cancelled');}};
    anchors=QUIZZES.map((q,index)=>{const anchor=instance.addAnchor(index);anchor.onTargetFound=()=>found(index);anchor.onTargetLost=()=>lost(index);return anchor;});
    // MindAR loads targets and requests rear-camera permission. Do not require models first.
    await instance.start();
    if(ticket!==attempt){discardAR(instance);return;}
    arReady=true;document.body.classList.add('ar');
    instance.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    instance.renderer.setAnimationLoop(()=>{
      if(rewardRoot && rewardRoot.parent!==viewer?.scene) rewardRoot.rotation.y+=0.018;
      instance.renderer.render(instance.scene,instance.camera);
    });
    setStatus('보드의 그림과 글자가 또렷하게 보이도록 비춰 주세요');armScanTimer();
    if(seen.has(count))showQuiz();
  }catch(error){
    console.warn('AR unavailable',error);
    if(ticket!==attempt){discardAR(instance);return;}
    discardAR(instance);mind=null;
    await useFlat('카메라 또는 이미지 인식을 사용할 수 없어 카메라 없는 모드로 시작해요.');
  } finally {if(targetURL)URL.revokeObjectURL(targetURL);}
}
async function useFlat(message='카메라 없이도 세 가지 오브제를 모두 모을 수 있어요.') {
  if(phase==='reward')return;
  finishCamera();mode='flat';phase='scanning';currentQuiz=-1;
  document.body.classList.add('flat');$('start').hidden=true;$('experience').hidden=false;
  $('mode-tag').textContent='카메라 없는 체험';$('flat-button').hidden=true;
  instruction();setStatus(message);showQuiz();
}
function showQuiz() {
  if(count>=3 || phase==='reward' || phase==='complete')return;
  stopScanTimer();phase='quiz';currentQuiz=count;const q=QUIZZES[count];
  $('scan-frame').hidden=true;$('quiz').hidden=false;$('quiz-number').textContent=`QUIZ 0${count+1}`;
  $('question').textContent=q.question;$('feedback').textContent='';$('answers').replaceChildren();
  const choices=shuffled(q.choices);
  let correctSlot=choices.indexOf(q.correct);
  if(correctSlot===previousCorrectSlot){
    const other=(correctSlot+1+Math.floor(Math.random()*2))%3;
    [choices[correctSlot],choices[other]]=[choices[other],choices[correctSlot]];correctSlot=other;
  }
  previousCorrectSlot=correctSlot;
  choices.forEach(choice=>{
    const button=document.createElement('button');button.type='button';button.textContent=choice;
    button.addEventListener('click',()=>answer(choice,button));$('answers').append(button);
  });
  setStatus(mode==='ar'?'보드 속 이야기를 보고 정답을 골라 주세요.':'전시 보드를 읽고 정답을 골라 주세요.');
  $('question').focus({preventScroll:true});
}
async function answer(choice,button) {
  if(phase!=='quiz' || currentQuiz!==count)return;
  const i=count,q=QUIZZES[i];
  if(choice!==q.correct){button.classList.remove('shake');void button.offsetWidth;button.classList.add('shake');$('feedback').textContent='앗, 보드를 한 번 더 볼까요? 다시 골라 보세요';return;}
  phase='reward';rewardIndex=i;button.classList.add('correct');
  $('answers').querySelectorAll('button').forEach(b=>b.disabled=true);
  $('feedback').textContent=q.success;
  // Save immediately: a refresh during the animation still preserves this answer.
  count++;saveCount();stopScanTimer();$('flat-button').hidden=true;
  await sleep(350);$('quiz').hidden=true;$('reward-text').hidden=false;$('reward-text').textContent=q.success;
  document.body.classList.add('revealing');setStatus('오브제를 발견했어요!');
  // Preloading is in flight; wait briefly, then use an explicit thumbnail fallback.
  if(!models[i] && !loadingDone && loadPromise)await Promise.race([loadPromise,sleep(5000)]);
  let startPoint={x:innerWidth/2,y:innerHeight*.38};
  if(models[i]) {
    try {
      const clone=models[i].clone(true);rewardRoot=new THREE.Group();rewardRoot.add(clone);
      if(mode==='ar' && arReady && seen.has(i)) {
        rewardRoot.scale.setScalar(.7);rewardRoot.position.z=.18;anchors[i].group.add(rewardRoot);
      } else await showViewerReward();
      await sleep(reduced?500:1800);
      if(rewardRoot?.parent && $('viewer').hidden && mind) {
        const pos=rewardRoot.getWorldPosition(new THREE.Vector3()).project(mind.camera);
        const rect=mind.renderer.domElement.getBoundingClientRect();
        const x=rect.left+(pos.x+1)*rect.width/2,y=rect.top+(1-pos.y)*rect.height/2;
        if(Number.isFinite(x)&&x>0&&x<innerWidth&&y>0&&y<innerHeight)startPoint={x,y};
      }
    } catch(error) {console.warn('WebGL reward unavailable',error);await thumbPreview(q);}
  } else {setStatus('3D를 불러오지 못해 오브제 이미지로 보여 드려요.');await thumbPreview(q);}
  clearReward();await flyToSlot(i,startPoint);paintCollection();
  $(`slot-${i}`).classList.add('pop');setTimeout(()=>$(`slot-${i}`).classList.remove('pop'),450);
  document.body.classList.remove('revealing');$('reward-text').hidden=true;rewardIndex=-1;
  if(count===3){complete();return;}
  phase='scanning';currentQuiz=-1;instruction();$('scan-frame').hidden=false;
  if(mode==='flat')showQuiz();else{setStatus(`이제 0${count+1} 보드를 비춰 주세요`);armScanTimer();if(seen.has(count))showQuiz();}
}
async function thumbPreview(q) {
  const img=document.createElement('img');img.src=`./assets/thumbs/${q.id}.png`;img.alt=q.name;img.className='flying-thumb';img.style.cssText='left:calc(50% - 60px);top:calc(38dvh - 60px);width:120px;height:120px';document.body.append(img);await sleep(1400);img.remove();
}
async function showViewerReward() {
  if(!rewardRoot || !$('viewer').hidden)return;
  rewardRoot.removeFromParent();rewardRoot.scale.setScalar(1);rewardRoot.position.set(0,0,0);
  if(!viewer){
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.01,100);camera.position.z=2.25;lightScene(scene);
    viewer={renderer,scene,camera};$('viewer').append(renderer.domElement);
    renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();setStatus('3D 화면이 중단되었어요. 오브제는 정상적으로 모았어요.');});
  }
  $('viewer').hidden=false;resizeViewer();viewer.scene.add(rewardRoot);
  viewer.renderer.setAnimationLoop(()=>{if(rewardRoot)rewardRoot.rotation.y+=.018;viewer.renderer.render(viewer.scene,viewer.camera);});
}
function resizeViewer(){if(!viewer || $('viewer').hidden)return;const w=$('viewer').clientWidth,h=$('viewer').clientHeight;viewer.renderer.setSize(w,h);viewer.camera.aspect=w/h;viewer.camera.updateProjectionMatrix();}
function clearReward(){rewardRoot?.removeFromParent();rewardRoot=null;if(viewer)viewer.renderer.setAnimationLoop(null);$('viewer').hidden=true;}
async function flyToSlot(i,origin) {
  const dest=$(`slot-${i}`).getBoundingClientRect(), img=document.createElement('img');img.className='flying-thumb';img.alt='';img.src=`./assets/thumbs/${QUIZZES[i].id}.png`;
  img.style.left=`${origin.x-45}px`;img.style.top=`${origin.y-45}px`;document.body.append(img);
  if(img.animate){const animation=img.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dest.left+dest.width/2-origin.x}px,${dest.top+dest.height/2-origin.y}px) scale(.65)`,opacity:.8}],{duration:reduced?1:650,easing:'cubic-bezier(.22,.75,.3,1)',fill:'forwards'});await animation.finished.catch(()=>{});}
  img.remove();
}
function complete(){
  finishCamera();clearReward();phase='complete';mode='complete';
  $('start').hidden=true;$('experience').hidden=true;$('complete').hidden=false;
  $('mode-tag').textContent='3 / 3 COLLECTED';paintCollection();$('complete-title').focus({preventScroll:true});
}
async function copy(text){try{await navigator.clipboard.writeText(text);toast('복사했어요.');}catch{window.prompt('아래 내용을 길게 눌러 복사해 주세요.',text);}}
$('start-button').addEventListener('click',()=>{if(phase==='idle')startAR();});
$('start-flat').addEventListener('click',()=>{if(phase==='idle')useFlat();});
$('flat-button').addEventListener('click',()=>useFlat());
$('retry-models').addEventListener('click',()=>preloadModels());
$('copy-url').addEventListener('click',()=>copy(location.href));
$('share-text').textContent=SHARE_TEXT;$('copy-share').addEventListener('click',()=>copy(SHARE_TEXT));
window.addEventListener('resize',resizeViewer);
window.addEventListener('pagehide',()=>{finishCamera();clearReward();});
window.addEventListener('pageshow',event=>{if(event.persisted && phase!=='complete')location.reload();});
document.addEventListener('visibilitychange',()=>{if(!document.hidden && mode==='ar' && phase==='scanning')scanStarted=performance.now();});
$('inapp').hidden=!/KAKAOTALK|FBAN|FBAV|Instagram|Line\/|NAVER|DaumApps|MicroMessenger/i.test(navigator.userAgent);
paintCollection();if(count===3)complete();
// HTML and CSS render independently of external libraries and model requests.
preloadModels();

```

