const $ = id => document.getElementById(id);
const KEY = 'flowin-ar-v1';
const LANGUAGE_KEY = 'flowin-quiz-language';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const TEXT = {
  ko: {
    title: '《눈, 눈, 눈》 퀴즈', eyebrow: '이자람 판소리 · 전시 연계 체험',
    intro: '퀴즈 세 문제를 풀고 눈송이, 부채, 소리북을 모아 보세요.',
    start: '시작하기', resume: '이어서 풀기', instruction: '정답을 골라 주세요',
    wrong: '다시 골라 보세요!', completeLabel: '수집 완료', complete: '모든 오브제를 모았어요!',
    completeLead: '눈 속에서 만난 이야기, 이제 공연으로 이어 보세요.',
    staff: '이 화면을 팀원에게 보여 주세요', booking: '공연 예매하기 ↗',
    copy: '공유 문구 복사', copied: '복사했어요.', prompt: '아래 문구를 복사해 주세요.',
    share: '《눈, 눈, 눈》 오브제를 모두 모았어요!',
    vr: '다음은 팀원의 안내에 따라 VR을 체험해 주세요.',
    ai: '본 콘텐츠는 생성형 AI를 활용하여 제작되었으며, 기획·검수·편집은 제작팀이 수행하였습니다.',
    credit: '3D 모델: Meshy로 제작 · 제작: FLOW:IN', privacy: '개인정보는 수집하지 않습니다.',
    preparing: '3D 오브제 준비 중…', ready: '3D 오브제 준비 완료',
    fallback: '3D를 표시할 수 없는 오브제는 이미지로 보여 드려요.',
    retry: '3D 로딩 다시 시도', viewer: '획득한 오브제의 3D 미리보기',
    progress: '3D 모델 다운로드 진행률', collection: '모은 오브제', experience: '퀴즈 체험',
    collected: '획득 완료', empty: '아직 모으지 않음', object: '오브제', quiz: '문제',
    storageError: '진행 상태를 저장할 수 없어요. 이 화면에서 계속해 주세요.'
  },
  en: {
    title: 'Snow, Snow, Snow Quiz', eyebrow: 'Lee Jaram’s Pansori · Exhibition Quiz',
    intro: 'Answer three questions to collect a snowflake, a fan, and a drum.',
    start: 'Start quiz', resume: 'Continue quiz', instruction: 'Choose the correct answer',
    wrong: 'Try another answer!', completeLabel: 'Collection complete', complete: 'You collected all three objects!',
    completeLead: 'Discover the rest of the story at the performance.',
    staff: 'Show this screen to a team member.', booking: 'Book tickets ↗',
    copy: 'Copy share message', copied: 'Copied!', prompt: 'Copy the message below.',
    share: 'I collected all three objects in the Snow, Snow, Snow quiz!',
    vr: 'Follow the team’s instructions to try the VR experience next.',
    ai: 'This content was created with generative AI. The production team planned, reviewed, and edited it.',
    credit: '3D models made with Meshy · Produced by FLOW:IN', privacy: 'We do not collect personal information.',
    preparing: 'Loading 3D objects…', ready: '3D objects are ready',
    fallback: 'An image will appear if a 3D object cannot be displayed.',
    retry: 'Retry 3D loading', viewer: '3D preview of the collected object',
    progress: '3D model download progress', collection: 'Collected objects', experience: 'Quiz',
    collected: 'collected', empty: 'not yet collected', object: 'Object', quiz: 'Question',
    storageError: 'Progress could not be saved. You can keep playing on this screen.'
  }
};

const QUIZZES = [
  {
    id: 'snowflake', bytes: 1883336,
    ko: { name: '눈송이', question: '두 사람은 무엇 속에서 길을 잃었을까요?', choices: ['눈보라', '바닷속', '사막'], success: '정답이에요! 눈송이를 모았어요.' },
    en: { name: 'Snowflake', question: 'Where did the two travelers get lost?', choices: ['In a snowstorm', 'Under the sea', 'In a desert'], success: 'Correct! You collected a snowflake.' }
  },
  {
    id: 'fan', bytes: 1432104,
    ko: { name: '부채', question: '이자람은 어떤 공연을 하는 사람일까요?', choices: ['판소리', '발레', '마술'], success: '정답이에요! 소리꾼의 부채를 모았어요.' },
    en: { name: 'Fan', question: 'What kind of performance does Lee Jaram give?', choices: ['Pansori (Korean musical storytelling)', 'Ballet', 'Magic'], success: 'Correct! You collected the singer’s fan.' }
  },
  {
    id: 'buk', bytes: 1190820,
    ko: { name: '소리북', question: '고수는 무엇으로 장단을 맞출까요?', choices: ['북', '피아노', '바이올린'], success: '정답이에요! 소리북을 모았어요.' },
    en: { name: 'Pansori drum', question: 'Which instrument keeps the rhythm in pansori?', choices: ['Drum', 'Piano', 'Violin'], success: 'Correct! You collected the pansori drum.' }
  }
];

function readLanguage() {
  try { return localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'ko'; }
  catch { return 'ko'; }
}
function readCount() {
  try {
    const value = JSON.parse(sessionStorage.getItem(KEY))?.count;
    return Number.isInteger(value) && value >= 0 && value <= QUIZZES.length ? value : 0;
  } catch { return 0; }
}

let lang = readLanguage();
let count = readCount();
let phase = count === QUIZZES.length ? 'complete' : 'idle';
let rewardIndex = -1, wrong = false, answerOrder = [], previousCorrectSlot = -1;
let THREE, GLTFLoader, enginePromise, loadPromise, viewer, rewardRoot, toastTimer;
let loadingDone = false;
const models = QUIZZES.map(() => null);
const byteLoaded = QUIZZES.map(() => 0);
const t = key => TEXT[lang][key];

function toast(message) {
  $('toast').textContent = message;
  $('toast').hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('toast').hidden = true; }, 3500);
}

function paintCollection() {
  const earned = phase === 'reward' ? rewardIndex : count;
  QUIZZES.forEach((q, i) => {
    const slot = $(`slot-${i}`);
    const name = q[lang].name;
    slot.classList.toggle('filled', i < earned);
    const img = slot.querySelector('img');
    img.alt = name;
    img.hidden = i >= earned;
    slot.setAttribute('aria-label', `${name} · ${t(i < earned ? 'collected' : 'empty')}`);
    slot.parentElement.querySelector('.slot-label').textContent = `${i + 1} ${name}`;
  });
}

function paint() {
  document.documentElement.lang = lang;
  document.title = `${t('title')} · FLOW:IN`;
  document.querySelectorAll('[data-text]').forEach(el => { el.textContent = t(el.dataset.text); });
  document.querySelectorAll('[data-lang]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
  });
  $('viewer').setAttribute('aria-label', t('viewer'));
  $('load-progress').setAttribute('aria-label', t('progress'));
  $('experience').setAttribute('aria-label', t('experience'));
  $('collection').setAttribute('aria-label', t('collection'));
  $('start-button').textContent = t(count ? 'resume' : 'start');
  $('start').hidden = phase !== 'idle';
  $('experience').hidden = phase === 'idle' || phase === 'complete';
  $('complete').hidden = phase !== 'complete';
  $('quiz').hidden = phase !== 'quiz';
  $('reward-text').hidden = phase !== 'reward';
  $('share-text').textContent = t('share');
  if (phase === 'quiz' || phase === 'reward') {
    const index = phase === 'reward' ? rewardIndex : count;
    const q = QUIZZES[index][lang];
    $('step-count').textContent = `${t('object')} ${index + 1} / ${QUIZZES.length}`;
    $('quiz-number').textContent = `${t('quiz')} ${index + 1}`;
    $('question').textContent = q.question;
    $('feedback').textContent = wrong ? t('wrong') : '';
    $('reward-text').textContent = phase === 'reward' ? q.success : '';
    const answers = $('answers');
    answers.replaceChildren();
    if (phase === 'quiz') for (const index of answerOrder) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = q.choices[index];
      button.addEventListener('click', () => answer(index, button));
      answers.append(button);
    }
  }
  paintCollection();
  progress();
}

function nextQuestion() {
  phase = 'quiz';
  wrong = false;
  answerOrder = [0, 1, 2];
  for (let i = answerOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answerOrder[i], answerOrder[j]] = [answerOrder[j], answerOrder[i]];
  }
  const position = answerOrder.indexOf(0);
  if (position === previousCorrectSlot) {
    const other = (position + 1) % answerOrder.length;
    [answerOrder[position], answerOrder[other]] = [answerOrder[other], answerOrder[position]];
  }
  previousCorrectSlot = answerOrder.indexOf(0);
  paint();
  $('question').focus({preventScroll: true});
}

async function answer(choice, button) {
  if (phase !== 'quiz') return;
  if (choice !== 0) {
    wrong = true;
    $('feedback').textContent = t('wrong');
    button.classList.remove('shake');
    void button.offsetWidth;
    button.classList.add('shake');
    return;
  }
  const index = count;
  rewardIndex = index;
  phase = 'reward';
  wrong = false;
  count++;
  try { sessionStorage.setItem(KEY, JSON.stringify({count})); }
  catch { toast(t('storageError')); }
  paint();
  if (!models[index] && loadPromise) await Promise.race([loadPromise, sleep(2500)]);
  try {
    if (models[index]) {
      rewardRoot = models[index].clone(true);
      await showViewerReward();
      await sleep(reduced ? 500 : 1600);
    } else {
      await thumbPreview(QUIZZES[index]);
    }
  } catch {
    clearReward();
    await thumbPreview(QUIZZES[index]);
  }
  clearReward();
  await flyToSlot(index, {x: innerWidth / 2, y: innerHeight * .38});
  if (count === QUIZZES.length) {
    phase = 'complete';
    paint();
    $('complete-title').focus({preventScroll: true});
  } else {
    nextQuestion();
  }
}

async function engine() {
  if(!enginePromise) enginePromise=Promise.all([import('three'),import('three/addons/loaders/GLTFLoader.js')]).then(([three,loader])=>{THREE=three;GLTFLoader=loader.GLTFLoader;}).catch(error=>{enginePromise=null;throw error;});
  return enginePromise;
}
function progress() {
  const total = QUIZZES.reduce((sum, quiz) => sum + quiz.bytes, 0);
  const loaded = byteLoaded.reduce((sum, bytes) => sum + bytes, 0);
  const ready = models.every(Boolean);
  const percent = ready ? 100 : Math.min(99, Math.floor(loaded / total * 100));
  $('load-progress').value = percent;
  $('load-label').textContent = ready ? t('ready') : loadingDone ? t('fallback') : `${t('preparing')} ${percent}%`;
  $('retry-models').hidden = ready || !loadingDone;
}
async function fetchModel(q,i) {
  const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),30000);
  try {
    const response=await fetch(`./${q.id}.glb`,{signal:controller.signal});
    if(!response.ok) throw new Error(`model HTTP ${response.status}`);
    let buffer;
    if(response.body?.getReader) {
      const reader=response.body.getReader(), chunks=[];let bytes=0;
      while(true) { const {done,value}=await reader.read();if(done)break;chunks.push(value);bytes+=value.length;byteLoaded[i]=bytes;progress(); }
      const data=new Uint8Array(bytes);let offset=0;for(const c of chunks){data.set(c,offset);offset+=c.length;}buffer=data.buffer;
    } else { buffer=await response.arrayBuffer();byteLoaded[i]=buffer.byteLength;progress(); }
    const gltf=await new GLTFLoader().parseAsync(buffer,new URL('./',location.href).href);
    // Center all Meshy assets and fit their longest axis to one scene unit.
    const box=new THREE.Box3().setFromObject(gltf.scene), center=box.getCenter(new THREE.Vector3()), size=box.getSize(new THREE.Vector3());
    gltf.scene.position.sub(center);
    const normalized=new THREE.Group();normalized.add(gltf.scene);normalized.scale.setScalar(1/Math.max(size.x,size.y,size.z,0.001));
    models[i]=normalized;
  } finally {clearTimeout(timeout);}
}
async function preloadModels() {
  if (loadPromise) return loadPromise;
  loadingDone = false;
  progress();
  loadPromise = (async () => {
    try {
      await engine();
      await Promise.allSettled(QUIZZES.map((q, i) => models[i] ? Promise.resolve() : fetchModel(q, i)));
    } catch (error) {
      console.warn('3D unavailable', error);
    } finally {
      loadingDone = true;
      loadPromise = null;
      progress();
    }
  })();
  return loadPromise;
}
function lightScene(scene) {scene.add(new THREE.HemisphereLight(0xffffff,0x496581,2.5));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(1,2,3);scene.add(light);}

async function thumbPreview(q) {
  const img=document.createElement('img');img.src=`./${q.id}.png`;img.alt=q[lang].name;img.className='flying-thumb';img.style.cssText='left:calc(50% - 60px);top:calc(38dvh - 60px);width:120px;height:120px';document.body.append(img);await sleep(1400);img.remove();
}
async function showViewerReward() {
  if(!rewardRoot || !$('viewer').hidden)return;
  rewardRoot.removeFromParent();rewardRoot.position.set(0,0,0);
  if(!viewer){
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.01,100);camera.position.z=2.25;lightScene(scene);
    viewer={renderer,scene,camera};$('viewer').append(renderer.domElement);
    renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();toast(t('fallback'));});
  }
  $('viewer').hidden=false;resizeViewer();viewer.scene.add(rewardRoot);
  viewer.renderer.setAnimationLoop(()=>{if(rewardRoot)rewardRoot.rotation.y+=.018;viewer.renderer.render(viewer.scene,viewer.camera);});
}
function resizeViewer(){if(!viewer || $('viewer').hidden)return;const w=$('viewer').clientWidth,h=$('viewer').clientHeight;viewer.renderer.setSize(w,h);viewer.camera.aspect=w/h;viewer.camera.updateProjectionMatrix();}
function clearReward(){rewardRoot?.removeFromParent();rewardRoot=null;if(viewer)viewer.renderer.setAnimationLoop(null);$('viewer').hidden=true;}
async function flyToSlot(i,origin) {
  const dest=$(`slot-${i}`).getBoundingClientRect(), img=document.createElement('img');img.className='flying-thumb';img.alt='';img.src=`./${QUIZZES[i].id}.png`;
  img.style.left=`${origin.x-45}px`;img.style.top=`${origin.y-45}px`;document.body.append(img);
  if(img.animate){const animation=img.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dest.left+dest.width/2-origin.x}px,${dest.top+dest.height/2-origin.y}px) scale(.65)`,opacity:.8}],{duration:reduced?1:650,easing:'cubic-bezier(.22,.75,.3,1)',fill:'forwards'});await animation.finished.catch(()=>{});}
  img.remove();
}

document.querySelectorAll('[data-lang]').forEach(button => {
  button.addEventListener('click', () => {
    lang = button.dataset.lang;
    try { localStorage.setItem(LANGUAGE_KEY, lang); } catch {}
    paint();
  });
});
$('start-button').addEventListener('click', nextQuestion);
$('retry-models').addEventListener('click', preloadModels);
$('copy-share').addEventListener('click', async () => {
  const message = t('share');
  try {
    await navigator.clipboard.writeText(message);
    toast(t('copied'));
  } catch {
    window.prompt(t('prompt'), message);
  }
});
window.addEventListener('resize', resizeViewer);
window.addEventListener('pagehide', clearReward);
paint();
preloadModels();
