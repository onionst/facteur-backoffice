import { Divider } from 'antd';
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

export type DebunkArticleDraftFormProps = {};
export default function DebunkArticleDraftForm(props: DebunkArticleDraftFormProps & IArticleDraft) {
  return (
    <div className={s['ds-article-draft-form']}>
      <Page>
        <ModalHeader
          style={{ margin: 0 }}
          subTitle={'Write the draft'}
          title={`Complete the following form to create a new ${props.type} article`}
        />
        <form className="grid-100">
          <Card>
            <h4>Overview</h4>
            <Divider style={{ margin: '8px 0' }} />
            <Input label="Headline" placeholder="Hours quoted in Spain to grow by 8.3% from 2019 despite what Figaredo said" />
            <Row align="SPACE">
              <Input label="URL" placeholder="https://example.com/factchecking/article-010101" />
              <Input label="Image URL" placeholder="https://example.com/factchecking/article-010101" />
            </Row>
            <Row align="SPACE">
              <DatePicker label="Date published" />
              <div className="w-full" />
            </Row>
          </Card>
          <Card>
            <h4>Article Details</h4>
            <Divider style={{ margin: '8px 0' }} />

            <Row align="SPACE">
              <Input label="Keywords" placeholder="Ukraine, Covid, EE24" />
              <Select
                label="Language"
                // defaultValue={form?.language}
                options={[
                  { label: "Article's language", value: '' },
                  ...Object.entries(LanguageISO).map(([key, value]) => ({
                    label: key,
                    value
                  }))
                ]}
                // onChange={v => setForm(prev => ({ ...prev, language: v }))}
              />
            </Row>
            <Row align="SPACE">
              <Input label="Topics" placeholder="Migration, Religion" />
              <Select
                label="EU Relation"
                // defaultValue={form?.language}
                options={[
                  { label: 'Direct', value: 'Direct' },
                  { label: 'Indirect', value: 'Indirect' }
                ]}
                // onChange={v => setForm(prev => ({ ...prev, language: v }))}
              />
            </Row>
            <Row align="SPACE">
              <Select
                label="Country of Origin"
                // defaultValue={form?.country}
                options={[
                  { label: "Organization's country", value: '' },
                  ...Object.entries(CountryISO).map(([key, value]) => ({
                    label: key.split('_').join(' '),
                    value: value.split('_').join(' ')
                  }))
                ]}
                // onChange={v => setForm(prev => ({ ...prev, country: v }))}
              />
              <Select
                label="Content location"
                // defaultValue={form?.country}
                options={[
                  { label: "Organization's country", value: '' },
                  ...Object.entries(CountryISO).map(([key, value]) => ({
                    label: key.split('_').join(' '),
                    value: value.split('_').join(' ')
                  }))
                ]}
                // onChange={v => setForm(prev => ({ ...prev, country: v }))}
              />
            </Row>
          </Card>
          <Card>
            <h4>Claim Details</h4>
            <Divider style={{ margin: '8px 0' }} />
            <Input label="Claim reviewed" placeholder="Quoted hours are falling in Spain" />
            <Input label="Rating" placeholder="False" />
            <Input label="Associated claim reviews url" placeholder="https://example.com/factchecking/article-020202" />
          </Card>
          <Card>
            <h4>Item reviewed</h4>
            <Divider style={{ margin: '8px 0' }} />
            <Row align="SPACE">
              <Input label="Author" placeholder="John Doe" />
              <Input label="Political party" placeholder="Organization name" />
            </Row>
            <DatePicker label="Date published" />
          </Card>
        </form>
      </Page>
      <div className={s['ds-article-draft-form__fab']}>
        <Button theme="CTA">Continue</Button>
      </div>
    </div>
  );
}
