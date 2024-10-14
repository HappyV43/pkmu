import { Database, House, LucideIcon, Settings, User } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: House,
          submenus: [
            {
              href: "/dashboard/penyaluran-elpiji",
              label: "Penyaluran Elpiji",
              active: pathname === "/dashboard/penyaluran-elpiji"
            },
            {
              href: "/dashboard/alokasi",
              label: "Alokasi",
              active: pathname === "/dashboard/alokasi"
            },
            // {
            //   href: "/dashboard/cetak-penyaluran",
            //   label: "Cetak Penyaluran",
            //   active: pathname === "/dashboard/cetak-penyaluran"
            // }
          ]
        }
      ]
    },
    {
      groupLabel: "Master Data",
      menus: [
        {
          href: "/master-data",
          label: "Master Data",
          active: pathname.includes("/master-data"),
          icon: Database,
          submenus: [
            {
              href: "/master-data/agents",
              label: "Agents",
              active: pathname === "/master-data/agents"
            },
            {
              href: "/master-data/companies",
              label: "Companies",
              active: pathname === "/master-data/companies"
            }
          ]
        }
      ]
    },
    {
      groupLabel: "Setting",
      menus: [
        {
          href: "/setting",
          label: "Setting",
          active: pathname === "/setting",
          icon: Settings,
          submenus: [
            { 
              href: "/setting/register",
              label: "Register",
              active: pathname === "/setting/register",
            }
          ]
        }
      ]
    }
  ];
}