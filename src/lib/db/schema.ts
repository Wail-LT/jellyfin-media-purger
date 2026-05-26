export const CREATE_SETTINGS_TABLE = `
  CREATE TABLE IF NOT EXISTS settings (
    id           INTEGER PRIMARY KEY CHECK (id = 1),
    jellyfin_url       TEXT NOT NULL DEFAULT '',
    jellyfin_api_key   TEXT NOT NULL DEFAULT '',
    jellyfin_user_id   TEXT NOT NULL DEFAULT '',
    radarr_url         TEXT NOT NULL DEFAULT '',
    radarr_api_key     TEXT NOT NULL DEFAULT '',
    months_threshold   INTEGER NOT NULL DEFAULT 3,
    updated_at         TEXT NOT NULL DEFAULT (datetime('now'))
  )
`;

export const SEED_SETTINGS = `
  INSERT OR IGNORE INTO settings (id) VALUES (1)
`;

export const CREATE_OPERATION_LOGS_TABLE = `
  CREATE TABLE IF NOT EXISTS operation_logs (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    level     TEXT NOT NULL DEFAULT 'info',
    message   TEXT NOT NULL
  )
`;
