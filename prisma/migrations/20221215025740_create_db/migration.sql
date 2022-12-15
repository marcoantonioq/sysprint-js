-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `groups` VARCHAR(191) NULL,
    `adress` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `quota` INTEGER NULL,
    `month_count` INTEGER NULL,
    `thumbnailphoto` VARCHAR(191) NULL,
    `job_count` INTEGER NULL,
    `printers` VARCHAR(191) NULL,
    `default_printer` VARCHAR(191) NULL,
    `modified` DATETIME(3) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Printer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `allow` BOOLEAN NOT NULL DEFAULT true,
    `name` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `localization` VARCHAR(191) NULL,
    `connection` VARCHAR(191) NULL,
    `definitions` VARCHAR(191) NULL,
    `driver` VARCHAR(191) NULL,
    `groups` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL,
    `default` BOOLEAN NOT NULL DEFAULT false,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `selected` BOOLEAN NOT NULL DEFAULT false,
    `month_count` INTEGER NOT NULL DEFAULT 0,
    `quota_period` INTEGER NOT NULL DEFAULT 0,
    `page_limite` INTEGER NOT NULL DEFAULT 0,
    `k_limit` INTEGER NOT NULL DEFAULT 0,
    `modified` DATETIME(3) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Printer_name_key`(`name`),
    UNIQUE INDEX `Printer_path_key`(`path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Spool` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jobid` INTEGER NULL,
    `user` VARCHAR(191) NOT NULL,
    `printer` VARCHAR(191) NOT NULL,
    `pages` INTEGER NULL,
    `host` VARCHAR(191) NULL,
    `filename` VARCHAR(191) NOT NULL,
    `size` INTEGER NULL,
    `encoding` VARCHAR(191) NULL,
    `path` VARCHAR(191) NOT NULL,
    `mimetype` VARCHAR(191) NOT NULL,
    `md5` VARCHAR(191) NULL,
    `params` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `complete` BOOLEAN NULL DEFAULT false,
    `description` VARCHAR(191) NULL,
    `modified` DATETIME(3) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Spool_user_printer_idx`(`user`, `printer`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `group` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `enable` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`group`, `key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Logger` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
