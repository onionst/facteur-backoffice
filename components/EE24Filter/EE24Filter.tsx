import { FormEvent } from 'react';
import { ArticleType } from '../Form/SelectArticleType/SelectArticleType';
import Page from '../Page/Page';
import RadioGroup from '../RadioGroup/RadioGroup';
import RangePicker from '../RangePicker/RangePicker';
import s from './EE24Filter.module.scss';
import { Input } from '@/bases/Input';
import Select from '@/bases/Select/Select';
import { CountryISO } from '@/constants/country';
import { EuRelation } from '@/constants/euRelation';
import { LanguageISO } from '@/constants/language';
import { PoliticalParty } from '@/constants/politicalParty';
import { ReviewRating } from '@/constants/ratings';
import { Topic } from '@/constants/topics';

export type Filter = {
  type?: ArticleType;
  untilDate?: Date;
  sinceDate?: Date;
  euRelation?: EuRelation;
  publisher?: string;
  inLanguage?: LanguageISO;
  topics?: Topic[];
  countryOfOrigin?: CountryISO;
  reviewRating?: ReviewRating;
  politicalParty?: PoliticalParty;
  order?: '-datePublished' | 'datePublished' | '-dateCreated' | 'dateCreated' | '-dateModified' | 'dateModified';
};
export type EE24FilterProps = {
  onChange: (filter: Filter) => void;
  onSubmit: () => void;
  filter: Filter & { search: string };
};
export default function EE24Filter(props: EE24FilterProps) {
  const handleSubmit = (e: FormEvent) => {
    try {
      e?.preventDefault();
      props.onSubmit();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Page>
      <div className={s['ds-ee24-filter']}>
        <h4>Filter</h4>
        <form onSubmit={handleSubmit} className={s['ds-ee24-filter__form']}>
          <Input label="Date range">
            <RangePicker />
          </Input>
          <Input label="Article type">
            <RadioGroup
              multiple
              onChange={() => {}}
              options={[
                {
                  label: ArticleType.Factcheck,
                  value: ArticleType.Factcheck
                },
                {
                  label: ArticleType.Debunk,
                  value: ArticleType.Debunk
                },
                {
                  label: ArticleType.Narrative,
                  value: ArticleType.Narrative
                },
                {
                  label: ArticleType.Prebunk,
                  value: ArticleType.Prebunk
                }
              ]}
            />
          </Input>
          <Input label="EU relation">
            <RadioGroup
              onChange={() => {}}
              options={[
                {
                  label: EuRelation.Direct,
                  value: EuRelation.Direct
                },
                {
                  label: EuRelation.Indirect,
                  value: EuRelation.Indirect
                }
              ]}
            />
          </Input>
          <Input label="Review rating">
            <Select
              onChange={() => {}}
              options={[
                { label: 'Filter by rating', value: '' },
                {
                  label: ReviewRating.True,
                  value: ReviewRating.True
                },
                {
                  label: ReviewRating.False,
                  value: ReviewRating.False
                },
                {
                  label: ReviewRating.AIGenerated,
                  value: ReviewRating.AIGenerated
                },
                {
                  label: ReviewRating.MissingContext,
                  value: ReviewRating.MissingContext
                },
                {
                  label: ReviewRating.PartlyFalse,
                  value: ReviewRating.PartlyFalse
                },
                {
                  label: ReviewRating.Satire,
                  value: ReviewRating.Satire
                }
              ]}
            />
          </Input>
        </form>
      </div>
    </Page>
  );
}
