/**
 * 1. 获取数据
 * 2. 数据校验
 * 3. 密码加密
 * 4. 判断账号是否注册
 * 5. 创建账号
 */

import Joi from "joi";
import md5 from "md5";
import { getDB } from "../../utils/db/mysql/index";
import { responseJson } from "../../utils/helper/index";

interface Res {
  nickname?: string;
  password: string;
  phone: string;
}

export default defineEventHandler(async (event) => {
  // 获取数据
  const body: Res = await readBody(event);
  // console.log("111", body);

  // 校验数据 joi
  const schema = Joi.object({
    nickname: Joi.string().min(2).max(10).required(),
    password: Joi.string().required(),
    phone: Joi.string().pattern(/1\d{10}/),
  });

  try {
    const value = await schema.validateAsync(body);
  } catch (e) {
    return responseJson(1, "参数错误", {});
  }

  // 密码加密 md5
  let salt = "cahcbshachskNi";
  let password = md5(md5(body.password) + salt);
  const con = getDB();

  try {
    // 查询数据库
    const [rows] = await con.execute(
      "select * from `users` where `phone` = ?",
      [body.phone]
    );
    if (rows instanceof Array && rows.length > 0) {
      return responseJson(1, "账号已注册", {});
    }

    // 创建账号
    const rows2: any = await con.execute(
      "insert into `users` (`nickname`, `phone`, `password`) value (?, ?, ?)",
      [body.nickname, body.phone, password]
    );
    // 释放连接
    await con.end();
    if (rows2[0].affectedRows === 1) {
      return responseJson(0, "注册成功", {});
    }
  } catch (e) {
    // 释放连接
    await con.end();
    return responseJson(1, "服务器错误", {});
  }

  return {};
});
