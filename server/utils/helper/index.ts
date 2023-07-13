export const responseJson = (code: number, msg: string, data: Object) => {
  return {
    code,
    msg,
    data,
  };
};

export const getLoginUid = (event: any) => {
  return event.context.auth ? event.context.auth.uid : 0;
};

// 获取当前时间
export const getTitle = () => {
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  let day = ("0" + currentDate.getDate()).slice(-2);
  return year + "-" + month + "-" + day;
};
