CREATE DATABASE IF NOT EXISTS articlesdb;

USE articlesdb;

-- INSERT INTO articles (title, description, image_url) VALUES
--     ('Article 1', 'some description', 'https://res.cloudinary.com/multipan/image/upload/v1638655307/samples/multipan/articulos/1638655304949torta_de_chocolate.jpg'),
--     ('Article 2', 'some description 2', 'https://res.cloudinary.com/multipan/image/upload/v1638650255/samples/multipan/Articulos/1638650252624carr.png')

CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL ,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE IF NOT EXISTS business (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    business_id INT NOT NULL,
    UNIQUE(employee_id, business_id),
    CONSTRAINT FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (business_id) REFERENCES business(id) ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS articles(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    quantity INT NOT NULL DEFAULT 0,
    business_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FOREIGN KEY(business_id) REFERENCES business(id) ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS photos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    public_id TEXT UNIQUE NOT NULL,
    image_url TEXT NOT NULL,
    article_id INT UNIQUE NOT NULL, 
    CONSTRAINT FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE CASCADE
)

-- CREATE TABLE IF NOT EXISTS permissions (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     all BOOLEAN,

-- )