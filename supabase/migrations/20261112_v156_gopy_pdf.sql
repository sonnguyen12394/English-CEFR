-- v156 📄 Góp ý kèm PDF lớn (specs/013-gopy-pdf-lon). Gói Free: 50 MB / tệp, 1 GB tổng.
-- App cắt PDF thành mảnh ≤ 25 MB, tải bằng đường có ký tên do hàm gopy-pdf cấp. App KHÔNG đọc / xoá / ghi thẳng được kho.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gopy-pdf', 'gopy-pdf', false, 27262976, array['application/octet-stream'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.gopy_pdf (
  id uuid primary key default gen_random_uuid(),
  uid uuid,
  name text not null,
  size bigint not null check (size > 0),
  n int not null check (n between 1 and 40),
  parts jsonb not null default '[]',      -- [{ i, size, sha }] app khai báo; máy chủ kiểm cỡ khi done
  st text not null default 'dang' check (st in ('dang', 'du', 'xoa')),
  at timestamptz not null default now(),
  done_at timestamptz,
  del_at timestamptz
);
alter table public.gopy_pdf enable row level security;   -- không có policy: chỉ máy chủ (service role) đọc / ghi
create index if not exists gopy_pdf_st on public.gopy_pdf (st);

-- Giữ chỗ có khoá: 2 máy tải cùng lúc vẫn không vượt trần.
create or replace function public.gopy_pdf_giu(p_uid uuid, p_name text, p_size bigint, p_n int, p_parts jsonb, p_cap bigint, p_max_dang int, p_max_du int)
returns jsonb language plpgsql security definer set search_path = public as $$
declare used bigint; nd int; nu int; nid uuid;
begin
  perform pg_advisory_xact_lock(4242013);
  select coalesce(sum(size), 0) into used from gopy_pdf where st <> 'xoa';
  if used + p_size > p_cap then return jsonb_build_object('error', 'day', 'used', used, 'cap', p_cap); end if;
  select count(*) filter (where st = 'dang'), count(*) filter (where st = 'du') into nd, nu from gopy_pdf where uid is not distinct from p_uid;
  if nd >= p_max_dang then return jsonb_build_object('error', 'dang', 'used', used, 'cap', p_cap); end if;
  if nu >= p_max_du then return jsonb_build_object('error', 'du', 'used', used, 'cap', p_cap); end if;
  insert into gopy_pdf (uid, name, size, n, parts) values (p_uid, p_name, p_size, p_n, p_parts) returning id into nid;
  return jsonb_build_object('id', nid, 'used', used + p_size, 'cap', p_cap);
end $$;
revoke all on function public.gopy_pdf_giu(uuid, text, bigint, int, jsonb, bigint, int, int) from public, anon, authenticated;

-- Khoá tạm cho Claude (không cần secret): Claude tạo bằng SQL qua Supabase MCP, hết hạn 24 giờ; chỉ máy chủ đọc (RLS bật, không policy).
-- insert into public.gopy_pdf_key (k) values (encode(gen_random_bytes(24), 'hex')) returning k;
create table if not exists public.gopy_pdf_key (k text primary key, at timestamptz not null default now());
alter table public.gopy_pdf_key enable row level security;
revoke all on public.gopy_pdf_key from anon, authenticated;

-- v157: giữ chỗ khi THAY tệp: bỏ qua tệp cũ (p_skip) khi tính trần và số tệp (thay được cả khi đang có 2 tệp).
create or replace function public.gopy_pdf_giu2(p_uid uuid, p_name text, p_size bigint, p_n int, p_parts jsonb, p_cap bigint, p_max_dang int, p_max_du int, p_skip uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare used bigint; nd int; nu int; nid uuid;
begin
  perform pg_advisory_xact_lock(4242013);
  select coalesce(sum(size), 0) into used from gopy_pdf where st <> 'xoa' and id is distinct from p_skip;
  if used + p_size > p_cap then return jsonb_build_object('error', 'day', 'used', used, 'cap', p_cap); end if;
  select count(*) filter (where st = 'dang'), count(*) filter (where st = 'du') into nd, nu from gopy_pdf where uid is not distinct from p_uid and id is distinct from p_skip;
  if nd >= p_max_dang then return jsonb_build_object('error', 'dang', 'used', used, 'cap', p_cap); end if;
  if nu >= p_max_du then return jsonb_build_object('error', 'du', 'used', used, 'cap', p_cap); end if;
  insert into gopy_pdf (uid, name, size, n, parts) values (p_uid, p_name, p_size, p_n, p_parts) returning id into nid;
  return jsonb_build_object('id', nid, 'used', used + p_size, 'cap', p_cap);
end $$;
revoke all on function public.gopy_pdf_giu2(uuid, text, bigint, int, jsonb, bigint, int, int, uuid) from public, anon, authenticated;
