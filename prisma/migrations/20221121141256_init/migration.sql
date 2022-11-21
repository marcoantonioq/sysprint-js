-- CreateTable
CREATE TABLE "Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "adress" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "quota" INTEGER NOT NULL,
    "month_count" INTEGER NOT NULL,
    "thumbnailphoto" TEXT NOT NULL,
    "job_count" INTEGER NOT NULL,
    "modified" DATETIME NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Printers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "allow" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "month_count" INTEGER NOT NULL DEFAULT 0,
    "quota_period" INTEGER NOT NULL DEFAULT 0,
    "page_limite" INTEGER NOT NULL DEFAULT 0,
    "k_limit" INTEGER NOT NULL DEFAULT 0,
    "modified" DATETIME NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Jobs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "printersId" INTEGER NOT NULL,
    "pages" INTEGER NOT NULL,
    "copies" INTEGER NOT NULL,
    "host" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "params" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "modified" DATETIME NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Jobs_printersId_fkey" FOREIGN KEY ("printersId") REFERENCES "Printers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Settings" (
    "group" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY ("group", "key")
);

-- CreateTable
CREATE TABLE "Loggers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
