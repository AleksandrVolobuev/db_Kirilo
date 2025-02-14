DROP TABLE users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY ,
  first_name VARCHAR(64) NOT NULL CHECK (firstName <> ''), -- Имя
  last_name VARCHAR(64) NOT NULL CHECK (lastName <> ''), -- Фамилия
  email VARCHAR(128) NOT NULL UNIQUE CHECK (email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'), -- Email
  "password" VARCHAR(64) NOT NULL CHECK("password"<> ''), -- Пароль
  hair_color VARCHAR(64) CHECK (hair_color <> ''), -- Цвет волос
  foot_size NUMERIC(3, 1)  CONSTRAINT valid_foot_size CHECK (foot_size BETWEEN 20 AND 50), -- Размер обуви
  is_male BOOLEAN, -- Пол
  weight NUMERIC(5, 2) NOT NULL CONSTRAINT valid_weight CHECK (weight BETWEEN 0.1 AND 999), -- Вес в килограммах
  height NUMERIC(3, 2) NOT NULL CONSTRAINT valid_height CHECK (height BETWEEN 0.5 AND 3), -- Рост в метрах
  rating NUMERIC(3, 2) NOT NULL DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5), -- Рейтинг пользователя
  birthday DATE NOT NULL CHECK (birthday < CURRENT_DATE), -- Дата рождения
  CONSTRAINT unique_full_name UNIQUE (firstName, lastName), -- Уникальность комбинации имени и фамилии
  CONSTRAINT non_empty_full_name CHECK (firstName || lastName <> '') -- Проверка, чтобы комбинация имени и фамилии не была пустой
);