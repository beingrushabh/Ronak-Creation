"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // optional: persist state
  useEffect(() => {
    const v = localStorage.getItem("admin_sidebar_collapsed");
    if (v === "1") setCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("admin_sidebar_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <aside
      className={[
        "bg-white border-r p-4 space-y-4 transition-all duration-300",
        collapsed ? "w-16" : "w-56",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        {!collapsed && (
          <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
        )}

        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="ml-auto inline-flex items-center justify-center h-9 w-9 rounded hover:bg-gray-100 border"
          aria-label={collapsed ? "Expand menu" : "Collapse menu"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="space-y-2 text-sm">
        <NavItem collapsed={collapsed} href="/admin/dashboard" label="Dashboard" />
        <NavItem collapsed={collapsed} href="/admin/products" label="Products" />
        <NavItem collapsed={collapsed} href="/admin/products/new" label="➜ Add Product" indent />
        <NavItem collapsed={collapsed} href="/admin/banners" label="Banners" />
        <NavItem collapsed={collapsed} href="/admin/settings" label="Settings" />

        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className={[
              "mt-4 text-sm text-red-600 hover:underline",
              collapsed ? "w-full text-center" : "",
            ].join(" ")}
            title={collapsed ? "Logout" : undefined}
          >
            {collapsed ? "⎋" : "Logout"}
          </button>
        </form>
      </nav>
    </aside>
  );
}

function NavItem({
  href,
  label,
  collapsed,
  indent,
}: {
  href: string;
  label: string;
  collapsed: boolean;
  indent?: boolean;
}) {
  // When collapsed, show a short label/emoji so it’s still usable
  const collapsedLabel =
    label.includes("Add Product") ? "+" :
    label === "Dashboard" ? "D" :
    label === "Products" ? "P" :
    label === "Banners" ? "B" :
    label === "Settings" ? "S" :
    label.slice(0, 1);

  return (
    <Link
      href={href}
      className={[
        "block py-1 hover:text-primary rounded",
        indent ? "pl-4" : "",
        collapsed ? "text-center px-0" : "",
      ].join(" ")}
      title={collapsed ? label : undefined}
    >
      {collapsed ? collapsedLabel : label}
    </Link>
  );
}
