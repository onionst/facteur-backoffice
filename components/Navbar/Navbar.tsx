import { Popover } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Plus } from 'react-feather';
import { Uploader } from '../Uploader/Uploader';
import s from './Navbar.module.scss';
import Button from '@/bases/Button/Button';
import IconButton from '@/bases/IconButton/IconButton';
import { Input } from '@/bases/Input';
import Row from '@/bases/Row/Row';
import { ROLES } from '@/constants/roles.constants';
import { useAuth } from '@/contexts/auth.context';
import useWindowSize from '@/hooks/useWindowWidth';

export type NavbarProps = {
  openDrawer?: () => void;
  collapsed: boolean;
};

export default function Navbar(props: NavbarProps) {
  const router = useRouter();
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const { width } = useWindowSize();
  const { session } = useAuth();
  return (
    <nav
      className={s['ds-navbar']}
      style={{
        width: width < 768 ? '100%' : `calc(100% - ${props.collapsed ? 74 : 270}px)`
      }}
    >
      <section className={s['ds-navbar__left']}>
        {width < 768 && (
          <IconButton onClick={props?.openDrawer}>
            <Plus color="#252f4a" size={18} />
          </IconButton>
        )}
        <Popover placement="bottomRight" content={<div></div>}>
          <Row align="LEFT">
            <Input disabled={uploadingImage} className={s['ds-navbar__left-input']} placeholder="Search in the EE24 dataset..." />
            <div className={s['ds-navbar__left-input__clip']}>
              <Uploader
                accept={{
                  'image/png': ['.png', '.jpeg', '.jpg'],
                  'audio/mp3': ['.mp3', '.wav', '.ogg'],
                  'video/mp4': ['.mp4', '.avi', '.mov', '.wav']
                }}
                onChange={() => {}}
                onLoadFinished={() => setUploadingImage(false)}
                onLoad={() => {
                  setUploadingImage(true);
                }}
              />
            </div>
          </Row>
        </Popover>
      </section>
      <section className={s['ds-navbar__right']}>
        {[ROLES.ADMIN, ROLES.FACT_CHECKER].includes(session.role) && !router.asPath.includes('/articles') && (
          <Link href="/app/data/articles/new">
            <Button theme="TERTIARY">
              <span>
                Create article <Plus size={14} />
              </span>
            </Button>
          </Link>
        )}
      </section>
    </nav>
  );
}
