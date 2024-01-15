import { FormEvent, useEffect, useState } from 'react';
import { ArticleType } from '../Form/SelectArticleType/SelectArticleType';
import Page from '../Page/Page';
import RadioGroup from '../RadioGroup/RadioGroup';
import RangePicker from '../RangePicker/RangePicker';
import s from './EE24Filter.module.scss';
import { Input } from '@/bases/Input';
import Select from '@/bases/Select/Select';
import Tagger from '@/bases/Tagger/Tagger';
import { CountryISO } from '@/constants/country';
import { EuRelation } from '@/constants/euRelation';
import { LanguageISO } from '@/constants/language';
import { PoliticalParty } from '@/constants/politicalParty';
import { ReviewRating } from '@/constants/ratings';
import { Topic } from '@/constants/topics';

export type Filter = {
  type?: ArticleType[];
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
  const [filter, setFilter] = useState<Partial<Filter>>({});
  const handleSubmit = (e: FormEvent) => {
    try {
      e?.preventDefault();
      props.onSubmit();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    props.onChange(filter);
  }, [filter]);

  return (
    <Page>
      <div className={s['ds-ee24-filter']}>
        <h4>Filter</h4>
        <form onSubmit={handleSubmit} className={s['ds-ee24-filter__form']}>
          <Input label="Date range">
            <RangePicker
              onChange={range => {
                if (range) {
                  setFilter(prev => ({
                    ...prev,
                    sinceDate: range[0]?.toDate(),
                    untilDate: range[1]?.toDate()
                  }));
                } else {
                  setFilter(prev => {
                    delete prev.sinceDate;
                    delete prev.untilDate;
                    return prev;
                  });
                }
              }}
            />
          </Input>
          <Input label="Article type">
            <RadioGroup
              multiple
              onChange={(types: any) => {
                setFilter(prev => ({
                  ...prev,
                  type: types
                }));
              }}
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
              onChange={(relation: any) => {
                setFilter(prev => ({
                  ...prev,
                  euRelation: relation
                }));
              }}
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
              onChange={(rating: any) => {
                setFilter(prev => ({
                  ...prev,
                  reviewRating: rating
                }));
              }}
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
          <Tagger
            label="Topics"
            options={Object.entries(Topic).map(v => ({
              value: v[1].split('_').join(' '),
              label: v[1].split('_').join(' ')
            }))}
            maxTagCount="responsive"
            mode="tags"
            onChange={(topics: any) => {
              setFilter(prev => ({
                ...prev,
                topics
              }));
            }}
            placeholder="Filter by topic"
          />
          <Input
            label="Publisher"
            onChange={v => {
              setFilter(prev => ({
                ...prev,
                publisher: v.target.value
              }));
            }}
            placeholder="Filter by publisher"
          />
          <Select
            label="Language"
            options={[
              { label: 'Filter by language', value: '' },
              ...Object.entries(LanguageISO).map(([key, value]) => ({
                label: key.split('_').join(' '),
                value: value.split('_').join(' ')
              }))
            ]}
            onChange={(v: any) => {
              setFilter(prev => ({
                ...prev,
                inLanguage: v
              }));
            }}
          />
          <Select
            label="Country"
            options={[
              { label: 'Filter by country', value: '' },
              ...Object.entries(CountryISO).map(([key, value]) => ({
                label: key.split('_').join(' '),
                value: value.split('_').join(' ')
              }))
            ]}
            onChange={(v: any) => {
              setFilter(prev => ({
                ...prev,
                countryOfOrigin: v
              }));
            }}
          />
          <Select
            label="Political party"
            options={[
              { label: 'Filter by political party', value: '' },
              ...Object.entries(PoliticalParty).map(v => ({
                value: v[1].split('_').join(' '),
                label: v[1].split('_').join(' ')
              }))
            ]}
            onChange={(v: any) => {
              setFilter(prev => ({
                ...prev,
                politicalParty: v
              }));
            }}
          />
        </form>
      </div>
    </Page>
  );
}
