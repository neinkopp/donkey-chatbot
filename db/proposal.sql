CREATE DATABASE chatbotdb;

CREATE TABLE chatbotdb.customer (
  customer_id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE chatbotdb.messages (
  message_id INT NOT NULL AUTO_INCREMENT,
  customer_id INT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (message_id),
  FOREIGN KEY (customer_id) REFERENCES chatbotdb.customer(customer_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;