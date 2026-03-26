"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export function NavUser({
  user,
}: {
  user: {
    full_name: string
    email: string
  }
}) {
  const { isMobile } = useSidebar()

  if (!user) {
    return <p>Redirecting...</p>;  // Prevents `null.full_name` error
  }

  const getInitials = (fullName: string) => {
    if (!fullName) return "U"; // Default to "U" if name is empty
  
    const names = fullName.trim().split(" ");
    const firstInitial = names[0]?.charAt(0).toUpperCase() || "";
    const lastInitial = names[1]?.charAt(0).toUpperCase() || "";
  
    return lastInitial ? `${firstInitial}${lastInitial}` : firstInitial;
  };

  const dispatch = useDispatch()

  const { logout } = useAuth();

  const router = useRouter()

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
        await logout(); // Call logout function

        // Delay redirect slightly to ensure state is cleared
        setTimeout(() => {
            router.replace("/signup"); 
            router.refresh(); // ⬅️ Ensure full UI update in Next.js
        }, 50);

    } catch (error) {
        console.log("Logout error:", error);
    }
};

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.full_name} alt={user.full_name} />
                <AvatarFallback className="rounded-lg">{getInitials(user.full_name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.full_name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.full_name} alt={user.full_name} />
                  <AvatarFallback className="rounded-lg">{getInitials(user.full_name)}</AvatarFallback>
                </Avatar>
                {/* <Link href={'/user'}> */}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.full_name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                {/* </Link> */}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href={'/pricing'} style={{cursor: 'pointer'}}>
              <DropdownMenuItem style={{cursor: 'pointer'}}>
                <Sparkles size={18} style={{marginRight: '8px'}} />
                Upgrade to Pro
              </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href={'/account'} style={{cursor: 'pointer'}}>
              <DropdownMenuItem style={{cursor: 'pointer'}}>
                <BadgeCheck size={18} style={{marginRight: '8px'}} />
                Account
              </DropdownMenuItem>
              </Link>
              <Link href={'/billing'}>
              <DropdownMenuItem style={{cursor: 'pointer'}}>
                <CreditCard size={18} style={{marginRight: '8px'}} />
                Billing
              </DropdownMenuItem>
              </Link>
              {/* <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <div onClick={handleLogout} style={{cursor: 'pointer'}}>
            <DropdownMenuItem style={{cursor: 'pointer'}}>
              <LogOut size={18} style={{marginRight: '8px'}} />
              Log out
            </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
