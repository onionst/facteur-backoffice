import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import dayjs from 'dayjs';
import { FormEvent, useState } from 'react';
import { Plus, X } from 'react-feather';
import { ArticleType } from '../SelectArticleType/SelectArticleType';
import { IArticleDraft } from './articleDraft.interface';
import s from './ArticleDraftForm.module.scss';
import Button from '@/bases/Button/Button';
import { DatePicker } from '@/bases/DatePicker/DatePicker';
import { Input } from '@/bases/Input';
import InputUploader from '@/bases/InputUploader/InputUploader';
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select/Select';
import Tagger from '@/bases/Tagger/Tagger';
import Card from '@/components/Card/Card';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import Page from '@/components/Page/Page';
import { FILE_TYPES } from '@/constants/accept';
import { CountryISO } from '@/constants/country';
import { LanguageISO } from '@/constants/language';
import { MediaFormat, MediaType, Platform } from '@/constants/media';
import { PoliticalParty } from '@/constants/politicalParty';
import { ReviewRating } from '@/constants/ratings';
import { Topic } from '@/constants/topics';
import { WorldCountriesISO } from '@/constants/worldCountries';
import { useArticles } from '@/contexts/articles.context';
import { validateUrl } from '@/utils/validateUrl';

export type DebunkArticleDraftFormProps = {};
export default function DebunkArticleDraftForm(props: DebunkArticleDraftFormProps & IArticleDraft) {
  const [loading, setLoading] = useState<boolean>(false);
  const { fetchTranslation, fetchMetadata } = useArticles();
  const { setForm, form } = props;
  const [fetchingUrlMetadata, setFetchingUrlMetadata] = useState<boolean>(false);
  const [urlFetcheable, setUrlFetcheable] = useState<boolean>(false);
  const handleUpdate = (v: any, k: string) => setForm((prev: any) => ({ ...prev, [k]: v.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      const [headline, claimreviewed] = await Promise.all([
        fetchTranslation(form.headlineNative),
        fetchTranslation(form.claimreviewedNative)
      ]);
      setForm((prev: any) => ({
        ...prev,
        headline,
        claimreviewed
      }));
      setLoading(false);
      props.onContinue(form);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleFetchUrlMetadata = async () => {
    try {
      setFetchingUrlMetadata(true);
      const { metadata, claimReview } = await fetchMetadata(props.type, form.url);

      setForm((prev: any) => ({
        ...prev,
        description: metadata?.summary || '',
        headlineNative: metadata?.title || prev?.headlineNative,
        image: metadata?.image || metadata?.meta_image || prev?.image,
        datePublished: dayjs(metadata?.date).isValid() ? dayjs(metadata?.date) : prev?.datePublished,
        claimreviewedNative: claimReview?.claimReviewed,
        itemReviewed: {
          datePublished: claimReview?.itemReviewed?.datePublished,
          author: claimReview?.itemReviewed?.author?.name,
          politicalParty: prev?.itemReviewed?.politicalParty,
          appearances: prev?.itemReviewed?.appearances
        }
      }));
      setFetchingUrlMetadata(false);
    } catch (err) {
      setFetchingUrlMetadata(false);
    }
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
          <div className="w-full ds-buttons-flex">
            <Input
              label={`URL of the ${props.type === ArticleType.Narrative ? 'report' : 'article'}`}
              type="url"
              name="url"
              minLength={10}
              value={form.url}
              onChange={v => {
                handleUpdate(v, 'url');
                setUrlFetcheable(validateUrl(v.target.value));
              }}
              id="url"
              pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
              required
              placeholder="https://example.com/factchecking/article-010101"
            />
            <Button type="button" onClick={handleFetchUrlMetadata} loading={fetchingUrlMetadata} disabled={!urlFetcheable} theme="TERTIARY">
              Fetch data
            </Button>
          </div>
          <Input
            type="text"
            minLength={10}
            required
            value={form.headlineNative}
            onChange={v => handleUpdate(v, 'headlineNative')}
            label={`Title of the ${props.type === ArticleType.Narrative ? 'report' : 'article'}`}
            placeholder="Hours quoted in Spain to grow by 8.3% from 2019 despite what Figaredo said"
          />
          <Row align="SPACE">
            <InputUploader
              accept={{
                'image/png': FILE_TYPES.images
              }}
              label="Image URL"
              value={form.image}
              onUrlChange={(url: string) => {
                setForm((prev: any) => ({
                  ...prev,
                  image: url
                }));
              }}
              placeholder="Upload image"
            />
            <DatePicker
              label="Date of article publication"
              value={dayjs(form.datePublished).isValid() ? dayjs(form.datePublished) : form.datePublished}
              onChange={v => setForm((prev: any) => ({ ...prev, datePublished: v }))}
            />
          </Row>
        </Card>
        <Card>
          <h4>Article Details</h4>
          <Divider style={{ margin: '8px 0' }} />

          <Row align="SPACE">
            <Tagger
              label="Keywords"
              maxTagCount="responsive"
              suffixIcon={null}
              value={form.keywords}
              mode="tags"
              onChange={v => setForm((prev: any) => ({ ...prev, keywords: v }))}
              placeholder="Add keywords separated by commas. e.g:Ukraine, Covid, EE24"
            />
            <Select
              label="Language of publication"
              required
              defaultValue={form?.inLanguage}
              options={[
                { label: 'Language of publication', value: '' },
                ...Object.entries(LanguageISO).map(([key, value]) => ({
                  label: key.split('_').join(' '),
                  value: value.split('_').join(' ')
                }))
              ]}
              onChange={v => setForm((prev: any) => ({ ...prev, inLanguage: v }))}
            />
          </Row>
          <Row align="SPACE">
            <Tagger
              label="Topics"
              value={form.topics}
              options={Object.entries(Topic).map(v => ({
                value: v[1].split('_').join(' '),
                label: v[1].split('_').join(' ')
              }))}
              maxTagCount="responsive"
              mode="multiple"
              onChange={v => setForm((prev: any) => ({ ...prev, topics: v }))}
              placeholder="Article's topics"
            />
            <Select
              label="EU Relation"
              required
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
              label="Country of the organization"
              required
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
              onChange={v => setForm((prev: any) => ({ ...prev, contentLocation: v }))}
              label="Country/Countries identified in article"
              placeholder="Country/Countries identified in article"
            />
          </Row>
        </Card>
        <Card>
          <h4>Claim Details</h4>
          <Divider style={{ margin: '8px 0' }} />
          <Input
            label="Claim"
            value={form.claimreviewedNative}
            onChange={v => handleUpdate(v, 'claimreviewedNative')}
            type="text"
            minLength={10}
            required
            placeholder="Quoted hours are falling in Spain"
          />
          <Row align="SPACE">
            <Select
              label="Rating"
              required
              defaultValue={form?.reviewRating}
              options={[
                { label: 'Rating', value: '' },
                ...Object.entries(ReviewRating).map(v => ({
                  value: v[1].split('_').join(' '),
                  label: v[1].split('_').join(' ')
                }))
              ]}
              onChange={v => setForm((prev: any) => ({ ...prev, reviewRating: v }))}
            />
            <DatePicker
              label="Date of claim publication"
              value={
                dayjs(form.itemReviewed.datePublished).isValid() ? dayjs(form.itemReviewed.datePublished) : form.itemReviewed.datePublished
              }
              onChange={v => setForm((prev: any) => ({ ...prev, itemReviewed: { ...prev.itemReviewed, datePublished: v } }))}
            />
          </Row>

          {props.type === ArticleType.Factcheck && (
            <Row align="SPACE">
              <Input
                value={form.itemReviewed.author}
                onChange={v => setForm((prev: any) => ({ ...prev, itemReviewed: { ...prev.itemReviewed, author: v.target.value } }))}
                label="Person"
                placeholder="John Doe"
              />

              <Select
                label="EU party related to the claim"
                defaultValue={form?.itemReviewed?.politicalParty}
                options={[
                  { label: 'Political party', value: '' },
                  ...Object.entries(PoliticalParty).map(v => ({
                    value: v[1].split('_').join(' '),
                    label: v[1].split('_').join(' ')
                  }))
                ]}
                onChange={v =>
                  setForm((prev: any) => ({
                    ...prev,
                    itemReviewed: {
                      ...prev.itemReviewed,
                      politicalParty: v
                    }
                  }))
                }
              />
            </Row>
          )}

          <Input requiredHide label="Claim appearances details" required={form?.itemReviewed?.appearances?.length > 0}>
            {form?.itemReviewed?.appearances?.map((appearance: any, appearanceIndex: number) => (
              <div key={appearance?.id}>
                <Card
                  key={appearance?.id}
                  style={{
                    marginBottom: 8
                  }}
                  title={`Claim appearance #${appearanceIndex + 1}`}
                >
                  <Input
                    label="URL"
                    pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                    placeholder="https://example.com/factchecking/article-010101"
                    key={`${appearance?.id}_URL`}
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
                      label="Platform"
                      defaultValue={appearance?.platform}
                      options={[
                        { label: 'Select platform where appearance was found', value: '' },
                        ...Object.entries(Platform).map(([key, value]) => ({
                          label: key.split('_').join(' '),
                          value: value.split('_').join(' ')
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
                    <Select
                      label="Format"
                      defaultValue={appearance?.mediaFormat}
                      options={[
                        { label: 'Select media format', value: '' },
                        ...Object.entries(MediaFormat).map(([key, value]) => ({
                          label: key.split('_').join(' '),
                          value: value.split('_').join(' ')
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
                  </Row>

                  <Row align="SPACE">
                    <InputUploader
                      accept={{
                        'image/png': FILE_TYPES.images,
                        'audio/mp3': FILE_TYPES.audio,
                        'video/mp4': FILE_TYPES.videos,
                        'application/*': FILE_TYPES.files
                      }}
                      label="Associated multimedia"
                      value={appearance?.associatedMedia}
                      onUrlChange={(url: string) => {
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
                                associatedMedia: url
                              };
                            })
                          }
                        }));
                      }}
                      placeholder="Upload file"
                    />

                    <Select
                      label="Associated multimedia format"
                      defaultValue={appearance?.associatedMediaType}
                      options={[
                        { label: 'Select associated media format', value: '' },
                        ...Object.entries(MediaType).map(([key, value]) => ({
                          label: key.split('_').join(' '),
                          value: value.split('_').join(' ')
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
                                associatedMediaType: v
                              };
                            })
                          }
                        }))
                      }
                    />
                  </Row>
                  <Input
                    label="Archive URL"
                    pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                    placeholder="https://example.com/factchecking/article-010101"
                    key={`${appearance.id}_archived`}
                    value={appearance?.archivedAt}
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
                              archivedAt: v.target.value
                            };
                          })
                        }
                      }))
                    }
                  />
                  <Row align="RIGHT">
                    <span
                      className="c-pointer mt-2"
                      onClick={() =>
                        setForm((prev: any) => ({
                          ...prev,
                          itemReviewed: {
                            ...prev.itemReviewed,
                            appearances: prev.itemReviewed.appearances.filter((_appearance: any) => _appearance.id != appearance.id)
                          }
                        }))
                      }
                    >
                      <X size={14} /> Remove claim appearance
                    </span>
                  </Row>
                </Card>
              </div>
            ))}
            <span
              className="c-pointer"
              onClick={() => {
                const id = Date.now();
                setForm((prev: any) => ({
                  ...prev,
                  itemReviewed: {
                    ...prev.itemReviewed,
                    appearances: [
                      ...(prev?.itemReviewed?.appearances || []),
                      {
                        id,
                        url: '',
                        archivedAt: '',
                        associatedMedia: '',
                        associatedMediaType: '',
                        mediaFormat: '',
                        platform: ''
                      }
                    ]
                  }
                }));
              }}
            >
              <Plus size={14} /> Add claim appearance
            </span>
          </Input>
        </Card>
      </Page>
      <div className={s['ds-article-draft-form__fab']}>
        <Row align="RIGHT">
          <Button type="button" theme="TERTIARY" onClick={props.onBack}>
            <ArrowLeftOutlined />
            Go back
          </Button>
          <Button loading={loading} theme="CTA">
            Continue
            <ArrowRightOutlined />
          </Button>
        </Row>
      </div>
    </form>
  );
}
