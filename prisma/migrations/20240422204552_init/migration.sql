-- CreateTable
CREATE TABLE "ticket_tier" (
    "id" SERIAL NOT NULL,
    "service_fee" DECIMAL(10,2) NOT NULL,
    "buyer_price" DECIMAL(10,2) NOT NULL,
    "promoter_receives_price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ticket_tier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_settings" (
    "id" SERIAL NOT NULL,
    "service_fee_rate" INTEGER NOT NULL,
    "minimum_fee" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "fee_settings_pkey" PRIMARY KEY ("id")
);
