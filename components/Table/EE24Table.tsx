import { Empty, Skeleton } from 'antd';
import { useMemo } from 'react';
import { FileType } from '../EE24Search/EE24Search';
import s from './Table.module.scss';
import Button from '@/bases/Button/Button';
import Image from '@/bases/Image/Image';

export type EE24TableProps = {
  firstExtended?: boolean;
  columns: any[];
  data: any[][];
  loading?: boolean;
  notFound?: { type: FileType; value: string } | null;
  onRowClick?: (index: number) => void;
  onReset: () => void;
};
export type EE24HeadlineProps = {
  image?: string;
  headline?: string;
};
export function NotFound(props: { withoutButton?: boolean; type: FileType; value: string; onClick: () => void }) {
  const render = {
    NONE: (
      <div className={s['ds-not-found']}>
        <Empty description="" />
        <div className={s['ds-not-found__text']}>
          <h3>No articles found</h3>
          <p>Your search did not match any article</p>
        </div>
        {!props.withoutButton && (
          <Button theme="TERTIARY" type="button" onClick={props.onClick}>
            Clear filter
          </Button>
        )}
      </div>
    ),
    AUDIO: (
      <div className={s['ds-not-found']}>
        <Image className={s['ds-not-found__image']} src={'/assets/portraits/audio.svg'} alt="not found" />
        <div className={s['ds-not-found__text']}>
          <h3>No articles found</h3>
          <p>Your audio did not match any article</p>
        </div>
        {!props.withoutButton && (
          <Button theme="TERTIARY" type="button" onClick={props.onClick}>
            Clear filter
          </Button>
        )}
      </div>
    ),
    VIDEO: (
      <div className={s['ds-not-found']}>
        <Image className={s['ds-not-found__image']} src={'/assets/portraits/video.svg'} alt="not found" />
        <div className={s['ds-not-found__text']}>
          <h3>No articles found</h3>
          <p>Your video did not match any article</p>
        </div>
        {!props.withoutButton && (
          <Button theme="TERTIARY" type="button" onClick={props.onClick}>
            Clear filter
          </Button>
        )}
      </div>
    ),
    IMAGE: (
      <div className={s['ds-not-found']}>
        <Image className={s['ds-not-found__image']} src={props.value} alt="not found" />
        <div className={s['ds-not-found__text']}>
          <h3>No articles found</h3>
          <p>Your image did not match any article</p>
        </div>
        {!props.withoutButton && (
          <Button theme="TERTIARY" type="button" onClick={props.onClick}>
            Clear filter
          </Button>
        )}
      </div>
    ),
    TEXT: (
      <div className={s['ds-not-found']}>
        <Empty description="" />
        <div className={s['ds-not-found__text']}>
          <h3>No articles found</h3>
          <p>Your search did not match any article</p>
        </div>
        {!props.withoutButton && (
          <Button theme="TERTIARY" type="button" onClick={props.onClick}>
            Clear filter
          </Button>
        )}
      </div>
    )
  }[props.type];

  return render;
}
export function EE24Headline(props: EE24HeadlineProps) {
  return (
    <div className={s['ds-headline']}>
      <Image src={props.image || '/assets/portraits/image.svg'} alt={'ee24 image'} />
      <p>{props.headline}</p>
    </div>
  );
}

export function EE24Table(props: EE24TableProps) {
  const Columns = useMemo(
    () =>
      props.columns.map(title => (
        <th key={title} className={props.firstExtended ? s['ds-table-column--extended'] : ''}>
          {title}
        </th>
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.columns]
  );

  const Loading = useMemo(
    () =>
      props.columns.map(title => (
        <td key={title}>
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </td>
      )),
    [props.columns]
  );

  const Data = useMemo(
    () =>
      props.data.map((data, index) => (
        <tr key={index} onClick={() => props.onRowClick && props.onRowClick(index)}>
          {data.map((column, _index) => (
            <td className={s['ds-table-row__item']} key={`${index}${_index}`}>
              {column}
            </td>
          ))}
        </tr>
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.data]
  );

  if (props.loading) {
    return (
      <div className={s['ds-table__container']}>
        <table className={`table table-striped gy-7 gs-7 ${s['ds-table']}`}>
          <thead>
            <tr className="fw-bold fs-6 text-gray-800 border-bottom border-gray-200">{Columns}</tr>
          </thead>
          <tbody>
            <tr>{Loading}</tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={s['ds-table__container']}>
      <table className={`table table-striped gy-7 gs-7 ${s['ds-table']}`}>
        <thead>
          <tr className="fw-bold fs-6 text-gray-800 border-bottom border-gray-200">{Columns}</tr>
        </thead>
        <tbody className={s['ds-table__tbody']}>{Data}</tbody>
      </table>
      {props.data.length === 0 ? props.notFound ? <NotFound {...props.notFound} onClick={props.onReset} /> : <Empty /> : null}
    </div>
  );
}
