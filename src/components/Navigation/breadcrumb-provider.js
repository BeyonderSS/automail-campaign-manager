"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const breadcrumbMap = {
  "/dashboard": ["Home"],
  "/dashboard/start-loop": ["Home", "New Loop"],
  "/dashboard/start-loop?step=1": ["Home", "New Loop"],
  "/dashboard/start-loop?step=2": ["Home", "New Loop", "Create Template"],
  "/dashboard/start-loop?step=3": ["Home", "New Loop", "Preview"],
  "/dashboard/your-loops": ["Home", "Your Loops"],
  "/dashboard/your-loops/*": ["Home", "Your Loops"], // Wildcard for nested routes
  "/dashboard/profile": ["Home", "Profile"],
  "/dashboard/profile/manage-credentials": ["Home","Profile", "Manage Credential"],
};

function resolveBreadcrumb(pathname) {
  for (const route in breadcrumbMap) {
    if (route.includes("*") && pathname.startsWith(route.replace("/*", ""))) {
      return breadcrumbMap[route];
    }
    if (pathname === route) {
      return breadcrumbMap[route];
    }
  }
  return ["Home"]; // Default fallback breadcrumb
}

function BreadcrumbProvider() {
  const pathname = usePathname();
  const breadcrumbTrail = resolveBreadcrumb(pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbTrail.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {index === breadcrumbTrail.length - 1 ? (
                <BreadcrumbPage>{item}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href="/">{item}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbTrail.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadcrumbProvider;
