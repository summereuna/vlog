<div align="center">
<h3>공유하고 싶은 일상 그 순간, Vl☻g</h3>
  <p>가지고 있는 동영상 파일을 업로드하거나 지금 바로 웹캠으로 녹화해 업로드 해보세요!<br/>
가입하는 누구나 원하는 동영상을 올릴 수 있지만 저는 보통 방탄소년단의 동영상을 올립니다. 😚</p>
  <img width="600" alt="vlog" src="https://github.com/user-attachments/assets/8afc1dae-3a80-4dd5-9e7c-e11bf394e405">
</div>
<br/>

## 목차

- [프로젝트 소개](#프로젝트-소개)
- [실행방법](#실행방법)
- [기술스택](#기술스택)
- [아키텍쳐](#아키텍쳐)
- [화면 구성](#화면-구성)
- [주요 기능](#주요-기능)
- [트러블 슈팅](#트러블-슈팅)

<br/>

## 프로젝트 소개

**Vlog는 동영상을 녹화, 업로드, 시청, 검색할 수 있는 사이트**입니다.<br/>
JavaScript와 Node.js를 배우며 동영상을 녹화/업로드/시청/검색할 수 있는 사이트를 구현하였습니다.<br/>
클라이언트와 서버 간의 사용자 요청 및 서버 응답 원리를 이해하고, 데이터를 처리하는 연습을 위해 프로젝트를 진행하였습니다.
<br/>

#### 기여자

개인 프로젝트입니다.

#### 프로젝트 진행기간

2021.09.13 ~ 2021.10.25(6주)

#### 프로젝트 배포링크

[📹 공유하고 싶은 일상 그 순간, Vl☻g](https://vlog2021.fly.dev/)

#### 테스트 계정

> <br/>ID: test123<br/>PW: qwe123!!!

<br/>

## 실행방법

1. 레포지토리 복제 및 의존성 설치

```
$ git clone https://github.com/summereuna/vlog.git
$ cd vlog
$ npm install
```

2. 개발 서버 가동

```
$ npm start
```

3. 브라우저에서 실행

```
http://localhost:4000/
```

<br/>

## 기술스택

|분류|기술|기술 선택 이유|
|:--:|:--:|:--|
|패키지 관리 | npm | - 자바스크립트 생태계에서 가장 널리 사용되는 npm을 사용했습니다.<br/>개발 경험이 많지 않아서, 가장 일반적으로 사용되는 패키지 관리 도구를 선택했습니다.|
|FE 번들링 및 빌드 툴|Webpack|- Webpack은 다양한 플러그인과 로더를 통해 파일을 통합하고 번들링할 수 있는 강력한 도구입니다. 프론트엔드 번들링의 기초를 공부하기 위해 Webpack을 선택했습니다.|
|FE 언어|JavaScript|- Node.js와 함께 풀스택 개발을 하기 위해 JavaScript를 선택했습니다. 마침 JavaScript를 배우고 있어서 이를 사용해 개발을 진행하였습니다.|
|스타일링|SCSS|- CSS보다 효율적이고 유지보수가 쉬운 SCSS를 사용했습니다. 재사용 가능한 스타일을 작성할 수 있고, Webpack과 함께 CSS 로더 설정을 통해 간편하게 사용할 수 있었습니다.|
|템플릿 엔진|Pug|- Pug는 Express와의 통합이 용이하고 HTML보다 간결한 코드 작성이 가능해 생산성을 높일 수 있어서 선택했습니다.|
|BE 언어|Node.js|- JavaScript 기반의 서버 개발을 위해 Node.js를 사용했습니다. 프론트엔드와 동일한 언어를 사용해 접근성과 학습 효율성이 뛰어나 초보자가 사용하기 적합했습니다.|
|BE 프레임워크|Express|- Express는 Node.js의 가벼운 프레임워크로, API 설계와 미들웨어 기반의 백엔드 구축을 손쉽게 할 수 있어 선택했습니다.|
|DB ODM|Mongoose|- 스키마 기반으로 데이터를 구조화하고, 데이터 검증이 용이한 Mongoose를 사용했습니다. MongoDB와 쉽게 연동할 수 있어 사용했습니다.|
|클라우드 DB|MongoDB Atlas|- MongoDB Atlas는 유연한 NoSQL 데이터베이스로, JSON 기반 구조 덕분에 데이터 모델이 직관적이고, 필드 확장과 수정이 용이해 선택했습니다. 무료 플랜으로 접근성이 높았습니다.|
|이미지/동영상 클라우드 스토리지|AWS S3|프리 티어로 무료로 사용할 수 있었고, 대기업의 안정적인 클라우드 서비스를 경험해보고 싶어 선택했습니다.|
|배포 및 호스팅|Flyio|Flyio는 무료 플랜을 제공하며, 애플리케이션을 여러 지역에 자동으로 배포해 빠른 응답 시간을 제공할 수 있어 선택했습니다. Heroku의 무료 플랜 종료 이후 대안으로 Flyio를 사용했습니다.|

<br/>

## 아키텍쳐

![vlog_architecture](https://github.com/user-attachments/assets/3fc8a106-dc54-4ec5-925e-0ff9d3237cf0)

### 폴더구조

```
📦 vlog
 ┣ 📂src
 ┃ ┣ 📂client                // 클라이언트
 ┃ ┃ ┣ 📂js
 ┃ ┃ ┃ ┣ 📜commentSection.js
 ┃ ┃ ┃ ┣ 📜main.js
 ┃ ┃ ┃ ┣ 📜recorder.js
 ┃ ┃ ┃ ┗ 📜videoPlayer.js
 ┃ ┃ ┗ 📂scss
 ┃ ┃   ┣ 📂components
 ┃ ┃   ┣ 📂config
 ┃ ┃   ┃ ┣ 📜_reset.scss
 ┃ ┃   ┃ ┗ 📜_variables.scss
 ┃ ┃   ┣ 📂screens
 ┃ ┃   ┗ 📜styles.scss
 ┃ ┃                        // 서버
 ┃ ┣ 📂controllers
 ┃ ┃ ┣ 📜userController.js
 ┃ ┃ ┗ 📜videoController.js
 ┃ ┣ 📂models
 ┃ ┃ ┣ 📜Comment.js
 ┃ ┃ ┣ 📜User.js
 ┃ ┃ ┗ 📜Video.js
 ┃ ┣ 📂routers
 ┃ ┃ ┣ 📜apiRouter.js
 ┃ ┃ ┣ 📜rootRouter.js
 ┃ ┃ ┣ 📜userRouter.js
 ┃ ┃ ┗ 📜videoRouter.js
 ┃ ┣ 📂views
 ┃ ┃ ┣ 📂mixins
 ┃ ┃ ┃ ┣ 📜comment.pug
 ┃ ┃ ┃ ┣ 📜message.pug
 ┃ ┃ ┃ ┣ 📜video-aside.pug
 ┃ ┃ ┃ ┣ 📜video.pug
 ┃ ┃ ┃ ┗ 📜watch-comment.pug
 ┃ ┃ ┣ 📂partials
 ┃ ┃ ┃ ┣ 📜footer.pug
 ┃ ┃ ┃ ┣ 📜header.pug
 ┃ ┃ ┃ ┣ 📜sidenav.pug
 ┃ ┃ ┃ ┗ 📜social-login.pug
 ┃ ┃ ┣ 📂users
 ┃ ┃ ┃ ┣ 📜change-password.pug
 ┃ ┃ ┃ ┣ 📜edit-profile.pug
 ┃ ┃ ┃ ┗ 📜profile.pug
 ┃ ┃ ┣ 📂videos
 ┃ ┃ ┃ ┣ 📜edit.pug
 ┃ ┃ ┃ ┗ 📜upload.pug
 ┃ ┃ ┣ 📜404.pug
 ┃ ┃ ┣ 📜base.pug
 ┃ ┃ ┣ 📜home.pug
 ┃ ┃ ┣ 📜join.pug
 ┃ ┃ ┣ 📜login.pug
 ┃ ┃ ┣ 📜search.pug
 ┃ ┃ ┗ 📜watch.pug
 ┃ ┣ 📜db.js
 ┃ ┣ 📜init.js
 ┃ ┣ 📜middlewares.js
 ┃ ┗ 📜server.js
 ┃                           //로컬에서 이미지/비디오 저장
 ┣ 📂uploads
 ┃ ┣ 📂avatars
 ┃ ┗ 📂videos
 ┃
 ┣ 📜.dockerignore
 ┣ 📜.env
 ┣ 📜.gitignore
 ┣ 📜Dockerfile
 ┣ 📜README.md
 ┣ 📜babel.config.json
 ┣ 📜fly.toml
 ┣ 📜nodemon.json
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┗ 📜webpack.config.js
```

|      폴더명       | 내용                                                             |
| :---------------: | :--------------------------------------------------------------- |
|      `/src`       | 클라이언트와 서버 파일들을 포함한 루트 디렉토리                  |
|   `/client/js`    | (클라이언트) 클라이언트에서 실행되는 JavaScript 파일 관리        |
|  `/client/scss`   | (클라이언트) 스타일시트 파일 관리                                |
|  `/controllers`   | (서버/컨트롤러) 비즈니스 로직 처리하는 컨트롤러 파일 관리        |
|     `/models`     | (서버/모델) 데이터베이스 모델 정의 파일 관리                     |
|    `/routers`     | (서버/라우터) 라우팅 파일 관리                                   |
|     `/views`      | (서버/뷰) 주요 페이지 템플릿 관리                                |
|  `/views/mixins`  | (서버/뷰) 재사용 가능한 템플릿 관리                              |
| `/views/partials` | (서버/뷰) 공통 레이아웃 템플릿 관리                              |
|  `/views/users`   | (서버/뷰) 사용자 관련 페이지 템플릿 관리                         |
|  `/views/videos`  | (서버/뷰) 비디오 관련 페이지 템플릿 관리                         |
|    `/uploads`     | (로컬 저장소) 로컬에서 업로드된 이미지, 동영상 파일 저장         |
|   .dockerignore   | Docker 빌드 시 제외할 파일/디렉토리 정의                         |
|       .env        | 환경 변수 정의                                                   |
|    .gitignore     | Git에서 추적하지 않을 파일/디렉토리 정의                         |
|    Dockerfile     | Docker 이미지를 빌드하기 위한 설정 파일                          |
|     README.md     | 리드미 파일                                                      |
| babel.config.json | ES6+ 코드를 변환하기 위한 Babel 설정 파일                        |
|     fly.toml      | Fly.io 배포 관련 설정 파일                                       |
|   nodemon.json    | 개발 중 서버를 자동으로 재시작하는 데 사용하는 Nodemon 설정 파일 |
| package-lock.json | npm 의존성 트리를 잠그기 위한 파일                               |
|   package.json    | 프로젝트의 의존성과 스크립트 등 관리                             |
| webpack.config.js | 클라이언트 자바스크립트 파일을 번들링하기 위한 웹팩 설정 파일    |

<br/>

## 화면 구성

|메인 페이지<br/>`/`|동영상 페이지<br/>`/videos/:id`| 
|:--:|:--:|
|<img width="600" alt="메인" src="https://github.com/user-attachments/assets/20de681d-99b9-48f3-9434-49ecb53e9dce">|<img width="600" alt="동영상" src="https://github.com/user-attachments/assets/4f90fe58-bc61-477d-a454-30e18d53e290">|
|로그인 페이지<br/>`/login`|회원가입 페이지<br/>`/join`| 
|<img width="600" alt="로그인" src="https://github.com/user-attachments/assets/5d6aee8a-ae07-4658-be69-2bf753f0d621">|<img width="600" alt="회원가입" src="https://github.com/user-attachments/assets/1132d2ec-9982-4581-94ce-d10c2472cc11">|
|검색 페이지<br/>`/search?keyword=`|동영상 업로드 페이지<br/>`/videos/upload`| 
|<img width="600" alt="검색" src="https://github.com/user-attachments/assets/dd11e34a-a2da-4f0f-bbba-b4cc4c5e7833">|<img width="600" alt="동영상 녹화" src="https://github.com/user-attachments/assets/519ee8a0-4be6-4c1e-8b15-ca6f576fe2ef">|
|유저 별 페이지<br/>`/users/:id`|프로필 변경 페이지<br/>`/users/edit`| 
|<img width="600" alt="유저 페이지" src="https://github.com/user-attachments/assets/02d80347-6c8d-4973-8e8f-ba55da23347d">|<img width="300" alt="프로필 변경" src="https://github.com/user-attachments/assets/2423a06c-7498-4d84-93d0-e91d8cd4d707"><img width="300" alt="프로필 변경 시" src="https://github.com/user-attachments/assets/7371c032-d0a6-4d2f-9279-631c966d04a4">|

<br />

<br />

## 주요 기능

#### 1. 회원가입 및 로그인
- ID/PW 통한 회원 가입 및 로그인 기능
- Github OAuth 소셜 로그인 지원
- 폼 유효성 검증
- 로그인/로그아웃 시 알림창 기능

#### 2. 동영상 검색 기능
- 상단 검색바에서 동영상 제목 키워드 검색 기능

#### 3. 동영상 전체 조회
- 반응형 웹 디자인 통해 다양한 화면 크기에 맞는 UI 제공
- 최근 업로드된 동영상 기준으로 전체 동영상 조회

#### 4. 동영상 상세 조회 및 댓글 조회
- 동영상 상세 페이지에서 비디오 및 댓글 조회 기능
- 동영상 조회수 증가 기능
- HTMLMediaElement API 활용한 비디오 컨트롤러 기능 제공
- KeyboardEvent 활용한 키보드 숏컷 기능 제공 (재생, 일시정지, 앞으로, 뒤로, 뮤트, 언뮤트, 전체화면 등)

#### 5. 동영상 업로드
- 웹캠 실시간 녹화 및 다운로드 기능 제공
- multer 사용해 AWS S3에 동영상 및 썸네일 업로드

#### 6. 프로필 변경
- 유저 프로필 사진 및 닉네임 변경 기능
- 프로필 변경 시 알림창 기능

<br />

## 트러블 슈팅
### 1. 조건문 사용하여 비밀번호 재해싱되는 문제 해결
- 문제 발생
사용자가 비디오를 업로드 하고 나면, 사용자의 비밀번호가 또 해싱되기 때문에 다음 번에 로그인을 못하는 상황이 발생했다.

- 문제 이유
```js
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});
```
비디오 업로드시, 유저 정보에 있는 비디오 어레이에 비디오 아이디 업데이트 하며 `user.save()`를 사용하고 있었다. 이를 실행할 때 마다 비밀번호 해싱코드가 실행되고 있었기 때문에 사용자의 해시된 비밀번호가 또 해시되는 문제가 발생했다.

- 해결 방법
```js
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});
```
비밀번호가 수정될 때만 새로 해시될 수 있도록 미들웨어에 조건문을 추가했다.

### 2. 클래스네임 설정으로 유저 이미지 좌우로 늘어나는 버그 해결
- 문제 발생
메인 화면에서 사용자 이미지가 좌우로 늘어나는 현상이 있었다.

- 문제 이유
<img width="245" alt="이미지오류" src="https://github.com/user-attachments/assets/38f10262-86ab-44d4-8392-c279e50c5a4d">
인스펙션애서 이미지를 클릭해보니 이미지에 설정해둔 width가 적용되지 않고, video-mixin div 안의 img 태그에 설정해둔 width가 적용되고 있었다.

- 해결 방법
video-mixin div 안의 img 태그에 새로운 클래스네임을 주어 문제를 해결했다.
