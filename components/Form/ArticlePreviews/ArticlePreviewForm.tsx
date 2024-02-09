import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Badge, Divider } from 'antd';
import dayjs from 'dayjs';
import { FormEvent, useState } from 'react';
import { ArticleType } from '../SelectArticleType/SelectArticleType';
import { IArticlePreview } from './articlePreview.interface';
import s from './ArticlePreviewForm.module.scss';
import Button from '@/bases/Button/Button';
import { DatePicker } from '@/bases/DatePicker/DatePicker';
import { Input } from '@/bases/Input';
import InputUploader from '@/bases/InputUploader/InputUploader';
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select/Select';
import Tagger from '@/bases/Tagger/Tagger';
import { TextArea } from '@/bases/Textarea';
import Card from '@/components/Card/Card';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import Page from '@/components/Page/Page';
import { CountryISO } from '@/constants/country';
import { LanguageISO } from '@/constants/language';
import { Topic } from '@/constants/topics';
import { WorldCountriesISO } from '@/constants/worldCountries';

export type ArticlePreviewFormProps = {};
export default function ArticlePreviewForm(props: ArticlePreviewFormProps & IArticlePreview) {
  const { setForm, form } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdate = (v: any, k: string) => setForm((prev: any) => ({ ...prev, [k]: v.target.value }));

  const handleSubmit = (e: FormEvent) => {
    try {
      setLoading(true);
      e?.preventDefault();
      props.onPublish();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className={s['ds-article-preview-form']} onSubmit={handleSubmit}>
      <Page>
        <ModalHeader
          style={{ margin: 0 }}
          subTitle={'Preview the Draft'}
          title={`Review and preview your ${props.type} ${props.type === ArticleType.Narrative ? 'report' : 'article'} before submission`}
        />
        <Card theme="LIGHT">
          <h4>Overview</h4>
          <Divider style={{ margin: '8px 0' }} />

          <div className="w-full">
            {form.headline != form.headlineNative && (
              <Badge.Ribbon text="Translated with AI">
                <TextArea
                  type="text"
                  minLength={10}
                  required
                  value={form.headline}
                  onChange={v => handleUpdate(v, 'headline')}
                  label={`Title of the ${props.type === ArticleType.Narrative ? 'report' : 'article'} (In English)`}
                  placeholder="Hours quoted in Spain to grow by 8.3% from 2019 despite what Figaredo said"
                />
              </Badge.Ribbon>
            )}
          </div>
          <TextArea
            type="text"
            minLength={10}
            disabled
            value={form.headlineNative}
            label={`Title of the ${props.type === ArticleType.Narrative ? 'report' : 'article'}`}
          />

          <Input
            label={`URL of the ${props.type === ArticleType.Narrative ? 'report' : 'article'}`}
            type="url"
            name="url"
            disabled
            minLength={10}
            value={form.url}
            id="url"
            pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
          />

          <Row align="SPACE">
            <InputUploader
              type="url"
              name="url"
              disabled
              value={form.image}
              minLength={10}
              id="url"
              pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
              label="Image URL"
            />
            <DatePicker
              label="Date of article publication"
              value={dayjs(form.datePublished).isValid() ? dayjs(form.datePublished) : form.datePublished}
              disabled
            />
          </Row>
        </Card>
        <Card theme="LIGHT">
          <h4>Article Details</h4>
          <Divider style={{ margin: '8px 0' }} />

          <Row align="SPACE">
            <Tagger label="Keywords" maxTagCount="responsive" disabled value={form.keywords} mode="tags" suffixIcon={null} />
            <Select
              label="Language of publication"
              disabled
              defaultValue={form?.inLanguage}
              options={[
                { label: 'Language of publication', value: '' },
                ...Object.entries(LanguageISO).map(([key, value]) => ({
                  label: key.split('_').join(' '),
                  value: value.split('_').join(' ')
                }))
              ]}
            />
          </Row>
          <Row align="SPACE">
            <Tagger
              disabled
              label="Topics"
              value={form.topics}
              options={Object.entries(Topic).map(([key, value]) => ({
                label: key.split('_').join(' '),
                value: value.split('_').join(' ')
              }))}
              maxTagCount="responsive"
              mode="multiple"
            />
          </Row>
          <Row align="SPACE">
            <Select
              label="Country of the organization"
              disabled
              defaultValue={form?.countryOfOrigin}
              options={[
                { label: 'Country of Origin', value: '' },
                ...Object.entries(CountryISO).map(([key, value]) => ({
                  label: key.split('_').join(' '),
                  value: value.split('_').join(' ')
                }))
              ]}
            />
            <Tagger
              disabled
              value={form?.contentLocation}
              options={[
                ...Object.entries(WorldCountriesISO).map(([key, value]) => ({
                  label: key.split('_').join(' '),
                  value: value.split('_').join(' ')
                }))
              ]}
              maxTagCount="responsive"
              mode="multiple"
              label="Country/Countries identified in article"
            />
          </Row>
        </Card>
      </Page>
      <Row align="RIGHT" style={{ marginTop: 20, paddingRight: 20 }}>
        <Button type="button" theme="TERTIARY" onClick={props.onBack}>
          <ArrowLeftOutlined />
          Go back
        </Button>
        <Button loading={loading} theme="CTA" type="submit">
          Publish
          <ArrowRightOutlined />
        </Button>
      </Row>
    </form>
  );
}
