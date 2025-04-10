type UserInfo = {
  username: string;
  token: string;
  id: number | null;
  role?: string;
};

type Markdown = {
  id: number | null;
  title: string | null;
  content: string | null;
};
