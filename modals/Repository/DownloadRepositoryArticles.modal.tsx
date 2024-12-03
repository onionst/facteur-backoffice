import { Modal, ModalProps, Tooltip, notification } from 'antd';
import dayjs from 'dayjs';
import { FormEvent, useState } from 'react';
import { X } from 'react-feather';
import { FileType } from '../FileType';
import s from '../Modals.module.scss';
import Button from '@/bases/Button/Button';
import { Input } from '@/bases/Input';
import { Segment } from '@/bases/Segment/Segment';
import Card from '@/components/Card/Card';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
import { useRepository } from '@/contexts/repository.context';

export type DownloadRepositoryArticlesModalProps = {
  id: string;
  filter: any;
};
export const DownloadRepositoryArticlesModal = (props: DownloadRepositoryArticlesModalProps & ModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fileType, setFileType] = useState<string>(FileType.CSV);
  const { downloadRepositoryArticles: downloadRepositoryArticles, page } = useRepository();
  const [exportArticles, setExportArticles] = useState<number | string>();

  const handleChangeExportArticles = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExportArticles(parseInt(event?.target?.value));
  };

  const handleCancel = (e: FormEvent) => {
    e?.preventDefault();
    setExportArticles('');
    // @ts-ignore
    props.onCancel();
  };

  const resetForm = () => {
    setLoading(false);
    setExportArticles('');
  };

  const handleDownloadRepositoryArticles = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      notification.success({ ...NOTIFICATIONS_CONFIG.success, message: 'Download started', description: 'It may take a few minutes' });

      const sliceData = page.records && exportArticles && exportArticles !== page.records;
      let filters = { ...props.filter, export: true, fileType };
      if (sliceData) {
        filters = { ...filters, exportSize: exportArticles };
      }

      const blob = await downloadRepositoryArticles(filters);

      const filename = `articles-${dayjs().format('DD-MM-YYYY')}.${fileType === FileType.CSV ? 'csv' : fileType === FileType.XLSX ? 'xlsx' : 'json'}`;

      const link = document.createElement('a');
      if (link.download !== undefined && blob !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error('Could not retrieve file.');
      }

      resetForm();
      // @ts-ignore
      props.onCancel();
    } catch (err) {
      console.error(err);
      notification.error({
        ...NOTIFICATIONS_CONFIG.error,
        message: 'Download error',
        description: 'File download failed'
      });
      resetForm();
    }
  };

  return (
    <Modal {...props} closeIcon={<X />} closable={!loading} maskClosable={!loading} onCancel={handleCancel}>
      <ModalHeader subTitle="Export articles" title="Select an export file type" />
      <form className={s['ds-modal-form']} onSubmit={handleDownloadRepositoryArticles}>
        {!loading && (
          <Card>
            <Input label="File type" required>
              <Segment
                selected={fileType}
                onSelect={setFileType}
                options={[
                  {
                    label: `.${FileType.CSV}`,
                    value: FileType.CSV
                  },
                  {
                    label: `.${FileType.XLSX}`,
                    value: FileType.XLSX
                  },
                  {
                    label: `.${FileType.JSON}`,
                    value: FileType.JSON
                  }
                ]}
              />
            </Input>
            <Tooltip title={`Total articles ${page.records}`}>
              <Input
                onChange={e => handleChangeExportArticles(e)}
                type="number"
                placeholder={`Total articles ${page.records}`}
                max={page.records}
                min={1}
                value={exportArticles}
                label="How many articles do you want to export?"
              ></Input>
            </Tooltip>
          </Card>
        )}

        <div className={s['ds-modal-form__buttons']}>
          <Button loading={loading} theme="CTA">
            Export
          </Button>
          <Button type="button" disabled={loading} onClick={handleCancel} theme="SECONDARY">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
