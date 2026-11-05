#!/bin/bash
# Mở phiên cloud: cài Graphify và dựng bản đồ mã (graphify-out/, không lưu trên git).
set -euo pipefail

# Chỉ chạy trên phiên cloud (máy trắng mỗi lần)
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

# Cài vào Python hệ thống: không có thư mục riêng để lưu dấu, nên kiểm bằng lệnh
if ! command -v graphify >/dev/null 2>&1; then
  pip install -q graphifyy 2>&1 | grep -v "Running pip as the 'root' user" || true
  command -v graphify >/dev/null 2>&1 || { echo "Không cài được graphifyy" >&2; exit 1; }
fi

# Dựng / cập nhật bản đồ: chỉ đọc mã (AST), không tốn tiền, có cache nên lần sau nhanh.
# Lỗi dựng bản đồ không chặn phiên.
graphify update . >/dev/null 2>&1 || echo "graphify update lỗi; chạy tay: graphify update ." >&2
