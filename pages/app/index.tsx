import { Skeleton } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ROLES } from '@/constants/roles.constants';
import { useAuth } from '@/contexts/auth.context';

export default function Index() {
  const { session } = useAuth();
  const router = useRouter();

  const handleRedirect = (role: ROLES) => {
    const path = {
      [ROLES.SUPER_ADMIN]: '/app/admin/organizations',
      [ROLES.ADMIN]: '/app/admin/users',
      [ROLES.RESEARCHER]: '/app/repository/search',
      [ROLES.FACT_CHECKER]: '/app/data/articles',
      [ROLES.NONE]: '/auth/sign-in'
    }[role];

    router.push(path);
  };

  useEffect(() => {
    handleRedirect(session.role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <div className="w-full">
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
}
