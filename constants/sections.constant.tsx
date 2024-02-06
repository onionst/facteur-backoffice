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
    id: 'ee24',
    access: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACT_CHECKER, ROLES.RESEARCHER],
    name: 'EE24 Dataset',
    type: 'MENU',
    sections: [
      {
        id: 'ee24.search',
        access: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACT_CHECKER, ROLES.RESEARCHER],
        icon: <Search size={18} strokeWidth={2.3} color="#4b5675" />,
        name: 'Search',
        type: 'ITEM',
        path: '/app/ee24/search'
      },
      {
        id: 'ee24.trends',
        access: [ROLES.ADMIN, ROLES.FACT_CHECKER, ROLES.SUPER_ADMIN, ROLES.RESEARCHER],
        icon: <TrendingUp size={18} strokeWidth={2.3} color="#4b5675" />,
        name: 'Global Trends',
        type: 'ITEM',
        path: '/app/ee24/trendings'
      }
    ].filter(item => SETTINGS.PUBLIC_SECTIONS.includes(item.id))
  },
  {
    id: 'stats',
    access: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACT_CHECKER, ROLES.RESEARCHER],
    name: 'Stats',
    type: 'MENU',
    sections: [
      {
        id: 'stats.dashboard',
        access: [ROLES.ADMIN, ROLES.FACT_CHECKER, ROLES.SUPER_ADMIN, ROLES.RESEARCHER],
        icon: <BarChart2 size={18} strokeWidth={2.3} color="#4b5675" />,
        name: 'Dashboard',
        type: 'ITEM',
        path: '/app/stats/dashboard'
      },
      {
        id: 'stats.narratives',
        access: [ROLES.ADMIN, ROLES.FACT_CHECKER, ROLES.SUPER_ADMIN, ROLES.RESEARCHER],
        icon: <Italic size={18} strokeWidth={2.3} color="#4b5675" />,
        name: 'Narratives',
        type: 'ITEM',
        path: '/app/stats/narratives'
      }
    ].filter(item => SETTINGS.PUBLIC_SECTIONS.includes(item.id))
  }
].filter(section => section?.sections?.length > 0);
