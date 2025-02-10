/* eslint-disable no-shadow */
import { AlertTriangle, Search } from 'react-feather';
import ItemSelect from '../ItemSelect/ItemSelect';
import Column from '@/bases/Column/Column';
import Row from '@/bases/Row/Row';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import Page from '@/components/Page/Page';

export enum ArticleType {
  Factcheck = 'Factcheck',
  Prebunk = 'Prebunk'
}

export type SelectArticleTypeProps = {
  onSelect: (type: ArticleType) => void;
};

export default function SelectArticleType(props: SelectArticleTypeProps) {
  return (
    <Page>
      <ModalHeader
        style={{ margin: 0 }}
        subTitle="Select type of publication"
        title="Choose between Political Fact-check or Prebunk report"
      />
      <Row align="SPACE">
        <Column align="SPACE">
          <ItemSelect onClick={() => props.onSelect(ArticleType.Factcheck)} icon={<Search size={18} color="#FFF" />} label="Fact-check" />
        </Column>
        <Column align="SPACE">
          <ItemSelect onClick={() => props.onSelect(ArticleType.Prebunk)} icon={<AlertTriangle size={18} color="#FFF" />} label="Prebunk" />
        </Column>
      </Row>
    </Page>
  );
}
