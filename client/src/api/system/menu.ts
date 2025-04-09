import store from "@/store";
import { hashObject } from "@/utils/object";
import server from "@/utils/request";

export type Menu = {
  id: number;
  title: string;
  icon: string;
  url: string;
  parentId?: number;
  children?: Menu[];
  name: string;
  sorts: number;
  conditions: number;
  role: string;
};

export async function getMenu() {
  const config = {
    method: "get",
    url: "/menu",
    headers: {
      lruCache: true,
    },
  };
  const key = hashObject(config);
  const result = await store.dispatch.user.getCache(key);
  if (result) {
    return result;
  }
  return server.requestT<{ data: Menu[] }>(config);
}
