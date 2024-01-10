import { ArrowRightOutlined } from '@ant-design/icons';
import { Badge, Divider } from 'antd';
import { FormEvent, useState } from 'react';
import { ArticleType } from '../SelectArticleType/SelectArticleType';
import { IArticlePreview } from './articlePreview.interface';
import s from './ArticlePreviewForm.module.scss';
import Button from '@/bases/Button/Button';
import { DatePicker } from '@/bases/DatePicker/DatePicker';
import { Input } from '@/bases/Input';
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select';
import Tagger from '@/bases/Tagger/Tagger';
import Card from '@/components/Card/Card';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import Page from '@/components/Page/Page';
import { CountryISO } from '@/constants/country';
import { LanguageISO } from '@/constants/language';
import { MediaFormat, MediaType, Platform } from '@/constants/media';
import { ReviewRating } from '@/constants/ratings';
import { Topic } from '@/constants/topics';

export type DebunkArticlePreviewFormProps = {};
export default function DebunkArticlePreviewForm(props: DebunkArticlePreviewFormProps & IArticlePreview) {
  const { setForm, form } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdate = (v: any, k: string) => setForm((prev: any) => ({ ...prev, [k]: v.target.value }));

  const handleSubmit = (e: FormEvent) => {
    setLoading(true);
    e?.preventDefault();
    setLoading(false);
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
                  label="Translated Headline"
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
            onChange={v => handleUpdate(v, 'headlineNative')}
            label={form.headline != form.headlineNative ? 'Original Headline' : 'Headline'}
            placeholder="Hours quoted in Spain to grow by 8.3% from 2019 despite what Figaredo said"
          />

          <Input
            label="URL"
            type="url"
            name="url"
            disabled
            minLength={10}
            value={form.url}
            onChange={v => handleUpdate(v, 'url')}
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
              disabled
              onChange={v => setForm((prev: any) => ({ ...prev, datePublished: v }))}
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
              value={form.keywords}
              mode="tags"
              onChange={v => setForm((prev: any) => ({ ...prev, keywords: v }))}
              placeholder="Ukraine, Covid, EE24"
            />
            <Select
              label="Language"
              disabled
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
            <Tagger
              disabled
              label="Topics"
              value={form.topics}
              options={Object.entries(Topic).map(([key, value]) => ({
                value: key.split('_').join(' '),
                label: value.split('_').join(' ')
              }))}
              maxTagCount="responsive"
              mode="tags"
              onChange={v => setForm((prev: any) => ({ ...prev, topics: v }))}
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
              onChange={v => setForm((prev: any) => ({ ...prev, euRelation: v }))}
            />
          </Row>
          <Row align="SPACE">
            <Select
              label="Country of Origin"
              disabled
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
              disabled
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
                  label="Translated Claim reviewed"
                  placeholder="Hours quoted in Spain to grow by 8.3% from 2019 despite what Figaredo said"
                />
              </Badge.Ribbon>
            )}
          </div>
          <Input
            label="Original Claim reviewed"
            value={form.claimreviewedNative}
            onChange={v => handleUpdate(v, 'claimreviewedNative')}
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
                ...Object.entries(ReviewRating).map(([key, value]) => ({
                  value: key.split('_').join(' '),
                  label: value.split('_').join(' ')
                }))
              ]}
              onChange={v => setForm((prev: any) => ({ ...prev, reviewRating: v }))}
            />
            <DatePicker
              label="Date published"
              disabled
              value={form.itemReviewed.datePublished}
              onChange={v => setForm((prev: any) => ({ ...prev, itemReviewed: { ...prev.itemReviewed, datePublished: v } }))}
            />
          </Row>
          {/* <Input label="Associated claim reviews url" required={form.associatedClaimReview.length > 0}>
            {form.associatedClaimReview.map((claimReview: any) => (
              <Input
                key={claimReview.id}
                style={{
                  marginBottom: 8
                }}
                required
                placeholder="https://example.com/factchecking/article-020202"
                value={claimReview?.url}
                onChange={v => {
                  setForm((prev: any) => ({
                    ...prev,
                    associatedClaimReview: prev.associatedClaimReview.map((claim: any) => {
                      if (claim.id != claimReview.id) {
                        return claim;
                      }
                      return {
                        ...claim,
                        url: v.target.value
                      };
                    })
                  }));
                }}
                onIconClick={() =>
                  setForm((prev: any) => ({
                    ...prev,
                    associatedClaimReview: prev.associatedClaimReview.filter((claim: any) => claim.id != claimReview.id)
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
                  associatedClaimReview: [
                    ...prev.associatedClaimReview,
                    {
                      id: Date.now(),
                      url: ''
                    }
                  ]
                }))
              }
            >
              <Plus size={14} /> Add associated claim review url
            </span>
          </Input> */}

          {props.type === ArticleType.Factcheck && (
            <Row align="SPACE">
              <Input
                value={form.itemReviewed.author}
                onChange={v => setForm((prev: any) => ({ ...prev, itemReviewed: { ...prev.itemReviewed, author: v.target.value } }))}
                label="Author"
                disabled
                placeholder="John Doe"
              />
              <Input
                value={form.itemReviewed.politicalParty}
                onChange={v =>
                  setForm((prev: any) => ({ ...prev, itemReviewed: { ...prev.itemReviewed, politicalParty: v.target.value } }))
                }
                disabled
                label="Political party"
                placeholder="Organization name"
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
                      key={`${appearance.id}_URL`}
                      value={appearance?.url}
                      onChange={v =>
                        setForm((prev: any) => ({
                          ...prev,
                          itemReviewed: {
                            ...prev.itemReviewed,
                            appearances: prev.itemReviewed.appearances.map((_appearance: any) => {
                              if (_appearance.id != appearance.id) {
                                return _appearance;
                              }
                              return {
                                ..._appearance,
                                url: v.target.value
                              };
                            })
                          }
                        }))
                      }
                    />
                    <Input
                      label="Archived url"
                      disabled
                      key={`${appearance.id}_URL`}
                      value={appearance?.url}
                      onChange={v =>
                        setForm((prev: any) => ({
                          ...prev,
                          itemReviewed: {
                            ...prev.itemReviewed,
                            appearances: prev.itemReviewed.appearances.map((_appearance: any) => {
                              if (_appearance.id != appearance.id) {
                                return _appearance;
                              }
                              return {
                                ..._appearance,
                                url: v.target.value
                              };
                            })
                          }
                        }))
                      }
                    />
                    <Row align="SPACE">
                      <Select
                        label="Media format"
                        disabled
                        defaultValue={appearance?.mediaFormat}
                        options={[
                          ...Object.entries(MediaFormat).map(([key, value]) => ({
                            value: key.split('_').join(' '),
                            label: value.split('_').join(' ')
                          }))
                        ]}
                        onChange={v =>
                          setForm((prev: any) => ({
                            ...prev,
                            itemReviewed: {
                              ...prev.itemReviewed,
                              appearances: prev.itemReviewed.appearances.map((_appearance: any) => {
                                if (_appearance.id != appearance.id) {
                                  return _appearance;
                                }
                                return {
                                  ..._appearance,
                                  mediaFormat: v
                                };
                              })
                            }
                          }))
                        }
                      />

                      <Select
                        label="Associated media"
                        disabled
                        defaultValue={appearance?.associatedMedia}
                        options={[
                          ...Object.entries(MediaType).map(([key, value]) => ({
                            value: key.split('_').join(' '),
                            label: value.split('_').join(' ')
                          }))
                        ]}
                        onChange={v =>
                          setForm((prev: any) => ({
                            ...prev,
                            itemReviewed: {
                              ...prev.itemReviewed,
                              appearances: prev.itemReviewed.appearances.map((_appearance: any) => {
                                if (_appearance.id != appearance.id) {
                                  return _appearance;
                                }
                                return {
                                  ..._appearance,
                                  associatedMedia: v
                                };
                              })
                            }
                          }))
                        }
                      />
                    </Row>
                    <Row align="SPACE">
                      <DatePicker disabled label="Date archived" />
                      <Select
                        label="Platform"
                        disabled
                        defaultValue={appearance?.platform}
                        options={[
                          ...Object.entries(Platform).map(([key, value]) => ({
                            value: key.split('_').join(' '),
                            label: value.split('_').join(' ')
                          }))
                        ]}
                        onChange={v =>
                          setForm((prev: any) => ({
                            ...prev,
                            itemReviewed: {
                              ...prev.itemReviewed,
                              appearances: prev.itemReviewed.appearances.map((_appearance: any) => {
                                if (_appearance.id != appearance.id) {
                                  return _appearance;
                                }
                                return {
                                  ..._appearance,
                                  platform: v
                                };
                              })
                            }
                          }))
                        }
                      />
                    </Row>
                  </Card>
                </div>
              ))}
            </Input>
          ) : null}
        </Card>
      </Page>
      <Row align="RIGHT" style={{ marginTop: 20, paddingRight: 20 }}>
        <Button loading={loading} type="submit" theme="CTA">
          Publish <ArrowRightOutlined />
        </Button>
      </Row>
    </form>
  );
}
