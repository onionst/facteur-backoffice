import { Modal, ModalProps, notification } from 'antd';
import { FormEvent, useState } from 'react';
import { X } from 'react-feather';
import s from '../Modals.module.scss';
import Button from '@/bases/Button/Button';
import { Input } from '@/bases/Input';
import { Segment } from '@/bases/Segment/Segment';
import Card from '@/components/Card/Card';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';

export type DownloadEE24ArticlesModalProps = {
  id: string;
};
export const DownloadEE24ArticlesModal = (props: DownloadEE24ArticlesModalProps & ModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fileType, setFileType] = useState<string>('CSV');

  const handleDownloadEE24Articles = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      notification.success({ ...NOTIFICATIONS_CONFIG.success, message: 'Download started', description: 'It may take a few minutes' });
      // const articles = await DownloadEE24Articles(0, [], session.organization?.domain || 'undefined');

      // const data = articles.map(article => ({
      //   type: article?.type || '',
      //   headline: article?.headline || '',
      //   nativeHeadline: article?.headlineNative || '',
      //   url: article?.url || '',
      //   image: article?.image || '',
      //   euRelation: article?.euRelation || '',
      //   claimReviewed: article?.claimreviewed || '',
      //   claimReviewedNative: article?.claimreviewedNative || '',
      //   rating: article?.reviewRating || ''
      // }));

      // let blob: Blob;
      // const filename = `articles-${dayjs().format('DD-MM-YYYY')}.${fileType === 'CSV' ? 'csv' : 'xlsx'}`;

      // if (fileType === 'CSV') {
      //   blob = convertJsonToCsv(data);

      //   const link = document.createElement('a');
      //   if (link.download !== undefined) {
      //     const url = URL.createObjectURL(blob);
      //     link.setAttribute('href', url);
      //     link.setAttribute('download', filename);
      //     link.style.visibility = 'hidden';
      //     document.body.appendChild(link);
      //     link.click();
      //     document.body.removeChild(link);
      //   }
      // } else {
      //   const wb = utils.book_new();
      //   const ws = utils.json_to_sheet(data);
      //   utils.book_append_sheet(wb, ws, 'articles');
      //   writeFile(wb, filename);
      // }

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
      <ModalHeader subTitle="Export articles" title="Select an export file type" />
      <form className={s['ds-modal-form']} onSubmit={handleDownloadEE24Articles}>
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
                  },
                  {
                    label: '.JSON',
                    value: 'JSON'
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
