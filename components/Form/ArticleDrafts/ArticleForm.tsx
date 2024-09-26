import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Divider, notification } from 'antd';
import dayjs from 'dayjs';
import { FormEvent, useState } from 'react';
import { Minus, Plus } from 'react-feather';
import { ArticleType } from '../SelectArticleType/SelectArticleType';
import { IArticleDraft } from './articleDraft.interface';
import s from './ArticleDraftForm.module.scss';
import ClaimReviewDraftForm from './ClaimReviewDraftForm';
import Button from '@/bases/Button/Button';
import { DatePicker } from '@/bases/DatePicker/DatePicker';
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
import { LanguageISO } from '@/constants/language';
import { Topic } from '@/constants/topics';
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
        const natives: string[] = [form.headlineNative].concat(
          form.claimReviews.map((claimReview: any) => claimReview.claimReviewedNative)
        );
        const translations = await Promise.all(natives.map(native => fetchTranslation(native)));
        translations.forEach((text: string) => text.replaceAll('\\', ''));

        const claimReviews = form.claimReviews.map((claimReview: any, i: number) => {
          return {
            ...claimReview,
            claimReviewed: translations[i + 1]
          };
        });

        setForm((prev: any) => ({
          ...prev,
          headline: translations[0],
          claimReviews: claimReviews
        }));
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

  const removeClaimReview = async (indexToRemove: number) => {
    setForm((prev: any) => ({
      ...prev,
      claimReviews: form.claimReviews.filter((_: any, index: number) => index !== indexToRemove)
    }));
  };

  const addClaimReview = async () => {
    setForm((prev: any) => ({
      ...prev,
      claimReviews: [
        ...form.claimReviews,
        {
          claimReviewed: '',
          claimReviewedNative: '',
          reviewRating: '',
          appearances: [],
          itemReviewed: {
            datePublished: null,
            author: '',
            politicalParty: ''
          },
          associatedClaimReview: []
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
            label={`Title of the ${props.type === ArticleType.Narrative ? 'report' : 'article'}`}
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
            <DatePicker
              label="Date of article publication"
              value={dayjs(form.datePublished).isValid() ? dayjs(form.datePublished) : form.datePublished}
              onChange={v => setForm((prev: any) => ({ ...prev, datePublished: v }))}
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
              placeholder="Add keywords separated by commas. e.g:Ukraine, Covid, EE24"
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
              disabled={preview}
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
              disabled={preview}
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
        <Card>
          <h4>Claim Details</h4>
          {form.claimReviews.map((claimReview: any, index: number) => {
            return (
              <>
                <ClaimReviewDraftForm
                  claimReview={claimReview}
                  formUrl={form.url}
                  handleUpdate={(newClaimReviewValue: any) => {
                    setForm({
                      ...form,
                      claimReviews: form.claimReviews.map((currentClaimReview: any, i: number) =>
                        i === index ? newClaimReviewValue : currentClaimReview
                      )
                    });
                  }}
                  key={index}
                  type={props.type}
                  preview={preview}
                />
                {index !== 0 && !preview && (
                  <span onClick={() => removeClaimReview(index)} className="c-pointer bg-danger">
                    <Minus size={14} /> Remove claim review
                  </span>
                )}
              </>
            );
          })}
        </Card>
        {!preview && (
          <Button onClick={addClaimReview} theme="CTA">
            <Plus size={14} /> Add claim review
          </Button>
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
