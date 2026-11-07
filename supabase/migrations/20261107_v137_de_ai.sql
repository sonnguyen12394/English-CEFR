-- v137 (7/11/2026): 🎯 Luyện đề do AI soạn (hàm máy chủ de-ai). Mỗi dòng là một đề AI đã soạn (hoặc đang soạn / lỗi).
-- Người sáng lập: "lưu lại đề đã tạo ít nhất 3 phiên bản để AI không tạo trùng đề" → KHÔNG xoá đề cũ: đề là lịch sử chống trùng.
-- Chỉ máy chủ (service role) thêm / sửa; người dùng chỉ đọc đề của chính mình. Chạy trên dự án eojrfoormaqboxwvdqhr qua MCP; lưu ở đây để biết lịch sử.
create table public.de_ai (
  id uuid primary key default gen_random_uuid(),
  uid uuid not null,
  at timestamptz not null default now(),
  ky text not null check (char_length(ky) <= 12),            -- ielts-ac · ielts-gt · toeic · cb-pre … cb-c2
  sk text not null check (sk in ('doc', 'nghe', 'viet', 'noi', 'np')),
  dang text not null check (char_length(dang) <= 24),        -- khoá dạng câu / phần, * = bất kỳ
  muc text check (char_length(muc) <= 12),                   -- band / điểm / cấp dùng để soạn
  st text not null default 'dang' check (st in ('dang', 'xong', 'loi')),
  de jsonb,                                                  -- đề (khuôn ở specs/001-luyen-de-ai/contracts/de-ai.md)
  chk jsonb,                                                 -- kết quả kiểm: { n, khop, bo, trung? }
  err text,
  tin int not null default 0,
  tout int not null default 0,
  du boolean not null default false,                         -- đề dự trữ (soạn sẵn)
  chude text check (char_length(chude) <= 40),               -- chủ đề máy chọn trước khi soạn
  tom text check (char_length(tom) <= 400),                  -- ý chính một câu (danh sách tránh)
  lan int not null default 1                                 -- 2 = phải soạn lại vì trùng / hỏng
);
comment on table public.de_ai is 'Đề luyện thi do AI soạn (edge function de-ai, v137). Không xoá: lịch sử chống trùng. Chỉ service role ghi; người dùng đọc dòng của mình.';
alter table public.de_ai enable row level security;
create policy "de_ai doc cua minh" on public.de_ai for select to authenticated using (uid = (select auth.uid()));
create index de_ai_uid_at on public.de_ai (uid, at desc);
create index de_ai_uid_ky_sk_at on public.de_ai (uid, ky, sk, at desc);
