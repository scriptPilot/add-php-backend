CREATE TABLE IF NOT EXISTS `users` (
  `id` INTEGER(8) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `tasks` (
  `id` INTEGER(8) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `userId` INTEGER(8) NOT NULL DEFAULT 0,
  `title` VARCHAR(255) NOT NULL DEFAULT "",
  `done` TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;