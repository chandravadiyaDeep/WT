-- StudentHub database starter schema for the local PHP/MySQL phase.
-- Run in phpMyAdmin or MySQL. Never use this database directly from GitHub Pages.
CREATE DATABASE IF NOT EXISTS student_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE student_hub;

CREATE TABLE IF NOT EXISTS students (
  student_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  enrollment_no VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(190) NOT NULL UNIQUE,
  mobile CHAR(10) NOT NULL,
  course VARCHAR(100) NOT NULL,
  year_of_study VARCHAR(30) NOT NULL,
  gender VARCHAR(30) NULL,
  date_of_birth DATE NULL,
  city VARCHAR(100) NULL,
  password_hash VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255) NULL,
  role ENUM('student','admin') NOT NULL DEFAULT 'student',
  status ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_students_name (name),
  INDEX idx_students_course_year (course,year_of_study)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS events (
  event_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  category ENUM('Technology','Workshops','Seminars','Sports','Cultural','Competitions','Other') NOT NULL DEFAULT 'Other',
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  venue VARCHAR(180) NOT NULL,
  seat_capacity INT UNSIGNED NOT NULL DEFAULT 0,
  organizer VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  badge VARCHAR(60) NULL,
  poster_filename VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_events_date (event_date),
  INDEX idx_events_category_date (category,event_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS registrations (
  registration_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  event_id BIGINT UNSIGNED NOT NULL,
  registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('registered','cancelled','attended') NOT NULL DEFAULT 'registered',
  UNIQUE KEY uq_registration_student_event (student_id,event_id),
  CONSTRAINT fk_registration_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  CONSTRAINT fk_registration_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
  INDEX idx_registration_event_status (event_id,status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS news (
  news_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255) NULL,
  published_status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_news_status_date (published_status,created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS feedback (
  feedback_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  category VARCHAR(80) NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_feedback_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT fk_feedback_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_messages (
  message_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  subject VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new','read','resolved') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_status_date (status,created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS discussions (
  discussion_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_discussion_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  INDEX idx_discussions_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS comments (
  comment_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  discussion_id BIGINT UNSIGNED NOT NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comment_discussion FOREIGN KEY (discussion_id) REFERENCES discussions(discussion_id) ON DELETE CASCADE,
  CONSTRAINT fk_comment_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS gallery (
  image_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  category VARCHAR(80) NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_logs (
  audit_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_student_id BIGINT UNSIGNED NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  details JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_student_id) REFERENCES students(student_id) ON DELETE SET NULL,
  INDEX idx_audit_date (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS remember_tokens (
  token_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_remember_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  INDEX idx_remember_expires (expires_at)
) ENGINE=InnoDB;

-- Create the first admin through a one-time PHP CLI/setup script using password_hash().
-- Never insert a plaintext admin password into this file.
-- Sample campus records can be inserted after the backend seed script is created.
