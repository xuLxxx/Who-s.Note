import { getToken } from "@/utils/auth";

const authState = {
  isAuth: false,
  role: "",
  token: getToken(),
  signin() {
    if (this.token) {
    } else {
      authState.isAuth = false;
    }
  },
};
