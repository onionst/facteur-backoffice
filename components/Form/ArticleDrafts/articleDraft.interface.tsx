import { ArticleType } from '../SelectArticleType/SelectArticleType';

export interface IArticleDraft {
  form: any;
  setForm: any;
  type: ArticleType;
  onContinue: (form: any) => void;
}
