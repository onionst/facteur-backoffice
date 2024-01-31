import Page from '../Page/Page';
import s from './Trending.module.scss';

export type TrendingProps = {
  position: number;
  narrative: string;
  explanation: string;
  EXAMPLES: Array<{ CLAIM: string; TRANSLATION: string }>;
};

export default function Trending(props: TrendingProps) {
  return (
    <Page>
      <div className={s['ds-trendings__top']}>
        <div className={`${s['ds-trendings__top-position']} ${props.position > 3 ? s['ds-trendings__top-position--grey'] : ''}`}>
          {props.position}°{' '}
        </div>
        <div className={s['ds-trendings__top-text']}>
          <h6>{props.narrative}</h6>
          <p>{props.explanation}</p>
        </div>
      </div>

      <div className={s['ds-trendings__examples']}>
        {props.EXAMPLES.map((example, index) => (
          <div key={index} className={s['ds-trendings__examples-card']}>
            <div className={s['ds-trendings__examples-card-claim']}>
              <p>“{example.CLAIM}”</p>
            </div>
            {example.CLAIM != example.TRANSLATION && (
              <div className={s['ds-trendings__examples-translation']}>
                <label>Translation:</label>
                <div>
                  <p>{example.TRANSLATION}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Page>
  );
}
