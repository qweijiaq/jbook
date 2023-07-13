import jwt from "jsonwebtoken";
/**
 * 1. 获取 token
 * 2. 判断 token, 如果有 token, 则处理 token，之后再验证 token 值
 */

export default defineEventHandler((event) => {
  // 获取 token
  let token = getHeader(event, "Authorization");
  if (token) {
    // 处理 token
    token = token.replace("Bearer ", "");
    // 密钥
    let secret = "xaxnsovnaovnai";
    try {
      // 验证 token
      let decoded = jwt.verify(token, secret);
      // 传递给上下文
      if (typeof decoded !== "string") {
        event.context.auth = {
          uid: decoded.data.data.uid,
        };
      }
    } catch (e) {
      console.log("jwt 解码失败", e);
    }
  }
});
