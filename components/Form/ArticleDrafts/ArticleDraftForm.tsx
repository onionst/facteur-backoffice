import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import dayjs from 'dayjs';
import { FormEvent, useState } from 'react';
import { IArticleDraft } from './articleDraft.interface';
import s from './ArticleDraftForm.module.scss';
import Button from '@/bases/Button/Button';
import { DatePicker } from '@/bases/DatePicker/DatePicker';
import { Input } from '@/bases/Input';
import InputUploader from '@/bases/InputUploader/InputUploader';
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select/Select';
import Tagger from '@/bases/Tagger/Tagger';
import Card from '@/components/Card/Card';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import Page from '@/components/Page/Page';
import { FILE_TYPES } from '@/constants/accept';
import { CountryISO } from '@/constants/country';
import { LanguageISO } from '@/constants/language';
import { Topic } from '@/constants/topics';
import { useArticles } from '@/contexts/articles.context';

export type ArticleDraftFormProps = {};
export default function ArticleDraftForm(props: ArticleDraftFormProps & IArticleDraft) {
  const { fetchTranslation } = useArticles();
  const [loading, setLoading] = useState<boolean>(false);
  const { setForm, form } = props;
  const handleUpdate = (v: any, k: string) => setForm((prev: any) => ({ ...prev, [k]: v.target.value }));
  const handleSubmit = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      const [headline] = await Promise.all([fetchTranslation(form.headlineNative)]);
      setForm((prev: any) => ({
        ...prev,
        headline
      }));
      setLoading(false);
      props.onContinue(form);
    } catch (err) {
      setLoading(false);
    }
  };
  return (
    <form className={s['ds-article-draft-form']} onSubmit={handleSubmit}>
      <Page>
        <ModalHeader
          style={{ margin: 0 }}
          subTitle={'Write the draft'}
          title={`Complete the following form to create a new ${props.type} article`}
        />
        <Card>
          <h4>Overview</h4>
          <Divider style={{ margin: '8px 0' }} />
          <Input
            label="URL"
            type="url"
            name="url"
            minLength={10}
            value={form.url}
            onChange={v => handleUpdate(v, 'url')}
            id="url"
            pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
            required
            placeholder="https://example.com/factchecking/article-010101"
          />
          <Input
            type="text"
            minLength={10}
            required
            value={form.headlineNative}
            onChange={v => handleUpdate(v, 'headlineNative')}
            label="Headline"
            placeholder="Hours quoted in Spain to grow by 8.3% from 2019 despite what Figaredo said"
          />
          <Row align="SPACE">
            <InputUploader
              accept={{
                'image/png': FILE_TYPES.images
              }}
              label="Image URL"
              value={form.image}
              onUrlChange={(url: string) => {
                setForm((prev: any) => ({
                  ...prev,
                  image: url
                }));
              }}
              placeholder="Upload image"
            />

            <DatePicker
              label="Date published"
              defaultValue={dayjs(form.datePublished).isValid() ? dayjs(form.datePublished) : form.datePublished}
              onChange={v => setForm((prev: any) => ({ ...prev, datePublished: v }))}
            />
          </Row>
        </Card>
        <Card>
          <h4>Article Details</h4>
          <Divider style={{ margin: '8px 0' }} />

          <Row align="SPACE">
            <Tagger
              label="Keywords"
              maxTagCount="responsive"
              suffixIcon={null}
              value={form.keywords}
              mode="tags"
              onChange={v => setForm((prev: any) => ({ ...prev, keywords: v }))}
              placeholder="Add keywords separated by commas. e.g:Ukraine, Covid, EE24"
            />
            <Select
              label="Language"
              required
              defaultValue={form?.inLanguage}
              options={[
                { label: "Article's language", value: '' },
                ...Object.entries(LanguageISO).map(([key, value]) => ({
                  label: key.split('_').join(' '),
                  value: value.split('_').join(' ')
                }))
              ]}
              onChange={v => setForm((prev: any) => ({ ...prev, inLanguage: v }))}
            />
          </Row>
          <Row align="SPACE">
            <Tagger
              label="Topics"
              value={form.topics}
              options={Object.entries(Topic).map(v => ({
                value: v[1].split('_').join(' '),
                label: v[1].split('_').join(' ')
              }))}
              maxTagCount="responsive"
              mode="tags"
              onChange={v => setForm((prev: any) => ({ ...prev, topics: v }))}
              placeholder="Article's topics"
            />
            <Select
              label="EU Relation"
              required
              defaultValue={form?.euRelation}
              options={[
                { label: 'EU Relation', value: '' },
                { label: 'Direct', value: 'Direct' },
                { label: 'Indirect', value: 'Indirect' }
              ]}
              onChange={v => setForm((prev: any) => ({ ...prev, euRelation: v }))}
            />
          </Row>
          <Row align="SPACE">
            <Select
              label="Country of Origin"
              required
              defaultValue={form?.countryOfOrigin}
              options={[
                { label: 'Country of Origin', value: '' },
                ...Object.entries(CountryISO).map(([key, value]) => ({
                  label: key.split('_').join(' '),
                  value: value.split('_').join(' ')
                }))
              ]}
              onChange={v => setForm((prev: any) => ({ ...prev, countryOfOrigin: v }))}
            />
            <Select
              label="Content location"
              defaultValue={form?.contentLocation}
              options={[
                { label: 'Content location', value: '' },
                ...Object.entries(CountryISO).map(([key, value]) => ({
                  label: key.split('_').join(' '),
                  value: value.split('_').join(' ')
                }))
              ]}
              onChange={v => setForm((prev: any) => ({ ...prev, contentLocation: v }))}
            />
          </Row>
        </Card>
      </Page>
      <div className={s['ds-article-draft-form__fab']}>
        <Row align="RIGHT">
          <Button type="button" theme="TERTIARY" onClick={props.onBack}>
            <ArrowLeftOutlined />
            Go back
          </Button>
          <Button loading={loading} theme="CTA">
            Continue
            <ArrowRightOutlined />
          </Button>
        </Row>
      </div>
    </form>
  );
}
