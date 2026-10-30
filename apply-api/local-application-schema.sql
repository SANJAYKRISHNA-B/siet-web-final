-- Local SQLite mirror of the existing cPanel sietasru_masterdb.application table.
-- Keep this in sync with the columns shown in phpMyAdmin; this does not alter cPanel.
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  email VARCHAR(50) NOT NULL,
  location VARCHAR(50) NOT NULL,
  course VARCHAR(30) NOT NULL,
  message TEXT NOT NULL,
  other VARCHAR(30) NOT NULL,
  previous_qualification VARCHAR(150) DEFAULT NULL,
  course_level VARCHAR(100) DEFAULT NULL,
  academic_qualification_marks VARCHAR(150) DEFAULT NULL
);
