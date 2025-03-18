/**
 * 参数处理   qs ? ?
 * @param {*} params  参数
 */
export function tansParams(params: { [keys: string]: unknown }) {
  let result = "";
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    const part = encodeURIComponent(propName) + "=";
    if (value !== null && value !== "" && typeof value !== "undefined") {
      if (value instanceof Object) {
        for (const [ckey, cVal] of Object.entries(value)) {
          if (
            typeof cVal === "string" ||
            typeof cVal === "number" ||
            typeof cVal === "boolean"
          ) {
            const temp = propName + "[" + ckey + "]";
            const subPart = encodeURIComponent(temp) + "=";
            result += subPart + encodeURIComponent(cVal) + "&";
          }
        }
      } else if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        result += part + encodeURIComponent(value) + "&";
      }
    }
  }
  return result;
}
