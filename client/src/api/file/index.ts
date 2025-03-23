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

export const getMarkdownHtml = (url: string) => {
  return server.requestT<any>({
    method: "get",
    url,
  });
};

export const getMarkdown = () => {
  return server.requestT<{ data: any }>({
    method: "get",
    url: "/markdown",
  });
};

export const getMarkdownByid = (id: number) => {
  return server.requestT<{ data: any }>({
    method: "get",
    url: `/markdown/${id}`,
  });
};
