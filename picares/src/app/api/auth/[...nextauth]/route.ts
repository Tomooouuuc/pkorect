import request from "@/libs/request";
import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userAccount: { label: "userAccount", type: "text" },
        userPassword: { label: "userPassword", type: "password" },
      },
      // 报错：
      async authorize(credentials, req) {
        // console.log("credentials", credentials);
        // console.log("req", req);
        const userLogin = {
          userAccount: credentials?.userAccount,
          userPassword: credentials?.userPassword,
        };

        const user: RESPONSE.Base<RESPONSE.LoginUser> = await request(
          "/api/user/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            data: userLogin,
          }
        );
        // Add logic here to look up the user from the credentials supplied
        if (user) {
          console.log("返回的user：", user);
          // Any object returned will be saved in `user` property of the JWT
          return user.data as User;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: "/user/login",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // console.log("signIn", user, account, profile, email, credentials);
      return true;
    },
    async redirect({ url, baseUrl }) {
      // console.log("redirect", url, baseUrl);
      return baseUrl;
    },
    async session({ session, token, user }) {
      // console.log("session---", session, token, user);
      session.user = token.user;
      // console.log("session+++", session, token, user);
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log("jwt---", token, user, account, profile, isNewUser);
      if (user) {
        token.user = user as RESPONSE.LoginUser;
      }
      // console.log("jwt+++", token, user, account, profile, isNewUser);
      console.log("token的值是：", token);
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
