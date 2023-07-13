import * as mysql from "mysql2";

// 连接池
export const getDB = () => {
  return mysql
    .createPool({
      host: "localhost",
      user: "root",
      database: "jbook",
      password: "weijia123",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
    .promise();
};
