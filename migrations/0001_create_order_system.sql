-- 深洋远瞰：询价接单系统数据库结构
-- Cloudflare D1 / SQLite

CREATE TABLE IF NOT EXISTS price_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  company TEXT,
  contact TEXT NOT NULL,
  cargo_type TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  weight_volume REAL NOT NULL,
  transport TEXT NOT NULL,
  remark TEXT,
  status TEXT NOT NULL DEFAULT '新询价',
  quoted_price TEXT,
  internal_note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_price_requests_status ON price_requests(status);
CREATE INDEX IF NOT EXISTS idx_price_requests_created_at ON price_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_price_requests_route ON price_requests(origin, destination, transport);
