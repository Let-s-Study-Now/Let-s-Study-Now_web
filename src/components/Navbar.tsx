import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 레벨 계산 (경험치 기반)
  const calculateLevel = (exp: number = 0) => {
    return Math.floor(exp / 100) + 1;
  };

  // 사용자 레벨 가져오기
  const userLevel = user?.level || (user?.exp !== undefined ? calculateLevel(user.exp) : 1);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link to="/" className="flex items-center space-x-3">
            {/* 눈에 잘 띄는 책 아이콘 */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 shadow-md flex items-center justify-center">
              <div className="relative w-6 h-5">
                {/* 책 본문 */}
                <div className="absolute inset-0 bg-white/95 rounded-sm" />
                {/* 중앙 접힌 선 */}
                <div className="absolute inset-y-1 left-1/2 w-px bg-indigo-300" />
                {/* 페이지 라인 */}
                <div className="absolute left-1.5 top-1 w-2/3 h-0.5 bg-indigo-100" />
                <div className="absolute left-1.5 top-2 w-1/2 h-0.5 bg-indigo-100" />
                {/* 북마크 */}
                <div className="absolute -top-1 right-1 w-1.5 h-3 bg-indigo-500 rounded-b-sm shadow-sm" />
              </div>
            </div>

            {/* 로고 텍스트 */}
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                Let's Study Now
              </span>
              <span className="text-xs text-indigo-500 font-medium">
                Study Group Platform
              </span>
            </div>
          </Link>

          {/* 네비게이션 메뉴 */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/open-study" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              오픈 스터디
            </Link>
            <Link 
              to="/group-study" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              그룹 스터디
            </Link>
            <Link 
              to="/checklist" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              체크리스트
            </Link>
          </div>

          {/* 사용자 메뉴 */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {user.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt="프로필" 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <span className="text-base font-medium">
                        {user.username}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className="bg-gradient-to-r from-indigo-500 to-sky-400 text-white border-0 text-sm font-semibold px-3 py-1"
                      >
                        Lv.{userLevel}
                      </Badge>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Settings className="w-4 h-4 mr-2" />
                    마이페이지
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  로그인
                </Button>
                <Button onClick={() => navigate('/register')}>
                  회원가입
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;