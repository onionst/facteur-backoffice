import { Input } from '@/bases/Input';
import { Preset } from '@/bases/Preset/Preset';
import Row from '@/bases/Row/Row';
import Card from '@/components/Card/Card';
import { useAuth } from '@/contexts/auth.context';
import { Divider, Drawer, DrawerProps, Popconfirm, Skeleton, Tooltip, notification } from 'antd';
import { parseRole } from './users/InviteUsers.modal';
import IconButton from '@/bases/IconButton/IconButton';
import { Copy, Edit, Eye, EyeOff, Minus, RefreshCw } from 'react-feather';
import Page from '@/components/Page/Page';
import { useEffect, useState } from 'react';
import Button from '@/bases/Button/Button';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
import { ROLES } from '@/constants/roles.constants';
import Switch from '@/bases/Switch/Switch';

export type AccountModalProps = {};
export function AccountModal(props: AccountModalProps & DrawerProps) {
  const { session, getApiCredentials, refreshApiCredentials } = useAuth();
  const [loadingApiKey, setLoadingApiKey] = useState<boolean>(false);
  const [refreshingApiKey, setRefreshingApiKey] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);

  const fetchApiCredentials = async () => {
    try {
      setLoadingApiKey(true);
      const apiKey = await getApiCredentials();
      setApiKey(apiKey);
      setLoadingApiKey(false);
    } catch (err) {
      setLoadingApiKey(false);
    }
  };

  const handleRefreshApiKey = async () => {
    try {
      setRefreshingApiKey(true);
      const apiKey = await refreshApiCredentials();
      setApiKey(apiKey);
      setShowApiKey(true);
      setRefreshingApiKey(false);
    } catch (err) {
      setRefreshingApiKey(false);
    }
  };

  useEffect(() => {
    if ([ROLES.ADMIN, ROLES.RESEARCHER].includes(session.role)) {
      fetchApiCredentials();
    }
  }, [session]);

  return (
    <Drawer {...props}>
      <Row align="SPACE">
        <h3>Account</h3>
        <IconButton>
          <Minus color="#252f4a" size={18} onClick={props.onClose} />
        </IconButton>
      </Row>
      {session.organizationId && (
        <Card style={{ marginTop: 20 }} title="Organization">
          <Page>
            <Row align="SPACE">
              <Preset title="Name" value={session?.organization?.name || '-'} />
              <Preset title="Domain" value={session?.organization?.domain || '-'} />
            </Row>
          </Page>
        </Card>
      )}
      <Card style={{ marginTop: 16 }} title="Profile">
        <Page>
          <Row align="SPACE">
            <Preset title="Name" value={session.name} />
            <Preset title="Surname" value={session.surname} />
          </Row>
          <Preset title="Email" value={session.email} />
        </Page>
      </Card>
      <Card style={{ marginTop: 16 }} title="Security">
        <Page>
          <Preset title="Two factor authentication" value={session.TFA ? 'Active' : 'Unactive'} />
        </Page>
      </Card>
      {(session.role === ROLES.RESEARCHER || session.role === ROLES.ADMIN) &&
        (loadingApiKey ? (
          <Card style={{ marginTop: 16 }}>
            <Skeleton active />
          </Card>
        ) : apiKey ? (
          <Card style={{ marginTop: 16 }}>
            <h5>{session.role === ROLES.ADMIN ? "Organization's " : ''} API KEY</h5>
            <Row align="SPACE">
              <Input
                style={{ height: 32, width: '100%', backgroundColor: '#FFF' }}
                disabled
                value={showApiKey ? apiKey : '********************************'}
              />
              <div>
                <Row align="RIGHT">
                  {!showApiKey && (
                    <Tooltip title="Show API Key">
                      <div>
                        <IconButton type="button" onClick={() => setShowApiKey(true)}>
                          <Eye color="#252f4a" size={18} />
                        </IconButton>
                      </div>
                    </Tooltip>
                  )}
                  {showApiKey && (
                    <Tooltip title="Hide API Key">
                      <div>
                        <IconButton type="button" onClick={() => setShowApiKey(false)}>
                          <EyeOff color="#252f4a" size={18} />
                        </IconButton>
                      </div>
                    </Tooltip>
                  )}
                  <Tooltip title="Copy API Key">
                    <div>
                      <IconButton
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(apiKey);
                          notification.success({ ...NOTIFICATIONS_CONFIG.success, message: 'Copied to clipboard' });
                        }}
                      >
                        <Copy color="#252f4a" size={18} />
                      </IconButton>
                    </div>
                  </Tooltip>
                  <Tooltip title="Refresh API Key">
                    <Popconfirm onConfirm={handleRefreshApiKey} title="This will invalidate current key and issue a new one">
                      <div>
                        <IconButton type="button" loading={refreshingApiKey}>
                          <RefreshCw color="#252f4a" size={18} />
                        </IconButton>
                      </div>
                    </Popconfirm>
                  </Tooltip>
                </Row>
              </div>
            </Row>
            <p style={{ color: '#252f4a', margin: 0 }}>Secret keys grants access to the API. Keep key safe and do not expose it.</p>
          </Card>
        ) : (
          <Card style={{ marginTop: 16 }}>
            <h5 className="m-0">Setup API Key</h5>
            <Button type="button" onClick={handleRefreshApiKey} loading={refreshingApiKey} theme="TERTIARY">
              Generate API Key
            </Button>
            <p style={{ color: '#252f4a', margin: 0 }} className="m-0">
              Manage articles using the API. You only have to pass this key into all API requests as
              <code>X-API-KEY={'<API_key>'}</code> header.
            </p>
          </Card>
        ))}
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
