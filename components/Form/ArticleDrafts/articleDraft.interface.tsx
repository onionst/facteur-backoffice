import { ArticleType } from '../SelectArticleType/SelectArticleType';

export interface IArticleDraft {
  form: any;
  ogForm?: any;
  setForm: any;
  type: ArticleType;
  onContinue: (form: any) => void;
  onBack: () => void;
}
