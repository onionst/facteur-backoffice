import { Divider, Tag } from 'antd';
import dayjs from 'dayjs';
import { ArticleType } from '../SelectArticleType/SelectArticleType';
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
import { AiVerificationType } from '@/constants/aiVerification';
import { ClaimantInfluence, ClaimantType } from '@/constants/climant';
import { DistortionType } from '@/constants/distortionType';
import { HarmEscalation } from '@/constants/harmEscalation';
import { LanguageISO } from '@/constants/language';
import { MediaFormat, Platform } from '@/constants/media';
import { ReviewRating } from '@/constants/ratings';
import { WorldCountriesISO } from '@/constants/worldCountries';

export type ArticleViewProps = {};
export default function ArticleView(props: ArticleViewProps & IArticleView) {
  const { form } = props;

  const claimReview = form.claimReview;
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

          {form?.topic ? (
            <Input label="Topic">
              <div className="ds-debunk-view__tags">
                <Tag style={{ marginBottom: 4 }}>{form.topic}</Tag>
              </div>
            </Input>
          ) : null}
          {form?.subtopics?.length > 0 ? (
            <Input label="Subtopics">
              <div className="ds-debunk-view__tags">
                {form?.subtopics.map((i: any, index: number) => (
                  <Tag style={{ marginBottom: 4 }} key={index}>
                    {i.split(' - ')[1]}
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
        {props.type !== ArticleType.Prebunk && (
          <Card theme="LIGHT">
            <h4>Claim Details</h4>
            <>
              <Divider style={{ margin: '8px 0' }} />
              <Card>
                <div className="w-full">
                  <label>Claim {claimReview?.claimReviewed != claimReview?.claimReviewedNative && '(In english)'}</label>
                  <h2>{claimReview?.claimReviewed}</h2>
                  {claimReview?.claimReviewed != claimReview?.claimReviewedNative && (
                    <p style={{ margin: 0 }}>Claim: “{claimReview?.claimReviewedNative}”</p>
                  )}
                </div>
              </Card>
              <Row align="SPACE">
                <Select
                  disabled
                  label="Rating"
                  defaultValue={claimReview?.reviewRating}
                  options={[
                    ...Object.entries(ReviewRating)
                      .filter(([, value]) => claimReview?.reviewRating === value)
                      .map(v => ({
                        value: v[1].split('_').join(' '),
                        label: v[1].split('_').join(' ')
                      }))
                  ]}
                />
              </Row>
              <Select
                disabled={true}
                label="Multiclaim"
                defaultValue={claimReview?.multiclaim ? 'true' : 'false'}
                options={[
                  {
                    label: 'Yes',
                    value: 'true'
                  },
                  {
                    label: 'No',
                    value: 'false'
                  }
                ]}
              />
              <Row align="SPACE">
                <Select
                  disabled={true}
                  label="Harm"
                  defaultValue={claimReview?.harm ? 'true' : claimReview?.harm === false ? 'false' : ''}
                  options={[
                    { label: 'Select harm', value: '' },
                    {
                      label: 'Yes',
                      value: 'true'
                    },
                    {
                      label: 'No',
                      value: 'false'
                    }
                  ]}
                />
                <Select
                  label="Harm escalation"
                  defaultValue={claimReview?.harmEscalation}
                  options={[
                    { label: 'Select the harm escalation', value: '' },
                    ...Object.entries(HarmEscalation).map(([, value]) => ({
                      label: value.split('_').join(' '),
                      value: value.split('_').join(' ')
                    }))
                  ]}
                  disabled={true}
                />
              </Row>

              <Tagger
                value={claimReview?.distortionType}
                options={[
                  ...Object.entries(DistortionType).map(([, value]) => ({
                    label: value.split('_').join(' '),
                    value: value.split('_').join(' ')
                  }))
                ]}
                mode="multiple"
                label="Distortion type"
                disabled
              />
              <Tagger
                value={claimReview?.aiVerification}
                options={[
                  ...Object.entries(AiVerificationType).map(([, value]) => ({
                    label: value.split('_').join(' '),
                    value: value.split('_').join(' ')
                  }))
                ]}
                mode="multiple"
                label="AI verification"
                disabled
              />
              {claimReview?.appearances?.length > 0 ? (
                <Input label="Claim appearances details">
                  {claimReview?.appearances.map((appearance: any, appearanceIndex: number) => (
                    <div key={`${form.url}_appearance_${appearanceIndex}`}>
                      <Card
                        key={`card_${form.url}_appearance_${appearanceIndex}`}
                        style={{
                          marginBottom: 8
                        }}
                        title={`Claim appearance #${appearanceIndex + 1}`}
                      >
                        <Input
                          disabled
                          label="URL"
                          pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                          key={`${form.url}_appearance_${appearanceIndex}_URL`}
                          value={appearance?.url}
                        />

                        <Row align="SPACE">
                          <Select
                            disabled
                            label="Platform"
                            defaultValue={appearance?.platform}
                            key={`${form.url}_appearance_${appearanceIndex}_platform`}
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
                            defaultValue={appearance?.difussionFormat}
                            key={`${form.url}_appearance_${appearanceIndex}_difussionFormat`}
                            options={[
                              { label: 'Select diffusion format', value: '' },
                              ...Object.entries(MediaFormat)
                                .filter(([, value]) => appearance?.difussionFormat === value)
                                .map(([key, value]) => ({
                                  label: key.split('_').join(' '),
                                  value: value.split('_').join(' ')
                                }))
                            ]}
                          />
                        </Row>
                        <DatePicker
                          label="Claim appearance date"
                          required
                          value={appearance.appearanceDate ? dayjs(appearance.appearanceDate) : undefined}
                          disabled
                        />

                        <Input
                          disabled
                          label="Archive URL"
                          pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                          key={`${form.url}_appearance_${appearanceIndex}_archivedAt`}
                          value={appearance?.archivedAt}
                        />
                        <Row align="SPACE">
                          <Input
                            label="Views"
                            type="number"
                            key={`appearance_${appearanceIndex}_views`}
                            value={appearance?.views}
                            disabled
                          />
                          <Input
                            label="Likes"
                            type="number"
                            key={`appearance_${appearanceIndex}_likes`}
                            value={appearance?.likes}
                            disabled
                          />
                          <Input
                            label="Comments"
                            type="number"
                            key={`appearance_${appearanceIndex}_comments`}
                            value={appearance?.comments}
                            disabled
                          />
                          <Input
                            label="Shares"
                            type="number"
                            key={`appearance_${appearanceIndex}_shares`}
                            value={appearance?.shares}
                            disabled
                          />
                        </Row>
                        <Row align="SPACE">
                          <Input
                            label="Claimant"
                            type="text"
                            key={`appearance_${appearanceIndex}_claimant`}
                            value={appearance?.claimant}
                            disabled
                          />
                        </Row>
                        <Row align="SPACE">
                          <Select
                            label="Claimant type"
                            defaultValue={appearance?.claimantType}
                            key={`appearance_${appearanceIndex}_claimantType`}
                            options={[
                              { label: 'Select the claimant type', value: '' },
                              ...Object.entries(ClaimantType).map(([key, value]) => ({
                                label: key.split('_').join(' '),
                                value: value.split('_').join(' ')
                              }))
                            ]}
                            disabled
                          />
                          <Select
                            label="Claimant influence"
                            defaultValue={appearance?.claimantInfluence}
                            key={`appearance_${appearanceIndex}_claimantInfluence`}
                            options={[
                              { label: 'Select the claimant influence', value: '' },
                              ...Object.entries(ClaimantInfluence).map(([key, value]) => ({
                                label: key.split('_').join(' '),
                                value: value.split('_').join(' ')
                              }))
                            ]}
                            disabled
                          />
                        </Row>
                      </Card>
                    </div>
                  ))}
                </Input>
              ) : null}
            </>
          </Card>
        )}

        {form.evidences && (
          <Card theme="LIGHT">
            <h4>Evidences</h4>
            <Divider style={{ margin: '8px 0' }} />
            {form.evidences.map((evidence: any, i: number) => {
              return (
                <Card key={i}>
                  <Row align="SPACE">
                    <Input disabled value={evidence.question} label="Question" />
                    <Input disabled value={evidence.answer} label="Answer" />
                  </Row>
                  <Row align="SPACE">
                    <Input disabled value={evidence.type} label="Type" />
                    <Input disabled value={evidence.url} label="URL" />
                  </Row>
                </Card>
              );
            })}
          </Card>
        )}
      </Page>
    </form>
  );
}
