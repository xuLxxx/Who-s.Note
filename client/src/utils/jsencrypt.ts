import JSEncrypt from "jsencrypt";

// 密钥对生成 http://web.chacuo.net/netrsakeypair

// const publicKey =
//   "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDH/hepFPR0UlsMm2umAzNIix9K\n" +
//   "RXp1ew+vPzzM2NwrlaaEs4UoHS7hxwTaryrIcjkpzNqgo9gaYquEijwqLlVTVHwm\n" +
//   "mNIf1s6yhmM9Iorj/UM5MSSZpAtM2NMQy3wNV4eaKRqYo/9QEgMiWrLsm+nd+he+\n" +
//   "XBOD5pShPQLunli05QIDAQAB";

// const privateKey =
//   "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMIkoV8WT+FLHng8\n" +
//   "/91XFt+L+1dOb+078YzkbiGGrn8NdwugkEKVW90hrNRL+b/z2/QwzQhR9x2oS9X1\n" +
//   "cNHjok5pQz6UVmYgJbL1H/I4cBWdzV5EmJcw66SnEdGZABY3BN7Bc3ZqMXALBhyf\n" +
//   "YGPR/IyIrRnZhK8w4/5uBn0MOJQHAgMBAAECgYEApmvmFO+4a+UL6oBHyQIlrl19\n" +
//   "iBrJ4W/4IRGTwpOEM49kVAhAgYMtK0L5t0algcFV9F5887vnfHnPAEsUeieK8fPX\n" +
//   "elj9uYXT7q/a1JG9tazcRPAhG6WdHtFQ3KazLj8M03uCuonL3UjEWtMTuDBKwfLz\n" +
//   "3Wt59l3Skf9k0fs0LTECQQDnhvOGJbT84p2CmLhLJj+WIE7ow1SlY9D2WYloeqY8\n" +
//   "XkRQE6tAnlXQGxPP4Fn0/JkLo6lRmXpnmhyDaZN9sNb/AkEA1qoUG0zKsdXI+skB\n" +
//   "2Pj//dVcn4G+JrYG6E97wJ+pk6kql9ee4rIBuZrnYk0zcdFt0+2QRJbh1YmpQa+x\n" +
//   "qq6K+QJANZh82SnzarL+6VN3HhZdk+AoxCMrfhnMLqrtbx0tTD46LBtRgmTk0obi\n" +
//   "IDX8PQUYXKRnNreDqWX4gcc32FnOewJAKgpnI62XaNqooMzrCrZBVFIL8MU1G1m8\n" +
//   "4pRmdSQPzvZrfA9jc5xPEC2RMURTVfAhJUc6YOR32B08w7uH/Rhv6QJAdTY9QojG\n" +
//   "s1NMLzxvPZLgut7nppMYf170Ugmu2IDmNlf8bOtjAX/CrGt/w5VLRyxDuYVIF0TH\n" +
//   "AwFuwtMa2q34EQ==";

const publicKey =
  "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALArRxRZYGk62/Y4kcxpt1gmQsuYULsO\n" +
  "CrnUOONXM9eBkSaD+ZfxXJ+f9A8ChNVgxSVLdh0sy0O0TDde8tss8tECAwEAAQ==";

const privateKey =
  "MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAsCtHFFlgaTrb9jiR\n" +
  "zGm3WCZCy5hQuw4KudQ441cz14GRJoP5l/Fcn5/0DwKE1WDFJUt2HSzLQ7RMN17y\n" +
  "2yzy0QIDAQABAkASxVm6gldyfvIHBzoJxM3jV5hQZzda5wEfkcxJ9PWyJY+s1CWK\n" +
  "udfcbpYs8C1d3d4HlUbcSri5qUi1ipjvV6gBAiEA51J7py/TG/IYwMOVaSbNphKL\n" +
  "4HeTexQ5ahSNOmxU64ECIQDC9olaZ0LIF2x9QZaYuqoAVdNmz4RhJS2W6kcNmPHv\n" +
  "UQIhAKuRoeT+s7WmenV+mvLCtQTX/KcgCWLgPTVQyO7sKpABAiBAdYqMHT/zL+tq\n" +
  "rljAPlcerUGr6Eh4ZfZgwyyizkKPQQIgbplVTk77cruLCDOoOnO62ingYNvSz1yt\n" +
  "oFSTdrjXYdQ=";

// 加密
export function encrypt(txt: string) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt) as string; // 对数据进行加密
}

// 解密
export function decrypt(txt: string) {
  const encryptor = new JSEncrypt();
  encryptor.setPrivateKey(privateKey); // 设置私钥
  return encryptor.decrypt(txt) as any; // 对数据进行解密
}

export function saveData(data: any, name: string) {
  localStorage.setItem(name, encrypt(JSON.stringify(data)));
}

export function getData(name: string) {
  const data = localStorage.getItem(name) as string;
  if (data) {
    return JSON.parse(decrypt(data));
  } else {
    return null;
  }
}

export function removeData(name: string) {
  localStorage.removeItem(name);
}
