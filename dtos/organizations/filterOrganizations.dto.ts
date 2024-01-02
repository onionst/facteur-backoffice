export class FilterOrganizations {
  skip?: number;
  limit?: number;
  orderBy?: 'name' | 'creationDate';
  order?: 'ASC' | 'DESC';
  search?: string;
  active?: boolean;
}
