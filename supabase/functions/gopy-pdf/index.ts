// 📄 Góp ý kèm PDF lớn (v156, specs/013-gopy-pdf-lon). Gói Supabase Free: 50 MB / tệp, 1 GB tổng.
// App cắt PDF thành mảnh CH = 25 MB, hàm này giữ chỗ (trần CAP), cấp đường tải lên có ký tên từng mảnh, kiểm đủ mảnh.
// App không đọc lại được mảnh nào (tài liệu riêng tư; mọi máy đang dùng chung tài khoản). Claude đọc / xoá qua khoá PDF_CLAUDE_KEY (header x-pdf-key).
// Vào (app, cần JWT): { act: 'info' } · { act: 'st', ids } · { act: 'start', name, size, parts: [{ size, sha }], thay? } · { act: 'sign', id, need: [i] } · { act: 'done', id } · { act: 'xoa', id }
// Vào (Claude, x-pdf-key): { act: 'list' } · { act: 'get', id } · { act: 'del', id }
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-pdf-key", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const out = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, "content-type": "application/json" } });
const MB = 1024 * 1024, CH = 25 * MB, MAX = 450 * MB, CAP = 800 * MB, MAX_DANG = 1, MAX_DU = 2, STALE = 2 * 864e5, B = "gopy-pdf";
const pth = (id: string, i: number) => `${id}/${String(i).padStart(2, "0")}.part`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const st = db.storage.from(B);
    const body = await req.json().catch(() => ({}));
    const act = String(body.act || ""), id = String(body.id || "");
    const rm = async (row: { id: string; n: number }) => {
      const ps = Array.from({ length: row.n }, (_, i) => pth(row.id, i)); await st.remove(ps);
      await db.from("gopy_pdf").update({ st: "xoa", del_at: new Date().toISOString() }).eq("id", row.id);
    };
    const used = async () => { const { data } = await db.from("gopy_pdf").select("size").neq("st", "xoa"); return (data || []).reduce((s, r) => s + Number(r.size), 0); };
    const row1 = async () => { const { data } = await db.from("gopy_pdf").select("*").eq("id", id).maybeSingle(); return data; };

    // ── Claude ──
    const key = Deno.env.get("PDF_CLAUDE_KEY") || "", hk = req.headers.get("x-pdf-key") || "";
    if (["list", "get", "del"].includes(act)) {
      if (!key || hk.length !== key.length || hk !== key) return out({ error: "Sai khoá." }, 403);
      if (act === "list") { const { data } = await db.from("gopy_pdf").select("id,name,size,n,st,at,done_at,del_at").order("at", { ascending: false }).limit(50); return out({ rows: data || [], used: await used(), cap: CAP }); }
      const r = await row1(); if (!r) return out({ error: "Không có tệp." }, 404);
      if (act === "del") { if (r.st !== "xoa") await rm(r); return out({ ok: true }); }
      if (r.st === "xoa") return out({ error: "Tệp đã xoá." }, 410);
      const urls = [];
      for (let i = 0; i < r.n; i++) { const { data, error } = await st.createSignedUrl(pth(r.id, i), 3600); urls.push(error ? null : data.signedUrl); }
      return out({ row: r, urls });
    }

    // ── App: cần đăng nhập ──
    const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    const { data: ud } = await db.auth.getUser(jwt); const user = ud && ud.user; if (!user) return out({ error: "Cần đăng nhập." }, 401);
    const anon = !!(user as { is_anonymous?: boolean }).is_anonymous;

    // dọn tệp dở quá 2 ngày (trả chỗ)
    const { data: old } = await db.from("gopy_pdf").select("id,n").eq("st", "dang").lt("at", new Date(Date.now() - STALE).toISOString());
    for (const r of old || []) await rm(r);

    if (act === "info") return out({ used: await used(), cap: CAP, max: MAX, ch: CH });
    if (act === "st") {   // trạng thái tệp cho màn quản lý góp ý (không lộ nội dung)
      if (anon) return out({ rows: [] });
      const ids = (Array.isArray(body.ids) ? body.ids : []).map(String).filter((x: string) => /^[0-9a-f-]{36}$/.test(x)).slice(0, 200);
      const { data } = await db.from("gopy_pdf").select("id,name,size,n,st").in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      return out({ rows: data || [] });
    }

    if (act === "start") {
      const name = String(body.name || "").slice(0, 200), size = Number(body.size), parts = Array.isArray(body.parts) ? body.parts : [];
      if (!/\.pdf$/i.test(name)) return out({ error: "Chỉ nhận tệp PDF." }, 400);
      if (!(size > 0) || size > MAX) return out({ error: `Tệp phải nhỏ hơn ${MAX / MB} MB.` }, 400);
      const n = Math.ceil(size / CH);
      if (parts.length !== n) return out({ error: "Sai số mảnh." }, 400);
      for (let i = 0; i < n; i++) { const want = i < n - 1 ? CH : size - CH * (n - 1);
        if (Number(parts[i]?.size) !== want || !/^[0-9a-f]{64}$/.test(String(parts[i]?.sha || ""))) return out({ error: "Sai bản kê mảnh." }, 400); }
      if (body.thay) { const { data: mine } = await db.from("gopy_pdf").select("id,n").eq("st", "dang").eq("uid", user.id); for (const r of mine || []) await rm(r); }   // bỏ tệp dở cũ của mình
      const pk = parts.map((p: { size: number; sha: string }, i: number) => ({ i, size: Number(p.size), sha: String(p.sha) }));
      const { data: g, error: ge } = await db.rpc("gopy_pdf_giu", { p_uid: user.id, p_name: name, p_size: size, p_n: n, p_parts: pk, p_cap: CAP, p_max_dang: MAX_DANG, p_max_du: MAX_DU });
      if (ge) return out({ error: ge.message }, 500);
      if (g.error) return out({ error: g.error, used: g.used, cap: g.cap }, 409);
      const toks = [];
      for (let i = 0; i < n; i++) { const { data, error } = await st.createSignedUploadUrl(pth(g.id, i)); if (error) return out({ error: error.message }, 500); toks.push({ i, path: data.path, token: data.token }); }
      return out({ id: g.id, n, toks, used: g.used, cap: CAP });
    }

    const r = await row1(); if (!r) return out({ error: "Không có tệp." }, 404);
    if (act === "xoa") { if (anon) return out({ error: "Không được xoá." }, 403); if (r.st !== "xoa") await rm(r); return out({ ok: true }); }
    if (r.uid !== user.id) return out({ error: "Không phải tệp của bạn." }, 403);
    if (r.st !== "dang") return out({ error: r.st === "du" ? "Tệp đã gửi đủ." : "Tệp đã xoá." }, 409);

    if (act === "sign") {
      const need = (Array.isArray(body.need) ? body.need : []).map(Number).filter((i: number) => i >= 0 && i < r.n);
      const toks = [];
      for (const i of need) { await st.remove([pth(r.id, i)]); const { data, error } = await st.createSignedUploadUrl(pth(r.id, i)); if (error) return out({ error: error.message }, 500); toks.push({ i, path: data.path, token: data.token }); }
      return out({ id: r.id, toks });
    }
    if (act === "done") {
      const { data: ls } = await st.list(r.id, { limit: 100 });
      const have: Record<string, number> = {}; for (const o of ls || []) have[o.name] = Number((o.metadata as { size?: number })?.size || 0);
      const miss = (r.parts as { i: number; size: number }[]).filter(p => have[pth(r.id, p.i).split("/")[1]] !== p.size).map(p => p.i);
      if (miss.length) return out({ miss });
      await db.from("gopy_pdf").update({ st: "du", done_at: new Date().toISOString() }).eq("id", r.id);
      return out({ ok: true });
    }
    return out({ error: "Sai yêu cầu." }, 400);
  } catch (e) { return out({ error: String((e as Error).message || e) }, 500); }
});
