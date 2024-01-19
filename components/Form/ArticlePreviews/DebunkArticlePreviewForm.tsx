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
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select/Select';
import Tagger from '@/bases/Tagger/Tagger';
import Card from '@/components/Card/Card';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import Page from '@/components/Page/Page';
import { CountryISO } from '@/constants/country';
import { LanguageISO } from '@/constants/language';
import { MediaFormat, MediaType, Platform } from '@/constants/media';
import { ReviewRating } from '@/constants/ratings';
import { Topic } from '@/constants/topics';
import { WorldCountriesISO } from '@/constants/worldCountries';

export type DebunkArticlePreviewFormProps = {};
export default function DebunkArticlePreviewForm(props: DebunkArticlePreviewFormProps & IArticlePreview) {
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
          title={`Review and preview your ${props.type} article before submission`}
        />
        <Card theme="LIGHT">
          <h4>Overview</h4>
          <Divider style={{ margin: '8px 0' }} />

          <div className="w-full">
            {form.headline != form.headlineNative && (
              <Badge.Ribbon text="Translated with AI">
                <Input
                  type="text"
                  minLength={10}
                  required
                  value={form.headline}
                  onChange={v => handleUpdate(v, 'headline')}
                  label={`Title of the ${props.type === ArticleType.Narrative ? 'report' : 'article'} (In english)`}
                  placeholder="Hours quoted in Spain to grow by 8.3% from 2019 despite what Figaredo said"
                />
              </Badge.Ribbon>
            )}
          </div>
          <Input
            type="text"
            minLength={10}
            disabled
            value={form.headlineNative}
            label={
              form.headline != form.headlineNative
                ? `Native title of the ${props.type === ArticleType.Narrative ? 'report' : 'article'}`
                : `Title of the ${props.type === ArticleType.Narrative ? 'report' : 'article'}`
            }
            placeholder="Hours quoted in Spain to grow by 8.3% from 2019 despite what Figaredo said"
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
            placeholder="https://example.com/factchecking/article-010101"
          />

          <Row align="SPACE">
            <Input
              type="url"
              name="url"
              disabled
              value={form.image}
              minLength={10}
              id="url"
              pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
              label="Image URL"
              placeholder="https://example.com/factchecking/article-010101"
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
            <Tagger
              label="Keywords"
              maxTagCount="responsive"
              disabled
              suffixIcon={null}
              value={form.keywords}
              mode="tags"
              placeholder="Add keywords separated by commas. e.g:Ukraine, Covid, EE24"
            />
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
                value: key.split('_').join(' '),
                label: value.split('_').join(' ')
              }))}
              maxTagCount="responsive"
              mode="multiple"
              placeholder="Article's topics"
            />
            <Select
              label="EU Relation"
              disabled
              defaultValue={form?.euRelation}
              options={[
                { label: 'EU Relation', value: '' },
                { label: 'Direct', value: 'Direct' },
                { label: 'Indirect', value: 'Indirect' }
              ]}
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
              mode="multiple"
              label="Country/Countries identified in article"
              placeholder="Country/Countries identified in article"
            />
          </Row>
        </Card>
        <Card theme="LIGHT">
          <h4>Claim Details</h4>
          <Divider style={{ margin: '8px 0' }} />
          <div className="w-full">
            {form.claimreviewed != form.claimreviewedNative && (
              <Badge.Ribbon text="Translated with AI">
                <Input
                  type="text"
                  minLength={10}
                  required
                  value={form.claimreviewed}
                  onChange={v => handleUpdate(v, 'claimreviewed')}
                  label="Claim (In english)"
                  placeholder="Hours quoted in Spain to grow by 8.3% from 2019 despite what Figaredo said"
                />
              </Badge.Ribbon>
            )}
          </div>
          <Input
            label="Claim"
            value={form.claimreviewedNative}
            type="text"
            minLength={10}
            disabled
            placeholder="Quoted hours are falling in Spain"
          />
          <Row align="SPACE">
            <Select
              label="Rating"
              disabled
              defaultValue={form?.reviewRating}
              options={[
                ...Object.entries(ReviewRating).map(v => ({
                  value: v[1].split('_').join(' '),
                  label: v[1].split('_').join(' ')
                }))
              ]}
            />
            <DatePicker
              label="Date of claim publication"
              disabled
              value={
                dayjs(form.itemReviewed.datePublished).isValid() ? dayjs(form.itemReviewed.datePublished) : form.itemReviewed.datePublished
              }
            />
          </Row>
          {props.type === ArticleType.Factcheck && (
            <Row align="SPACE">
              <Input value={form.itemReviewed.author} label="Person" disabled placeholder="John Doe" />
              <Input
                value={form.itemReviewed.politicalParty}
                disabled
                label="EU party related to the claim"
                placeholder="EU party related to the claim"
              />
            </Row>
          )}

          {form.itemReviewed.appearances.length > 0 ? (
            <Input label="Appearances" required={form.itemReviewed.appearances.length > 0}>
              {form.itemReviewed.appearances.map((appearance: any) => (
                <div key={appearance.id}>
                  <Card
                    key={appearance.id}
                    style={{
                      marginBottom: 8
                    }}
                  >
                    <Input
                      label="URL"
                      disabled
                      pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                      placeholder="https://example.com/factchecking/article-010101"
                      key={`${appearance.id}_URL`}
                      value={appearance?.url}
                    />

                    <Row align="SPACE">
                      <Select
                        label="Platform"
                        disabled
                        defaultValue={appearance?.platform}
                        options={[
                          { label: 'Select platform where appearance was found', value: '' },
                          ...Object.entries(Platform).map(([key, value]) => ({
                            value: key.split('_').join(' '),
                            label: value.split('_').join(' ')
                          }))
                        ]}
                      />
                      <Select
                        disabled
                        label="Format"
                        defaultValue={appearance?.mediaFormat}
                        options={[
                          { label: 'Select media format', value: '' },
                          ...Object.entries(MediaFormat).map(([key, value]) => ({
                            value: key.split('_').join(' '),
                            label: value.split('_').join(' ')
                          }))
                        ]}
                      />
                    </Row>

                    <Row align="SPACE">
                      <Input label="Associated multimedia" value={appearance?.associatedMedia} disabled placeholder="Upload file" />

                      <Select
                        disabled
                        label="Associated multimedia format"
                        defaultValue={appearance?.associatedMediaType}
                        options={[
                          { label: 'Select associated media format', value: '' },
                          ...Object.entries(MediaType).map(([key, value]) => ({
                            value: key.split('_').join(' '),
                            label: value.split('_').join(' ')
                          }))
                        ]}
                      />
                    </Row>
                    <Input
                      disabled
                      label="Archive URL"
                      pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                      placeholder="https://example.com/factchecking/article-010101"
                      key={`${appearance.id}_archived`}
                      value={appearance?.archivedAt}
                    />
                  </Card>
                </div>
              ))}
            </Input>
          ) : null}
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
