import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: RESPONSE.LoginUser;
  }
  interface JWT {
    token: {
      user: RESPONSE.LoginUser;
    };
  }
  interface User extends RESPONSE.LoginUser {} // 直接继承自定义类型
}

import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    user: RESPONSE.LoginUser;
  }
}
