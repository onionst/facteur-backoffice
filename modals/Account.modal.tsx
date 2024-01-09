import { Input } from '@/bases/Input';
import { Preset } from '@/bases/Preset/Preset';
import Row from '@/bases/Row/Row';
import Card from '@/components/Card/Card';
import { useAuth } from '@/contexts/auth.context';
import { Divider, Drawer, DrawerProps } from 'antd';
import { parseRole } from './users/InviteUsers.modal';
import IconButton from '@/bases/IconButton/IconButton';
import { Edit, Minus } from 'react-feather';
import Page from '@/components/Page/Page';

export type AccountModalProps = {};
export function AccountModal(props: AccountModalProps & DrawerProps) {
  const { session } = useAuth();
  return (
    <Drawer {...props}>
      <Row align="SPACE">
        <IconButton>
          <Minus color="#252f4a" size={18} onClick={props.onClose} />
        </IconButton>
        <h3>Account</h3>
        <IconButton>
          <Edit color="#252f4a" size={18} />
        </IconButton>
      </Row>
      <Card style={{ marginTop: 20 }} title="Company">
        <Page></Page>
      </Card>
      <Card style={{ marginTop: 16 }} title="Profile">
        <Page></Page>
      </Card>
      <Card style={{ marginTop: 20 }} title="API">
        <Page></Page>
      </Card>
      {/* <Card style={{ marginTop: 8 }} title="Personal information">
        <Row align="SPACE">
          <Preset title="Name" value={session.name} />
          <Preset title="Surname" value={session.surname} />
        </Row>
      </Card>
      <Card style={{ marginTop: 20 }} title="Contact">
        <Preset title="Email" value={session.email} />
      </Card>
      <Card style={{ marginTop: 20 }} title="Security">
        <Row align="SPACE">
          <Preset title="Role" value={parseRole(session.role)} />
          <Preset title="2FA" value="" />
        </Row>
      </Card> */}
    </Drawer>
  );
}
