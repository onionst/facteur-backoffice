import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Badge, Divider, notification } from 'antd';
import { FormEvent, useState } from 'react';
import { Plus, Minus } from 'react-feather';
import { ArticleType } from '../SelectArticleType/SelectArticleType';
import { IArticleDraft } from './articleDraft.interface';
import s from './ArticleDraftForm.module.scss';
import ClaimReviewDraftForm from './ClaimReviewDraftForm';
import Button from '@/bases/Button/Button';
import { Input } from '@/bases/Input';
import InputUploader from '@/bases/InputUploader/InputUploader';
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select/Select';
import Tagger from '@/bases/Tagger/Tagger';
import { TextArea } from '@/bases/Textarea';
import Card from '@/components/Card/Card';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import Page from '@/components/Page/Page';
import { FILE_TYPES, MIN_LENGTH_KEYWORDS } from '@/constants/accept';
import { CountryISO } from '@/constants/country';
import { EvidenceType } from '@/constants/evidenceType';
import { LanguageISO } from '@/constants/language';
import { Subtopic, Topic } from '@/constants/topics';
import { WorldCountriesISO } from '@/constants/worldCountries';
import { useArticles } from '@/contexts/articles.context';
import { validateUrl } from '@/utils/validateUrl';

export type ArticleFormProps = {
  preview?: boolean;
};

export default function ArticleForm(props: ArticleFormProps & IArticleDraft) {
  const [loading, setLoading] = useState<boolean>(false);
  const { fetchTranslation, handleFetchUrlMetadata } = useArticles();
  const { setForm, form, preview = false } = props;
  const [fetchingUrlMetadata, setFetchingUrlMetadata] = useState<boolean>(false);
  const [urlFetcheable, setUrlFetcheable] = useState<boolean>(false);

  const handlePublish = (e: FormEvent) => {
    if (props.onPublish !== undefined) {
      try {
        setLoading(true);
        e?.preventDefault();
        props.onPublish();
      } catch (err) {
        console.error(err);
      }
    }
  };
  const handleUpdate = (v: any, k: string) => setForm((prev: any) => ({ ...prev, [k]: v.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    if (props.onContinue !== undefined) {
      try {
        e?.preventDefault();
        setLoading(true);
        const natives: string[] = [form.headlineNative].concat(form.claimReview.claimReviewedNative);
        const translations = await Promise.all(natives.map(native => fetchTranslation(native)));
        translations.forEach((text: string) => text.replaceAll('\\', ''));
        if (form.type === ArticleType.Factcheck) {
          const claimReview = {
            ...form.claimReview,
            claimReviewed: translations[1]
          };
          setForm((prev: any) => ({
            ...prev,
            headline: translations[0],
            claimReview: claimReview
          }));
        } else {
          setForm((prev: any) => ({
            ...prev,
            headline: translations[0]
          }));
        }

        setLoading(false);
        props.onContinue(form);
      } catch (err) {
        setLoading(false);
      }
    }
  };

  const handleClickFetchUrlMetadata = async () => {
    await handleFetchUrlMetadata(props.type, form.url, setForm, setFetchingUrlMetadata);
  };

  const removeEvidence = async (indexToRemove: number) => {
    setForm((prev: any) => ({
      ...prev,
      evidences: form.evidences.filter((_: any, index: number) => index !== indexToRemove)
    }));
  };

  const addEvidence = async () => {
    setForm((prev: any) => ({
      ...prev,
      evidences: [
        ...form.evidences,
        {
          title: '',
          url: ''
        }
      ]
    }));
  };

  return (
    <form className={s['ds-article-draft-form']} onSubmit={preview ? handlePublish : handleSubmit}>
      <Page>
        <ModalHeader
          style={{ margin: 0 }}
          subTitle={'Write the draft'}
          title={`Complete the following form to create a new ${props.type} article`}
        />
        <Card>
          <h4>Overview</h4>
          <Divider style={{ margin: '8px 0' }} />
          <div className="w-full">
            {form.headline != form.headlineNative && props.preview && (
              <Badge.Ribbon text="Translated with AI">
                <TextArea
                  type="text"
                  minLength={10}
                  required
                  value={form.headline}
                  onChange={v => handleUpdate(v, 'headline')}
                  label={'Title of the article (In English)'}
                  placeholder="Hours quoted in Spain to grow by 8.3% from 2019 despite what Figaredo said"
                />
              </Badge.Ribbon>
            )}
          </div>

          <div className="w-full ds-buttons-flex">
            <Input
              label={'URL of the article'}
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
              disabled={preview}
            />
            {!preview && (
              <Button
                type="button"
                onClick={handleClickFetchUrlMetadata}
                loading={fetchingUrlMetadata}
                disabled={!urlFetcheable}
                theme="TERTIARY"
              >
                Fetch data
              </Button>
            )}
          </div>
          <TextArea
            type="text"
            minLength={10}
            required
            value={form.headlineNative}
            onChange={v => handleUpdate(v, 'headlineNative')}
            label={'Title of the article'}
            placeholder="Hours quoted in Spain to grow by 8.3% from 2019 despite what Figaredo said"
            disabled={preview}
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
              disabled={preview}
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
              onChange={v => {
                if (v?.find((keyword: string) => keyword?.length < MIN_LENGTH_KEYWORDS)) {
                  notification.warning({
                    message: `Keywords must be at least ${MIN_LENGTH_KEYWORDS} character long`
                  });
                }
                setForm((prev: any) => ({ ...prev, keywords: v.filter((keyword: string) => keyword?.length >= MIN_LENGTH_KEYWORDS) }));
              }}
              placeholder="Add keywords separated by commas. e.g:Ukraine, Covid"
              disabled={preview}
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
              disabled={preview}
            />
          </Row>
          <Row align="SPACE">
            <Select
              label="Topic"
              defaultValue={form.topic}
              options={[
                { label: 'Topic', value: '' },
                ...Object.entries(Topic).map(v => ({
                  value: v[1].split('_').join(' '),
                  label: v[1].split('_').join(' ')
                }))
              ]}
              required
              onChange={v => setForm((prev: any) => ({ ...prev, topic: v, subtopics: undefined }))}
              disabled={preview}
            />
            <Tagger
              label="Subtopics"
              value={form.subtopics}
              options={[
                ...Object.entries(Subtopic)
                  .filter(v => v[1].startsWith(form.topic))
                  .map(v => ({
                    value: v[1].split('_').join(' '),
                    label: v[1].split(' - ')[1]
                  }))
              ]}
              maxTagCount="responsive"
              mode="multiple"
              onChange={v => setForm((prev: any) => ({ ...prev, subtopics: v }))}
              placeholder="Article's subtopics"
              required
              disabled={preview || !form.topic}
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
              disabled={preview}
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
              disabled={preview}
            />
          </Row>
        </Card>
        {props.type !== ArticleType.Prebunk && (
          <Card>
            <h4>Claim Details</h4>
            <ClaimReviewDraftForm
              claimReview={form.claimReview}
              formUrl={form.url}
              index={0}
              handleUpdate={(newClaimReviewValue: any) => {
                setForm({
                  ...form,
                  claimReview: newClaimReviewValue
                });
              }}
              key={0}
              type={props.type}
              preview={preview}
            />
          </Card>
        )}
        {(!preview || form.evidences.length > 0) && props.type !== ArticleType.Prebunk && (
          <Card>
            <h4>Evidences</h4>
            <Divider style={{ margin: '8px 0' }} />

            {form.evidences?.map((evidence: any, evidenceIndex: number) => {
              return (
                <>
                  <div className="w-full ds-buttons-flex">
                    <Input
                      label={'URL of the evidence'}
                      type="url"
                      name="url"
                      minLength={10}
                      value={evidence.url}
                      onChange={v => {
                        setForm({
                          ...form,
                          evidences: form.evidences.map((currentEvidence: any, i: number) =>
                            i === evidenceIndex ? { ...currentEvidence, url: v.target.value } : currentEvidence
                          )
                        });
                      }}
                      id="url"
                      pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                      required
                      placeholder="https://example.com/factchecking/article-010101"
                      disabled={preview}
                    />
                  </div>
                  <TextArea
                    type="text"
                    minLength={10}
                    required
                    value={evidence.question}
                    onChange={v => {
                      setForm({
                        ...form,
                        evidences: form.evidences.map((currentEvidence: any, i: number) =>
                          i === evidenceIndex ? { ...currentEvidence, question: v.target.value } : currentEvidence
                        )
                      });
                    }}
                    label={'Evidence question'}
                    placeholder="Question"
                    disabled={preview}
                  />
                  <TextArea
                    type="text"
                    minLength={10}
                    required
                    value={evidence.answer}
                    onChange={v => {
                      setForm({
                        ...form,
                        evidences: form.evidences.map((currentEvidence: any, i: number) =>
                          i === evidenceIndex ? { ...currentEvidence, answer: v.target.value } : currentEvidence
                        )
                      });
                    }}
                    label={'Evidence answer'}
                    placeholder="Answer"
                    disabled={preview}
                  />
                  <Select
                    label="Evidence type"
                    required
                    defaultValue={evidence.type}
                    options={[
                      { label: 'Evidence type', value: '' },
                      ...Object.entries(EvidenceType).map(([, value]) => ({
                        label: value.split('_').join(' '),
                        value: value.split('_').join(' ')
                      }))
                    ]}
                    onChange={v => {
                      setForm({
                        ...form,
                        evidences: form.evidences.map((currentEvidence: any, i: number) =>
                          i === evidenceIndex ? { ...currentEvidence, type: v } : currentEvidence
                        )
                      });
                    }}
                    disabled={preview}
                  />
                  {!preview && (
                    <span onClick={() => removeEvidence(evidenceIndex)} className="c-pointer bg-danger">
                      <Minus size={14} /> Remove evidence
                    </span>
                  )}
                </>
              );
            })}
            {!preview && (
              <Button onClick={addEvidence} theme="CTA">
                <Plus size={14} /> Add evidence
              </Button>
            )}
          </Card>
        )}
      </Page>
      <div className={s['ds-article-draft-form__fab']}>
        <Row align="RIGHT">
          <Button type="button" theme="TERTIARY" onClick={props.onBack}>
            <ArrowLeftOutlined />
            Go back
          </Button>
          {preview ? (
            <Button loading={loading} theme="CTA" type="submit">
              Publish
              <ArrowRightOutlined />
            </Button>
          ) : (
            <Button loading={loading} theme="CTA">
              Continue
              <ArrowRightOutlined />
            </Button>
          )}
        </Row>
      </div>
    </form>
  );
}
