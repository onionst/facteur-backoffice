import { Divider } from 'antd';
import dayjs from 'dayjs';
import { ArticleType } from '../SelectArticleType/SelectArticleType';
import { IArticleView } from './articleView.interface';
import s from './ArticleViewForm.module.scss';
import { DatePicker } from '@/bases/DatePicker/DatePicker';
import { Input } from '@/bases/Input';
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select/Select';
import Tagger from '@/bases/Tagger/Tagger';
import Card from '@/components/Card/Card';
import Page from '@/components/Page/Page';
import { CountryISO } from '@/constants/country';
import { LanguageISO } from '@/constants/language';
import { Topic } from '@/constants/topics';
import { WorldCountriesISO } from '@/constants/worldCountries';

export type ArticleViewFormProps = {};
export default function ArticleViewForm(props: ArticleViewFormProps & IArticleView) {
  const { form } = props;
  return (
    <form className={s['ds-article-preview-form']}>
      <Page>
        <Card theme="LIGHT">
          <h4>Overview</h4>
          <Divider style={{ margin: '8px 0' }} />

          <div className="w-full">
            <Input
              type="text"
              minLength={10}
              required
              value={form.headline}
              label={`Translated title of the ${props.type === ArticleType.Narrative ? 'report' : 'article'}`}
              placeholder="Hours quoted in Spain to grow by 8.3% from 2019 despite what Figaredo said"
            />
          </div>
          <Input
            type="text"
            minLength={10}
            value={form.headlineNative}
            label={
              form.headline != form.headlineNative
                ? `Native title of the ${props.type === ArticleType.Narrative ? 'report' : 'article'}`
                : `Title of the ${props.type === ArticleType.Narrative ? 'report' : 'article'}`
            }
          />

          <Input
            label={`URL of the ${props.type === ArticleType.Narrative ? 'report' : 'article'}`}
            type="url"
            name="url"
            minLength={10}
            value={form.url}
            id="url"
            pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
          />

          <Row align="SPACE">
            <Input
              type="url"
              name="url"
              value={form.image}
              minLength={10}
              id="url"
              pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
              label="Image URL"
            />
            <DatePicker
              label="Date of article publication"
              value={dayjs(form.datePublished).isValid() ? dayjs(form.datePublished) : form.datePublished}
            />
          </Row>
        </Card>
        <Card theme="LIGHT">
          <h4>Article Details</h4>
          <Divider style={{ margin: '8px 0' }} />

          <Row align="SPACE">
            <Tagger label="Keywords" maxTagCount="responsive" value={form.keywords} mode="tags" suffixIcon={null} />
            <Select
              label="Language of publication"
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
    </form>
  );
}
