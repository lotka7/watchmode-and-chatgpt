export type PaginationOptions = {
  skip?: number;
  take?: number;
  filter?: { literal: string; params: Record<string, unknown> }[];
  sort?: { [key: string]: 'ASC' | 'DESC' };
};

export type PaginationOptionsDTO = {
  page?: number;
  take?: number;
  sort?: { [key: string]: 'ASC' | 'DESC' };
} & { [key: string]: FilterExpression };

export type FilterExpression = {
  operator: FilterOperator;
  value: unknown;
};

export type FilterOperator = 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'ne';

export type PaginatedList<T> = {
  items: T[];
  total: number;
};
