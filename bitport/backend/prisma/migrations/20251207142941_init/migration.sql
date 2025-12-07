-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "from_symbol" TEXT NOT NULL,
    "to_symbol" TEXT NOT NULL,
    "amount_from" DECIMAL(20,8) NOT NULL,
    "amount_to" DECIMAL(20,8) NOT NULL,
    "price_usd" DECIMAL(20,8) NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_user_id" ON "history"("user_id");

-- CreateIndex
CREATE INDEX "idx_created_at" ON "history"("created_at");

-- CreateIndex
CREATE INDEX "idx_symbols" ON "history"("from_symbol", "to_symbol");

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
