interface myFetchOptions {
  headers?: Record<string, string>;
  [key: string]: any;
}

export const useHttpFetch = (url: string, opt: myFetchOptions) => {
  // token
  const token = useCookie("token");
  // 添加请求头和 token
  const headers = {
    ...opt.headers,
    ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
  };
  opt.headers = headers;

  return useFetch(url, {
    ...opt,
    baseURL: "http://127.0.0.1:3000",
    onRequest({ request, options }) {
      console.log("request", request);
    },
    onRequestError({ request, options, error }) {
      console.log("request", request);
    },
    onResponse({ request, response, options }) {
      console.log("response", response);
    },
    onResponseError({ request, response, options }) {
      console.log("response", response);
    },
  });
};

// 定义接口
export const useInfoFetch = (opt: myFetchOptions) => {
  return useHttpFetch("/user/info", opt);
};

// 注册接口
export const registerFetch = (opt: myFetchOptions) => {
  return useHttpFetch("/api/auth/register", opt);
};
