/**
 * 1. 判断用户是否登录
 * 2. 已登录则获取文章
 */

import { getDB } from "../../utils/db/mysql/index";
import { responseJson } from "../../utils/helper/index";
import { getLoginUid } from "../../utils/helper/index";

export default defineEventHandler(async (event) => {
  // 判断用户登录
  let uid = getLoginUid(event);
  if (uid === 0) {
    setResponseStatus(event, 401);
    return responseJson(1, "请先登录", {});
  }

  // 获取数据
  const body: any = await getQuery(event);
  body.page = Number(body.page);
  body.pageSize = Number(body.pageSize);

  const con = getDB();

  try {
    // 获取文章
    const rows: any = await con.query(
      "select * from `notes` where `uid` = ? LIMIT ? OFFSET ?",
      [uid, body.pageSize, (body.page - 1) * body.pageSize]
    );
    console.log(rows[0]);
    // 释放连接
    await con.end();
    return responseJson(0, "文章获取成功", { list: rows[0] });
  } catch (e) {
    // 释放连接
    await con.end();
    console.log(e);
    setResponseStatus(event, 500);
    return responseJson(1, "服务器错误", {});
  }
});
