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

export function getMenu() {
  return server.requestT<{ data: Menu[] }>({
    method: "get",
    url: "/menu",

  });
}
