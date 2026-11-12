-- v161 Đề riêng có mã (Đề 9 trở đi: tài liệu ETS của người sáng lập, không công khai).
-- Chỉ máy chủ (hàm de-rieng, service role) đọc / ghi: RLS bật, không có policy nào cho người dùng.
create table if not exists public.de_rieng (id text primary key, t text not null, data jsonb not null, at timestamptz not null default now());
create table if not exists public.de_rieng_ma (h text primary key, at timestamptz not null default now());   -- h = sha256 hex của mã
create table if not exists public.de_rieng_thu (id bigserial primary key, at timestamptz not null default now(), ip text, ok boolean not null);
alter table public.de_rieng enable row level security;
alter table public.de_rieng_ma enable row level security;
alter table public.de_rieng_thu enable row level security;
revoke all on public.de_rieng, public.de_rieng_ma, public.de_rieng_thu from anon, authenticated;
-- thêm: khoá tạm cho Claude nạp đề (24 giờ), cùng kiểu gopy_pdf_key
create table if not exists public.de_rieng_key (k text primary key, at timestamptz not null default now());
alter table public.de_rieng_key enable row level security;
revoke all on public.de_rieng_key from anon, authenticated;
-- mã: chỉ lưu sha256 (thêm bằng Supabase MCP, không ghi mã vào repo)
