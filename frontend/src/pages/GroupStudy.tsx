import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  groupAPI,
  studyRoomAPI,
  Group,
  GroupStudyRoom,
  GroupMember,
} from "@/lib/api";
import { Users, Plus, Copy, Trash2, Clock, BookOpen, UserX } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STUDY_FIELDS = [
  "프로그래밍",
  "영어",
  "자격증",
  "공무원",
  "대학입시",
  "취업준비",
  "어학",
  "기타",
];

// ✅ 확장된 멤버 인터페이스
interface ExtendedGroupMember extends GroupMember {
  username?: string;
  nickname?: string;
  name?: string;
  profileImage?: string;
  profileImageUrl?: string;
}

const GroupStudy: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { groupId: inviteGroupId } = useParams<{ groupId?: string }>();
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [groupRooms, setGroupRooms] = useState<{
    [groupId: number]: GroupStudyRoom[];
  }>({});
  const [loading, setLoading] = useState(false);
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [createRoomDialogOpen, setCreateRoomDialogOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [selectedGroupForMembers, setSelectedGroupForMembers] = useState<Group | null>(null);
  const [groupMembers, setGroupMembers] = useState<ExtendedGroupMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<ExtendedGroupMember | null>(null);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<number | "all">("all");

  const [newGroup, setNewGroup] = useState({
    groupName: "",
  });

  const [newRoom, setNewRoom] = useState({
    roomName: "",
    maxMembers: 4,
    studyHours: 2,
    studyField: "프로그래밍",
  });

  useEffect(() => {
    if (user) {
      loadMyGroups();
    }
  }, [user]);

  // 초대 링크 처리
  useEffect(() => {
    const handleInviteLink = async () => {
      if (!inviteGroupId) return;

      const groupId = Number(inviteGroupId);
      if (isNaN(groupId)) return;

      if (!user) {
        const inviteLink = `${window.location.origin}/#/group-invite/${groupId}`;
        localStorage.setItem("pendingInvite", inviteLink);
        navigate("/login");
        return;
      }

      try {
        let isAlreadyMember = false;
        try {
          const members = await groupAPI.getMembers(groupId);
          isAlreadyMember = members.some((m) => m.memberId === Number(user.id));
        } catch (error) {
          console.error("멤버 목록 조회 실패:", error);
        }

        if (isAlreadyMember) {
          toast({
            title: "알림",
            description: "이미 그룹 멤버입니다.",
          });

          try {
            const group = await groupAPI.getGroup(groupId);
            setSelectedGroupForMembers(group);
            
            const members = await groupAPI.getMembers(groupId);
            const extendedMembers: ExtendedGroupMember[] = members.map((m: any) => ({
              ...m,
              username: m.username || m.nickname || m.name || `사용자${m.memberId}`,
              profileImage: m.profileImage || m.profileImageUrl || m.profile_image || m.profile_image_url
            }));
            setGroupMembers(extendedMembers);
            setMembersDialogOpen(true);
          } catch (error) {
            console.error("그룹 정보 조회 실패:", error);
          }

          navigate("/group-study", { replace: true });
          return;
        }

        let addSuccess = false;
        try {
          await groupAPI.addMember(groupId, Number(user.id));
          addSuccess = true;
        } catch (addError: any) {
          console.log("멤버 추가 시도:", addError?.message);
          
          if (addError?.status === 400) {
            addSuccess = true;
          }
        }

        await loadMyGroups();
        
        try {
          const group = await groupAPI.getGroup(groupId);
          
          toast({
            title: "성공",
            description: addSuccess ? "그룹에 참여했습니다." : "그룹 초대를 수락했습니다.",
          });

          setSelectedGroupForMembers(group);
          setLoadingMembers(true);
          
          const members = await groupAPI.getMembers(groupId);
          const extendedMembers: ExtendedGroupMember[] = members.map((m: any) => ({
            ...m,
            username: m.username || m.nickname || m.name || `사용자${m.memberId}`,
            profileImage: m.profileImage || m.profileImageUrl || m.profile_image || m.profile_image_url
          }));
          setGroupMembers(extendedMembers);
          setMembersDialogOpen(true);
        } catch (error) {
          console.error("그룹 정보 조회 실패:", error);
          toast({
            title: "오류",
            description: "그룹 정보를 불러올 수 없습니다.",
            variant: "destructive",
          });
        } finally {
          setLoadingMembers(false);
        }

        navigate("/group-study", { replace: true });
      } catch (error: any) {
        console.error("초대 링크 처리 실패:", error);
        toast({
          title: "오류",
          description: "초대 링크 처리에 실패했습니다.",
          variant: "destructive",
        });
        navigate("/group-study", { replace: true });
      }
    };

    handleInviteLink();
  }, [inviteGroupId, user, navigate]);

  const loadMyGroups = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const allGroups = await groupAPI.getAllGroups();
      
      const myGroupIds = new Set<number>();
      
      await Promise.all(
        allGroups.map(async (group) => {
          try {
            const members = await groupAPI.getMembers(group.id);
            const isMember = members.some((m) => m.memberId === Number(user.id));
            if (isMember) {
              myGroupIds.add(group.id);
            }
          } catch (error) {
            console.warn(`그룹 ${group.id} 멤버 조회 실패`);
          }
        })
      );

      const groups = allGroups.filter((g) => myGroupIds.has(g.id));
      setMyGroups(groups);

      for (const group of groups) {
        await loadGroupRooms(group.id);
      }
      
      console.log("✅ 내 그룹 목록:", groups.length);
    } catch (error: any) {
      console.error("그룹 로드 에러:", error);

      if (error?.message?.includes("401")) {
        toast({
          title: "세션 만료",
          description: "다시 로그인해주세요.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "#/login";
        }, 1500);
      } else {
        toast({
          title: "오류",
          description: error?.message || "그룹 목록을 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const loadGroupRooms = async (groupId: number) => {
    try {
      const rooms = await studyRoomAPI.getGroupRooms(groupId);
      setGroupRooms((prev) => ({ ...prev, [groupId]: rooms }));
    } catch (error) {
      console.error("그룹 방 불러오기 실패:", error);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroup.groupName.trim()) {
      toast({
        title: "오류",
        description: "그룹 이름을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await groupAPI.createGroup({
        groupName: newGroup.groupName,
      });

      toast({
        title: "성공",
        description: "그룹이 생성되었습니다.",
      });
      setCreateGroupDialogOpen(false);
      setNewGroup({ groupName: "" });
      await loadMyGroups();
    } catch (error: any) {
      toast({
        title: "오류",
        description: error?.message || "그룹 생성에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoom.roomName.trim() || selectedGroupId === null) {
      toast({
        title: "오류",
        description: "방 제목과 그룹을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const createdRoom = await studyRoomAPI.createRoom({
        groupId: selectedGroupId,
        roomName: newRoom.roomName,
        studyField: newRoom.studyField,
        studyHours: newRoom.studyHours,
        maxMembers: newRoom.maxMembers,
      });

      toast({
        title: "성공",
        description: "스터디 방이 생성되었습니다.",
      });
      setCreateRoomDialogOpen(false);
      setNewRoom({
        roomName: "",
        maxMembers: 4,
        studyHours: 2,
        studyField: "프로그래밍",
      });

      navigate(`/group-study/room/${createdRoom.id}`);
    } catch (error: any) {
      toast({
        title: "오류",
        description: error?.message || "스터디 방 생성에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    if (!confirm("정말로 이 그룹을 삭제하시겠습니까?")) return;

    setLoading(true);
    try {
      await groupAPI.deleteGroup(groupId);
      toast({ title: "성공", description: "그룹이 삭제되었습니다." });
      await loadMyGroups();
    } catch (error: any) {
      toast({
        title: "오류",
        description: error?.message || "그룹 삭제에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId: number) => {
    setLoading(true);
    try {
      if (!user?.id) {
        toast({
          title: "오류",
          description: "로그인이 필요합니다.",
          variant: "destructive",
        });
        return;
      }

      await studyRoomAPI.joinRoom(roomId, Number(user.id));
      toast({
        title: "성공",
        description: "스터디 방에 참여했습니다.",
      });

      navigate(`/group-study/room/${roomId}`);
    } catch (error: any) {
      console.error("방 참여 에러:", error);

      if (error?.message?.includes("500")) {
        toast({
          title: "알림",
          description: "이미 참여 중인 방입니다. 입장합니다.",
        });
        navigate(`/group-study/room/${roomId}`);
      } else if (error?.message?.includes("이미")) {
        toast({
          title: "알림",
          description: "이미 참여 중인 방입니다.",
        });
        navigate(`/group-study/room/${roomId}`);
      } else {
        toast({
          title: "오류",
          description: error?.message || "스터디 방 참여에 실패했습니다.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = (groupId: number) => {
    const inviteLink = `${window.location.origin}/#/group-invite/${groupId}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        toast({ title: "성공", description: "초대 링크가 클립보드에 복사되었습니다." });
      })
      .catch(() => {
        toast({
          title: "오류",
          description: "링크 복사에 실패했습니다.",
          variant: "destructive",
        });
      });
  };

  // ✅ 멤버 로드 함수 수정 - 모든 가능한 필드명 체크
  const loadGroupMembers = async (group: Group) => {
    setLoadingMembers(true);
    try {
      console.log("📥 그룹 멤버 로딩 시작:", group.id);
      
      const members = await groupAPI.getMembers(group.id);
      console.log("📥 원본 멤버 데이터:", JSON.stringify(members, null, 2));
      
      // ✅ 모든 가능한 필드명을 체크하여 사용자 이름과 프로필 이미지 추출
      const extendedMembers: ExtendedGroupMember[] = members.map((m: any) => {
        // 사용자 이름 우선순위: username > nickname > name > memberId
        const displayName = m.username || m.nickname || m.name || m.user?.username || m.user?.nickname || m.user?.name || `사용자${m.memberId}`;
        
        // 프로필 이미지 우선순위: profileImage > profileImageUrl > profile_image > profile_image_url > user.profileImage
        const profileImg = m.profileImage || m.profileImageUrl || m.profile_image || m.profile_image_url || m.user?.profileImage || m.user?.profileImageUrl || m.user?.profile_image;
        
        console.log(`👤 멤버 ${m.memberId} 처리:`, {
          원본: m,
          표시이름: displayName,
          프로필이미지: profileImg
        });
        
        return {
          ...m,
          username: displayName,
          profileImage: profileImg
        };
      });
      
      console.log("✅ 처리된 멤버 데이터:", extendedMembers);
      setGroupMembers(extendedMembers);
    } catch (error) {
      console.error("❌ 멤버 로딩 실패:", error);
      toast({
        title: "오류",
        description: "멤버 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
      setGroupMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove || !selectedGroupForMembers || !user) return;

    setLoading(true);
    try {
      await groupAPI.removeMember(
        selectedGroupForMembers.id,
        memberToRemove.memberId,
        Number(user.id)
      );
      toast({
        title: "성공",
        description: "멤버가 추방되었습니다.",
      });
      setRemoveMemberDialogOpen(false);
      setMemberToRemove(null);
      await loadGroupMembers(selectedGroupForMembers);
    } catch (error: any) {
      toast({
        title: "오류",
        description: error?.message || "멤버 추방에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Card className="max-w-md mx-auto mt-12">
            <CardContent className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                로그인이 필요합니다
              </h3>
              <p className="text-gray-500 mb-4">
                그룹 스터디를 이용하려면 로그인해주세요
              </p>
              <Button onClick={() => (window.location.href = "#/login")}>
                로그인하기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">그룹 스터디</h1>
            <p className="text-gray-600 mt-2">
              친구들과 그룹을 만들어 체계적으로 스터디를 진행하세요
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                setLoading(true);
                await loadMyGroups();
                toast({
                  title: "새로고침 완료",
                  description: "그룹 목록을 업데이트했습니다.",
                });
              }}
              disabled={loading}
              title="새로고침"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={loading ? "animate-spin" : ""}
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
            </Button>

            <Dialog
              open={createGroupDialogOpen}
              onOpenChange={setCreateGroupDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  그룹 만들기
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>새 그룹 만들기</DialogTitle>
                  <DialogDescription>
                    새로운 스터디 그룹을 생성하여 멤버들과 함께 공부하세요
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>그룹 이름 *</Label>
                    <Input
                      placeholder="그룹 이름을 입력하세요"
                      value={newGroup.groupName}
                      onChange={(e) =>
                        setNewGroup({ groupName: e.target.value })
                      }
                      maxLength={50}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setCreateGroupDialogOpen(false)}
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleCreateGroup}
                      disabled={loading || !newGroup.groupName.trim()}
                    >
                      {loading ? "생성 중..." : "그룹 만들기"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={createRoomDialogOpen}
              onOpenChange={setCreateRoomDialogOpen}
            >
              <DialogTrigger asChild>
                <Button disabled={myGroups.length === 0}>
                  <Plus className="w-4 h-4 mr-2" />
                  스터디 방 만들기
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>새 스터디 방 만들기</DialogTitle>
                  <DialogDescription>
                    그룹 스터디 방을 생성하여 멤버들과 함께 공부하세요
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>그룹 선택 *</Label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={selectedGroupId || ""}
                      onChange={(e) =>
                        setSelectedGroupId(Number(e.target.value) || null)
                      }
                    >
                      <option value="">그룹을 선택하세요</option>
                      {myGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.groupName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>방 제목 *</Label>
                    <Input
                      placeholder="방 제목을 입력하세요"
                      value={newRoom.roomName}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, roomName: e.target.value })
                      }
                      maxLength={30}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>공부 분야 *</Label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newRoom.studyField}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, studyField: e.target.value })
                      }
                    >
                      {STUDY_FIELDS.map((field) => (
                        <option key={field} value={field}>
                          {field}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>최대 인원</Label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={newRoom.maxMembers}
                        onChange={(e) =>
                          setNewRoom({
                            ...newRoom,
                            maxMembers: parseInt(e.target.value),
                          })
                        }
                      >
                        {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num}명
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>공부 시간</Label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={newRoom.studyHours}
                        onChange={(e) =>
                          setNewRoom({
                            ...newRoom,
                            studyHours: parseInt(e.target.value),
                          })
                        }
                      >
                        {[1, 2, 3, 4, 5].map((hour) => (
                          <option key={hour} value={hour}>
                            {hour}시간
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setCreateRoomDialogOpen(false)}
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleCreateRoom}
                      disabled={
                        loading ||
                        !newRoom.roomName.trim() ||
                        selectedGroupId === null
                      }
                    >
                      {loading ? "생성 중..." : "방 만들기"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="groups" className="space-y-6">
          <TabsList>
            <TabsTrigger value="groups">내 그룹</TabsTrigger>
            <TabsTrigger value="rooms">스터디 방</TabsTrigger>
          </TabsList>

          <TabsContent value="groups">
            {myGroups.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    참여 중인 그룹이 없습니다
                  </h3>
                  <p className="text-gray-500 mb-4">
                    첫 번째 그룹을 만들어보세요!
                  </p>
                  <Button onClick={() => setCreateGroupDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    그룹 만들기
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {group.groupName}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            생성일:{" "}
                            {new Date(group.createdAt).toLocaleDateString(
                              "ko-KR"
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={async () => {
                              await loadGroupRooms(group.id);
                              toast({
                                title: "새로고침 완료",
                                description: `${group.groupName}의 스터디 방 목록을 업데이트했습니다.`,
                              });
                            }}
                            title="스터디 방 새로고침"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                            </svg>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyInviteLink(group.id)}
                            title="초대 링크 복사"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteGroup(group.id)}
                            title="그룹 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">
                          활성 방 {groupRooms[group.id]?.length || 0}개
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            setSelectedGroupForMembers(group);
                            setMembersDialogOpen(true);
                            await loadGroupMembers(group);
                          }}
                          disabled={loadingMembers}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          멤버 보기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rooms">
            <div className="space-y-6">
              {myGroups.length > 1 && (
                <div className="flex items-center gap-3 mb-4">
                  <Label className="text-sm font-medium text-gray-700">
                    그룹 필터:
                  </Label>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedGroupFilter}
                    onChange={(e) =>
                      setSelectedGroupFilter(
                        e.target.value === "all"
                          ? "all"
                          : Number(e.target.value)
                      )
                    }
                  >
                    <option value="all">전체 그룹</option>
                    {myGroups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.groupName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(() => {
                const filteredGroups =
                  selectedGroupFilter === "all"
                    ? myGroups
                    : myGroups.filter((g) => g.id === selectedGroupFilter);

                const allRooms: Array<GroupStudyRoom & { groupName: string }> = [];
                filteredGroups.forEach((group) => {
                  const rooms = groupRooms[group.id] || [];
                  rooms.forEach((room) => {
                    allRooms.push({ ...room, groupName: group.groupName });
                  });
                });

                if (allRooms.length === 0) {
                  return (
                    <Card>
                      <CardContent className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          활성 스터디 방이 없습니다
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {selectedGroupFilter === "all"
                            ? "새로운 스터디 방을 만들어보세요!"
                            : "선택한 그룹에 활성 스터디 방이 없습니다."}
                        </p>
                        {selectedGroupFilter === "all" && (
                          <Button onClick={() => setCreateRoomDialogOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            스터디 방 만들기
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allRooms.map((room) => {
                      const isFull = room.currentMembers >= room.maxMembers;
                      return (
                        <Card
                          key={room.id}
                          className={`hover:shadow-md transition-shadow ${
                            isFull ? "opacity-75" : ""
                          }`}
                        >
                          <CardHeader className="pb-3">
                            <div className="mb-2">
                              <Badge
                                variant="secondary"
                                className="text-xs mb-2 bg-indigo-100 text-indigo-700"
                              >
                                {room.groupName}
                              </Badge>
                            </div>
                            <CardTitle className="text-base">
                              {room.roomName}
                            </CardTitle>
                            <div className="flex flex-col gap-2 mt-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1 text-gray-500" />
                                <span>
                                  {room.currentMembers || 0}/{room.maxMembers}명
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-gray-500" />
                                <span>
                                  {room.remainingMinutes
                                    ? `남은 시간: ${room.remainingMinutes}분`
                                    : "진행 중"}
                                </span>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="pt-0">
                            <div className="flex flex-col gap-3">
                              <Badge variant="outline" className="text-xs w-fit">
                                {room.studyField}
                              </Badge>
                              {isFull ? (
                                <div className="flex flex-col gap-2">
                                  <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-md text-center">
                                    <p className="text-sm font-medium text-red-700">
                                      입장 불가
                                    </p>
                                    <p className="text-xs text-red-600 mt-1">
                                      최대 인원에 도달했습니다
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled
                                    className="w-full"
                                  >
                                    입장 불가
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleJoinRoom(room.id)}
                                  disabled={loading}
                                  className="w-full"
                                >
                                  입장하기
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ✅ 그룹 멤버 다이얼로그 - 프로필 이미지와 실제 이름 표시 */}
      <Dialog open={membersDialogOpen} onOpenChange={setMembersDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedGroupForMembers?.groupName} 멤버 목록
            </DialogTitle>
            <DialogDescription>
              그룹에 소속된 멤버들을 확인하고 관리할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedGroupForMembers &&
              user &&
              selectedGroupForMembers.leaderId === Number(user.id) && (
                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div>
                    <p className="text-sm font-medium text-indigo-900">
                      초대 링크 공유
                    </p>
                    <p className="text-xs text-indigo-700 mt-1">
                      링크를 복사하여 외부 사용자를 초대하세요
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() =>
                      copyInviteLink(selectedGroupForMembers.id)
                    }
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    초대 링크 복사
                  </Button>
                </div>
              )}
            
            {/* ✅ 멤버 목록 */}
            <div className="border rounded-lg">
              {loadingMembers ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-sm text-gray-500">멤버 목록을 불러오는 중...</p>
                </div>
              ) : groupMembers.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">멤버가 없습니다.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {groupMembers.map((member) => {
                    const isLeader =
                      selectedGroupForMembers?.leaderId === member.memberId;
                    const isCurrentUser =
                      user && Number(user.id) === member.memberId;

                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          {/* ✅ 프로필 이미지 표시 */}
                          <Avatar className="w-10 h-10">
                            {member.profileImage ? (
                              <AvatarImage 
                                src={member.profileImage}
                                alt={member.username || "프로필"}
                                onError={(e) => {
                                  console.log("이미지 로드 실패:", member.profileImage);
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : null}
                            <AvatarFallback
                              className={
                                isLeader
                                  ? "bg-yellow-500 text-white"
                                  : isCurrentUser
                                  ? "bg-indigo-500 text-white"
                                  : "bg-gray-400 text-white"
                              }
                            >
                              {member.username?.charAt(0)?.toUpperCase() || 
                               member.memberId.toString().charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {/* ✅ 실제 사용자 이름 표시 */}
                              <span className="font-medium text-gray-900">
                                {member.username || `사용자${member.memberId}`}
                              </span>
                              {isLeader && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-yellow-100 text-yellow-800"
                                >
                                  방장
                                </Badge>
                              )}
                              {isCurrentUser && !isLeader && (
                                <Badge variant="secondary" className="text-xs">
                                  나
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {member.role}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                가입일:{" "}
                                {new Date(member.joinedAt).toLocaleDateString(
                                  "ko-KR"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {selectedGroupForMembers &&
                          user &&
                          selectedGroupForMembers.leaderId ===
                            Number(user.id) &&
                          !isLeader && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                setMemberToRemove(member);
                                setRemoveMemberDialogOpen(true);
                              }}
                            >
                              <UserX className="w-4 h-4 mr-1" />
                              추방
                            </Button>
                          )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setMembersDialogOpen(false)}
            >
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ 멤버 추방 확인 다이얼로그 */}
      <AlertDialog
        open={removeMemberDialogOpen}
        onOpenChange={setRemoveMemberDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>멤버 추방 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 멤버를 그룹에서 추방하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* ✅ memberToRemove가 있을 때만 표시 */}
          {memberToRemove && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg my-2">
              {/* ✅ 프로필 이미지 */}
              <Avatar className="w-12 h-12">
                {memberToRemove.profileImage ? (
                  <AvatarImage 
                    src={memberToRemove.profileImage}
                    alt={memberToRemove.username || "프로필"}
                    onError={(e) => {
                      console.log("이미지 로드 실패:", memberToRemove.profileImage);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                <AvatarFallback className="bg-blue-500 text-white">
                  {memberToRemove.username?.charAt(0)?.toUpperCase() || 
                   memberToRemove.memberId.toString().charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* ✅ 사용자 정보 */}
              <div>
                <span className="font-medium text-gray-900 block text-lg">
                  {memberToRemove.username || `사용자${memberToRemove.memberId}`}
                </span>
                <span className="text-sm text-gray-500">
                  멤버 ID: {memberToRemove.memberId}
                </span>
              </div>
            </div>
          )}

          <AlertDialogDescription className="text-red-600">
            추방된 사용자는 더 이상 해당 그룹의 스터디에 참여하거나 그룹
            스터디 페이지에 접근할 수 없습니다.
          </AlertDialogDescription>

          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-red-600 hover:bg-red-700"
            >
              추방하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GroupStudy;