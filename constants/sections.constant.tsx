import { BarChart2, Box, File, Search, TrendingUp, Users } from 'react-feather';
import { ROLES } from './roles.constants';

export class Section {
  access: ROLES[];
  name: string;
  type: 'ITEM' | 'MENU';
  icon?: any;
  path?: string;
  sections?: Section[];
}

export const SECTIONS: Section[] = [
  {
    access: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    name: 'Admin',
    type: 'MENU',
    sections: [
      {
        access: [ROLES.SUPER_ADMIN],
        icon: <Box size={18} strokeWidth={2.3} color="#4b5675" />,
        name: 'Organizations',
        type: 'ITEM',
        path: '/app/admin/organizations'
      },
      {
        access: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
        name: 'Users',
        icon: <Users size={18} strokeWidth={2.3} color="#4b5675" />,
        type: 'ITEM',
        path: '/app/admin/users'
      }
    ]
  },
  {
    access: [ROLES.ADMIN, ROLES.FACT_CHECKER],
    name: 'Data',
    type: 'MENU',
    sections: [
      {
        access: [ROLES.ADMIN, ROLES.FACT_CHECKER, ROLES.RESEARCHER],
        icon: <File size={18} strokeWidth={2.3} color="#4b5675" />,
        name: 'Articles',
        type: 'ITEM',
        path: '/app/data/articles'
      }
    ]
  },
  {
    access: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACT_CHECKER, ROLES.RESEARCHER],
    name: 'EE24 Dataset',
    type: 'MENU',
    sections: [
      {
        access: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACT_CHECKER, ROLES.RESEARCHER],
        icon: <Search size={18} strokeWidth={2.3} color="#4b5675" />,
        name: 'Search',
        type: 'ITEM',
        path: '/app/ee24/search'
      },
      {
        access: [ROLES.ADMIN, ROLES.FACT_CHECKER, ROLES.SUPER_ADMIN],
        icon: <BarChart2 size={18} strokeWidth={2.3} color="#4b5675" />,
        name: 'Statistics',
        type: 'ITEM',
        path: '/app/ee24/stats'
      },
      {
        access: [ROLES.ADMIN, ROLES.FACT_CHECKER, ROLES.RESEARCHER, ROLES.SUPER_ADMIN],
        icon: <TrendingUp size={18} strokeWidth={2.3} color="#4b5675" />,
        name: 'Trends',
        type: 'ITEM',
        path: '/app/ee24/trends'
      }
    ]
  }
];
