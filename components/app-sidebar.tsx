"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { DollarSign, User, CreditCard } from "lucide-react";

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { CalendarCheck } from 'lucide-react';
import { Landmark } from 'lucide-react';
import { CircleDollarSign } from 'lucide-react';
import { UserRoundCog } from 'lucide-react';
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

import { House } from 'lucide-react';

import { History } from "lucide-react";

// This is sample data.
const data = {
  user: {
    name: "john doe",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Reportrx",
      plan: "",
      logo: "https://i.postimg.cc/4dCLmmgt/6100173661924344835.jpg",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: House,
      isActive: false,
    },
    {
      title: "History",
      url: "/folder",
      icon: History,
      isActive: false,
    },
    {
      title: "Appointments",
      url: "/appointments",
      icon: CalendarCheck,
      isActive: false,
    },
    {
      title: "Account",
      url: "/account",
      icon: User,
      isActive: false,
    },
    ],
    //   title: "Links",
    //   url: "/dashboard/043318e3-d9b5-40a8-9538-c06c26647eec/know-more",
    //   icon: Landmark,

    // },
    // {
    //   title: "Links",
    //   url: "/dashboard/5c73e207-f364-4670-b1e0-8fc77a6602e0/know-more",
    //   icon: BookOpen,

    // },
    // {
    //   title: "Pricing",
    //   url: "#",
    //   icon: CircleDollarSign,

    // },
    // {
    //   title: "About",
    //   url: "#",
    //   icon: UserRoundCog,

    // },
  // ],
  projects: [
    {
      name: "Terms & condition",
      link: "/terms-and-conditions",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSelector((state: RootState) => state.user.user);
  // console.log(user, 'this is user')
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  )
}
