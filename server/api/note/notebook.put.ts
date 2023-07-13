/**
 * 1. 判断用户是否登录
 * 2. 已登录则修改文集
 */

import Joi from "joi";
import { getDB } from "../../utils/db/mysql/index";
import { responseJson } from "../../utils/helper/index";
import { getLoginUid } from "../../utils/helper/index";

interface Res {
  name: string;
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
      "select * from `notebooks` where `id` = ?",
      [body.id]
    );
    if (rows[0].length === 0) {
      return responseJson(1, "该文集不存在", {});
    }
    // 验证该用户是否拥有该文集的权限
    const rows1: any = await con.execute(
      "select * from `notebooks` where `id` = ? and `uid` = ?",
      [body.id, uid]
    );
    if (rows1[0].length === 0) {
      return responseJson(1, "该用户没有该文集的权限", {});
    }
    // 修改文集
    const rows2: any = await con.execute(
      "update `notebooks` set `name` = ? where `id` = ? and `uid` = ?",
      [body.name, body.id, uid]
    );
    // 释放连接
    await con.end();
    if (rows2[0].length === 0) {
      return responseJson(1, "文集修改失败", {});
    }
    return responseJson(0, "文集修改成功", {});
  } catch (e) {
    // 释放连接
    await con.end();
    console.log(e);
    return responseJson(1, "服务器错误", {});
  }
});
