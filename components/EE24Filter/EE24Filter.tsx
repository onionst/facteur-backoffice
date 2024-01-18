import { ArrowRightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { FormEvent, useEffect, useState } from 'react';
import { X } from 'react-feather';
import { ArticleType } from '../Form/SelectArticleType/SelectArticleType';
import RadioGroup from '../RadioGroup/RadioGroup';
import RangePicker from '../RangePicker/RangePicker';
import s from './EE24Filter.module.scss';
import Button from '@/bases/Button/Button';
import { Input } from '@/bases/Input';
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select/Select';
import Tagger from '@/bases/Tagger/Tagger';
import { CountryISO } from '@/constants/country';
import { EuRelation } from '@/constants/euRelation';
import { LanguageISO } from '@/constants/language';
import { PoliticalParty } from '@/constants/politicalParty';
import { ReviewRating } from '@/constants/ratings';
import { Topic } from '@/constants/topics';
import { useOrganizations } from '@/contexts/organizations.context';
import { Organization } from '@/dtos/organizations/organization.dto';

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
  reset: () => void;
  filter: Filter & { search: string };
};
export default function EE24Filter(props: EE24FilterProps) {
  const { listOrganizations } = useOrganizations();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [filter, setFilter] = useState<Partial<Filter>>({});
  const [modified, setModified] = useState<boolean>(false);

  const [organizations, setOrganizations] = useState<Array<Partial<Organization>>>([]);

  const handleListOrganizations = async () => {
    setOrganizations(await listOrganizations());
  };
  useEffect(() => {
    handleListOrganizations();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    try {
      e?.preventDefault();
      props.onSubmit();
      setSubmitted(true);
      setModified(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    props.onChange(filter);
    setSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className={s['ds-ee24-filter__container']}>
      <div className={s['ds-ee24-filter']}>
        <Row align="SPACE">
          <h4 style={{ lineHeight: '30px' }}>Filter</h4>
          {Object.values(filter).find(i => i) && (
            <span className={`c-pointer ${s['ds-ee24-filter__bg--white']}`} onClick={() => props.reset()}>
              Clear filter <X size={18} />
            </span>
          )}
        </Row>
        <form onSubmit={handleSubmit} className={s['ds-ee24-filter__form']}>
          <Input label="Date range">
            <RangePicker
              value={[filter.sinceDate ? dayjs(filter.sinceDate) : null, filter.untilDate ? dayjs(filter.untilDate) : null]}
              onChange={range => {
                setModified(true);
                if (range) {
                  setFilter(prev => ({
                    ...prev,
                    sinceDate: range[0]?.toDate(),
                    untilDate: range[1]?.toDate()
                  }));
                } else {
                  setFilter((prev: any) => ({
                    ...prev,
                    sinceDate: null,
                    untilDate: null
                  }));
                }
              }}
            />
          </Input>
          <Input label="Article type">
            <RadioGroup
              multiple
              onChange={(types: any) => {
                setModified(true);
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
                setModified(true);
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
                setModified(true);
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
              setModified(true);
              setFilter(prev => ({
                ...prev,
                topics
              }));
            }}
            placeholder="Filter by topic"
          />

          <Select
            label="Publisher"
            onChange={organization => {
              setModified(true);
              setFilter(prev => ({
                ...prev,
                publisher: organization
              }));
            }}
            options={[
              {
                value: '',
                label: 'Filter by publisher'
              },
              ...organizations.map(i => ({
                value: i?.domain || '',
                label: i?.name || ''
              }))
            ]}
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
              setModified(true);
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
              setModified(true);
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
              setModified(true);
              setFilter(prev => ({
                ...prev,
                politicalParty: v
              }));
            }}
          />
          {modified && !submitted ? (
            <div className={s['ds-ee24-filter__apply']}>
              <Row align="RIGHT">
                <Button theme="CTA">
                  Apply filter <ArrowRightOutlined />
                </Button>
              </Row>
            </div>
          ) : (
            <div />
          )}
        </form>
      </div>
    </div>
  );
}
