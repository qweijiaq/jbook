import { getDB } from "../utils/db/mysql/index";

export default defineEventHandler(async () => {
  const [rows, fields] = await getDB().query(`SELECT * FROM users`);
  console.log("users", rows);
});
