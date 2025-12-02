import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { checklistAPI, Checklist } from "@/lib/api";
import {
  Plus,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  CheckSquare,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const ChecklistPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [monthSummary, setMonthSummary] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 다이얼로그 상태
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 폼 상태
  const [newChecklistContent, setNewChecklistContent] = useState("");
  const [editingChecklist, setEditingChecklist] = useState<Checklist | null>(
    null
  );
  const [editContent, setEditContent] = useState("");
  const [selectedForDelete, setSelectedForDelete] = useState<string[]>([]);

  useEffect(() => {
    if (selectedDate) {
      loadChecklists();
      loadMonthSummary();
    }
  }, [selectedDate]);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const loadChecklists = async () => {
    setLoading(true);
    try {
      const dateStr = formatDate(selectedDate);
      const checklistsData = await checklistAPI.getChecklists(dateStr);
      // API 응답이 배열인지 확인
      if (Array.isArray(checklistsData)) {
        setChecklists(checklistsData);
      } else {
        setChecklists([]);
      }
    } catch (error) {
      console.error("Failed to load checklists:", error);
      toast({
        title: "오류",
        description: "체크리스트를 불러오는데 실패했습니다.",
        variant: "destructive",
      });
      setChecklists([]); // 에러 시 빈 배열로 설정
    }
    setLoading(false);
  };

  const loadMonthSummary = async () => {
    try {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const summary = await checklistAPI.getMonthSummary(year, month);
      // API 응답이 { dates: [...] } 형태인지 확인
      if (summary && Array.isArray(summary.dates)) {
        setMonthSummary(summary.dates);
      } else {
        setMonthSummary([]);
      }
    } catch (error) {
      console.error("Failed to load month summary:", error);
      setMonthSummary([]); // 에러 시 빈 배열로 설정
    }
  };

  const handleCreateChecklist = async () => {
    if (!newChecklistContent.trim()) {
      toast({
        title: "오류",
        description: "내용을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const dateStr = formatDate(selectedDate);
      // API 스키마에 맞게 수정: targetDate로 변경
      await checklistAPI.createChecklist({
        targetDate: dateStr,
        content: newChecklistContent.trim(),
      });

      toast({
        title: "성공",
        description: "체크리스트가 추가되었습니다.",
      });

      setCreateDialogOpen(false);
      setNewChecklistContent("");
      loadChecklists();
      loadMonthSummary();
    } catch (error) {
      toast({
        title: "오류",
        description: "체크리스트 생성에 실패했습니다.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleEditChecklist = async () => {
    if (!editContent.trim() || !editingChecklist) {
      toast({
        title: "오류",
        description: "내용을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // API 스키마에 맞게 수정: content만 전달
      await checklistAPI.updateChecklist(editingChecklist.id, {
        content: editContent.trim(),
      });

      toast({
        title: "성공",
        description: "체크리스트가 수정되었습니다.",
      });

      setEditDialogOpen(false);
      setEditingChecklist(null);
      setEditContent("");
      loadChecklists();
    } catch (error) {
      toast({
        title: "오류",
        description: "체크리스트 수정에 실패했습니다.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDeleteChecklists = async () => {
    if (selectedForDelete.length === 0) {
      toast({
        title: "오류",
        description: "삭제할 체크리스트를 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await Promise.all(
        selectedForDelete.map((id) => checklistAPI.deleteChecklist(id))
      );

      toast({
        title: "성공",
        description: `${selectedForDelete.length}개의 체크리스트가 삭제되었습니다.`,
      });

      setDeleteDialogOpen(false);
      setSelectedForDelete([]);
      loadChecklists();
      loadMonthSummary();
    } catch (error) {
      toast({
        title: "오류",
        description: "체크리스트 삭제에 실패했습니다.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleToggleChecklist = async (checklistId: string) => {
    setLoading(true);
    try {
      await checklistAPI.toggleChecklist(checklistId);
      loadChecklists();
    } catch (error) {
      toast({
        title: "오류",
        description: "체크리스트 상태 변경에 실패했습니다.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const openEditDialog = (checklist: Checklist) => {
    setEditingChecklist(checklist);
    setEditContent(checklist.content);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = () => {
    if (checklists.length === 0) {
      toast({
        title: "알림",
        description: "삭제할 체크리스트가 없습니다.",
        variant: "destructive",
      });
      return;
    }
    setDeleteDialogOpen(true);
  };

  const handleDeleteSelection = (checklistId: string, checked: boolean) => {
    setSelectedForDelete((prev) =>
      checked ? [...prev, checklistId] : prev.filter((id) => id !== checklistId)
    );
  };

  // 달력에서 체크리스트가 있는 날짜 표시 (빨간색)
  const modifiers = {
    hasChecklist: (monthSummary || []).map((dateStr) => {
      // "YYYY-MM-DD" 형식의 문자열을 Date 객체로 변환
      const [year, month, day] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day);
    }),
  };

  const modifiersStyles = {
    hasChecklist: {
      color: "#dc2626",
      fontWeight: "bold",
    },
  };

  const modifiersClassNames = {
    hasChecklist: "text-red-600 font-bold",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">체크리스트</h1>
          <p className="text-gray-600 mt-2">
            학습 목표를 설정하고 달성률을 확인하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 달력 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  날짜 선택
                </CardTitle>
                <CardDescription>
                  체크리스트를 관리할 날짜를 선택하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <style>
                  {`
                    /* 체크리스트가 있는 날짜를 빨간색으로 표시 */
                    .rdp-day.hasChecklist button {
                      color: #dc2626 !important;
                      font-weight: bold !important;
                    }
                    .rdp-day.hasChecklist:not(.rdp-day_selected) button:hover {
                      color: #991b1b !important;
                    }
                  `}
                </style>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                  className="rounded-md border"
                />
                <div className="mt-4 text-xs text-gray-500">
                  <span className="text-red-600 font-bold">●</span> 빨간색
                  날짜는 체크리스트가 있는 날입니다
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 체크리스트 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <CheckSquare className="w-5 h-5 mr-2" />
                      {selectedDate.toLocaleDateString("ko-KR")} 체크리스트
                    </CardTitle>
                    <CardDescription>
                      총 {checklists.length}개 항목
                      {checklists.length > 0 && (
                        <span className="ml-2">
                          (완료: {checklists.filter((c) => c.completed).length}
                          개)
                        </span>
                      )}
                    </CardDescription>
                  </div>

                  <div className="flex space-x-2">
                    <Dialog
                      open={createDialogOpen}
                      onOpenChange={setCreateDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          생성
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>새 체크리스트 생성</DialogTitle>
                          <DialogDescription>
                            {selectedDate.toLocaleDateString("ko-KR")}의
                            체크리스트를 추가합니다
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="checklist-content">내용 *</Label>
                            <Input
                              id="checklist-content"
                              placeholder="체크리스트 내용을 입력하세요"
                              value={newChecklistContent}
                              onChange={(e) =>
                                setNewChecklistContent(e.target.value)
                              }
                              maxLength={200}
                            />
                            <p className="text-xs text-gray-500 text-right">
                              {newChecklistContent.length}/200
                            </p>
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setCreateDialogOpen(false)}
                            >
                              취소
                            </Button>
                            <Button
                              onClick={handleCreateChecklist}
                              disabled={loading || !newChecklistContent.trim()}
                            >
                              {loading ? "생성 중..." : "완료"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {checklists.length > 0 && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            checklists.length > 0 &&
                            openEditDialog(checklists[0])
                          }
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          수정
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={openDeleteDialog}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          삭제
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {loading && checklists.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-4">
                      체크리스트를 불러오는 중...
                    </p>
                  </div>
                ) : checklists.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      체크리스트가 없습니다
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {selectedDate.toLocaleDateString("ko-KR")}의 첫 번째
                      체크리스트를 만들어보세요!
                    </p>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      체크리스트 생성
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {checklists.map((checklist) => (
                      <div
                        key={checklist.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg border ${
                          checklist.completed
                            ? "bg-green-50 border-green-200"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <Checkbox
                          checked={checklist.completed}
                          onCheckedChange={() =>
                            handleToggleChecklist(checklist.id)
                          }
                          disabled={loading}
                        />

                        <div className="flex-1">
                          <p
                            className={`${
                              checklist.completed
                                ? "line-through text-gray-500"
                                : "text-gray-900"
                            }`}
                          >
                            {checklist.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(checklist.createdAt).toLocaleString(
                              "ko-KR"
                            )}
                          </p>
                        </div>

                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditDialog(checklist)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>

                        {checklist.completed && (
                          <Badge variant="secondary" className="text-xs">
                            완료
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 수정 다이얼로그 */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>체크리스트 수정</DialogTitle>
              <DialogDescription>
                체크리스트 내용을 수정합니다
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-content">내용 *</Label>
                <Input
                  id="edit-content"
                  placeholder="체크리스트 내용을 입력하세요"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 text-right">
                  {editContent.length}/200
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  취소
                </Button>
                <Button
                  onClick={handleEditChecklist}
                  disabled={loading || !editContent.trim()}
                >
                  {loading ? "수정 중..." : "완료"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 삭제 다이얼로그 */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>체크리스트 삭제</DialogTitle>
              <DialogDescription>
                삭제할 체크리스트를 선택하세요
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="max-h-60 overflow-y-auto space-y-2">
                {checklists.map((checklist) => (
                  <div
                    key={checklist.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      checked={selectedForDelete.includes(checklist.id)}
                      onCheckedChange={(checked) =>
                        handleDeleteSelection(checklist.id, checked as boolean)
                      }
                    />
                    <span className="text-sm flex-1">{checklist.content}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setSelectedForDelete([]);
                  }}
                >
                  취소
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteChecklists}
                  disabled={loading || selectedForDelete.length === 0}
                >
                  {loading
                    ? "삭제 중..."
                    : `삭제 (${selectedForDelete.length}개)`}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ChecklistPage;
