-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(128) NOT NULL,
    "hash" VARCHAR(512) NOT NULL,
    "salt" VARCHAR(256) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
