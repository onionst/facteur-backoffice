import { BarChart2, Box, File, Italic, Search, TrendingUp, Users } from 'react-feather';
import { ROLES } from './roles.constants';
import { SETTINGS } from './settings';

export class Section {
  access: ROLES[];
  name: string;
  type: string;
  icon?: any;
  id: string;
  path?: string;
  sections?: Section[];
}

export const SECTIONS: Section[] = [
  {
    id: 'admin',
    access: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    name: 'Admin',
    type: 'MENU',
    sections: [
      {
        id: 'admin.organizations',
        access: [ROLES.SUPER_ADMIN],
        icon: <Box size={18} strokeWidth={2.3} color="#4b5675" />,
        name: 'Organizations',
        type: 'ITEM',
        path: '/app/admin/organizations'
      },
      {
        id: 'admin.users',
        access: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
        name: 'Users',
        icon: <Users size={18} strokeWidth={2.3} color="#4b5675" />,
        type: 'ITEM',
        path: '/app/admin/users'
      }
    ].filter(item => SETTINGS.PUBLIC_SECTIONS.includes(item.id))
  },
  {
    id: 'data',
    access: [ROLES.ADMIN, ROLES.FACT_CHECKER],
    name: 'Data',
    type: 'MENU',
    sections: [
      {
        id: 'data.articles',
        access: [ROLES.ADMIN, ROLES.FACT_CHECKER, ROLES.RESEARCHER],
        icon: <File size={18} strokeWidth={2.3} color="#4b5675" />,
        name: 'Your articles',
        type: 'ITEM',
        path: '/app/data/articles'
      }
    ].filter(item => SETTINGS.PUBLIC_SECTIONS.includes(item.id))
  },
  {
    id: 'repository',
    access: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACT_CHECKER, ROLES.RESEARCHER],
    name: 'EuroClimateCheck Dataset',
    type: 'MENU',
    sections: [
      {
        id: 'repository.search',
        access: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACT_CHECKER, ROLES.RESEARCHER],
        icon: <Search size={18} strokeWidth={2.3} color="#4b5675" />,
        name: 'Search',
        type: 'ITEM',
        path: '/app/repository/search'
      }
    ].filter(item => SETTINGS.PUBLIC_SECTIONS.includes(item.id))
  }
].filter(section => section?.sections?.length > 0);
