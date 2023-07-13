/**
 * 获取所有文集
 */

import { getDB } from "../utils/db/mysql/index";
import { responseJson } from "../utils/helper/index";
import { getLoginUid } from "../utils/helper/index";

export default defineEventHandler(async (event) => {
  const con = getDB();

  try {
    // 获取文集
    const rows: any = await con.execute("select * from `notebooks`");
    console.log(rows[0]);
    // 释放连接
    await con.end();
    return responseJson(0, "所有文集获取成功", { list: rows[0] });
  } catch (e) {
    // 释放连接
    await con.end();
    console.log(e);
    return responseJson(1, "服务器错误", {});
  }
});
