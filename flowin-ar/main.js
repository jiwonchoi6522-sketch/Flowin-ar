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
