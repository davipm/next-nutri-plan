'use client';

import { Apple, Bot, ChevronRight, ChevronsUpDown, Command, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type * as React from 'react';
import { Role } from '@/app/(dashboard)/_types/nav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { signOut, useSession } from '@/lib/auth-client';

const data = {
  navMain: [
    {
      title: 'Foods Management',
      icon: Apple,
      isActive: true,
      allowedRoles: [Role.ADMIN, Role.CLIENT, Role.USER],
      items: [
        {
          title: 'Foods',
          url: '/admin/food-management/foods',
        },
        {
          title: 'Categories',
          url: '/admin/food-management/categories',
        },
        {
          title: 'Serving Units',
          url: '/admin/food-management/serving-units',
        },
      ],
    },
    {
      title: 'Meals Management',
      icon: Bot,
      allowedRoles: [Role.ADMIN, Role.CLIENT, Role.USER],
      items: [
        {
          title: 'Meals',
          url: '/client',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { data: session } = useSession();
  const pathname = usePathname();

  const userRole = session?.user?.role === Role.ADMIN ? Role.ADMIN : Role.USER;
  const filteredNavMain = data.navMain.filter((item) => item.allowedRoles.includes(userRole));

  const handleSignOut = () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in');
        },
      },
    });
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/client">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Nutri Plan</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {filteredNavMain.map((item) => (
              <Collapsible
                asChild
                className="group/collapsible"
                defaultOpen={item.isActive}
                key={item.title}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                <Link href={subItem.url as any}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  size="lg"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    {session?.user.image && (
                      <AvatarImage alt={session?.user.name} src={session?.user.image} />
                    )}
                    <AvatarFallback className="rounded-lg">
                      {session?.user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{session?.user.name}</span>
                    <span className="truncate text-xs">{session?.user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      {session?.user.image && (
                        <AvatarImage alt={session?.user.name} src={session?.user.image} />
                      )}
                      <AvatarFallback className="rounded-lg">
                        {session?.user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{session?.user.name}</span>
                      <span className="truncate text-xs">{session?.user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
