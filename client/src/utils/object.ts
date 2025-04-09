import md5 from "md5";

export const sortObject = (obj: Record<string, any>) => {
  const ret: Record<string, any> = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => (ret[key] = obj[key]));
  return ret;
};

export const hashObject = (config: Record<string, any>) => {
  const target = {
    method: config.method,
    url: config.url,
    params: config.params ? sortObject(config.params) : null,
    data: config.data ? sortObject(config.data) : null,
  };
//   console.log("hashObject", target);
  return md5(JSON.stringify(target));
};
