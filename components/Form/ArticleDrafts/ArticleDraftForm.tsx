import { Divider } from 'antd';
import { FormEvent } from 'react';
import { IArticleDraft } from './articleDraft.interface';
import s from './ArticleDraftForm.module.scss';
import Button from '@/bases/Button/Button';
import { DatePicker } from '@/bases/DatePicker/DatePicker';
import { Input } from '@/bases/Input';
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select';
import Card from '@/components/Card/Card';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import Page from '@/components/Page/Page';
import { CountryISO } from '@/constants/country';
import { LanguageISO } from '@/constants/language';
import { Topic } from '@/constants/topics';

export type ArticleDraftFormProps = {};
export default function ArticleDraftForm(props: ArticleDraftFormProps & IArticleDraft) {
  const { setForm, form } = props;
  const handleUpdate = (v: any, k: string) => setForm((prev: any) => ({ ...prev, [k]: v.target.value }));
  const handleSubmit = (e: FormEvent) => {
    e?.preventDefault();
    props.onContinue(form);
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
            <Input
              type="url"
              name="url"
              value={form.image}
              onChange={v => handleUpdate(v, 'image')}
              minLength={10}
              id="url"
              pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
              label="Image URL"
              placeholder="https://example.com/factchecking/article-010101"
            />
            <DatePicker
              label="Date published"
              value={form.datePublished}
              onChange={v => setForm((prev: any) => ({ ...prev, datePublished: v }))}
            />
          </Row>
        </Card>
        <Card>
          <h4>Article Details</h4>
          <Divider style={{ margin: '8px 0' }} />

          <Row align="SPACE">
            <Input
              label="Keywords (comma separated)"
              value={form.keywords}
              onChange={v => handleUpdate(v, 'keywords')}
              placeholder="Ukraine, Covid, EE24"
            />
            <Select
              label="Language"
              defaultValue={form?.inLanguage}
              options={[
                { label: "Article's language", value: '' },
                ...Object.entries(LanguageISO).map(([key, value]) => ({
                  label: key,
                  value
                }))
              ]}
              onChange={v => setForm((prev: any) => ({ ...prev, inLanguage: v }))}
            />
          </Row>
          <Row align="SPACE">
            <Select
              label="Topics"
              // defaultValue={form?.topics}a
              options={[
                { label: "Article's topic", value: '' },
                ...Object.entries(Topic).map(([key, value]) => ({
                  value: key.split('_').join(' '),
                  label: value.split('_').join(' ')
                }))
              ]}
              onChange={v => setForm((prev: any) => ({ ...prev, topics: v }))}
            />
            <Select
              label="EU Relation"
              defaultValue={form?.euRelation}
              options={[
                { label: 'Direct', value: 'Direct' },
                { label: 'Indirect', value: 'Indirect' }
              ]}
              onChange={v => setForm((prev: any) => ({ ...prev, euRelation: v }))}
            />
          </Row>
          <Row align="SPACE">
            <Select
              label="Country of Origin"
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
        <Button theme="CTA">Continue</Button>
      </div>
    </form>
  );
}
