-- v224 📋 Hồ sơ năng lực TOEIC: Claude (phiên chat) ghi bằng quyền máy chủ; người học chỉ ĐỌC dòng của mình.
create table if not exists public.ho_so (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null,
  at timestamptz not null default now()
);
alter table public.ho_so enable row level security;
drop policy if exists ho_so_doc on public.ho_so;
create policy ho_so_doc on public.ho_so for select to authenticated using (auth.uid() = user_id);
-- không có policy insert / update / delete: chỉ máy chủ (service role) ghi.
