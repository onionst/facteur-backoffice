import { Divider, Tag } from 'antd';
import dayjs from 'dayjs';
import { ArticleType } from '../SelectArticleType/SelectArticleType';
import { IArticleView } from './articleView.interface';
import s from './ArticleViewForm.module.scss';
import { DatePicker } from '@/bases/DatePicker/DatePicker';
import { Input } from '@/bases/Input';
import InputUploader from '@/bases/InputUploader/InputUploader';
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select/Select';
import Tagger from '@/bases/Tagger/Tagger';
import Banner from '@/components/Banner/Banner';
import Card from '@/components/Card/Card';
import Page from '@/components/Page/Page';
import { LanguageISO } from '@/constants/language';
import { MediaFormat, MediaType, Platform } from '@/constants/media';
import { ReviewRating } from '@/constants/ratings';
import { WorldCountriesISO } from '@/constants/worldCountries';

export type DebunkArticleViewFormProps = {};
export default function DebunkArticleViewForm(props: DebunkArticleViewFormProps & IArticleView) {
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
            label={`URL of the ${props.type === ArticleType.Narrative ? 'report' : 'article'}`}
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
              label="EU Relation"
              defaultValue={form?.euRelation}
              options={[{ label: form?.euRelation, value: form?.euRelation }]}
            />
          </Row>
          <Row align="SPACE">
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
          </Row>

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
        <Card theme="LIGHT">
          <h4>Claim Details</h4>
          <Divider style={{ margin: '8px 0' }} />
          <Card>
            <div className="w-full">
              <label>Claim {form?.claimreviewed != form?.claimreviewedNative && '(In english)'}</label>
              <h2>{form?.claimreviewed}</h2>
              {form?.claimreviewed != form?.claimreviewedNative && <p style={{ margin: 0 }}>Claim: “{form?.claimreviewedNative}”</p>}
            </div>
          </Card>
          <Row align="SPACE">
            <Select
              disabled
              label="Rating"
              defaultValue={form?.reviewRating}
              options={[
                ...Object.entries(ReviewRating)
                  .filter(([, value]) => form?.reviewRating === value)
                  .map(v => ({
                    value: v[1].split('_').join(' '),
                    label: v[1].split('_').join(' ')
                  }))
              ]}
            />
            <DatePicker
              disabled
              label="Date of claim publication"
              value={
                dayjs(form?.itemReviewed.datePublished).isValid()
                  ? dayjs(form?.itemReviewed.datePublished)
                  : form?.itemReviewed.datePublished
              }
            />
          </Row>
          {props.type === ArticleType.Factcheck && (
            <Row align="SPACE">
              <Input disabled value={form?.itemReviewed.author} label="Person" />
              <Input disabled value={form?.itemReviewed.politicalParty} label="EU party related to the claim" />
            </Row>
          )}
          {form?.itemReviewed?.appearances?.length > 0 ? (
            <Input label="Claim appearances details">
              {form?.itemReviewed.appearances.map((appearance: any, appearanceIndex: number) => (
                <div key={appearance.id}>
                  <Card
                    key={appearance.id}
                    style={{
                      marginBottom: 8
                    }}
                    title={`Claim appearance #${appearanceIndex + 1}`}
                  >
                    <Input
                      disabled
                      label="URL"
                      pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                      key={`${appearance.id}_URL`}
                      value={appearance?.url}
                    />

                    <Row align="SPACE">
                      <Select
                        disabled
                        label="Platform"
                        defaultValue={appearance?.platform}
                        options={[
                          ...Object.entries(Platform)
                            .filter(([, value]) => appearance?.platform === value)
                            .map(([key, value]) => ({
                              label: key.split('_').join(' '),
                              value: value.split('_').join(' ')
                            }))
                        ]}
                      />
                      <Select
                        disabled
                        label="Format"
                        defaultValue={appearance?.mediaFormat}
                        options={[
                          { label: 'Select media format', value: '' },
                          ...Object.entries(MediaFormat)
                            .filter(([, value]) => appearance?.mediaFormat === value)
                            .map(([key, value]) => ({
                              label: key.split('_').join(' '),
                              value: value.split('_').join(' ')
                            }))
                        ]}
                      />
                    </Row>

                    <Row align="SPACE">
                      <InputUploader disabled label="Associated multimedia" value={appearance?.associatedMedia} />

                      <Select
                        disabled
                        label="Associated multimedia format"
                        defaultValue={appearance?.associatedMediaType}
                        options={[
                          { label: 'Select associated media format', value: '' },
                          ...Object.entries(MediaType)
                            .filter(([, value]) => appearance?.associatedMediaType === value)
                            .map(([key, value]) => ({
                              label: key.split('_').join(' '),
                              value: value.split('_').join(' ')
                            }))
                        ]}
                      />
                    </Row>
                    <Input
                      disabled
                      label="Archive URL"
                      pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
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
    </form>
  );
}
