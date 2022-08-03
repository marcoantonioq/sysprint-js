-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "thumbnail" TEXT,
    "status" BOOLEAN,
    "rules" TEXT,
    "quota" DECIMAL(65,30),
    "pages" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prints" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT,
    "quota" DECIMAL(65,30),
    "pages" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spools" (
    "job" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_print" INTEGER NOT NULL,
    "copies" DECIMAL(65,30) NOT NULL,
    "params" TEXT,
    "file" TEXT NOT NULL,
    "status" TEXT,
    "media" TEXT,
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spools_pkey" PRIMARY KEY ("job")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "prints_name_key" ON "prints"("name");

-- AddForeignKey
ALTER TABLE "spools" ADD CONSTRAINT "spools_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spools" ADD CONSTRAINT "spools_id_print_fkey" FOREIGN KEY ("id_print") REFERENCES "prints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
