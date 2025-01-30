import { ArrowRightOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import dayjs from 'dayjs';
import { FormEvent, useEffect, useState } from 'react';
import { X } from 'react-feather';
import { ArticleType } from '../Form/SelectArticleType/SelectArticleType';
import RadioGroup from '../RadioGroup/RadioGroup';
import RangePicker from '../RangePicker/RangePicker';
import s from './RepositoryFilter.module.scss';
import Button from '@/bases/Button/Button';
import { Input } from '@/bases/Input';
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select/Select';
import Tagger from '@/bases/Tagger/Tagger';
import { MIN_LENGTH_KEYWORDS } from '@/constants/accept';
import { CountryISO } from '@/constants/country';
import { LanguageISO } from '@/constants/language';
import { PoliticalParty } from '@/constants/politicalParty';
import { ReviewRating } from '@/constants/ratings';
import { Topic } from '@/constants/topics';
import { useOrganizations } from '@/contexts/organizations.context';
import { Organization } from '@/dtos/organizations/organization.dto';
import { FileType } from '@/modals/FileType';

export type Filter = {
  type?: ArticleType[];
  untilDate?: Date;
  sinceDate?: Date;
  publisher?: string;
  inLanguage?: LanguageISO;
  keywords?: string[];
  topic?: Topic;
  countryOfOrigin?: CountryISO;
  reviewRating?: ReviewRating;
  politicalParty?: PoliticalParty;
  order?: '-datePublished' | 'datePublished' | '-dateCreated' | 'dateCreated' | '-dateModified' | 'dateModified';
  export?: boolean;
  exportSize?: number;
  fileType?: FileType;
};
export type RepositoryFilterProps = {
  onChange: (filter: Filter) => void;
  onSubmit: () => void;
  reset: () => void;
  filter: Filter & { search: string };
};
export default function RepositoryFilter(props: RepositoryFilterProps) {
  const { listOrganizations } = useOrganizations();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [filter, setFilter] = useState<Partial<Filter>>({});
  const [modified, setModified] = useState<boolean>(false);
  const [renders, setRenders] = useState<number>(0);

  const [organizations, setOrganizations] = useState<Array<Partial<Organization>>>([]);

  const handleListOrganizations = async () => {
    setOrganizations(await listOrganizations());
  };
  useEffect(() => {
    handleListOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setRenders(prev => prev + 1);
  }, [filter]);

  // debido al componente <RangePicker />, se esta llamando 2 veces a setFilter() lo que provoca que aparezca el boton de "apply filter". el render === 2 busca esperar a que se haya terminado de inicializar los estados antes de continuar
  useEffect(() => {
    if (renders === 2) {
      setModified(false);
    }
  }, [renders]);

  useEffect(() => {
    props.onChange(filter);
    setSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className={s['ds-repository-filter__container']}>
      <div className={s['ds-repository-filter']}>
        <Row align="SPACE">
          <h4 style={{ lineHeight: '30px' }}>Filter</h4>
          {Object.values(filter).find(i => i) && (
            <span className={`c-pointer ${s['ds-repository-filter__bg--white']}`} onClick={() => props.reset()}>
              Clear filter <X size={18} />
            </span>
          )}
        </Row>
        <form onSubmit={handleSubmit} className={s['ds-repository-filter__form']}>
          <Input label="Date of article publication range">
            <RangePicker
              value={[filter.sinceDate ? dayjs(filter.sinceDate) : null, filter.untilDate ? dayjs(filter.untilDate) : null]}
              onChange={range => {
                setModified(true);
                if (range) {
                  setFilter(prev => ({
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
                  label: ArticleType.Prebunk,
                  value: ArticleType.Prebunk
                }
              ]}
            />
          </Input>
          <Tagger
            label="Keywords"
            maxTagCount="responsive"
            suffixIcon={null}
            mode="tags"
            onChange={v => {
              setModified(true);
              if (v?.find((keyword: string) => keyword?.length < MIN_LENGTH_KEYWORDS)) {
                notification.warning({
                  message: `Keywords must be at least ${MIN_LENGTH_KEYWORDS} character long`
                });
              }
              setFilter((prev: any) => ({ ...prev, keywords: v.filter((keyword: string) => keyword?.length >= MIN_LENGTH_KEYWORDS) }));
            }}
            placeholder="Add keywords separated by commas. e.g:Ukraine, Covid"
          />
          <Input label="Rating">
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
          <Select
            label="Topic"
            options={[
              {
                value: '',
                label: 'Filter by topic'
              },
              ...Object.entries(Topic).map(v => ({
                value: v[1].split('_').join(' '),
                label: v[1].split('_').join(' ')
              }))
            ]}
            onChange={(topic: any) => {
              setModified(true);
              setFilter(prev => ({
                ...prev,
                topic
              }));
            }}
          />

          <Select
            label="Name of the organization"
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
            label="Language of publication"
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
            label="Country of the organization"
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
          {!(filter?.type && filter?.type?.length > 0 && !filter.type?.includes(ArticleType.Factcheck)) && (
            <Select
              label="EU party related to the claim"
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
          )}
          {modified && !submitted && renders >= 2 ? (
            <div className={s['ds-repository-filter__apply']}>
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
