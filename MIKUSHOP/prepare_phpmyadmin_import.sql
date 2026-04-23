SET NAMES utf8mb4;
START TRANSACTION;

ALTER TABLE `hangs`
  MODIFY `ten` VARCHAR(255) NOT NULL,
  MODIFY `hinh_anh` VARCHAR(255) NULL,
  MODIFY `gia` DECIMAL(12,2) NOT NULL,
  MODIFY `ton_kho` INT NOT NULL;

ALTER TABLE `maus`
  MODIFY `ten` VARCHAR(255) NOT NULL;

ALTER TABLE `kich_cos`
  MODIFY `ten` VARCHAR(255) NOT NULL;

ALTER TABLE `bien_the_hangs`
  MODIFY `gia` DECIMAL(12,2) NOT NULL,
  MODIFY `ton_kho` INT NOT NULL;

COMMIT;

DELIMITER //

CREATE PROCEDURE add_bien_the_hangs_ten_if_missing()
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'bien_the_hangs'
      AND COLUMN_NAME = 'ten'
  ) THEN
    ALTER TABLE `bien_the_hangs`
      ADD COLUMN `ten` VARCHAR(255) NULL AFTER `kich_co_id`;
  END IF;
END//

DELIMITER ;

CALL add_bien_the_hangs_ten_if_missing();
DROP PROCEDURE add_bien_the_hangs_ten_if_missing;
