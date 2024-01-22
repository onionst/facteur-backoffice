import { ArrowRightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Dispatch, useEffect, useState } from 'react';
import { X } from 'react-feather';
import { ArticleType } from '../Form/SelectArticleType/SelectArticleType';
import RadioGroup from '../RadioGroup/RadioGroup';
import RangePicker from '../RangePicker/RangePicker';
import s from './EE24Filter.module.scss';
import Button from '@/bases/Button/Button';
import { Input } from '@/bases/Input';
import Row from '@/bases/Row/Row';
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
  reset: () => void;
  filter: Filter;
  setFilter: Dispatch<any>;
};
export default function ArticlesFilter(props: EE24FilterProps) {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [modified, setModified] = useState<boolean>(false);
  const { filter, setFilter } = props;
  const handleSubmit = () => {
    try {
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
    <div className={`${s['ds-ee24-filter__container']} ${s['ds-articles-filter__container']}`}>
      <div className={`${s['ds-ee24-filter']} ${s['ds-articles-filter']}`}>
        <Row align="SPACE">
          <h4 style={{ lineHeight: '30px' }}>Filter</h4>
          {Object.values(filter).find(i => i) && (
            <span className={`c-pointer ${s['ds-ee24-filter__bg--white']}`} onClick={() => props.reset()}>
              Clear filter <X size={18} />
            </span>
          )}
        </Row>
        <form className={s['ds-ee24-filter__form']}>
          <Input label="Date of article publication range">
            <RangePicker
              value={[filter.sinceDate ? dayjs(filter.sinceDate) : null, filter.untilDate ? dayjs(filter.untilDate) : null]}
              onChange={range => {
                setModified(true);
                if (range) {
                  setFilter((prev: any) => ({
                    ...prev,
                    sinceDate: range[0]?.startOf('day')?.toDate(),
                    untilDate: range[1]?.endOf('day')?.toDate()
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
          <Input label="Type of publication">
            <RadioGroup
              // @ts-ignore
              selected={filter?.type || ''}
              onChange={(types: any) => {
                setModified(true);
                setFilter((prev: any) => ({
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

          {modified && !submitted ? (
            <Row align="RIGHT">
              <Button type="button" theme="CTA" onClick={handleSubmit}>
                Apply filter <ArrowRightOutlined />
              </Button>
            </Row>
          ) : (
            <div />
          )}
        </form>
      </div>
    </div>
  );
}
