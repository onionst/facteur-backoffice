import { Popover } from 'antd';
import { useState } from 'react';
import { Filter as FIcon } from 'react-feather';
import Radio from '../Radio/Radio';
import s from './Sorter.module.scss';
import { ROLES } from '@/constants/roles.constants';
import { useAuth } from '@/contexts/auth.context';
import { parseRole } from '@/modals/users/InviteUsers.modal';

export type order = 'ASC' | 'DESC' | 'NONE';

export type SorterProps = {
  children: any;
  onSort: (role: string) => void;
};

export function Filter(props: SorterProps) {
  const { session } = useAuth();
  const [selected, setSelected] = useState('');

  const handleCheck = (role: any) => {
    if (role === selected) {
      setSelected('');
      props.onSort('');
    } else {
      setSelected(role);
      props.onSort(role);
    }
  };

  return (
    <Popover
      trigger={'click'}
      content={
        <div className={s['ds-filter']}>
          <h6>Roles</h6>
          {session.role === ROLES.SUPER_ADMIN && (
            <Radio
              checked={ROLES.SUPER_ADMIN === selected}
              onClick={() => handleCheck(ROLES.SUPER_ADMIN)}
              label={parseRole(ROLES.SUPER_ADMIN)}
            />
          )}
          <Radio checked={ROLES.ADMIN === selected} onClick={() => handleCheck(ROLES.ADMIN)} label={parseRole(ROLES.ADMIN)} />
          {session.role === ROLES.SUPER_ADMIN && (
            <Radio
              checked={ROLES.RESEARCHER === selected}
              onClick={() => handleCheck(ROLES.RESEARCHER)}
              label={parseRole(ROLES.RESEARCHER)}
            />
          )}
          <Radio
            checked={ROLES.FACT_CHECKER === selected}
            onClick={() => handleCheck(ROLES.FACT_CHECKER)}
            label={parseRole(ROLES.FACT_CHECKER)}
          />
        </div>
      }
    >
      <button className={s['ds-sorter']} type="button">
        {props.children}
        <div className={s['ds-sorter-box']}>
          <FIcon size={14} color={!selected ? '#252f4a' : '#00986d'} />
        </div>
      </button>
    </Popover>
  );
}
