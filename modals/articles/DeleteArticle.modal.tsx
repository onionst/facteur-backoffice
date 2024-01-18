import { Modal, ModalProps } from 'antd';
import { FormEvent, useEffect, useState } from 'react';
import { X } from 'react-feather';
import s from '../Modals.module.scss';
import Button from '@/bases/Button/Button';
import { Input } from '@/bases/Input';
import Card from '@/components/Card/Card';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import { useArticles } from '@/contexts/articles.context';
import { Article } from '@/dtos/articles/article.dto';

export type DeleteArticleModalProps = {
  id: string;
};
export const DELETE_ARTICLE_CONFIRMATION = 'delete';
export const DeleteArticleModal = (props: DeleteArticleModalProps & ModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<string>('');
  const { fetchArticleData, deleteArticle } = useArticles();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [article, setArticle] = useState<Partial<Article>>({});

  const handleDeleteUser = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      if (confirmation?.toLowerCase() != DELETE_ARTICLE_CONFIRMATION) {
        setLoading(false);
        return;
      }
      await deleteArticle(props.id);
      setLoading(false);
      // @ts-ignore
      props.onCancel();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchData = async (id: string) => {
    const data = await fetchArticleData(id);
    if (!data) {
      // @ts-ignore
      props.onCancel();
    } else {
      setConfirmation('');
      setArticle(data);
    }
  };

  useEffect(() => {
    if (props.id) {
      fetchData(props.id);
    }
  }, [props?.id]);

  return (
    <Modal {...props} closeIcon={<X />}>
      <ModalHeader type="ATTENTION" subTitle="Delete article" title="Are you sure you want to delete this article?" />
      <form className={s['ds-modal-form']} onSubmit={handleDeleteUser}>
        <Card>
          <Input
            required
            label={`Write '${DELETE_ARTICLE_CONFIRMATION}' to delete this article`}
            placeholder="Delete confirmation"
            value={confirmation}
            onChange={v => setConfirmation(v.target.value)}
          />
        </Card>

        <div className={s['ds-modal-form__buttons']}>
          <Button loading={loading} disabled={confirmation?.toLowerCase() != DELETE_ARTICLE_CONFIRMATION} theme="ATTENTION">
            Delete
          </Button>
          <Button type="button" onClick={props.onCancel} theme="SECONDARY">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
