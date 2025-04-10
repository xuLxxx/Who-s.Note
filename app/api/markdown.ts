// import store from "@/store";
import { hashObject } from "@/utils/object";
import server from "@/utils/request";

export const uploadFile = (data: FormData) => {
  return server.requestT<{
    code: number;
    data: { fileUrl: string; fileName: string; fileType: string };
    message: string;
  }>({
    method: "post",
    url: "/upload",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
};

export const saveMarkdown = (data: Object) => {
  return server.requestT<{ data: Object }>({
    method: "post",
    url: "/markdown",
    data,
  });
};

export const getMarkdownHtml = async (url: string) => {
  const config = {
    method: "get",
    url,
    headers: {
      lruCache: true,
    },
  };
  //   const key = hashObject(config);
  //   const result = await store.dispatch.user.getCache(key);
  //   if (result) {
  //     return result;
  //   }
  return server.requestT<any>(config);
};

export const getMarkdown = async () => {
  console.log("getMarkdown");
  const config = {
    method: "get",
    url: "/markdown",
    headers: {
      lruCache: true,
    },
  };
  //   const key = hashObject(config);
  //   const result = await store.dispatch.user.getCache(key);
  //   if (result) {
  //     return result;
  //   }
  return server.requestT<{ data: any }>(config);
};

export const getMarkdownByid = async (id: number) => {
  const config = {
    method: "get",
    url: `/markdown/${id}`,
    headers: {
      lruCache: true,
    },
  };
  //   const key = hashObject(config);
  //   const result = await store.dispatch.user.getCache(key);
  //   if (result) {
  //     return result;
  //   }
  return server.requestT<{ data: any }>(config);
};
