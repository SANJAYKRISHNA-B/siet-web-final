-- Run once in phpMyAdmin when the existing applicant table has no district column.
SET @siet_district_column_exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'applicant'
    AND COLUMN_NAME = 'district'
);

SET @siet_district_migration = IF(
  @siet_district_column_exists = 0,
  'ALTER TABLE `applicant` ADD COLUMN `district` VARCHAR(100) DEFAULT NULL AFTER `city`',
  'SELECT ''district column already exists'''
);

PREPARE siet_district_statement FROM @siet_district_migration;
EXECUTE siet_district_statement;
DEALLOCATE PREPARE siet_district_statement;
