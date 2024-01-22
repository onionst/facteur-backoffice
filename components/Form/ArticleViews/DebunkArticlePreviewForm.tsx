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
import { LanguageISO } from '@/constants/language';
import { MediaFormat, MediaType, Platform } from '@/constants/media';
import { ReviewRating } from '@/constants/ratings';
import { Topic } from '@/constants/topics';
import { WorldCountriesISO } from '@/constants/worldCountries';

export type DebunkArticleViewFormProps = {};
export default function DebunkArticleViewForm(props: DebunkArticleViewFormProps & IArticleView) {
  const { form } = props;

  return (
    <form className={s['ds-article-preview-form']}>
      <Page>
        <Card theme="LIGHT">
          <h4>Overview</h4>
          <Divider style={{ margin: '8px 0' }} />

          <div className="w-full">
            {form.headline != form.headlineNative && (
              <Input
                type="text"
                minLength={10}
                value={form.headline}
                label={`Title of the ${props.type === ArticleType.Narrative ? 'report' : 'article'} (In english)`}
                placeholder="Hours quoted in Spain to grow by 8.3% from 2019 despite what Figaredo said"
              />
            )}
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
            <Tagger label="Keywords" maxTagCount="responsive" suffixIcon={null} value={form.keywords} mode="tags" />
            <Select
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
            <Select label="EU Relation" defaultValue={form?.euRelation} options={[{ label: form?.euRelation, value: form?.euRelation }]} />
          </Row>
          <Row align="SPACE">
            <Select
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
              mode="multiple"
              label="Country/Countries identified in article"
            />
          </Row>
        </Card>
        <Card theme="LIGHT">
          <h4>Claim Details</h4>
          <Divider style={{ margin: '8px 0' }} />
          <div className="w-full">
            {form.claimreviewed != form.claimreviewedNative && (
              <Input
                type="text"
                minLength={10}
                value={form.claimreviewed}
                label="Claim (In english)"
                placeholder="Hours quoted in Spain to grow by 8.3% from 2019 despite what Figaredo said"
              />
            )}
          </div>
          <Input label="Claim" value={form.claimreviewedNative} type="text" minLength={10} />
          <Row align="SPACE">
            <Select
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
              label="Date of claim publication"
              value={
                dayjs(form.itemReviewed.datePublished).isValid() ? dayjs(form.itemReviewed.datePublished) : form.itemReviewed.datePublished
              }
            />
          </Row>
          {props.type === ArticleType.Factcheck && (
            <Row align="SPACE">
              <Input value={form.itemReviewed.author} label="Person" />
              <Input value={form.itemReviewed.politicalParty} label="EU party related to the claim" />
            </Row>
          )}

          {form.itemReviewed.appearances.length > 0 ? (
            <Input label="Claim appearances details">
              {form.itemReviewed.appearances.map((appearance: any, appearanceIndex: number) => (
                <div key={appearance.id}>
                  <Card
                    key={appearance.id}
                    style={{
                      marginBottom: 8
                    }}
                    title={`Claim appearance #${appearanceIndex + 1}`}
                  >
                    <Input
                      label="URL"
                      pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                      key={`${appearance.id}_URL`}
                      value={appearance?.url}
                    />

                    <Row align="SPACE">
                      <Select
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
                      <Input label="Associated multimedia" value={appearance?.associatedMedia} />

                      <Select
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
