/**
 * 1. 判断用户是否登录
 * 2. 已登录则创建文章
 */

import Joi from "joi";
import { getDB } from "../../utils/db/mysql/index";
import { responseJson, getTitle } from "../../utils/helper/index";
import { getLoginUid } from "../../utils/helper/index";

interface Res {
  noteId: number;
  title: string;
  content_md: string;
  state: number;
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
    noteId: Joi.number().required(),
    title: Joi.string().required(),
    content_md: Joi.string().required(),
    state: Joi.number().required(),
  });

  try {
    const value = await schema.validateAsync(body);
  } catch (e) {
    return responseJson(1, "参数错误", {});
  }

  const con = getDB();

  try {
    // 修改文章
    const rows: any = await con.execute(
      "update `notes` set `title` = ?, `content_md` = ?, `state` = ? where `id` = ? and `uid` = ?",
      [body.title, body.content_md, body.state, body.noteId, uid]
    );
    // 释放连接
    await con.end();
    console.log(rows[0]);
    if (rows[0].length === 0) {
      return responseJson(1, "文章更新失败", {});
    }
    return responseJson(0, "文章更新成功", {});
  } catch (e) {
    // 释放连接
    await con.end();
    console.log(e);
    return responseJson(1, "服务器错误", {});
  }
});
