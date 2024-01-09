import { Modal, ModalProps, Popconfirm, Skeleton, Tabs, Tooltip, notification } from 'antd';
import { FormEvent, useEffect, useState } from 'react';
import { Copy, Eye, EyeOff, RefreshCw, X } from 'react-feather';
import s from '../Modals.module.scss';
import Button from '@/bases/Button/Button';
import { Input } from '@/bases/Input';
import Select from '@/bases/Select';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import { CountryISO } from '@/constants/country';
import { LanguageISO } from '@/constants/language';
import { useOrganizations } from '@/contexts/organizations.context';
import { Organization } from '@/dtos/organizations/organization.dto';
import { UpdateOrganization } from '@/dtos/organizations/updateOrganization.dto';
import IconButton from '@/bases/IconButton/IconButton';
import Row from '@/bases/Row/Row';
import { useAuth } from '@/contexts/auth.context';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
import Card from '@/components/Card/Card';

export type EditOrganizationModalProps = {
  id: string;
};
export const EditOrganizationModal = (props: EditOrganizationModalProps & ModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingApiKey, setLoadingApiKey] = useState<boolean>(false);
  const [refreshingApiKey, setRefreshingApiKey] = useState<boolean>(false);
  const { fetchOrganizationData, updateOrganization } = useOrganizations();
  const [organization, setOrganization] = useState<Partial<Organization>>({});
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const { getApiCredentials, refreshApiCredentials } = useAuth();

  const handleUpdateOrganization = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      // @ts-ignore
      const form: Organization = organization;
      const payload: UpdateOrganization = {
        name: form.name?.trim(),
        domain: form.domain?.trim()
      };
      if (form.domain) {
        payload.domain = form.domain;
      }
      if (form.country) {
        payload.country = form.country;
      }
      await updateOrganization(props.id, payload);
      setLoading(false);
      // @ts-ignore
      props.onCancel();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchData = async (id: string) => {
    await fetchApiCredentials(id);
    const data = await fetchOrganizationData(id);
    if (!data) {
      // @ts-ignore
      props.onCancel();
    } else {
      setOrganization(data);
    }
  };

  const fetchApiCredentials = async (id: string) => {
    try {
      setLoadingApiKey(true);
      const apiKey = await getApiCredentials(id, 'ORGANIZATION');
      setApiKey(apiKey);
      setLoadingApiKey(false);
    } catch (err) {
      setLoadingApiKey(false);
    }
  };

  const handleRefreshApiKey = async () => {
    try {
      setRefreshingApiKey(true);
      const apiKey = await refreshApiCredentials(props.id, 'ORGANIZATION');
      setApiKey(apiKey);
      setShowApiKey(true);
      setRefreshingApiKey(false);
    } catch (err) {
      setRefreshingApiKey(false);
    }
  };

  useEffect(() => {
    if (props.id) {
      fetchData(props.id);
    }
  }, [props?.id]);

  return (
    <Modal {...props} closeIcon={<X />} key={organization?.id}>
      <ModalHeader
        subTitle="Edit organization"
        title={organization?.name ? `Update ${organization?.name}'s information` : 'Update the information of the organization'}
      />
      <form className={s['ds-modal-form']} onSubmit={handleUpdateOrganization}>
        <Tabs>
          <Tabs.TabPane tab="Information" key={0}>
            <Card>
              <Input
                required
                label="Name"
                placeholder="Organization's name"
                pattern="^[^\.]+$"
                title="Name should not include dots"
                value={organization?.name}
                onChange={v => setOrganization(prev => ({ ...prev, name: v.target.value }))}
              />
              <Input
                required
                label="Web domain"
                placeholder="e.g: efcsn.com"
                pattern=".*\..+"
                title="Web domain should include at least one dot. e.g: efcsn.com"
                value={organization?.domain}
                onChange={v => setOrganization(prev => ({ ...prev, domain: v.target.value }))}
              />

              <Select
                label="Country"
                key={organization?.id}
                defaultValue={organization?.country}
                options={[
                  { label: "Organization's country", value: '' },
                  ...Object.entries(CountryISO).map(([key, value]) => ({
                    label: key.split('_').join(' '),
                    value: value.split('_').join(' ')
                  }))
                ]}
                onChange={v => setOrganization(prev => ({ ...prev, country: v }))}
              />
              <Select
                label="Language"
                key={organization?.id}
                defaultValue={organization?.language}
                options={[
                  { label: "Organization's main language", value: '' },
                  ...Object.entries(LanguageISO).map(([key, value]) => ({
                    label: key,
                    value
                  }))
                ]}
                onChange={v => setOrganization(prev => ({ ...prev, language: v }))}
              />
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane tab="API" key={1}>
            {loadingApiKey ? (
              <Card>
                <Skeleton active />
              </Card>
            ) : apiKey ? (
              <Card>
                <h5>Organization's API KEY</h5>
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
                <p>Secret keys grants access to the API. Keep key safe and do not expose it.</p>
              </Card>
            ) : (
              <Card>
                <h5 className="m-0">Setup API Key</h5>
                <Button type="button" onClick={handleRefreshApiKey} loading={refreshingApiKey} theme="TERTIARY">
                  Generate API Key
                </Button>
                <p className="m-0">
                  Let organizations manage their articles using the API. The organization has to pass this key into all API requests as
                  <code>X-API-KEY={'<API_key>'}</code> header.
                </p>
              </Card>
            )}
          </Tabs.TabPane>
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
