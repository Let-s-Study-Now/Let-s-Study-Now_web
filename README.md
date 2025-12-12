# 📚 Let's Study Now

즉석 스터디 그룹 매칭 웹사이트  
실시간으로 스터디 그룹을 매칭해주는 웹사이트입니다.  
언제든지 접속해서 다른 사람들과 함께 공부할 수 있는 환경을 제공합니다. ✨

<img src="./mainlogo.svg" width="500" height="500" alt="로고">

---

## 👤 사용자 계정 / 회원 관리

- 회원가입
- 로그인
- 프로필 관리 (사진 등록 가능)

---

## 🤝 그룹 매칭 / 참여

- **오픈 스터디 참여**

  - 공용 스터디룸에 자유롭게 입장
  - 매칭을 기다릴 필요 없이 즉시 시작 가능

- **그룹 스터디 참여**

  - 공부 시간 설정: 30분, 1시간, 2시간 등
  - 같은 공부시간을 설정한 사용자끼리 자동 매칭
  - 모두 함께 시작하고 목표 시간이 정해져 있음

- **URL 공유 매칭**

  - 공유 링크를 통해 친구들을 직접 초대

- **스터디룸 퇴장**

---

## 🖥 스터디룸 기능

- **공부 상태 표시 (공부 / 휴식)**

  - 버튼을 눌러 자신의 상황을 다른 사용자에게 알림

- **타이머 기능**

  - 원하는 공부 시간과 휴식 시간 설정 가능
  - 자동으로 공부 상태 변경
  - 반복적으로 사용자에게 알림 전송

- **상태메시지 등록**
  - 현재 기분이나 상황을 다른 사용자들과 간단히 공유

---

## 📝 추가 기능

- **체크리스트**

  - 오늘 할 공부 목록이나 할 일 관리
  - 체크리스트 생성 / 수정 / 완료 표시 / 순서 변경 / 조회

- **디데이 설정**

  - 시험일, 과제 마감일 등 중요한 날짜 등록
  - 남은 시간 확인 가능

- **스터디 기록 조회**

- **체크리스트 달성률 조회**

---

## 🚀 목표

"Let's Study Now"는 혼자가 아닌 함께하는 공부 문화를 만들어  
사용자가 꾸준히 목표를 달성할 수 있도록 돕는 것을 목표로 합니다.

# Project Build Guide

## Tech Stack

This project is built using the following technologies:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Prerequisites

Make sure your system has Node.js and npm installed.

We recommend using nvm to install Node.js: [nvm Installation Guide](https://github.com/nvm-sh/nvm#installing-and-updating)

## Install Dependencies

```sh
npm install
```

## Development Server

Start the development server with hot reload and instant preview:

```sh
npm run dev
```

## Build Project

Build for production:

```sh
npm run build
```

## Preview Build

Preview the built project:

```sh
npm run preview
```

## Project Structure

```
│  .gitignore
│  components.json
│  eslint.config.js
│  favicon.png
│  index.html
│  package-lock.json
│  package.json
│  postcss.config.js
│  README.md
│  tailwind.config.ts
│  tsconfig.app.json
│  tsconfig.json
│  tsconfig.node.json
│  vite.config.ts
│
├─examples
│  └─third-party-integrations
│      │  README.md
│      │
│      └─stripe
│              CheckoutForm.tsx
│              README.md
│
├─public
│      favicon.ico
│      placeholder.svg
│      robots.txt
│
├─src
│  │  App.css
│  │  App.tsx
│  │  index.css
│  │  main.tsx
│  │  vite-env.d.ts
│  │
│  ├─components
│  │  │  Navbar.tsx
│  │  │
│  │  └─ui
│  │          accordion.tsx
│  │          alert-dialog.tsx
│  │          alert.tsx
│  │          aspect-ratio.tsx
│  │          avatar.tsx
│  │          badge.tsx
│  │          breadcrumb.tsx
│  │          button.tsx
│  │          calendar.tsx
│  │          card.tsx
│  │          carousel.tsx
│  │          chart.tsx
│  │          checkbox.tsx
│  │          collapsible.tsx
│  │          command.tsx
│  │          context-menu.tsx
│  │          dialog.tsx
│  │          drawer.tsx
│  │          dropdown-menu.tsx
│  │          form.tsx
│  │          hover-card.tsx
│  │          input-otp.tsx
│  │          input.tsx
│  │          label.tsx
│  │          menubar.tsx
│  │          navigation-menu.tsx
│  │          pagination.tsx
│  │          popover.tsx
│  │          progress.tsx
│  │          radio-group.tsx
│  │          resizable.tsx
│  │          scroll-area.tsx
│  │          select.tsx
│  │          separator.tsx
│  │          sheet.tsx
│  │          sidebar.tsx
│  │          skeleton.tsx
│  │          slider.tsx
│  │          sonner.tsx
│  │          switch.tsx
│  │          table.tsx
│  │          tabs.tsx
│  │          textarea.tsx
│  │          toast.tsx
│  │          toaster.tsx
│  │          toggle-group.tsx
│  │          toggle.tsx
│  │          tooltip.tsx
│  │          use-toast.ts
│  │
│  ├─contexts
│  │      AuthContext.tsx
│  │
│  ├─hooks
│  │      use-mobile.tsx
│  │      use-toast.ts
│  │
│  ├─lib
│  │      api.ts
│  │      react-router-dom-proxy.tsx
│  │      utils.ts
│  │      websocket.ts
│  │
│  └─pages
│          Checklist.tsx
│          GroupStudy.tsx
│          GroupStudyRoom.tsx
│          Index.tsx
│          Login.tsx
│          NotFound.tsx
│          OpenStudy.tsx
│          OpenStudyRoom.tsx
│          Profile.tsx
│          Register.tsx
│
└─supabase
    ├─edge_function
    │  │  deno.json
    │  │  deps.ts
    │  │
    │  └─tests
    │          env.example
    │          README.md
    │
    └─migrations
            create_users_profile_table_2025_11_05_07_41.sql
```

