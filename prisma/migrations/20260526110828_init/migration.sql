-- CreateTable
CREATE TABLE "settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "jellyfin_url" TEXT NOT NULL DEFAULT '',
    "jellyfin_api_key" TEXT NOT NULL DEFAULT '',
    "jellyfin_user_id" TEXT NOT NULL DEFAULT '',
    "radarr_url" TEXT NOT NULL DEFAULT '',
    "radarr_api_key" TEXT NOT NULL DEFAULT '',
    "months_threshold" INTEGER NOT NULL DEFAULT 3,
    "schedule_enabled" INTEGER NOT NULL DEFAULT 0,
    "schedule_frequency" TEXT NOT NULL DEFAULT 'weekly',
    "schedule_hour" INTEGER NOT NULL DEFAULT 3,
    "schedule_last_run_at" TEXT NOT NULL DEFAULT '',
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "operation_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" TEXT NOT NULL DEFAULT 'info',
    "message" TEXT NOT NULL
);
