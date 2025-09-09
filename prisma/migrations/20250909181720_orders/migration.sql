-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING_PAYMENT', 'PAID', 'CANCELED', 'EXPIRED', 'REFUNDED', 'FULFILLED');

-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('ZAR');

-- CreateEnum
CREATE TYPE "public"."ShippingMethod" AS ENUM ('STANDARD', 'EXPRESS');

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "shippingFee" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "currency" "public"."Currency" NOT NULL DEFAULT 'ZAR',
    "shippingMethod" "public"."ShippingMethod" NOT NULL,
    "deliveryWindow" "public"."DeliveryWindow" NOT NULL DEFAULT 'ANYTIME',
    "deliveryNotes" TEXT,
    "shipToName" TEXT NOT NULL,
    "shipToPhone" TEXT NOT NULL,
    "shipToLine1" TEXT NOT NULL,
    "shipToLine2" TEXT,
    "shipToSuburb" TEXT NOT NULL,
    "shipToProvince" "public"."Province" NOT NULL,
    "shipToPostal" TEXT NOT NULL,
    "shipToCountry" TEXT NOT NULL DEFAULT 'South Africa',
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "payReference" TEXT,
    "payAccessCode" TEXT,
    "payGateway" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "image" TEXT,
    "size" TEXT,
    "color" TEXT,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_payReference_key" ON "public"."Order"("payReference");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "public"."Order"("userId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "public"."Order"("status");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
