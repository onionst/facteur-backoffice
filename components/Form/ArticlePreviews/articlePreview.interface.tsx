import { ArticleType } from '../SelectArticleType/SelectArticleType';

export interface IArticlePreview {
  form: any;
  setForm: any;
  type: ArticleType;
  onContinue: (form: any) => void;
}
