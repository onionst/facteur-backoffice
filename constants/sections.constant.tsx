import { Activity, BarChart2, Briefcase, Copy, FileText, TrendingUp, Users } from 'react-feather';
import { ROLES } from './roles.constants';

export type SectionBadge = {
  count: number;
  variant?: 'default' | 'warn';
};

export class Section {
  access: ROLES[];
  name: string;
  type: string;
  icon?: any;
  id: string;
  path?: string;
  sections?: Section[];
  target?: string;
  badge?: SectionBadge;
}

const ALL_ROLES: ROLES[] = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACT_CHECKER, ROLES.RESEARCHER];

/* Visual mock: replicates the sidebar of the maqueta (Editorial / Repository /
   Admin). Items that already have a real page link to it; the rest point to
   `#` until the corresponding screen is ported. Badge counts are illustrative
   only — they will be wired to real data when each feature lands. */
export const SECTIONS: Section[] = [
  {
    id: 'editorial',
    access: ALL_ROLES,
    name: 'Editorial',
    type: 'MENU',
    sections: [
      {
        id: 'editorial.articles',
        access: ALL_ROLES,
        icon: <FileText size={18} strokeWidth={1.6} />,
        name: 'Articles',
        type: 'ITEM',
        path: '/app/data/articles',
        badge: { count: 6, variant: 'warn' }
      },
      {
        id: 'editorial.matches',
        access: ALL_ROLES,
        icon: <Copy size={18} strokeWidth={1.6} />,
        name: 'Matches',
        type: 'ITEM',
        path: '#',
        badge: { count: 7, variant: 'warn' }
      }
    ]
  },
  {
    id: 'repository',
    access: ALL_ROLES,
    name: 'Repository',
    type: 'MENU',
    sections: [
      {
        id: 'repository.dashboard',
        access: ALL_ROLES,
        icon: <BarChart2 size={18} strokeWidth={1.6} />,
        name: 'Dashboard',
        type: 'ITEM',
        path: '/app/repository/search'
      },
      {
        id: 'repository.trends',
        access: ALL_ROLES,
        icon: <TrendingUp size={18} strokeWidth={1.6} />,
        name: 'Trends',
        type: 'ITEM',
        path: '#'
      }
    ]
  },
  {
    id: 'admin',
    access: ALL_ROLES,
    name: 'Admin',
    type: 'MENU',
    sections: [
      {
        id: 'admin.pipeline',
        access: ALL_ROLES,
        icon: <Activity size={18} strokeWidth={1.6} />,
        name: 'Pipeline',
        type: 'ITEM',
        path: '#',
        badge: { count: 3, variant: 'warn' }
      },
      {
        id: 'admin.users',
        access: ALL_ROLES,
        icon: <Users size={18} strokeWidth={1.6} />,
        name: 'Users',
        type: 'ITEM',
        path: '/app/admin/users'
      },
      {
        id: 'admin.organizations',
        access: ALL_ROLES,
        icon: <Briefcase size={18} strokeWidth={1.6} />,
        name: 'Organizations',
        type: 'ITEM',
        path: '/app/admin/organizations'
      }
    ]
  }
];
