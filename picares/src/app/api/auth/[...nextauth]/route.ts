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
      async authorize(credentials, req) {
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
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (user.userRole === "ban") {
        throw new Error("用户已被封禁");
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
