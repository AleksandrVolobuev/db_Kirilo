const { Client } = require("pg");
const { config } = require("./config");

const client = new Client(config);

start();

async function start() {
  try {
    await client.connect();
    console.log("Подключение к базе данных успешно!");

    //const result = await client.query(
    //  `CREATE TABLE  users (
    //    id SERIAL PRIMARY KEY
    //  );`function
    //);
    const result = await client.query(
      `INSERT INTO users  VALUES (1),(2),(3) RETURNING *;`
    );
    console.log(result);
    //console.log("Таблица 'users' создана или уже существует.");
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
  } finally {
    await client.end();
    console.log("Соединение закрыто.");
  }
}
