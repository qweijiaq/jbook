/**
 * 1. 判断用户是否登录
 * 2. 已登录则创建文章
 */

import Joi from "joi";
import { getDB } from "../../utils/db/mysql/index";
import { responseJson, getTitle } from "../../utils/helper/index";
import { getLoginUid } from "../../utils/helper/index";

interface Res {
  notebookId: number;
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
    notebookId: Joi.number().required(),
  });

  try {
    const value = await schema.validateAsync(body);
  } catch (e) {
    return responseJson(1, "参数错误", {});
  }

  const con = getDB();

  try {
    // 创建文章
    const rows: any = await con.execute(
      "insert into `notes` (`title`, `content_md`, `state`, `uid`) value (?, ?, ?, ?)",
      [getTitle(), "", 1, uid]
    );
    console.log(rows[0]);
    if (rows[0].affectedRows === 0) {
      return responseJson(1, "文章创建失败", {});
    }
    // 关联文集表
    const rows2: any = await con.execute(
      "insert into `notebook_notes` (`notebook_id`, `note_id`) value (?, ?)",
      [body.notebookId, rows[0].insertId]
    );
    // 释放连接
    await con.end();
    if (rows[0].affectedRows === 0) {
      return responseJson(1, "文章关联失败", {});
    }
    return responseJson(0, "文章创建并关联成功", {});
  } catch (e) {
    // 释放连接
    await con.end();
    console.log(e);
    return responseJson(1, "服务器错误", {});
  }
});
