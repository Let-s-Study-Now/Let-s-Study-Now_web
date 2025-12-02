-- 사용자 프로필 테이블 생성
CREATE TABLE IF NOT EXISTS public.user_profiles_2025_11_05_07_41 (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username VARCHAR(12) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INTEGER,
  profile_image_url TEXT,
  bio TEXT CHECK (LENGTH(bio) <= 200),
  study_fields TEXT[], -- 관심 공부 분야 (최대 5개)
  notification_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책 활성화
ALTER TABLE public.user_profiles_2025_11_05_07_41 ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 프로필만 조회/수정 가능
CREATE POLICY "Users can view own profile" ON public.user_profiles_2025_11_05_07_41
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles_2025_11_05_07_41
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles_2025_11_05_07_41
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 다른 사용자의 기본 정보는 조회 가능 (스터디 참여자 목록용)
CREATE POLICY "Users can view others basic info" ON public.user_profiles_2025_11_05_07_41
  FOR SELECT USING (true);

-- 프로필 업데이트 시 updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles_2025_11_05_07_41
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();