import { Divider } from 'antd';
import { Plus, X } from 'react-feather';
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
import { ReviewRating } from '@/constants/ratings';
import { Topic } from '@/constants/topics';
import { useState } from 'react';

export type DebunkArticleDraftFormProps = {};
export default function DebunkArticleDraftForm(props: DebunkArticleDraftFormProps & IArticleDraft) {
  const [form, setForm] = useState({
    type: 'Factcheck',
    url: '',
    headline: '',
    headlineNative: '',
    datePublished: '',
    image: '',
    keywords: [],
    inLanguage: '',
    topics: [],
    euRelation: '',
    countryOfOrigin: '',
    contentLocation: '',
    claimreviewed: '',
    claimreviewedNative: '',
    reviewRating: '',
    itemReviewed: {
      datePublished: '',
      author: '',
      politicalParty: '',
      appearances: [
        {
          url: '',
          archivedAt: '',
          associatedMedia: '',
          mediaFormat: '',
          platform: ''
        }
      ]
    },
    associatedClaimReview: ['']
  });
  return (
    <form className={s['ds-article-draft-form']} onSubmit={() => {}}>
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
            id="url"
            pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
            required
            placeholder="https://example.com/factchecking/article-010101"
          />
          <Input
            type="text"
            minLength={10}
            required
            label="Headline"
            placeholder="Hours quoted in Spain to grow by 8.3% from 2019 despite what Figaredo said"
          />
          <Row align="SPACE">
            <Input
              type="url"
              name="url"
              minLength={10}
              id="url"
              pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
              label="Image URL"
              placeholder="https://example.com/factchecking/article-010101"
            />
            <DatePicker label="Date published" />
          </Row>
        </Card>
        <Card>
          <h4>Article Details</h4>
          <Divider style={{ margin: '8px 0' }} />

          <Row align="SPACE">
            <Input label="Keywords (comma separated)" placeholder="Ukraine, Covid, EE24" />
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
            <Select
              label="Topics"
              // defaultValue={form?.country}
              options={[
                { label: "Article's topic", value: '' },
                ...Object.entries(Topic).map(([key, value]) => ({
                  value: key.split('_').join(' '),
                  label: value.split('_').join(' ')
                }))
              ]}
              // onChange={v => setForm(prev => ({ ...prev, country: v }))}
            />
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
                { label: 'Country of Origin', value: '' },
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
                { label: 'Content location', value: '' },
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
          <Input label="Claim reviewed" type="text" minLength={10} required placeholder="Quoted hours are falling in Spain" />
          <Select
            label="Rating"
            required
            // defaultValue={form?.country}
            options={[
              ...Object.entries(ReviewRating).map(([key, value]) => ({
                value: key.split('_').join(' '),
                label: value.split('_').join(' ')
              }))
            ]}
            // onChange={v => setForm(prev => ({ ...prev, country: v }))}
          />
          <Input label="Associated claim reviews url" required={form.associatedClaimReview.length > 0}>
            {form.associatedClaimReview.map((input, index) => (
              <Input
                key={index}
                style={{
                  marginBottom: 8
                }}
                required
                placeholder="https://example.com/factchecking/article-020202"
                value={input}
                onIconClick={() =>
                  setForm(prev => ({
                    ...prev,
                    associatedClaimReview: prev.associatedClaimReview.filter((_: any, _index: any) => _index != index)
                  }))
                }
                withIcon={<X color="#4b5675" size={20} />}
              />
            ))}
            <span
              className="c-pointer mt-1"
              onClick={() =>
                setForm((prev: any) => ({
                  ...prev,
                  associatedClaimReview: [...prev.associatedClaimReview, '']
                }))
              }
            >
              <u>
                <Plus size={14} /> Add another claim review url
              </u>
            </span>
          </Input>
        </Card>
        <Card>
          <h4>Item reviewed</h4>
          <Divider style={{ margin: '8px 0' }} />
          <Row align="SPACE">
            <Input label="Author" placeholder="John Doe" />
            <Input label="Political party" placeholder="Organization name" />
          </Row>
          <DatePicker label="Date published" />
          <Input label="Appearances" required={form.itemReviewed.appearances.length > 0}>
            {form.itemReviewed.appearances.map((appearance, index) => (
              <Card
                key={index}
                style={{
                  marginBottom: 8
                }}
              >
                <Input label="URL" required />
                <Row align="SPACE">
                  <Input label="Media Format" />
                  <Input label="Associated media" />
                </Row>
                <Row align="SPACE">
                  <Input label="Date archived" />
                  <Input label="Platform" />
                </Row>
                <Row align="RIGHT">
                  <span
                    className="c-pointer mt-2"
                    onClick={() =>
                      setForm((prev: any) => ({
                        ...prev,
                        itemReviewed: {
                          ...prev.itemReviewed,
                          appearances: prev.itemReviewed.appearances.filter((_: any, _index: any) => _index != index)
                        }
                      }))
                    }
                  >
                    <u>
                      <X size={14} /> Remove appearance
                    </u>
                  </span>
                </Row>
              </Card>
            ))}
            <span
              className="c-pointer"
              onClick={() =>
                setForm((prev: any) => ({
                  ...prev,
                  itemReviewed: {
                    ...prev.itemReviewed,
                    appearances: [
                      ...prev.itemReviewed.appearances,
                      {
                        url: '',
                        archivedAt: '',
                        associatedMedia: '',
                        mediaFormat: '',
                        platform: ''
                      }
                    ]
                  }
                }))
              }
            >
              <u>
                <Plus size={14} /> Add appearance
              </u>
            </span>
          </Input>
        </Card>
      </Page>
      <div className={s['ds-article-draft-form__fab']}>
        <Button type="submit" theme="CTA">
          Continue
        </Button>
      </div>
    </form>
  );
}
