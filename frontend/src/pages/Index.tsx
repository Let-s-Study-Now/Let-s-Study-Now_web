import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, CheckSquare, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const studyHighlights = [
    {
      id: "open",
      label: "오픈 스터디",
      icon: Users,
      badge: "실시간 공개 스터디",
      description:
        "누구나 바로 입장해 집중 모드를 켜고 실시간으로 공부 현황을 공유할 수 있어요.",
      points: [
        "주제 태그로 목표가 같은 참여자와 매칭",
        "공부 타이머 · 화이트보드 · 캡쳐 로그 제공",
        "집중 세션마다 리포트 자동 생성",
      ],
      actionLabel: "오픈 스터디 참여하기",
      actionPath: "/open-study",
      accent: "from-indigo-500 to-blue-500",
    },
    {
      id: "group",
      label: "그룹 스터디",
      icon: BookOpen,
      badge: "친구들과 함께하는 그룹",
      description:
        "고정 멤버와 스터디 일정을 만들고, 자료 공유와 출석 체크로 꾸준함을 이어가요.",
      points: [
        "그룹 캘린더와 리마인더로 일정 관리",
        "자료/과제 공유, 체크리스트로 체계적인 진행",
        "그룹 전용 피드백과 배지로 동기부여",
      ],
      actionLabel: "그룹 스터디 만들기",
      actionPath: "/group-study",
      accent: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 text-white">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-8 md:justify-start">
            {/* 텍스트 + 버튼 (왼쪽) */}
            <div className="text-center md:text-left max-w-xl flex-1 flex flex-col justify-center">
              <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
                Study Together
              </p>
              <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight drop-shadow-sm">
                Let's Study Now!
              </h1>
              <p className="mt-6 text-lg md:text-2xl text-white/85">
                혼자 공부하기 어려우신가요?
                <span className="block mt-2">
                  함께 공부하며 동기부여를 받아보세요!
                </span>
              </p>

              {!user ? (
                <div className="mt-10 flex flex-col sm:flex-row gap-4 md:justify-start justify-center">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg shadow-indigo-900/20"
                    onClick={() => navigate("/register")}
                  >
                    지금 시작하기
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-white/70 text-white hover:bg-white/10"
                    onClick={() => navigate("/login")}
                  >
                    로그인
                  </Button>
                </div>
              ) : (
                <div className="mt-10">
                  <p className="text-lg mb-4 text-white/90">
                    안녕하세요, {user.username}님!
                  </p>
                  <Button
                    size="lg"
                    className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg shadow-indigo-900/15"
                    onClick={() => navigate("/open-study")}
                  >
                    스터디 시작하기
                  </Button>
                </div>
              )}
            </div>
            
            {/* Hero decorative elements (오른쪽) */}
            <div className="hidden md:flex justify-center md:justify-end flex-shrink-0 w-full md:w-auto">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* 큰 원형 그라디언트 */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-white/10 to-transparent blur-3xl" />
                
                {/* 중앙 원형 패턴 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-white/10 border-2 border-white/30 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20" />
                  </div>
                </div>
                
                {/* 주변 장식 원들 */}
                <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm" />
                <div className="absolute top-12 right-8 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm" />
                <div className="absolute bottom-8 left-8 w-14 h-14 rounded-full bg-white/12 border border-white/25 backdrop-blur-sm" />
                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm" />
                
                {/* 연결선 효과 */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M64 64 Q128 96 192 64"
                    stroke="url(#lineGrad)"
                    strokeWidth="2"
                    strokeDasharray="4 6"
                    fill="none"
                  />
                  <path
                    d="M64 192 Q128 160 192 192"
                    stroke="url(#lineGrad)"
                    strokeWidth="2"
                    strokeDasharray="4 6"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Profile highlight - placed above study tabs */}
        <div className="mb-12 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-purple-50 to-white p-6 md:p-8 shadow-sm">
          {user ? (
            <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr] items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="shrink-0">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="프로필"
                      className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                      {user.username?.charAt(0)?.toUpperCase() ?? "U"}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-indigo-600">
                    My Study Profile
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {user.username}
                  </h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    {(user.studyFields && user.studyFields.length > 0
                      ? user.studyFields
                      : ["관심 분야를 설정해보세요"]
                    ).map((field, idx) => (
                      <span
                        key={`${field}-${idx}`}
                        className="px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600"
                      >
                        #{field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white border border-indigo-100 rounded-2xl p-5 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  {[
                    { label: "이번 주", value: "8h 30m" },
                    { label: "연속 출석", value: "7일" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl bg-slate-50 py-3 px-2"
                    >
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-gray-600">
                  다음 스터디 일정과 루틴을 간단히 확인하세요.
                </div>
                <Button
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => navigate("/profile")}
                >
                  프로필 수정
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr] items-center">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-600">
                    스터디 프로필 안내
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    프로필을 설정해 공부 루틴을 저장하세요
                  </h3>
                </div>
              </div>
              <div className="bg-white border border-indigo-100 rounded-2xl p-6 flex flex-col gap-4">
                <div>
                  <p className="text-sm text-gray-500">현재 상태</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    프로필이 아직 설정되지 않았어요
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    프로필을 작성하면 학습 히스토리와 뱃지를 수집할 수 있어요.
                  </p>
                </div>
                <Button
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => navigate("/profile")}
                >
                  프로필 설정하기
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Study participation guide - all in one box */}
        <div className="mb-12 rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-white border-2 border-indigo-200 shadow-2xl overflow-hidden">
          {/* Header section */}
          <div className="px-8 py-6 md:px-16 md:py-8 text-center border-b-2 border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
            <div className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg">
              스터디 참여 가이드
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              다양한 스터디 방식
            </h2>
            <p className="mt-3 text-base md:text-lg text-gray-700 max-w-2xl mx-auto font-medium">
              <span className="font-bold text-indigo-700">오픈 스터디</span>와{" "}
              <span className="font-bold text-emerald-700">그룹 스터디</span>{" "}
              중, 나에게 맞는 방식을 골라 함께 공부하세요.
            </p>
            <div className="mt-6 grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-3 text-sm font-medium">
              {[
                "실시간 집중",
                "친구들과 일정 공유",
                "집중 리포트",
                "출석/배지 시스템",
              ].map((chip) => (
                <span
                  key={chip}
                  className="px-5 py-2 rounded-2xl bg-white/80 border-2 border-indigo-200 text-indigo-700 shadow-sm"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Study cards */}
          <div className="divide-y-2 divide-indigo-100">
            {studyHighlights.map((study) => {
              const Icon = study.icon;
              return (
                <div
                  key={study.id}
                  className="grid lg:grid-cols-2 bg-white/50 hover:bg-white/80 transition-colors"
                >
                  <div className="py-8 px-12 md:py-10 md:px-20">
                    <span
                      className={`inline-flex items-center px-4 py-2 text-sm font-bold text-white rounded-full bg-gradient-to-r ${study.accent} shadow-lg`}
                    >
                      {study.badge}
                    </span>
                    <div className="mt-6 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 shadow-md">
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                        {study.label}
                      </h3>
                    </div>
                    <p className="mt-6 text-gray-700 text-lg font-medium leading-relaxed">{study.description}</p>
                  </div>
                  <div className="border-t-2 lg:border-t-0 lg:border-l-2 border-indigo-200 bg-gradient-to-br from-slate-50 to-indigo-50/30 py-8 px-12 md:py-10 md:px-20">
                    <div className="rounded-3xl bg-white border-2 border-indigo-200 shadow-xl p-8 space-y-5">
                      <ul className="space-y-5 text-base text-gray-700">
                        {study.points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-4">
                            <span className="mt-2 h-3 w-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex-shrink-0 shadow-sm" />
                            <span className="text-base font-medium leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        size="lg"
                        className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 h-12 text-base font-bold shadow-lg hover:shadow-xl transition-all"
                        onClick={() => navigate(study.actionPath)}
                      >
                        {study.actionLabel}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Checklist highlight - same layout as study methods */}
        <div className="mt-12 rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-white border-2 border-purple-200 shadow-2xl overflow-hidden">
          {/* Header section */}
          <div className="px-8 py-6 md:px-16 md:py-8 text-center border-b-2 border-purple-100 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
            <div className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg">
              학습 관리 도구
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              체크리스트
            </h2>
            <p className="mt-3 text-base md:text-lg text-gray-700 max-w-2xl mx-auto font-medium">
              <span className="font-bold text-purple-700">오늘의 목표</span>를 정리하고{" "}
              <span className="font-bold text-purple-700">달성률</span>을 관리해 학습 루틴을 완성하세요.
            </p>
            <div className="mt-6 grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-3 text-sm font-medium">
              {[
                "목표 설정",
                "달성률 추적",
                "집중 기록",
                "루틴 관리",
              ].map((chip) => (
                <span
                  key={chip}
                  className="px-5 py-2 rounded-2xl bg-white/80 border-2 border-purple-200 text-purple-700 shadow-sm"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Checklist card */}
          <div className="grid lg:grid-cols-2 bg-white/50 hover:bg-white/80 transition-colors">
            <div className="py-8 px-12 md:py-10 md:px-20">
              <span className="inline-flex items-center px-4 py-2 text-sm font-bold text-white rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                학습 목표 관리
              </span>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-purple-600 shadow-md">
                  <CheckSquare className="w-8 h-8" />
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  체크리스트
                </h3>
              </div>
              <p className="mt-6 text-gray-700 text-lg font-medium leading-relaxed">
                해야 할 일을 하나씩 체크하고, 집중 기록과 리포트로 학습 루틴을 완성해보세요.
              </p>
              
              {/* 통계 정보 */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {user ? (
                  <>
                    <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-5 shadow-md">
                      <p className="text-xs text-gray-500 font-medium">오늘 완료</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">3 / 4</p>
                      <p className="text-xs text-purple-600 mt-1 font-semibold">
                        3개 완료
                      </p>
                    </div>
                    <div className="rounded-2xl border-2 border-purple-200 bg-white p-5 flex flex-col items-center justify-center shadow-md">
                      <div className="relative w-20 h-20">
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              "conic-gradient(#a855f7 0deg, #a855f7 270deg, #ede9fe 270deg)",
                          }}
                        />
                        <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center">
                          <span className="text-xl font-bold text-gray-900">75%</span>
                          <span className="text-[10px] text-gray-500">달성률</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-2xl border-2 border-purple-200 bg-slate-50 p-5 flex flex-col items-center justify-center">
                      <p className="text-xs text-gray-400">오늘 완료</p>
                      <p className="text-sm text-gray-400 mt-2">-</p>
                    </div>
                    <div className="rounded-2xl border-2 border-purple-200 bg-slate-50 p-5 flex flex-col items-center justify-center">
                      <p className="text-xs text-gray-400">달성률</p>
                      <p className="text-sm text-gray-400 mt-2">-</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="border-t-2 lg:border-t-0 lg:border-l-2 border-purple-200 bg-gradient-to-br from-slate-50 to-purple-50/30 py-8 px-12 md:py-10 md:px-20">
              <div className="rounded-3xl bg-white border-2 border-purple-200 shadow-xl p-8 space-y-5">
                <div>
                  <p className="text-base font-bold text-gray-700 mb-4">
                    체크리스트 미리보기
                  </p>
                  {user ? (
                    <>
                      <ul className="space-y-3 text-base text-gray-700">
                        {[
                          { task: "모닝 루틴 정리", status: "완료", completed: true },
                          { task: "강의 복습", status: "진행 중", completed: false },
                          { task: "문제 풀이 20문제", status: "진행 중", completed: false },
                        ].map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between bg-slate-50 rounded-xl border-2 border-purple-200 px-4 py-3 shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                                item.completed 
                                  ? "bg-purple-500 text-white" 
                                  : "bg-purple-50 text-purple-600"
                              }`}>
                                {item.completed ? "✓" : idx + 1}
                              </span>
                              <span className={item.completed ? "line-through text-gray-400" : ""}>
                                {item.task}
                              </span>
                            </div>
                            <span className={`text-xs ${
                              item.completed ? "text-purple-600 font-semibold" : "text-gray-500"
                            }`}>
                              {item.status}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-3 text-sm text-gray-600 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 px-4 py-3 mt-4 shadow-sm">
                        <span className="inline-flex items-center gap-1 text-purple-600 font-bold">
                          +1
                          <span className="text-gray-600 font-medium">집중 뱃지</span>
                        </span>
                        <span>·</span>
                        <span className="font-medium">연속 4일 달성 중</span>
                      </div>
                    </>
                  ) : (
                    <div className="bg-slate-50 rounded-xl border-2 border-purple-200 px-4 py-8 text-center shadow-sm">
                      <p className="text-base text-gray-500 font-medium">
                        로그인하면 체크리스트를 확인할 수 있어요
                      </p>
                    </div>
                  )}
                </div>
                
                <ul className="space-y-5 text-base text-gray-700 pt-4 border-t-2 border-purple-100">
                  {[
                    "목표를 추가하고 우선순위를 설정",
                    "체크 완료 시 달성률 자동 업데이트",
                    "집중 세션과 연동된 리포트 생성",
                  ].map((point, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <span className="mt-2 h-3 w-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0 shadow-sm" />
                      <span className="text-base font-medium leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  size="lg"
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 h-12 text-base font-bold shadow-lg hover:shadow-xl transition-all"
                  onClick={() => navigate("/checklist")}
                >
                  체크리스트 열기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                1,000+
              </div>
              <div className="text-gray-600">활성 사용자</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                5,000+
              </div>
              <div className="text-gray-600">완료된 스터디</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                10,000+
              </div>
              <div className="text-gray-600">학습 시간</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Let's Study Now! All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
