/**
 * 1. 判断用户是否登录
 * 2. 已登录则创建文集
 */

import Joi from "joi";
import { getDB } from "../../utils/db/mysql/index";
import { responseJson } from "../../utils/helper/index";
import { getLoginUid } from "../../utils/helper/index";

interface Res {
  name: string;
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
    name: Joi.string().required(),
  });

  try {
    const value = await schema.validateAsync(body);
  } catch (e) {
    return responseJson(1, "参数错误", {});
  }

  const con = getDB();

  try {
    // 验证文集是否存在
    const rows: any = await con.execute(
      "select * from `notebooks` where `name` = ?",
      [body.name]
    );
    if (rows[0].affectedRows === 1) {
      return responseJson(1, "该文集已存在", {});
    }
    // 创建文集
    const rows2: any = await con.execute(
      "insert into `notebooks` (`name`, `uid`) value (?, ?)",
      [body.name, uid]
    );
    // 释放连接
    await con.end();
    if (rows2[0].affectedRows === 0) {
      return responseJson(1, "文集创建失败", {});
    }
    return responseJson(0, "文集创建成功", {});
  } catch (e) {
    // 释放连接
    await con.end();
    console.log(e);
    return responseJson(1, "服务器错误", {});
  }

  return {};
});
