import { Drawer } from 'antd';
import { useState } from 'react';
import s from './AppLayout.module.scss';
import AppHeader from '@/components/AppHeader/AppHeader';
import Footer from '@/components/Footer/Footer';
import Sidebar from '@/components/Sidebar/Sidebar';
import Topbar from '@/components/Topbar/Topbar';
import useWindowSize from '@/hooks/useWindowWidth';

export type LayoutProps = {
  children: any;
};

export default function AppLayout(props: LayoutProps) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const { width } = useWindowSize();

  if (width < 768) {
    return (
      <div className={s.shell}>
        <Topbar />
        <AppHeader onMenuClick={() => setShowDrawer(true)} />
        <Drawer
          width={270}
          footer={null}
          styles={{ header: { display: 'none' }, content: { padding: 0 } }}
          placement="left"
          open={showDrawer}
          onClose={() => setShowDrawer(false)}
        >
          <Sidebar
            onClose={() => setShowDrawer(false)}
            mobile
            collapsed={false}
            setCollapsed={() => setShowDrawer(false)}
            style={{ position: 'static', height: 'auto' }}
          />
        </Drawer>
        <main className={s.mainMobile}>
          <section className={s.content}>{props.children}</section>
          <Footer />
        </main>
      </div>
    );
  }

  return (
    <div className={s.shell}>
      <Topbar />
      <AppHeader />
      <div className={`${s.layout} ${collapsed ? s.collapsed : ''}`}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className={s.main}>
          <section className={s.content}>{props.children}</section>
          <Footer />
        </main>
      </div>
    </div>
  );
}
