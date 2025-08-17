import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getServerSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    console.error("Error getting server session:", error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession();
  return !!session;
}

export async function getCurrentUser() {
  const session = await getServerSession();
  return session?.user || null;
}
