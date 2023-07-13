/**
 * 获取所有文章
 */

import { getDB } from "../utils/db/mysql/index";
import { responseJson } from "../utils/helper/index";
import { getLoginUid } from "../utils/helper/index";

export default defineEventHandler(async (event) => {
  const con = getDB();

  // 获取数据
  const body: any = await getQuery(event);
  body.page = Number(body.page);
  body.pageSize = Number(body.pageSize);

  try {
    // 获取文集
    const rows: any = await con.query(
      "select * from `notes` LIMIT ? OFFSET ?",
      [body.pageSize, (body.page - 1) * body.pageSize]
    );
    console.log(rows[0]);
    // 释放连接
    await con.end();
    return responseJson(0, "文章获取成功", { list: rows[0] });
  } catch (e) {
    // 释放连接
    await con.end();
    console.log(e);
    return responseJson(1, "服务器错误", {});
  }
});
