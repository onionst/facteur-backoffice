import { BarChart2, Box, File, Search, Users } from "react-feather";
import { ROLES } from "./roles.constants";

export class Section {
  access: ROLES[];
  name: string;
  type: "ITEM" | "MENU";
  icon?: any;
  path?: string;
  sections?: Array<Section>;
}

export const SECTIONS: Array<Section> = [
  {
    access: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    name: "Admin",
    type: "MENU",
    sections: [
      {
        access: [ROLES.SUPER_ADMIN],
        icon: <Box size={18} strokeWidth={2.3} color="#071437" />,
        name: "Organizations",
        type: "ITEM",
        path: "/app/admin/organizations",
      },
      {
        access: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
        name: "Users",
        icon: <Users size={18} strokeWidth={2.3} color="#071437" />,
        type: "ITEM",
        path: "/app/admin/users",
      },
    ],
  },
  {
    access: [ROLES.ADMIN, ROLES.FACT_CHECKER, ROLES.RESEARCHER, ROLES.VIEWER],
    name: "Data",
    type: "MENU",
    sections: [
      {
        access: [ROLES.SUPER_ADMIN],
        icon: <File size={18} strokeWidth={2.3} color="#071437" />,
        name: "Articles",
        type: "ITEM",
        path: "/app/repository/fact-checks",
      },
    ],
  },
  {
    access: [ROLES.ADMIN, ROLES.FACT_CHECKER, ROLES.RESEARCHER, ROLES.VIEWER],
    name: "EE24 Dataset",
    type: "MENU",
    sections: [
      {
        access: [ROLES.SUPER_ADMIN],
        icon: <Search size={18} strokeWidth={2.3} color="#071437" />,
        name: "Search",
        type: "ITEM",
        path: "/app/repository/fact-checks",
      },
      {
        access: [ROLES.SUPER_ADMIN],
        icon: <BarChart2 size={18} strokeWidth={2.3} color="#071437" />,
        name: "Stats",
        type: "ITEM",
        path: "/app/repository/fact-checks",
      },
    ],
  },
];
