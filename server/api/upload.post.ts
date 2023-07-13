/**
 * 1. 判断用户是否登录
 * 2. 上传头像
 */

import { getDB } from "../utils/db/mysql/index";
import { responseJson } from "../utils/helper/index";
import { getLoginUid } from "../utils/helper/index";
import path from "path";
import fs from "fs";

export default defineEventHandler(async (event) => {
  // 判断用户登录
  let uid = getLoginUid(event);
  if (uid === 0) {
    setResponseStatus(event, 401);
    return responseJson(1, "请先登录", {});
  }

  // 获取数据
  const body = await readMultipartFormData(event);

  if (body) {
    if (
      body[0].type !== "image/jpeg" &&
      body[0].type !== "image/png" &&
      body[0].type !== "image/jpg"
    ) {
      return responseJson(1, "图片的格式必须是 JPG / PNG 或 JPEG", {});
    }
    // 图片名称
    const fileName = Date.now() + "-" + body[0].filename;
    // 图片存储路径
    const filePath = path.join("./public", "img", fileName);
    // 图片路径
    const buffer = body[0].data;
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        return responseJson(1, "图片上传失败", {});
      }
    });
    // 存储图片的路径
    const avatarUrl = "/img/" + fileName;

    const con = getDB();
    try {
      // 插入 users 表中
      const rows: any = await con.execute(
        "update `users` set `avatar` = ? where `id` = ?",
        [avatarUrl, uid]
      );
      // 释放连接
      await con.end();
      console.log(rows[0]);
      if (rows[0].length === 0) {
        return responseJson(1, "头像上传数据库失败", {});
      }
      return responseJson(0, "头像上传数据库成功", {
        avatar: avatarUrl,
      });
    } catch (e) {
      // 释放连接
      await con.end();
      return responseJson(1, "服务器错误", {});
    }
  }
  return responseJson(1, "请上传头像", {});
});
