import { Modal, ModalProps, notification } from 'antd';
import dayjs from 'dayjs';
import { FormEvent, useEffect, useState } from 'react';
import { X } from 'react-feather';
import { utils, writeFile } from 'xlsx';
import s from '../Modals.module.scss';
import { parseRole } from './InviteUsers.modal';
import Button from '@/bases/Button/Button';
import { Input } from '@/bases/Input';
import { Segment } from '@/bases/Segment/Segment';
import Card from '@/components/Card/Card';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
import { ROLES } from '@/constants/roles.constants';
import { useAuth } from '@/contexts/auth.context';
import { useOrganizations } from '@/contexts/organizations.context';
import { useUsers } from '@/contexts/users.context';
import { convertJsonToCsv } from '@/utils/convertJsonToCsv';

export type DownloadUsersModalProps = {
  id: string;
};
export const DownloadUsersModal = (props: DownloadUsersModalProps & ModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [organizations, setOrganizations] = useState<Array<{ value: string; label: string }>>([]);
  const [fileType, setFileType] = useState<string>('CSV');
  const { downloadUsers } = useUsers();
  const { session } = useAuth();
  const { listOrganizations } = useOrganizations();

  const handleListOrganization = async () => {
    setOrganizations([
      {
        value: '',
        label: ''
      },
      ...(await listOrganizations()).map(organization => ({
        value: organization?.id || '',
        label: organization?.name || ''
      }))
    ]);
  };

  useEffect(() => {
    if (session.role === ROLES.SUPER_ADMIN) {
      handleListOrganization();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const handleDownloadUsers = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      notification.success({ ...NOTIFICATIONS_CONFIG.success, message: 'Download started', description: 'It may take a few minutes' });
      const users = await downloadUsers(0, []);

      const data = users.map(user => {
        let payload = {
          name: user?.name || '',
          surname: user?.surname || '',
          email: user?.email || '',
          active: user?.active ? 1 : 0,
          role: parseRole(user?.role) || ''
          // apiKey: user?.apiKey || ''
        };
        if (session.role === ROLES.SUPER_ADMIN) {
          payload = {
            ...payload,
            // @ts-ignore
            organization: organizations.find((i: any) => i.value === user.organizationId)?.label || ''
          };
        }
        return payload;
      });

      let blob: Blob;
      const filename = `users-${dayjs().format('DD-MM-YYYY')}.${fileType === 'CSV' ? 'csv' : 'xlsx'}`;

      if (fileType === 'CSV') {
        blob = convertJsonToCsv(data);

        const link = document.createElement('a');
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        const wb = utils.book_new();
        const ws = utils.json_to_sheet(data);
        utils.book_append_sheet(wb, ws, 'users');
        writeFile(wb, filename);
      }

      setLoading(false);
      // @ts-ignore
      props.onCancel();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <Modal {...props} closeIcon={<X />} closable={!loading} maskClosable={!loading}>
      <ModalHeader subTitle="Export users" title="Select an export file type" />
      <form className={s['ds-modal-form']} onSubmit={handleDownloadUsers}>
        {!loading && (
          <Card>
            <Input label="File type" required>
              <Segment
                selected={fileType}
                onSelect={setFileType}
                options={[
                  {
                    label: '.CSV',
                    value: 'CSV'
                  },
                  {
                    label: '.XLSX',
                    value: 'XLSX'
                  }
                ]}
              />
            </Input>
          </Card>
        )}

        <div className={s['ds-modal-form__buttons']}>
          <Button loading={loading} theme="CTA">
            Export
          </Button>
          <Button type="button" disabled={loading} onClick={props.onCancel} theme="SECONDARY">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
