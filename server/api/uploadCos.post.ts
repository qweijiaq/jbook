/**
 * 1. 判断用户是否登录
 * 2. 上传头像到腾讯云
 */

import { getDB } from "../utils/db/mysql/index";
import { responseJson } from "../utils/helper/index";
import { getLoginUid } from "../utils/helper/index";
import COS from "cos-nodejs-sdk-v5";
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
    // 初始化
    const config = useRuntimeConfig();
    const cos = new COS({
      SecretId: config.SecretId,
      SecretKey: config.SecretKey,
    });

    // 图片名称
    const fileName = Date.now() + "-" + body[0].filename;
    // 图片内容
    const buffer = body[0].data;
    // 请求文件
    const data = await cos.putObject({
      Bucket: "jbook-1313210861",
      Region: "ap-chongqing",
      Key: fileName,
      Body: buffer,
    });
    const avatarUrl = `https://${data.Location}`;

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
