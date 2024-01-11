import { Modal, ModalProps, Popconfirm, Skeleton, Tabs, Tooltip, notification } from 'antd';
import { FormEvent, useEffect, useState } from 'react';
import { Copy, Eye, EyeOff, RefreshCw, X } from 'react-feather';
import s from '../Modals.module.scss';
import Button from '@/bases/Button/Button';
import IconButton from '@/bases/IconButton/IconButton';
import { Input } from '@/bases/Input';
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select';
import Switch from '@/bases/Switch/Switch';
import Card from '@/components/Card/Card';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
import { ROLES } from '@/constants/roles.constants';
import { useAuth } from '@/contexts/auth.context';
import { useOrganizations } from '@/contexts/organizations.context';
import { useUsers } from '@/contexts/users.context';
import { Organization } from '@/dtos/organizations/organization.dto';
import { User } from '@/dtos/users/user.dto';

export type EditUserModalProps = {
  id: string;
};
export const EditUserModal = (props: EditUserModalProps & ModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingApiKey, setLoadingApiKey] = useState<boolean>(false);
  const [refreshingApiKey, setRefreshingApiKey] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const { fetchUserData, updateUser } = useUsers();
  const { listOrganizations } = useOrganizations();
  const { session, getApiCredentials, refreshApiCredentials } = useAuth();
  const [user, setUser] = useState<Partial<User>>({});
  const [organizations, setOrganizations] = useState<Array<Partial<Organization>>>([]);

  const handleListOrganizations = async () => {
    if (session.role === ROLES.SUPER_ADMIN) {
      setOrganizations(await listOrganizations());
    }
  };

  useEffect(() => {
    handleListOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open, session]);
  const handleUpdateUser = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      await updateUser(props.id, {
        name: user?.name,
        surname: user?.surname,
        email: user.email,
        TFA: user.TFA,
        role: user.role,
        organizationId: user.organizationId
      });
      setLoading(false);
      // @ts-ignore
      props.onCancel();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchApiCredentials = async (id: string) => {
    try {
      setLoadingApiKey(true);
      const apiKey = await getApiCredentials(id, 'RESEARCHER');
      setApiKey(apiKey);
      setLoadingApiKey(false);
    } catch (err) {
      setLoadingApiKey(false);
    }
  };

  const handleRefreshApiKey = async () => {
    try {
      setRefreshingApiKey(true);
      const apiKey = await refreshApiCredentials(props.id, 'RESEARCHER');
      setApiKey(apiKey);
      setShowApiKey(true);
      setRefreshingApiKey(false);
    } catch (err) {
      setRefreshingApiKey(false);
    }
  };

  const fetchData = async (id: string) => {
    const data = await fetchUserData(id);
    if (!data) {
      // @ts-ignore
      props.onCancel();
    } else {
      if (data.role === ROLES.RESEARCHER) {
        fetchApiCredentials(id);
      }
      setUser(data);
    }
  };

  useEffect(() => {
    fetchData(props.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.id]);

  return (
    <Modal {...props} closeIcon={<X />} key={user?.id}>
      <ModalHeader subTitle="Edit user" title={user?.name ? `Update ${user?.name}'s information` : 'Update the information of the user'} />
      <form className={s['ds-modal-form']} onSubmit={handleUpdateUser}>
        <Tabs>
          <Tabs.TabPane key={0} tab="Information">
            <Card>
              {session.role === ROLES.SUPER_ADMIN && (
                <Select
                  defaultValue={user?.organizationId}
                  label="Organization"
                  onChange={organization => {
                    setUser((prev: any) => ({ ...prev, organizationId: organization }));
                  }}
                  options={[
                    {
                      value: '',
                      label: ''
                    },
                    ...organizations.map(i => ({
                      value: i?.id || '',
                      label: i?.name || ''
                    }))
                  ]}
                />
              )}
              <Input
                required
                label="Email"
                placeholder="User's email"
                value={user?.email}
                onChange={v => setUser(prev => ({ ...prev, email: v.target.value }))}
              />
              <Input
                required
                label="Name"
                placeholder="User's name"
                value={user?.name}
                onChange={v => setUser(prev => ({ ...prev, name: v.target.value }))}
              />
              <Input
                required
                label="Surname"
                placeholder="User's surname"
                value={user?.surname}
                onChange={v => setUser(prev => ({ ...prev, surname: v.target.value }))}
              />
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane key={1} tab="Security">
            <Card>
              <Row align="SPACE">
                <Card title="2FA" style={{ background: '#FFF' }}>
                  <Switch checked={user?.TFA} onChange={TFA => setUser(prev => ({ ...prev, TFA }))} left="Unactive" right="Active" />
                </Card>
                {user?.email != session?.email && user.organizationId ? (
                  <Card title="Role" style={{ background: '#FFF' }}>
                    <Switch
                      checked={user?.organizationId ? ROLES.ADMIN === user?.role : ROLES.SUPER_ADMIN === user?.role}
                      onChange={state =>
                        setUser(prev => ({
                          ...prev,
                          role: user?.organizationId
                            ? state
                              ? ROLES.ADMIN
                              : ROLES.FACT_CHECKER
                            : state
                              ? ROLES.SUPER_ADMIN
                              : ROLES.RESEARCHER
                        }))
                      }
                      left={user?.organizationId ? 'Fact-checker' : 'Researcher'}
                      right={user?.organizationId ? 'Admin' : 'Super admin'}
                    />
                  </Card>
                ) : (
                  <div className="w-full" />
                )}
              </Row>
            </Card>
          </Tabs.TabPane>
          {user?.role === ROLES.RESEARCHER && (
            <Tabs.TabPane key={2} tab="API">
              {' '}
              {loadingApiKey ? (
                <Card>
                  <Skeleton active />
                </Card>
              ) : apiKey ? (
                <Card>
                  <h5>{"Researcher's"} API KEY</h5>
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
                <Card>
                  <h5 className="m-0">Setup API Key</h5>
                  <Button type="button" onClick={handleRefreshApiKey} loading={refreshingApiKey} theme="TERTIARY">
                    Generate API Key
                  </Button>
                  <p className="m-0">
                    Let researchers find articles using the API. The researcher has to pass this key into all API requests as
                    <code>X-API-KEY={'<API_key>'}</code> header.
                  </p>
                </Card>
              )}
            </Tabs.TabPane>
          )}
        </Tabs>

        <div className={s['ds-modal-form__buttons']}>
          <Button loading={loading} theme="CTA">
            Update
          </Button>
          <Button type="button" onClick={props.onCancel} theme="SECONDARY">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
