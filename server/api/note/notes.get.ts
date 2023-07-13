/**
 * 1. 判断用户是否登录
 * 2. 已登录则获取用户文集下的文章
 */

import { getDB } from "../../utils/db/mysql/index";
import { responseJson } from "../../utils/helper/index";
import { getLoginUid } from "../../utils/helper/index";
import Joi from "joi";

export default defineEventHandler(async (event) => {
  // 判断用户登录
  let uid = getLoginUid(event);
  if (uid === 0) {
    setResponseStatus(event, 401);
    return responseJson(1, "请先登录", {});
  }

  // 获取数据
  const params: any = await getQuery(event);
  //   params.page = Number(params.page);
  //   params.pageSize = Number(params.pageSize);

  // 校验数据 joi
  const schema = Joi.object({
    notebookId: Joi.number().required(),
  });

  try {
    const value = await schema.validateAsync(params);
  } catch (e) {
    console.log(e);
    return responseJson(1, "参数错误", {});
  }

  const con = getDB();

  try {
    // 查询文章 - 文集关联表
    const rows: any = await con.query(
      "select `note_id` from `notebook_notes` where `notebook_id` = ?",
      [params.notebookId]
    );
    // 查询文章
    let noteIdList: any = [];
    // 遍历文章 id
    rows[0].map((v: any) => {
      noteIdList.push(v.note_id);
    });
    // 查询文章表
    const rows2 = await con.query(
      "SELECT * FROM `notes` WHERE `uid` = ? AND id IN (?)",
      [uid, noteIdList]
    );
    // 释放连接
    await con.end();
    return responseJson(0, "文章获取成功", { list: rows2[0] });
  } catch (e) {
    // 释放连接
    await con.end();
    setResponseStatus(event, 500);
    return responseJson(1, "服务器错误", {});
  }
});
