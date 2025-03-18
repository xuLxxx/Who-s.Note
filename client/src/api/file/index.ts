import server from "@/utils/request";

export const uploadFile = (data: FormData) => {
  return server.requestT<{ data: Object }>({
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
