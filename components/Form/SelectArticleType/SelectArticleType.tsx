/* eslint-disable no-shadow */
import { AlertTriangle, MessageCircle, MoreHorizontal, Search } from 'react-feather';
import ItemSelect from '../ItemSelect/ItemSelect';
import Column from '@/bases/Column/Column';
import Row from '@/bases/Row/Row';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import Page from '@/components/Page/Page';

export enum ArticleType {
  Factcheck = 'Factcheck',
  Debunk = 'Debunk',
  Narrative = 'Narrative',
  Prebunk = 'Prebunk'
}

export type SelectArticleTypeProps = {
  onSelect: (type: ArticleType) => void;
};

export default function SelectArticleType(props: SelectArticleTypeProps) {
  return (
    <Page>
      <ModalHeader style={{ margin: 0 }} subTitle="Select article type" title="Choose between Factcheck, Debunk, Narrative or Prebunk" />
      <Row align="SPACE">
        <Column align="SPACE">
          <ItemSelect onClick={() => props.onSelect(ArticleType.Factcheck)} icon={<Search size={18} color="#FFF" />} label="Factcheck" />
          <ItemSelect onClick={() => props.onSelect(ArticleType.Debunk)} icon={<MessageCircle size={18} color="#FFF" />} label="Debunk" />
        </Column>
        <Column align="SPACE">
          <ItemSelect
            onClick={() => props.onSelect(ArticleType.Narrative)}
            icon={<MoreHorizontal size={18} color="#FFF" />}
            label="Narrative"
          />
          <ItemSelect onClick={() => props.onSelect(ArticleType.Prebunk)} icon={<AlertTriangle size={18} color="#FFF" />} label="Prebunk" />
        </Column>
      </Row>
    </Page>
  );
}
