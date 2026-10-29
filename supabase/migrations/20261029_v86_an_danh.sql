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
