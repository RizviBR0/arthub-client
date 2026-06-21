"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function RoleGuard({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isPending) return;

    // If the user is logged in but has no role, and they aren't already on the role selection page
    if (session?.user && !session.user.role && pathname !== "/role-selection") {
      router.push("/role-selection");
    }
  }, [session, isPending, router, pathname]);

  return <>{children}</>;
}
