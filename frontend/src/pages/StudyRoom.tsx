import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { openStudyAPI, studyRoomAPI } from "@/lib/api";
import {
  Users,
  Clock,
  Send,
  Image as ImageIcon,
  LogOut,
  Play,
  Pause,
  Square,
  Copy,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

interface Participant {
  id: string;
  username: string;
  profileImage?: string;
  level: number;
  status: "studying" | "resting" | "away";
  statusMessage: string;
  statusDuration: number;
  totalTime: number;
}

interface ChatMessage {
  id: string;
  type: "text" | "image" | "system";
  sender?: string;
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

const StudyRoom: React.FC = () => {
  const { user } = useAuth();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasJoinedRef = useRef(false);

  // Room Info
  const [roomInfo, setRoomInfo] = useState({
    title: "알고리즘 마스터 스터디",
    studyField: "프로그래밍",
    currentParticipants: 3,
    maxParticipants: 6,
    remainingTime: 7530,
    createdBy: "",
    creatorUsername: "",
  });

  // Participants
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "1",
      username: "김철수",
      level: 5,
      status: "studying",
      statusMessage: "알고리즘 문제 풀이 중...",
      statusDuration: 1500,
      totalTime: 5025,
    },
    {
      id: "2",
      username: "이영희",
      level: 3,
      status: "resting",
      statusMessage: "잠깐 쉬는 중",
      statusDuration: 300,
      totalTime: 7893,
    },
  ]);

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "system",
      content: "스터디룸에 입장했습니다.",
      timestamp: new Date(),
    },
  ]);
  const [messageInput, setMessageInput] = useState("");

  // My Status
  const [myStatus, setMyStatus] = useState<"studying" | "resting">("studying");
  const [myStatusMessage, setMyStatusMessage] = useState("");

  // Timer
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [studyMinutes, setStudyMinutes] = useState(25);
  const [restMinutes, setRestMinutes] = useState(5);
  const [currentTimerType, setCurrentTimerType] = useState<"study" | "rest">(
    "study"
  );
  const [timerSeconds, setTimerSeconds] = useState(studyMinutes * 60);

  // Today's Stats
  const [todayStats, setTodayStats] = useState({
    totalStudyTime: 0,
    studySessions: 0,
    restSessions: 0,
  });

  // Dialogs
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);

  // 시간 포맷 함수
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // 채팅 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ 방 입장 처리
  useEffect(() => {
    if (!user || !roomId || hasJoinedRef.current) return;

    const joinRoom = async () => {
      try {
        hasJoinedRef.current = true;
        console.log("Joined room:", roomId);
      } catch (error) {
        console.error("Failed to join room:", error);
        navigate("/open-study");
      }
    };

    joinRoom();
  }, [user, roomId, navigate]);

  // ✅ 브라우저 뒤로가기/새로고침/닫기 시 방 나가기
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (roomId && hasJoinedRef.current) {
        const baseURL =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
        const url = `${baseURL}/api/open-study/rooms/${roomId}/leave`;

        fetch(url, {
          method: "POST",
          credentials: "include",
          keepalive: true,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }).catch((err) => console.error("Failed to leave room:", err));
      }
    };

    const handlePopState = async () => {
      if (roomId && hasJoinedRef.current) {
        try {
          await leaveRoom();
        } catch (error) {
          console.error("Failed to leave room on back:", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);

      if (roomId && hasJoinedRef.current) {
        leaveRoom();
      }
    };
  }, [roomId]);

  // ✅ 방 나가기 함수
  const leaveRoom = async () => {
    if (!roomId) return;

    try {
      await openStudyAPI.leaveRoom(roomId);
      localStorage.removeItem("currentStudyRoom");
      hasJoinedRef.current = false;
      console.log("Left room:", roomId);
    } catch (error) {
      console.error("Failed to leave room:", error);

      try {
        await studyRoomAPI.leaveRoom(roomId);
        localStorage.removeItem("currentStudyRoom");
        hasJoinedRef.current = false;
      } catch (groupError) {
        console.error("Failed to leave group room:", groupError);
      }
    }
  };

  // ✅ 방 삭제 함수 (방장 전용)
  const deleteRoom = async () => {
    if (!roomId) return;

    try {
      try {
        await openStudyAPI.deleteRoom(roomId);
        console.log("Open study room deleted:", roomId);

        toast({
          title: "방 삭제 완료",
          description: "스터디 방이 삭제되었습니다.",
        });
        return;
      } catch (openError) {
        console.log("Not an open study room, trying group room...");
      }

      await studyRoomAPI.deleteRoom(roomId);
      console.log("Group study room deleted:", roomId);

      toast({
        title: "방 삭제 완료",
        description: "스터디 방이 삭제되었습니다.",
      });
    } catch (error: any) {
      console.error("Failed to delete room:", error);
      toast({
        title: "오류",
        description: error?.message || "방 삭제에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  // ✅ 타이머 로직
  useEffect(() => {
    if (timerRunning && !timerPaused) {
      const interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timerRunning, timerPaused]);

  // 타이머 완료 처리
  const handleTimerComplete = () => {
    const newType = currentTimerType === "study" ? "rest" : "study";
    const newSeconds =
      newType === "study" ? studyMinutes * 60 : restMinutes * 60;

    setCurrentTimerType(newType);
    setTimerSeconds(newSeconds);

    toast({
      title: "🎉 타이머 완료!",
      description: `${
        currentTimerType === "study" ? "공부" : "휴식"
      } 세션 완료! +10 경험치`,
    });

    if (currentTimerType === "study") {
      setTodayStats((prev) => ({
        ...prev,
        studySessions: prev.studySessions + 1,
        totalStudyTime: prev.totalStudyTime + studyMinutes * 60,
      }));
    } else {
      setTodayStats((prev) => ({
        ...prev,
        restSessions: prev.restSessions + 1,
      }));
    }

    addSystemMessage(
      `타이머가 ${currentTimerType === "study" ? "공부" : "휴식"} 세션에서 ${
        newType === "study" ? "공부" : "휴식"
      } 세션으로 자동 전환되었습니다.`
    );
  };

  // 타이머 시작
  const handleTimerStart = () => {
    if (!timerRunning) {
      setTimerSeconds(
        currentTimerType === "study" ? studyMinutes * 60 : restMinutes * 60
      );
    }
    setTimerRunning(true);
    setTimerPaused(false);
  };

  // 타이머 일시정지
  const handleTimerPause = () => {
    setTimerPaused(true);
  };

  // 타이머 중지
  const handleTimerStop = () => {
    setTimerRunning(false);
    setTimerPaused(false);
    setTimerSeconds(
      currentTimerType === "study" ? studyMinutes * 60 : restMinutes * 60
    );
  };

  // ✅ 상태 전환 (자동 타이머 ON/OFF)
  const handleStatusToggle = (newStatus: "studying" | "resting") => {
    const previousStatus = myStatus;
    setMyStatus(newStatus);

    // ✅ 상태에 맞춰 타이머 타입 변경
    if (newStatus === "studying") {
      setCurrentTimerType("study");
      setTimerSeconds(studyMinutes * 60);

      // ✅ 공부 모드로 전환 시 자동 타이머 시작
      if (!timerRunning) {
        setTimerRunning(true);
        setTimerPaused(false);
      }
    } else {
      setCurrentTimerType("rest");
      setTimerSeconds(restMinutes * 60);

      // ✅ 휴식 모드로 전환 시 타이머 중지
      setTimerRunning(false);
      setTimerPaused(false);
    }

    addSystemMessage(
      `${user?.username}님이 ${
        newStatus === "studying" ? "공부" : "휴식"
      } 모드로 전환했습니다.`
    );

    toast({
      title: previousStatus === "studying" ? "휴식 시작" : "공부 시작",
      description: `${
        newStatus === "studying"
          ? "타이머가 시작되었습니다"
          : "타이머가 중지되었습니다"
      }`,
    });
  };

  // 상태 메시지 업데이트
  const handleStatusMessageUpdate = () => {
    if (myStatusMessage.trim()) {
      toast({
        title: "상태 메시지 업데이트",
        description: "상태 메시지가 변경되었습니다.",
      });
    }
  };

  // 메시지 전송
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "text",
      sender: user?.username || "익명",
      content: messageInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageInput("");
  };

  // 시스템 메시지 추가
  const addSystemMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "system",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // ✅ 이미지 업로드
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "오류",
        description: "이미지 크기는 10MB를 초과할 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    // 이미지 미리보기 생성
    const imageUrl = URL.createObjectURL(file);

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "image",
      sender: user?.username || "익명",
      content: "",
      imageUrl,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    toast({
      title: "이미지 전송",
      description: "이미지가 전송되었습니다.",
    });
  };

  // 초대 링크 복사
  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/#/room/${roomId}`;
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "초대 링크 복사 완료",
      description: "초대 링크가 클립보드에 복사되었습니다.",
    });
  };

  // 방 나가기
  const handleExitRoom = async () => {
    if (!roomId) return;

    const isCreator =
      user &&
      (roomInfo.createdBy === user.id ||
        roomInfo.creatorUsername === user.username);

    if (isCreator) {
      const confirmDelete = confirm(
        "방장이 나가면 방이 삭제됩니다.\n정말로 방을 삭제하시겠습니까?"
      );

      if (!confirmDelete) {
        return;
      }

      await deleteRoom();
    } else {
      // ✅ 일반 참여자는 leaveRoom 호출
      await leaveRoom();

      toast({
        title: "안내",
        description: "방을 나갔습니다.",
      });
    }

    localStorage.removeItem("currentStudyRoom");
    hasJoinedRef.current = false;

    setTimeout(() => {
      navigate("/open-study");
    }, 100);
  };

  // 상태별 색상
  const getStatusColor = (status: "studying" | "resting" | "away") => {
    switch (status) {
      case "studying":
        return "bg-green-500";
      case "resting":
        return "bg-orange-500";
      case "away":
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: "studying" | "resting" | "away") => {
    switch (status) {
      case "studying":
        return "공부중";
      case "resting":
        return "휴식중";
      case "away":
        return "자리비움";
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">{roomInfo.title}</h1>
          <Badge variant="secondary">{roomInfo.studyField}</Badge>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="font-medium">
              {formatTime(roomInfo.remainingTime)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* ✅ 참여자 수 클릭 시 목록 팝업 */}
          <Sheet open={participantsOpen} onOpenChange={setParticipantsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span className="font-medium">
                  {roomInfo.currentParticipants}/{roomInfo.maxParticipants}
                </span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  참여자 목록 ({participants.length}/{roomInfo.maxParticipants})
                </SheetTitle>
                <SheetDescription>
                  현재 스터디룸에 참여 중인 멤버들입니다
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                {participants.map((participant) => (
                  <Card key={participant.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarImage src={participant.profileImage} />
                          <AvatarFallback>
                            {participant.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-gray-900">
                              {participant.username}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              Lv.{participant.level}
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-2 mt-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor(
                                participant.status
                              )}`}
                            />
                            <span className="text-sm text-gray-600">
                              {getStatusText(participant.status)} (
                              {formatTime(participant.statusDuration)})
                            </span>
                          </div>

                          {participant.statusMessage && (
                            <p className="text-sm text-gray-500 mt-1 italic truncate">
                              "{participant.statusMessage}"
                            </p>
                          )}

                          <div className="flex items-center text-xs text-gray-500 mt-2">
                            <Clock className="w-3 h-3 mr-1" />총{" "}
                            {formatTime(participant.totalTime)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setInviteDialogOpen(true)}
          >
            <Users className="w-4 h-4 mr-2" />
            초대
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExitDialogOpen(true)}
          >
            <LogOut className="w-4 h-4 mr-2" />
            나가기
          </Button>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 채팅 영역 */}
        <div className="flex-1 flex flex-col">
          {/* 채팅 메시지 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.type === "system" ? (
                  <div className="text-center text-sm text-gray-500 py-2">
                    {message.content}
                  </div>
                ) : (
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {message.sender?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">
                          {message.sender}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {message.type === "text" && (
                        <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                          <p className="text-gray-900">{message.content}</p>
                        </div>
                      )}

                      {message.type === "image" && (
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <img
                            src={message.imageUrl}
                            alt="uploaded"
                            className="max-w-xs rounded cursor-pointer hover:opacity-90"
                            onClick={() => window.open(message.imageUrl)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* 채팅 입력 */}
          <div className="border-t bg-white p-4">
            <div className="flex items-center space-x-2">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                id="image-upload"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
              <Input
                placeholder="메시지를 입력하세요..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 나의 컨트롤 패널 */}
          <div className="border-t bg-gray-50 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">나의 컨트롤</h3>

            {/* ✅ 상태 토글 (자동 타이머) */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                variant={myStatus === "studying" ? "default" : "outline"}
                className={
                  myStatus === "studying"
                    ? "bg-green-500 hover:bg-green-600"
                    : ""
                }
                onClick={() => handleStatusToggle("studying")}
              >
                🟢 공부중
              </Button>
              <Button
                variant={myStatus === "resting" ? "default" : "outline"}
                className={
                  myStatus === "resting"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : ""
                }
                onClick={() => handleStatusToggle("resting")}
              >
                🟡 휴식중
              </Button>
            </div>

            {/* 상태 메시지 */}
            <div className="mb-4">
              <Label className="text-sm text-gray-600 mb-2">상태 메시지</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="상태 메시지 (최대 50자)"
                  value={myStatusMessage}
                  onChange={(e) =>
                    setMyStatusMessage(e.target.value.slice(0, 50))
                  }
                  maxLength={50}
                />
                <Button onClick={handleStatusMessageUpdate}>적용</Button>
              </div>
              <p className="text-xs text-gray-500 text-right mt-1">
                {myStatusMessage.length}/50
              </p>
            </div>

            {/* 타이머 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  학습 타이머
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">공부 시간</Label>
                    <select
                      className="w-full p-2 border rounded mt-1"
                      value={studyMinutes}
                      onChange={(e) => setStudyMinutes(Number(e.target.value))}
                      disabled={timerRunning}
                    >
                      <option value={10}>10분</option>
                      <option value={25}>25분</option>
                      <option value={50}>50분</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">휴식 시간</Label>
                    <select
                      className="w-full p-2 border rounded mt-1"
                      value={restMinutes}
                      onChange={(e) => setRestMinutes(Number(e.target.value))}
                      disabled={timerRunning}
                    >
                      <option value={5}>5분</option>
                      <option value={10}>10분</option>
                      <option value={15}>15분</option>
                    </select>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    {currentTimerType === "study" ? "공부 중" : "휴식 중"}
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {formatTime(timerSeconds)}
                  </p>
                </div>

                <div className="flex space-x-2">
                  {!timerRunning || timerPaused ? (
                    <Button className="flex-1" onClick={handleTimerStart}>
                      <Play className="w-4 h-4 mr-2" />
                      {timerRunning ? "재개" : "시작"}
                    </Button>
                  ) : (
                    <Button
                      className="flex-1"
                      variant="outline"
                      onClick={handleTimerPause}
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      일시정지
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleTimerStop}
                    disabled={!timerRunning}
                  >
                    <Square className="w-4 h-4 mr-2" />
                    중지
                  </Button>
                </div>

                {/* 오늘의 학습 기록 */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      📊 오늘의 학습 기록
                    </span>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>총 학습 시간:</span>
                      <span className="font-medium">
                        {formatTime(todayStats.totalStudyTime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>공부 세션:</span>
                      <span className="font-medium">
                        {todayStats.studySessions}회
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>휴식 세션:</span>
                      <span className="font-medium">
                        {todayStats.restSessions}회
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 초대 다이얼로그 */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🎉 친구 초대하기</DialogTitle>
            <DialogDescription>
              친구들을 초대하여 함께 공부하세요!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2">초대 링크</Label>
              <div className="flex space-x-2">
                <Input
                  readOnly
                  value={`${window.location.origin}/#/room/${roomId}`}
                  className="flex-1"
                />
                <Button onClick={handleCopyInviteLink}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 나가기 확인 다이얼로그 */}
      <Dialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>스터디룸 나가기</DialogTitle>
            <DialogDescription>
              정말로 스터디룸을 나가시겠습니까?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setExitDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleExitRoom}>
              나가기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudyRoom;