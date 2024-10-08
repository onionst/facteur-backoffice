import { Divider, Tag } from 'antd';
import dayjs from 'dayjs';
import { IArticleView } from './articleView.interface';
import s from './ArticleViewForm.module.scss';
import { DatePicker } from '@/bases/DatePicker/DatePicker';
import { Input } from '@/bases/Input';
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select/Select';
import Tagger from '@/bases/Tagger/Tagger';
import Banner from '@/components/Banner/Banner';
import Card from '@/components/Card/Card';
import Page from '@/components/Page/Page';
import { LanguageISO } from '@/constants/language';
import { WorldCountriesISO } from '@/constants/worldCountries';

export type ArticleViewFormProps = {};
export default function ArticleViewForm(props: ArticleViewFormProps & IArticleView) {
  const { form } = props;
  return (
    <form className={`${s['ds-article-preview-form']} w-full`}>
      <Page>
        <Banner src={form?.image} />
        <Card theme="LIGHT">
          <h4>Overview</h4>
          <Divider style={{ margin: '8px 0' }} />
          <Card>
            <div className="w-full">
              <label>Title {form?.headline != form?.headlineNative && '(In english)'}</label>
              <h1>{form?.headline}</h1>
              {form?.healine != form?.headlineNative && <p style={{ margin: 0 }}>Title: “{form?.headlineNative}”</p>}
            </div>
          </Card>

          <Input
            label={'URL of the article'}
            type="url"
            name="url"
            disabled
            minLength={10}
            value={form?.url}
            id="url"
            pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
          />

          <DatePicker
            label="Date of article publication"
            disabled
            value={dayjs(form?.datePublished).isValid() ? dayjs(form?.datePublished) : form?.datePublished}
          />
        </Card>
        <Card theme="LIGHT">
          <h4>Article Details</h4>
          <Divider style={{ margin: '8px 0' }} />

          <Row align="SPACE">
            <Select
              disabled
              label="Language of publication"
              defaultValue={form?.inLanguage}
              options={[
                ...Object.entries(LanguageISO)
                  .filter(([, value]) => form?.inLanguage === value)
                  .map(([key, value]) => ({
                    label: key.split('_').join(' '),
                    value: value.split('_').join(' ')
                  }))
              ]}
            />

            <Select
              disabled
              label="Country of the organization"
              defaultValue={form?.countryOfOrigin}
              options={[
                ...Object.entries(WorldCountriesISO)
                  .filter(([, value]) => form?.countryOfOrigin === value)
                  .map(([key, value]) => ({
                    label: key.split('_').join(' '),
                    value: value.split('_').join(' ')
                  }))
              ]}
            />
          </Row>

          <Tagger
            value={form?.contentLocation}
            options={[
              ...Object.entries(WorldCountriesISO)
                .filter(([, value]) => form?.contentLocation.includes(value))
                .map(([key, value]) => ({
                  label: key.split('_').join(' '),
                  value: value.split('_').join(' ')
                }))
            ]}
            disabled
            mode="multiple"
            label="Country/Countries identified in article"
          />

          {form?.topics?.length > 0 ? (
            <Input label="Topics">
              <div className="ds-debunk-view__tags">
                {form?.topics.map((i: any, index: number) => (
                  <Tag style={{ marginBottom: 4 }} key={index}>
                    {i}
                  </Tag>
                ))}
              </div>
            </Input>
          ) : null}
          {form?.keywords?.length > 0 ? (
            <Input label="Keywords">
              <div className="ds-debunk-view__tags">
                {form?.keywords.map((i: any, index: number) => (
                  <Tag style={{ marginBottom: 4 }} key={index}>
                    {i}
                  </Tag>
                ))}
              </div>
            </Input>
          ) : null}
        </Card>
      </Page>
    </form>
  );
}
