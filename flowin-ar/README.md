# FLOW:IN · 《눈, 눈, 눈》 모바일 웹 AR 퀴즈

첨부 Meshy 모델을 연결한 정적 HTML/CSS/JS 프로젝트입니다. 앱 설치는 필요하지 않습니다.
MindAR 이미지 트래킹 three.js 버전 1.2.5, three.js / GLTFLoader 0.160.0을 CDN에서 버전을 고정해 사용합니다.
Google Fonts의 Gowun Batang을 사용하며 연결 실패 시 시스템 serif로 표시합니다.

## 지금 준비된 것 / 남은 것

- 전체 프런트엔드 코드와 실제 모델 3개, 흰 배경 PNG 3개를 포함했습니다.
- **실제 전시 보드 01·02·03 이미지와 이를 컴파일한 `assets/targets.mind`는 제공되지 않아 포함하지 않았습니다.**
- `targets.mind`를 넣기 전에는 시작하기가 카메라 없는 모드로 전환됩니다. 가짜 타깃 파일을 넣지 않았습니다.
- GitHub 계정·저장소에 접속하거나 실제 사이트를 배포하지 않았습니다. 아래 순서로 직접 배포할 수 있습니다.
- iOS Safari, Android Chrome을 목표로 구현했습니다. 실제 휴대폰에서의 추적과 카메라 성능 검증은 필요합니다.

## 1. 파일 구조

```text
flowin-ar/
├── index.html                 시작 / AR / 완료 화면 및 버전 고정 importmap
├── style.css                  모바일 레이아웃, 수집 박스, 눈·획득 애니메이션
├── main.js                    퀴즈·추적·3D·오류 처리·진행 저장 전체 코드
├── README.md                  이 안내서
├── COMPLETE_CODE.md           HTML/CSS/JS 전체 코드 합본
├── .nojekyll                  GitHub Pages에 정적 파일을 그대로 게시
└── assets/
    ├── targets.mind           직접 생성해서 추가해야 하는 파일
    ├── TARGETS_REQUIRED.txt    타깃 준비 안내 (대체 파일 아님)
    ├── models/
    │   ├── snowflake.glb
    │   ├── fan.glb
    │   └── buk.glb
    └── thumbs/
        ├── snowflake.png
        ├── fan.png
        └── buk.png
```

위 구조의 `targets.mind`만 미포함입니다. 모든 경로가 `./assets/...` 상대 경로라 GitHub 프로젝트 저장소의 하위 URL에서도 실행됩니다. `file://`로 index.html을 더블클릭하면 모듈·모델·카메라가 정상 동작하지 않습니다.

## 2. 첨부 파일 연결과 최적화

| 첨부 파일 | 프로젝트 경로 |
|---|---|
| Meshy_AI_Crystal_Snowflake_1107104900_texture.glb | assets/models/snowflake.glb |
| Meshy_AI_Orange_Folding_Fan_1107104806_texture.glb | assets/models/fan.glb |
| Meshy_AI_Golden_Drum_with_Stic_1107104854_texture.glb | assets/models/buk.glb |
| 눈송이_썸네일.png | assets/thumbs/snowflake.png |
| 부채_썸네일.png | assets/thumbs/fan.png |
| 소리북_썸네일.png | assets/thumbs/buk.png |

원본 GLB의 기하 구조는 유지하고, 포함된 불투명 2048px PNG 텍스처만 JPEG 품질 88로 재인코딩했습니다. 손실 압축이므로 최종 인쇄물과 비교할 때 표면 질감의 미세한 차이는 있을 수 있습니다. DRACO나 KTX 확장을 추가하지 않았으므로 별도 디코더 없이 GLTFLoader로 열립니다.

| 모델 | 원본 크기 (MB, 1MB=1,000,000 bytes) | 제공본 크기 |
|---|---:|---:|
| 눈송이 | 5.39 | 1.88MB |
| 부채 | 2.80 | 1.43MB |
| 소리북 | 3.83 | 1.19MB |

실제 첨부 PNG는 어두운 배경이어서 그대로 쓰면 흰 박스 안에 검은 사각형이 드러납니다. 제공본의 썸네일은 **첨부 GLB를 흰 배경에서 새로 렌더링한 이미지**입니다. 첨부 PNG 자체를 수정한 파일은 아닙니다. 따라서 원본 PNG와 촬영 각도·조명이 다를 수 있습니다. 박스 내부와 썸네일 가장자리는 모두 RGB(255,255,255), 완전 불투명입니다.

팀에서 별도로 만든 흰 배경 최종 PNG가 있다면 위 경로의 동명 파일을 교체하면 됩니다. object-fit: contain으로 비율을 유지합니다. 모델 파일을 나중에 교체하면 main.js의 QUIZZES 안 `bytes`도 실제 파일 바이트 수로 수정하세요. 이 값은 표시용 진행률 계산에만 쓰입니다.

## 3. 내가 준비해야 할 것

- [ ] 최종 출력 보드 01·02·03에서 각각 인식할 평면 이미지 PNG/JPG 1장씩
- [ ] 세 이미지를 **하나로 컴파일한** targets.mind 파일
- [ ] GitHub 계정과 새 공개 저장소 (예: flowin-ar)
- [ ] 배포가 완료된 실제 HTTPS URL을 담은 전시 보드 접속용 QR
- [ ] iPhone 1대 이상, Android 1대 이상과 실제 인쇄 보드
- [ ] 보드 위 오브제의 방향·크기·위치를 확인할 최종 현장 리허설
- [ ] AR·VR 체험이 모두 끝난 뒤 사용할 별도 Google Forms 설문 QR

이 AR 웹사이트에는 설문을 넣지 않았습니다. 프로젝트 운영 조건대로 **AR 약 5분 → 팀원 안내 → VR 약 5분 → 전체 체험 후 2문항 Google Forms 설문 QR** 순서로 진행합니다. 완료 화면에는 VR 안내를 넣었습니다. 퀴즈를 빨리 풀면 5분보다 일찍 끝날 수 있으며, 5분을 강제로 기다리게 하지는 않습니다. 보드 읽기와 현장 설명을 포함한 목표 시간입니다.

## 4. targets.mind 만드는 방법

공식 설명: https://hiukim.github.io/mind-ar-js-doc/quick-start/compile/
공식 Image Targets Compiler: https://hiukim.github.io/mind-ar-js-doc/tools/compile/

1. 전시 보드에서 실제 인식에 사용할 영역을 정합니다. 번호만 크게 있는 이미지보다 사진·그림·글자 등 특징이 골고루 있는 이미지가 좋습니다. 세 타깃은 서로 충분히 달라야 합니다.
2. 최종 인쇄 디자인과 같은 비율·배치·색으로 `board-01.png`, `board-02.png`, `board-03.png`를 내보냅니다. 사진으로 찍은 사선 이미지보다 원본 정면 이미지를 사용하세요.
3. 위 Compiler를 PC에서 열고 세 파일을 함께 추가합니다.
4. 도구에 표시되는 목록/미리보기 순서를 반드시 확인합니다. **첫 번째=보드01(타깃0), 두 번째=보드02(타깃1), 세 번째=보드03(타깃2)**여야 합니다. 파일명 순서만 믿지 말고 출력 순서를 확인하세요.
5. Start를 눌러 컴파일하고 특징점이 이미지 전반에 분포하는지 확인합니다. 특징점이 거의 없으면 보드의 시각 요소나 인식 영역을 바꾸세요.
6. Download로 `.mind` 파일을 내려받아 `targets.mind`로 이름을 정합니다.
7. `assets/targets.mind`에 넣습니다. 각 보드를 따로 컴파일한 파일 3개로 대체할 수 없습니다.
8. 배포 후 각 보드를 비추어 문제 순서가 올바른지 확인합니다. 01에서 다른 문제가 나오면 컴파일 순서를 바로잡아 다시 만드세요.

QR은 사이트 주소를 여는 역할이고, `.mind`의 보드 이미지는 사이트가 열린 뒤 카메라로 인식하는 역할입니다. 서로 다릅니다. 최종 QR을 보드에 넣은 후 보드 전체를 타깃으로 컴파일하거나, QR과 겹치지 않는 고정된 그림 영역을 타깃으로 정하세요. 컴파일한 영역을 나중에 크게 변경하면 재컴파일해야 합니다.

매끈한 단색·반복 패턴·반사 코팅·주름·강한 조명 반사는 인식에 불리합니다. 인쇄물은 평평하게 놓고, 먼저 보드 전체를 화면에 넣은 뒤 천천히 거리와 각도를 조절합니다.

## 5. GitHub Pages 배포 — 브라우저로 하는 방법

GitHub 공식 안내: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

1. ZIP을 압축 해제합니다. `index.html`이 들어 있는 폴더를 확인합니다.
2. 먼저 `assets/targets.mind`를 추가합니다. 타깃 없이도 카메라 없는 모드는 확인할 수 있습니다.
3. GitHub에서 **New repository**를 누릅니다. 예를 들어 저장소 이름을 `flowin-ar`로 정하고 공개 저장소를 만듭니다.
4. **Add file → Upload files**에서 `index.html`, `style.css`, `main.js`, `assets` 폴더와 `.nojekyll`을 올립니다. ZIP 파일 자체를 올리지 마세요. 파일들은 저장소의 최상위에 있어야 합니다.
5. 업로드 후 저장소 첫 화면에서 바로 `index.html`과 `assets/`가 보이는지 확인하고 Commit changes 합니다. `flowin-ar/flowin-ar/index.html`처럼 폴더가 한 번 더 생기지 않도록 합니다.
6. 저장소 **Settings → Pages → Build and deployment**로 이동합니다.
7. **Source: Deploy from a branch**를 선택합니다.
8. **Branch: main**, **Folder: /(root)**를 선택하고 Save를 누릅니다.
9. 배포 작업이 끝나면 Pages 화면의 게시 주소를 엽니다. 주소 형식은 `https://계정명.github.io/저장소명/`입니다. 실제로 표시된 URL을 사용하세요.
10. HTTPS 적용을 확인합니다. **Enforce HTTPS**가 선택 가능한 경우 켭니다.
11. Safari와 Chrome에서 모델·이미지가 뜨는지 확인합니다. Pages 주소 뒤의 `/assets/models/snowflake.glb`와 `/assets/targets.mind`가 404가 아닌지도 확인합니다.
12. **완성된 HTTPS 사이트 주소**로 QR을 만듭니다. 저장소 주소 github.com/...를 넣지 마세요.
13. 출력 전 아이폰·안드로이드 기본 카메라로 QR을 스캔하고, 보드 인식부터 완료까지 테스트합니다.

README.md와 COMPLETE_CODE.md는 배포에 필수가 아니어서 저장소에서 제외해도 됩니다. 대소문자가 다른 `Targets.mind`, `Snowflake.glb` 등은 GitHub Pages에서 다른 파일입니다.

### 터미널을 사용할 경우

새로 만든 빈 저장소 기준입니다. 아래 주소는 자신의 것으로 바꿉니다. 명령은 index.html이 있는 폴더에서 실행합니다.

```bash
git init
git add .
git commit -m "Add FLOWIN AR quiz"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/flowin-ar.git
git push -u origin main
```

이후 Settings → Pages 설정은 동일합니다. 이 프로젝트에는 빌드나 npm 설치가 필요하지 않습니다.

## 6. 로컬에서 확인하기

Python이 설치되어 있으면 프로젝트 폴더에서 실행합니다.

```bash
python3 -m http.server 8000
```

같은 PC에서 `http://localhost:8000`을 엽니다. localhost는 카메라 개발용 보안 컨텍스트로 취급되지만, `http://192.168...` 같은 주소를 휴대폰에서 열면 카메라 권한이 동작하지 않을 수 있습니다. 휴대폰 검증에는 GitHub Pages의 HTTPS URL을 사용하세요.

## 7. 동작 방식과 조절할 값

- 보기 순서는 Fisher–Yates로 매 문제 출제 때 섞고, 같은 실행 안에서는 직전 문제와 정답 위치가 겹치지 않도록 한 번 더 조정합니다. 새로고침하면 직전 보기 위치 기록은 초기화됩니다.
- 현재 순서의 타깃을 찾으면 문제가 뜹니다. 문제를 한 번 연 뒤 보드가 시야에서 사라져도 재선택할 수 있습니다.
- 다른 순서의 보드가 먼저 인식되면 ‘먼저 0N 보드를 비춰 주세요’를 표시합니다.
- 정답 후 기본 1.8초 동안 3D를 회전시키고 650ms 동안 썸네일을 하단 박스로 보냅니다.
- 축하 동작 도중 추적이 끊기면 오브제를 화면의 일반 3D 뷰로 옮깁니다. 다음 보드를 찾을 때 다시 이미지 추적을 사용합니다.
- 현재 보드를 찾지 못하는 동안 10초 후 조명 안내, 20초 후 카메라 없는 모드 버튼을 표시합니다. 카메라 초기화가 지연될 때도 20초 후 버튼이 나타납니다.
- 권한 거부·미지원·타깃 파일 누락 시 카메라 없는 모드로 전환합니다. 이미 카메라 없는 모드에서 진행 중이면 늦게 시작된 카메라 스트림도 정지시킵니다.
- 모델은 첫 화면에서 병렬로 미리 불러오지만 시작 버튼을 막지 않습니다. 정답 시 필요한 모델이 아직 로딩 중이면 최대 5초 더 기다립니다.
- 모델 요청은 30초 후 실패 처리하고 다시 로딩 버튼을 제공합니다. WebGL/CDN/모델 실패 시 퀴즈와 썸네일 수집은 계속됩니다. 실패한 상태에서 3D가 표시되었다고 안내하지 않습니다.
- 진행 상태는 `sessionStorage`의 `flowin-ar-v1` 키에 `{"count":0~3}` 형태로 저장합니다. 정답을 확인하는 즉시 저장하므로 애니메이션 중 새로고침해도 유지됩니다. 브라우저가 저장을 차단하면 안내합니다.
- sessionStorage는 같은 탭의 새로고침에 대응합니다. 탭을 닫고 새로 열 때까지의 영구 저장을 보장하지 않습니다. 전시 테스트를 처음부터 다시 하려면 사이트 탭을 닫고 새 탭에서 접속하거나 개발자 도구에서 이 키만 삭제하세요.
- 완료 시 카메라 스트림과 추적을 멈춥니다. 예매는 `target="_blank" rel="noopener noreferrer"`로 새 탭을 엽니다.
- 인앱 브라우저는 UA로 안내하며 100% 탐지를 보장하지 않습니다. Safari/Chrome에서 여는 방법은 앱 버전에 따라 다릅니다.

`main.js` 상단에서 `SHARE_TEXT`를 수정하면 완료 화면 문구와 복사 내용이 함께 바뀝니다. 인스타그램 앱 자동 게시 기능은 없으며, 문구를 복사해 관객이 직접 공유하는 방식입니다.

오브제 방향은 모델의 원본 축을 유지했습니다. 실제 보드 테스트에서 눕거나 뒤집힌 것처럼 보이면 `answer()` 안에서 생성한 clone의 `rotation.x/y/z` 값을 조절하세요. 보드 위 크기는 `rewardRoot.scale.setScalar(.7)`, 보드에서 뜬 높이는 `rewardRoot.position.z=.18`입니다. `showViewerReward()`의 일반 3D 화면에는 별도의 정규화 크기와 카메라를 사용합니다.

## 8. 아이폰·안드로이드 실기기 체크리스트

각 플랫폼에서 아래 표를 각각 한 번 이상 수행하고 기종·OS·브라우저 버전·날짜·결과를 남깁니다. 체크박스는 **현장 검증 전 상태**입니다.

| 검사 | iPhone Safari | Android Chrome | 합격 기준 |
|---|---|---|---|
| 기본 카메라로 QR 열기 | □ | □ | 설치 안내 없이 올바른 HTTPS 페이지가 열림 |
| 첫 화면 로딩 | □ | □ | 모바일 데이터·빈 캐시에서 10초 안에 제목·버튼 표시 |
| 3D 프리로드 | □ | □ | 진행률 후 3개 준비 완료; 각 모델 5MB 미만 |
| 카메라 허용 | □ | □ | 후면 카메라가 표시되고 보드 이미지 추적 가능 |
| 카메라 거부 | □ | □ | 카메라 없는 모드로 바로 이동하고 모든 문제 완료 가능 |
| 시작 화면의 카메라 없는 버튼 | □ | □ | 권한 요청 없이 퀴즈 시작 |
| 타깃 0 / 보드 01 | □ | □ | 눈보라 문제 → 눈송이 |
| 타깃 1 / 보드 02 | □ | □ | 판소리 문제 → 부채 |
| 타깃 2 / 보드 03 | □ | □ | 북 문제 → 소리북 |
| 순서 아닌 보드 | □ | □ | 현재 풀어야 할 보드 번호 안내, 다음 문제 건너뛰지 않음 |
| 오답 / 재선택 | □ | □ | 누른 버튼만 흔들림, 문구 표시, 다시 고를 수 있음 |
| 정답 연타 | □ | □ | 정답 처리 한 번, 획득 1회, 문제 중복 진행 없음 |
| 정답 3D | □ | □ | 보드 위에 올바른 방향/크기로 표시, 1~2초 회전 |
| 추적 중 폰 이동 | □ | □ | 퀴즈 유지; 축하 도중 추적 손실 시 일반 3D로 전환 |
| 수집 애니메이션 | □ | □ | 해당 칸으로 이동, 흰 배경 박스에 썸네일 표시 |
| 10초 미인식 | □ | □ | 밝은 조명·보드 전체 안내 |
| 20초 미인식 | □ | □ | 카메라 없이 계속하기 버튼, 전환 후 카메라 해제 |
| 권한 요청 중 모드 전환 | □ | □ | 뒤늦게 허용해도 카메라가 계속 켜져 있지 않음 |
| 새로고침 | □ | □ | 각 정답 직후·애니메이션 도중 모두 획득 유지 |
| 완료 화면 새로고침 | □ | □ | 세 칸과 완료 화면 유지, 카메라 재요청 없음 |
| 완료 화면 | □ | □ | 팀원 제시 안내·공유 문구·세 이미지가 보임 |
| 예매 버튼 | □ | □ | 지정한 경기아트센터 URL이 새 탭으로 열림 |
| 카카오톡·인스타 인앱 | □ | □ | 외부 브라우저 안내, 주소 복사 가능 |
| 작은 화면·큰 글씨 | □ | □ | 버튼 52px 이상, 문제 스크롤 가능, 수집 칸·고지 표시 |
| 가로/세로 전환 | □ | □ | 내용 접근 가능, 3D 종횡비 정상 |
| 백그라운드 / 복귀 | □ | □ | 진행 유지, 10/20초 안내가 갑자기 연속 발생하지 않음 |
| 페이지 이탈 | □ | □ | 카메라 사용 표시가 꺼짐 |
| 느린 통신·CDN 실패 | □ | □ | 시작 UI 표시, 퀴즈/썸네일 대체 동작, 재시도 가능 |
| 모델 404 | □ | □ | 로딩 실패 안내와 썸네일 대체, 진행 중단 없음 |
| targets.mind 누락 | □ | □ | 카메라 없는 모드로 전환 |
| 실제 전시장 조명·거리 | □ | □ | 보드 3개가 각자 안정적으로 인식됨 |

성능 측정은 캐시를 지운 모바일 데이터 환경에서 하세요. 네트워크 속도·CDN 장애·기기 성능 때문에 10초를 모든 조건에서 보장할 수는 없습니다. 구현은 HTML/CSS UI를 모델·MindAR 로딩과 분리하고, 화면 픽셀 비율을 최대 1.5로 제한합니다. 눈 효과는 CSS 요소 8개만 사용하며 ‘동작 줄이기’ 설정을 반영합니다.

## 9. 이번 작업에서 확인한 범위

- JavaScript 문법 검사
- 브라우저에서 카메라 없는 3문항 진행, 오답 재선택, 정답 후 단계 이동
- 3개 수집 완료 화면 및 새로고침 후 획득 기록 복원
- 실제 GLB 3개 로딩 완료와 제공 썸네일의 흰 배경
- **미검증:** 실제 보드 이미지 추적, 10/20초 현장 인식 타이밍, 휴대폰 카메라 권한 UI, iOS/Android별 WebGL 성능, 실기기 10초 로딩 목표

## 10. 공식 참고 자료

- MindAR 설치 및 three.js importmap: https://hiukim.github.io/mind-ar-js-doc/installation/
- MindAR three.js 예제: https://hiukim.github.io/mind-ar-js-doc/more-examples/threejs-image/
- MindAR 이미지 타깃 컴파일: https://hiukim.github.io/mind-ar-js-doc/quick-start/compile/
- GitHub Pages 배포 설정: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

카메라 영상과 퀴즈 응답을 서버로 업로드하는 코드는 없습니다. 진행 정보는 이 탭의 sessionStorage에만 저장하며, 분석·광고 SDK를 사용하지 않습니다. 폰트·라이브러리는 외부 CDN에 요청합니다.
