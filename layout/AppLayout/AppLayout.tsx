import { Drawer } from 'antd';
import { useState } from 'react';
import s from './AppLayout.module.scss';
import Footer from '@/components/Footer/Footer';
import Navbar from '@/components/Navbar/Navbar';
import Sidebar from '@/components/Sidebar/Sidebar';
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
      <div className={s['ds-app__mobile']}>
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
            style={{ position: 'static' }}
          />
        </Drawer>
        <main>
          <Navbar collapsed={collapsed} openDrawer={() => setShowDrawer(true)} />
          <section className={s['ds-app__main']}>{props.children}</section>
        </main>
      </div>
    );
  }

  return (
    <div className={`${s['ds-app']} ${s[`ds-app--${collapsed ? 'collapsed' : 'regular'}`]}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div />
      <main>
        <Navbar collapsed={collapsed} />
        <section className={s['ds-app__main']}>{props.children}</section>
        <Footer />
      </main>
    </div>
  );
}
