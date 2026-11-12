// 📄 Góp ý kèm PDF lớn (v157, specs/014-gopy-pdf-lon). Gói Supabase Free: 50 MB / tệp, 1 GB tổng.
// App cắt PDF thành mảnh CH = 25 MB, hàm này giữ chỗ (trần CAP), cấp đường tải lên có ký tên từng mảnh, kiểm đủ mảnh.
// App không đọc lại được mảnh nào (tài liệu riêng tư; mọi máy đang dùng chung tài khoản). Claude đọc / xoá qua header x-pdf-key: khoá tạm trong bảng gopy_pdf_key (Claude tạo bằng SQL, hết hạn 24 giờ) hoặc secret PDF_CLAUDE_KEY nếu có.
// Vào (app, cần JWT): { act: 'info' } · { act: 'st', ids } · { act: 'start', name, size, parts: [{ size, sha }], thay? } · { act: 'sign', id, need: [i] } · { act: 'done', id } · { act: 'xoa', id }
// v158 (người gửi): { act: 'mo', id } ≤ 50 MB · { act: 'sua', id, name?, txt? } · { act: 'doi', old, id } · start { doi: id cũ }
// v159 (chép từ Google Drive, người dùng đã đăng nhập): { act: 'ginfo', fid, tok } · { act: 'gstart', fid, tok, doi? } · { act: 'gcopy', id, i, tok } (tok = mã truy cập drive.file, KHÔNG ghi lại)
// Vào (Claude, x-pdf-key): { act: 'list' } · { act: 'get', id } · { act: 'del', id }
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { okIds, driveMeta, driveRange } from "./drive.js";

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-pdf-key", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const out = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, "content-type": "application/json" } });
const MB = 1024 * 1024, VIEW = 50 * MB, CH = 25 * MB, MAX = 450 * MB, CAP = 800 * MB, MAX_DANG = 1, MAX_DU = 2, STALE = 2 * 864e5, B = "gopy-pdf";
const okName = (x: unknown) => { let n = String(x || "").replace(/[\u0000-\u001f\/\\]/g, " ").trim().slice(0, 200); if (!n) return ""; if (!/\.pdf$/i.test(n)) n += ".pdf"; return n; };
const mbTxt = (b: number) => (b < 10 * MB ? (b / MB).toFixed(1).replace(".", ",") : String(Math.round(b / MB))) + " MB";
const pdfLine = (txt: string, line: string) => String(txt || "").split("\n").filter(l => !l.startsWith("📄 ")).join("\n").trimEnd() + "\n" + line;
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
      let ok = !!key && hk === key;
      if (!ok && /^[0-9a-f]{48}$/.test(hk)) { const { data: kk } = await db.from("gopy_pdf_key").select("k").eq("k", hk).gt("at", new Date(Date.now() - 864e5).toISOString()).maybeSingle(); ok = !!kk; }
      if (!ok) return out({ error: "Sai khoá." }, 403);
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
    if (act === "st") {   // trạng thái tệp (không lộ nội dung); người ẩn danh chỉ thấy tệp của mình; kèm chữ góp ý của tệp mình gửi
      const ids = (Array.isArray(body.ids) ? body.ids : []).map(String).filter((x: string) => /^[0-9a-f-]{36}$/.test(x)).slice(0, 200);
      let q = db.from("gopy_pdf").select("id,uid,name,size,n,st,src").in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      if (anon) q = q.eq("uid", user.id);
      const { data } = await q; const rows = (data || []).map(r => ({ id: r.id, name: r.name, size: r.size, n: r.n, st: r.st, src: r.src, mine: r.uid === user.id }));
      const mine = rows.filter(r => r.mine).map(r => r.id);
      if (mine.length) { const { data: g } = await db.from("gopy").select("id,txt,ctx").in("ctx->pdf->>id", mine);
        for (const x of g || []) { const r = rows.find(y => y.id === x.ctx?.pdf?.id); if (r) Object.assign(r, { gid: x.id, txt: x.txt }); } }
      return out({ rows });
    }

    if (act === "ginfo" || act === "gstart") {   // v159: tệp PDF ở Google Drive
      if (!okIds(body.fid, body.tok)) return out({ error: "ma" }, 400);
      const m = await driveMeta(body.fid, body.tok);
      if (m.error) return out(m, m.error === "tok" ? 401 : 400);
      if (m.size > MAX) return out({ error: "lon", size: m.size }, 400);
      if (act === "ginfo") return out({ name: m.name, size: m.size, n: Math.ceil(m.size / CH) });
      const nm = okName(m.name) || "tai-lieu.pdf";
      const n = Math.ceil(m.size / CH), pk = Array.from({ length: n }, (_, i) => ({ i, size: i < n - 1 ? CH : m.size - CH * (n - 1), sha: null }));
      if (body.thay) { const { data: mine } = await db.from("gopy_pdf").select("id,n").eq("st", "dang").eq("uid", user.id); for (const r of mine || []) await rm(r); }
      let skip = null;
      if (body.doi) { const { data: o } = await db.from("gopy_pdf").select("id,uid,st").eq("id", String(body.doi)).maybeSingle(); if (o && o.uid === user.id && o.st !== "xoa") skip = o.id; }
      const { data: g, error: ge } = await db.rpc("gopy_pdf_giu2", { p_uid: user.id, p_name: nm, p_size: m.size, p_n: n, p_parts: pk, p_cap: CAP, p_max_dang: MAX_DANG, p_max_du: MAX_DU, p_skip: skip });
      if (ge) return out({ error: ge.message }, 500);
      if (g.error) return out({ error: g.error, used: g.used, cap: g.cap }, 409);
      await db.from("gopy_pdf").update({ src: "drive", fid: String(body.fid) }).eq("id", g.id);
      return out({ id: g.id, n, name: nm, size: m.size, used: g.used, cap: CAP });
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
      let skip = null;   // v158: thay tệp: tệp cũ (của mình, còn) không tính vào trần
      if (body.doi) { const { data: o } = await db.from("gopy_pdf").select("id,uid,st").eq("id", String(body.doi)).maybeSingle(); if (o && o.uid === user.id && o.st !== "xoa") skip = o.id; }
      const { data: g, error: ge } = await db.rpc("gopy_pdf_giu2", { p_uid: user.id, p_name: name, p_size: size, p_n: n, p_parts: pk, p_cap: CAP, p_max_dang: MAX_DANG, p_max_du: MAX_DU, p_skip: skip });
      if (ge) return out({ error: ge.message }, 500);
      if (g.error) return out({ error: g.error, used: g.used, cap: g.cap }, 409);
      const toks = [];
      for (let i = 0; i < n; i++) { const { data, error } = await st.createSignedUploadUrl(pth(g.id, i)); if (error) return out({ error: error.message }, 500); toks.push({ i, path: data.path, token: data.token }); }
      return out({ id: g.id, n, toks, used: g.used, cap: CAP });
    }

    const r = await row1(); if (!r) return out({ error: "Không có tệp." }, 404);
    if (act === "xoa") { if (anon && r.uid !== user.id) return out({ error: "Không được xoá." }, 403); if (r.st !== "xoa") await rm(r);
      const { data: gg } = await db.from("gopy").select("id,txt").eq("ctx->pdf->>id", r.id).limit(1);
      if (gg && gg[0]) await db.from("gopy").update({ txt: pdfLine(gg[0].txt, `📄 đã xoá · ${r.name}`) }).eq("id", gg[0].id);
      return out({ ok: true }); }
    if (r.uid !== user.id) return out({ error: "Không phải tệp của bạn." }, 403);
    const gRow = async (pid: string) => { const { data } = await db.from("gopy").select("id,txt,ctx").eq("ctx->pdf->>id", pid).limit(1); return data && data[0]; };
    if (act === "mo") {   // v158: xem trong app, chỉ tệp ≤ 50 MB
      if (r.st !== "du") return out({ error: "Tệp chưa đủ phần hoặc đã xoá." }, 409);
      if (r.size > VIEW) return out({ error: "lon" }, 413);
      const urls = []; for (let i = 0; i < r.n; i++) { const { data, error } = await st.createSignedUrl(pth(r.id, i), 600); if (error) return out({ error: error.message }, 500); urls.push(data.signedUrl); }
      return out({ urls, parts: r.parts, name: r.name, size: r.size });
    }
    if (act === "sua") {   // v158: đổi tên tệp + sửa chữ góp ý
      const name = body.name != null ? okName(body.name) : r.name; if (!name) return out({ error: "Tên tệp trống." }, 400);
      const g = await gRow(r.id); let txt = g ? g.txt : "";
      if (body.txt != null) { txt = String(body.txt).trim().slice(0, 4000); if (!txt) return out({ error: "Nội dung góp ý trống." }, 400); }
      txt = pdfLine(txt, r.st === "xoa" ? `📄 đã xoá · ${name}` : `📄 ${name} · ${mbTxt(Number(r.size))}`);
      await db.from("gopy_pdf").update({ name }).eq("id", r.id);
      if (g) await db.from("gopy").update({ txt, ctx: { ...g.ctx, pdf: { ...g.ctx.pdf, name } } }).eq("id", g.id);
      return out({ ok: true, name, txt, gid: g ? g.id : null });
    }
    if (act === "doi") {   // v158: góp ý trỏ sang tệp mới (đã đủ phần), xoá tệp cũ
      if (r.st !== "du") return out({ error: "Tệp mới chưa đủ phần." }, 409);
      const { data: o } = await db.from("gopy_pdf").select("*").eq("id", String(body.old || "")).maybeSingle();
      if (!o || o.uid !== user.id) return out({ error: "Không phải tệp của bạn." }, 403);
      const g = await gRow(o.id); let txt = "";
      if (g) { txt = pdfLine(g.txt, `📄 ${r.name} · ${mbTxt(Number(r.size))}`); await db.from("gopy").update({ txt, ctx: { ...g.ctx, pdf: { id: r.id, name: r.name, size: r.size, n: r.n } } }).eq("id", g.id); }
      if (o.st !== "xoa") await rm(o);
      return out({ ok: true, txt, gid: g ? g.id : null });
    }
    if (r.st !== "dang") return out({ error: r.st === "du" ? "Tệp đã gửi đủ." : "Tệp đã xoá." }, 409);

    if (act === "gcopy") {   // v159: chép phần i từ Drive (mã tệp lấy từ dòng đã giữ chỗ, trang không đổi được)
      if (r.src !== "drive" || !r.fid) return out({ error: "Không phải tệp từ Drive." }, 400);
      if (!okIds(r.fid, body.tok)) return out({ error: "ma" }, 400);
      const i = Number(body.i); if (!Number.isInteger(i) || i < 0 || i >= r.n) return out({ error: "phan" }, 400);
      const d = await driveRange(r.fid, body.tok, i, Number(r.size), CH);
      if (d.error) return out(d, d.error === "tok" ? 401 : 400);
      const sha = [...new Uint8Array(await crypto.subtle.digest("SHA-256", d.buf))].map(x => x.toString(16).padStart(2, "0")).join("");
      const { error: ue } = await st.upload(pth(r.id, i), d.buf, { contentType: "application/octet-stream", upsert: true });
      if (ue) return out({ error: "luu", msg: ue.message }, 500);
      const parts = (r.parts as { i: number; size: number; sha: string | null }[]).map(p => p.i === i ? { ...p, sha } : p);
      await db.from("gopy_pdf").update({ parts }).eq("id", r.id);
      return out({ ok: true, sha });
    }
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
