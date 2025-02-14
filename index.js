const { Client } = require("pg");
const { config } = require("./config");
const {_} = require("lodash");

const client = new Client(config);

//const p1 = fetch()
//console.log(p1);

start();

async function start() {
  try {
    await client.connect();
    console.log("✅ Подключение к базе данных успешно!");

    const u = {
      first_name: "Ivan",
      last_name: "Ivanov",
      email: "tect@mste.com",
      password: "12345",
      hair_color: "black",
      foot_size: 42,
      is_male: true,
      weight: 80,
      height: 1.8,
      birthday: "1990-01-01",
    };

    // Создание таблицы (если её нет)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(64) NOT NULL CHECK (first_name <> ''),
        last_name VARCHAR(64) NOT NULL CHECK (last_name <> ''),
        email VARCHAR(128) NOT NULL UNIQUE CHECK (email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
        "password" VARCHAR(64) NOT NULL CHECK ("password" <> ''),
        hair_color VARCHAR(64) NOT NULL,
        foot_size NUMERIC(3, 1) CHECK (foot_size BETWEEN 20 AND 50),
        is_male BOOLEAN,
        weight NUMERIC(5, 2) NOT NULL CHECK (weight BETWEEN 0.1 AND 999),
        height NUMERIC(3, 2) NOT NULL CHECK (height BETWEEN 0.5 AND 3),
        birthday DATE NOT NULL CHECK (birthday < CURRENT_DATE),
        created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
        updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp
      );
    `);

    // Вставка данных через параметризованный запрос
    const query = `
      INSERT INTO users (
        first_name, last_name, email, "password", hair_color, foot_size, is_male, weight, height, birthday
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (email) DO UPDATE 
      SET 
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        "password" = EXCLUDED."password",
        hair_color = EXCLUDED.hair_color,
        foot_size = EXCLUDED.foot_size,
        is_male = EXCLUDED.is_male,
        weight = EXCLUDED.weight,
        height = EXCLUDED.height,
        birthday = EXCLUDED.birthday,
        updated_at = CURRENT_TIMESTAMP;`;

    const values = [
      u.first_name,
      u.last_name,
      u.email,
      u.password,
      u.hair_color,
      u.foot_size,
      u.is_male,
      u.weight,
      u.height,
      u.birthday,
    ];

    const result = await client.query(query, values);

    console.log("✅ Данные успешно добавлены или обновлены:", result.rowCount);
  } catch (error) {
    console.error("❌ Ошибка при выполнении запроса:", error);
  } finally {
    await client.end();
    console.log("🔌 Соединение закрыто.");
  }
}
