"use client"

import { useParams, usePathname } from "next/navigation"

import { Sidebar,
        SidebarContent,
        SidebarGroup, 
        SidebarGroupContent, 
        SidebarGroupLabel, 
        SidebarMenu, 
        SidebarMenuButton, 
        SidebarMenuItem, 
        SidebarFooter
    } from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"
import Link from "next/link"

import { LayoutDashboard,
        Image,
        Tag, 
        Ruler,
        Palette, 
        Package, 
        ShoppingCart, 
        Settings 
    } from "lucide-react"

    import { UserButton } from "@clerk/nextjs"    
    
    import { ThemeToggle } from "@/components/theme-toggle"
    import StoreSwitcher from "./store-switcher"


export function AppSidebar({stores}: {stores: any[]}) {
  const pathname = usePathname()
  const params = useParams()

  const routes = [
    {
      href: `/${params.storeId}`,
      label: 'Overview',
      icon: LayoutDashboard,
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: 'Billboards',
      icon: Image,
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: 'Categories',
      icon: Tag,
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: 'Sizes',
      icon: Ruler,
      active: pathname === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: 'Colors',
      icon: Palette,
      active: pathname === `/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: 'Products',
      icon: Package,
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: 'Orders',
      icon: ShoppingCart,
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: 'Settings',
      icon: Settings,
      active: pathname === `/${params.storeId}/settings`,
    },
  ]

  return (
    <Sidebar side="left" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
            <div className="flex items-center justify-between px-4 py-2">
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupLabel><ThemeToggle/></SidebarGroupLabel>
            </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => (
            <SidebarMenuItem key={route.href}>
            <SidebarMenuButton asChild>
                <Link 
                href={route.href} 
                className={cn(
                    "flex items-center px-2 py-1 rounded-md",
                    route.active 
                    ? "bg-blue-800 text-white font-semibold" 
                    : "text-muted-foreground"
                )}
                >
                <route.icon className="h-4 w-4 mr-2" />
                <span className="text-sm">{route.label}</span>
                </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    <SidebarFooter>
  <div className="border-b">
    <div className="flex h-16 items-center">
      <div className="group-data-[collapsible=icon]:hidden">
        <StoreSwitcher items={stores} />
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  </div>
</SidebarFooter>
    </Sidebar>
  )
}
