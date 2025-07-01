CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Employee') DEFAULT 'Employee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default Admin
-- Generate hash using bcrypt.hashSync('Admin@123', 10)
INSERT INTO users (username, password, role) VALUES (
  'Admin User', 
  '$2b$10$OeOLwUqOjgRr6Ox/epcG0OYZKzM3ZOmMfLCLrMg1i9brPQj9ArX/W', 
  'Admin'
);