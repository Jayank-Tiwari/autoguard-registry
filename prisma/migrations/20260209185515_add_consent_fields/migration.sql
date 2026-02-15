-- AlterTable
ALTER TABLE `vehicle` ADD COLUMN `consentGiven` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `consentTimestamp` DATETIME(3) NULL;
