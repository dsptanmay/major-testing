import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { ThirdwebProvider } from "thirdweb/react";

async function OrganizationDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const currentRole = user?.publicMetadata.role;
  if (!currentRole) redirect("/role-select");
  if (currentRole !== "medical_organization") redirect("/");
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
}

export default OrganizationDashboardLayout;
