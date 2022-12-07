-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "groups" TEXT,
    "adress" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "quota" INTEGER,
    "month_count" INTEGER,
    "thumbnailphoto" TEXT,
    "job_count" INTEGER,
    "printers" TEXT,
    "default_printer" TEXT,
    "modified" DATETIME NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Printer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "allow" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "localization" TEXT,
    "groups" TEXT,
    "icon" TEXT,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "month_count" INTEGER NOT NULL DEFAULT 0,
    "quota_period" INTEGER NOT NULL DEFAULT 0,
    "page_limite" INTEGER NOT NULL DEFAULT 0,
    "k_limit" INTEGER NOT NULL DEFAULT 0,
    "modified" DATETIME NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jobid" INTEGER,
    "userid" INTEGER NOT NULL,
    "printerid" INTEGER NOT NULL,
    "pages" INTEGER,
    "host" TEXT,
    "filename" TEXT NOT NULL,
    "size" INTEGER,
    "encoding" TEXT,
    "path" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "md5" TEXT,
    "params" TEXT,
    "status" TEXT,
    "complete" BOOLEAN DEFAULT false,
    "description" TEXT,
    "modified" DATETIME NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Job_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Job_printerid_fkey" FOREIGN KEY ("printerid") REFERENCES "Printer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Setting" (
    "group" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY ("group", "key")
);

-- CreateTable
CREATE TABLE "Logger" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Printer_name_key" ON "Printer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Printer_path_key" ON "Printer"("path");

-- CreateIndex
CREATE INDEX "Job_userid_printerid_idx" ON "Job"("userid", "printerid");
