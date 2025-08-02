-- CreateTable
CREATE TABLE "public"."Room" (
    "roomId" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("roomId")
);
