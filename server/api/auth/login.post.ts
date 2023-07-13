/**
 * 1. 获取客户端传来的手机号和密码
 * 2. 数据校验
 * 3. 查询数据库，如果不存在手机则返回手机号不存在或密码错误
 * 4. 如果已经注册，并且密码错误，就生成 token，并返回给客户端，token 根据 jwt 生成
 */

import Joi from "joi";
import md5 from "md5";
import jwt from "jsonwebtoken";
import { getDB } from "../../utils/db/mysql/index";
import { responseJson } from "../../utils/helper/index";

interface Res {
  password: string;
  phone: string;
}

export default defineEventHandler(async (event) => {
  // 获取数据
  const body: Res = await readBody(event);

  // 校验数据 joi
  const schema = Joi.object({
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
    const rows: any = await con.execute(
      "select * from `users` where `phone` = ? and `password` = ?",
      [body.phone, password]
    );
    if (rows[0].length === 0) {
      return responseJson(1, "账号不存在或密码错误", {});
    }
    // 释放连接
    await con.end();
    // 生成 token jsonwebtoken
    let secret = "xaxnsovnaovnai"; // 密钥
    let token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        data: {
          data: {
            uid: rows[0][0].id,
          },
        },
      },
      secret
    );
    // 返回消息
    return responseJson(0, "ok", {
      accessToken: token,
      nickname: rows[0][0].nickname,
      phone: rows[0][0].phone,
    });
  } catch (e) {
    // 释放连接
    await con.end();
    return responseJson(1, "服务器错误", {});
  }

  return {};
});
