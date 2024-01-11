import { ArticleType } from '../SelectArticleType/SelectArticleType';

export interface IArticlePreview {
  form: any;
  setForm: any;
  type: ArticleType;
  onPublish: () => void;
  onBack: () => void;
}
