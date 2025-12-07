-- CreateTable
CREATE TABLE "watchlist" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "coin_name" TEXT NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_alerts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "coin_name" TEXT NOT NULL,
    "target_price" DECIMAL(20,8) NOT NULL,
    "condition" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "triggered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_watchlist_user_id" ON "watchlist"("user_id");

-- CreateIndex
CREATE INDEX "idx_watchlist_symbol" ON "watchlist"("symbol");

-- CreateIndex
CREATE INDEX "idx_watchlist_created_at" ON "watchlist"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "watchlist_user_id_symbol_key" ON "watchlist"("user_id", "symbol");

-- CreateIndex
CREATE INDEX "idx_alert_user_id" ON "price_alerts"("user_id");

-- CreateIndex
CREATE INDEX "idx_alert_symbol" ON "price_alerts"("symbol");

-- CreateIndex
CREATE INDEX "idx_alert_is_active" ON "price_alerts"("is_active");

-- CreateIndex
CREATE INDEX "idx_alert_created_at" ON "price_alerts"("created_at");

-- AddForeignKey
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
