CREATE SCHEMA `uni_thrift` ;

CREATE TABLE `uni_thrift`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `authority` VARCHAR(45) NOT NULL,
  role ENUM('admin','user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));
INSERT INTO `uni_thrift`.`users` (`id`, `name`, `email`, `password`, `authority`) VALUES ('1', 'Thina Maliwa', 'ThinaM@gmail.com', 'Teemoney1', 'admin');
INSERT INTO `uni_thrift`.`users` (`id`, `name`, `email`, `password`, `authority`) VALUES ('2', 'Yaqoob Samsodien', 'YaqoobS@gmail.com', 'Yaqoob2', 'admin');
INSERT INTO `uni_thrift`.`users` (`id`, `name`, `email`, `password`, `authority`) VALUES ('3', 'Tentsoalo', 'TK@gmmail.com', 'TK3', 'admin');
INSERT INTO `uni_thrift`.`users` (`id`, `name`, `email`, `password`, `authority`) VALUES ('4', 'Emihle Dumo', 'EmihleD@gmail.com', 'Emza4', 'admin');
INSERT INTO `uni_thrift`.`users` (`id`, `name`, `email`, `password`, `authority`) VALUES ('5', 'Michael Jackson', 'MichaelJ@yahoo.com', 'Mike5', 'user');
INSERT INTO `uni_thrift`.`users` (`id`, `name`, `email`, `password`, `authority`) VALUES ('6', 'Jordan Carter', 'JordanC@yahoo.com', 'Jordy6', 'user');
INSERT INTO `uni_thrift`.`users` (`id`, `name`, `email`, `password`, `authority`) VALUES ('7', 'Ed Hardy', 'EdH@yahoo.com', 'Ed7', 'user');
INSERT INTO `uni_thrift`.`users` (`id`, `name`, `email`, `password`, `authority`) VALUES ('8', 'Austin Babbit', 'Austinb@yahoo.com', 'Aussie8', 'user');
INSERT INTO `uni_thrift`.`users` (`id`, `name`, `email`, `password`, `authority`) VALUES ('9', 'Richard Stark', 'RichardS@yahoo.com', 'Rich9', 'user');
INSERT INTO `uni_thrift`.`users` (`id`, `name`, `email`, `password`, `authority`) VALUES ('10', 'Johnny Dang', 'JohnnyD@yahoo.com', 'Johnny10', 'user');

ALTER TABLE `uni_thrift`.`users` 
ADD COLUMN `authority` VARCHAR(45) NOT NULL AFTER `password`;

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    size VARCHAR(10),
    category VARCHAR(50),
    image_url VARCHAR(255),
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `uni_thrift`.`selller_reviews` (
  `seller_id` INT NOT NULL,
  `id` INT NULL,
  `seller_name` VARCHAR(45) NULL,
  `reviwer_id` INT NULL,
  `reviewer_name` VARCHAR(45) NULL,
  `rating` INT NULL,
  `comment` VARCHAR(250) NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`seller_id`));

CREATE TABLE `uni_thrift`.`orders` (
  `id` INT NOT NULL,
  `buyer_id` VARCHAR(45) NULL,
  `total_amount` DECIMAL(10,5) NULL,
  `payment_status` VARCHAR(45) NULL,
  `created_at` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));
    

  
