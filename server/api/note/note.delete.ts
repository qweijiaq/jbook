/**
 * 1. 判断用户是否登录
 * 2. 已登录则删除文章
 */

import Joi from "joi";
import { getDB } from "../../utils/db/mysql/index";
import { responseJson } from "../../utils/helper/index";
import { getLoginUid } from "../../utils/helper/index";

interface Res {
  id: number;
}

export default defineEventHandler(async (event) => {
  // 判断用户登录
  let uid = getLoginUid(event);
  if (uid === 0) {
    setResponseStatus(event, 401);
    return responseJson(1, "请先登录", {});
  }

  // 获取数据
  const body: Res = await readBody(event);

  // 校验数据 joi
  const schema = Joi.object({
    id: Joi.number().required(),
  });

  try {
    const value = await schema.validateAsync(body);
  } catch (e) {
    return responseJson(1, "参数错误", {});
  }

  const con = getDB();

  try {
    // 删除文章
    const rows: any = await con.execute(
      "delete from `notes` where `id` = ? and `uid` = ?",
      [body.id, uid]
    );
    // 释放连接
    await con.end();
    if (rows[0].affectedRows === 0) {
      return responseJson(1, "文章删除失败", {});
    }
    return responseJson(0, "文集删除成功", {});
  } catch (e) {
    // 释放连接
    await con.end();
    console.log(e);
    return responseJson(1, "服务器错误", {});
  }
});
