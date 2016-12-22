DROP DATABASE IF EXISTS jonfor;
CREATE DATABASE jonfor;
\c jonfor;
CREATE TABLE IF NOT EXISTS sounds (
  id SERIAL PRIMARY KEY,
  file_name VARCHAR(255),
  original_file_name VARCHAR(255),
  data_type VARCHAR(255),
  description TEXT,
  date_added DATE DEFAULT CURRENT_DATE
)