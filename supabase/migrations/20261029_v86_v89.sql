-- v86 (29/10/2026): mỗi máy một tài khoản ẩn danh (anonymous sign-in). Đã chạy trên dự án eojrfoormaqboxwvdqhr qua MCP; lưu ở đây để biết lịch sử.
-- Người ẩn danh chỉ được học (vocab_state của mình, RLS sẵn có) và gửi góp ý; không vào soxuong, không đọc / sửa / xoá góp ý và ảnh góp ý.
create policy "khong cho an danh" on public.soxuong as restrictive for all to authenticated
  using (coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false)
  with check (coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);
create policy "an danh khong sua gopy" on public.gopy as restrictive for update to authenticated
  using (coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false)
  with check (coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);
create policy "an danh khong xoa gopy" on public.gopy as restrictive for delete to authenticated
  using (coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);
create policy "an danh khong doc gopy" on public.gopy as restrictive for select to authenticated
  using (coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);
create policy "gopy anh an danh khong doc" on storage.objects as restrictive for select to authenticated
  using (bucket_id <> 'gopy' or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);
create policy "gopy anh an danh khong xoa" on storage.objects as restrictive for delete to authenticated
  using (bucket_id <> 'gopy' or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);
-- loại góp ý ⚑ Câu sai
alter table public.gopy drop constraint gopy_kind_check;
alter table public.gopy add constraint gopy_kind_check check (kind = any (array['loi','kho','y','khac','sai']));

-- v89 (30/10/2026): từ người học tra mà từ điển app chưa có (chỉ từ, không gắn tài khoản); người ẩn danh chỉ thêm, không đọc
create table public.td_miss (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  w text not null check (w ~ '^[a-z][a-z''-]{2,29}$'),
  src text not null check (src in ('cham', 'tra', 'luu')),
  app_v text check (char_length(app_v) <= 10)
);
alter table public.td_miss enable row level security;
create policy "td_miss them" on public.td_miss for insert to authenticated with check (true);
create policy "td_miss doc" on public.td_miss for select to authenticated using (coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);
create index td_miss_at on public.td_miss (at desc);
