import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { SessionProvider } from "next-auth/react";

export default async function SessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
