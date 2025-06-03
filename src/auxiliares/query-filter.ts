export interface IQueryParam {
  page?: string | number;
  limit?: string | number;
  sort?: string;
  filter?: string;
  populate?: string;
  select?: string;
  /**
   * Si la query debe incluir las entidades de los clientes hijos
   */
  includeChildren?: boolean;
  /**
   * Nivel de profundidad de los clientes hijos, si no se especifica se toman todos
   */
  childrenLevel?: number;
  excludeTotalCount?: boolean;
  executionStats?: boolean;
  [key: string]: any;
}
export interface IPopulate {
  path?: string;
  select?: string;
  populate?: IPopulate;
  [key: string]: any;
}

type mongoOperators = {
  $regex?: string;
  $in?: string[];
  $nin?: string[];
  $gte?: number | string;
  $lte?: number | string;
  $gt?: number | string;
  $lt?: number | string;
  $eq?: number | string | boolean | null;
  $ne?: number | string | boolean | null;
  $exists?: boolean;
  [key: string]: any;
};

type mongoFilter = number | string | boolean | null | mongoOperators;

export type IFilter<T> = {
  [K in keyof T]: undefined | mongoFilter | IFilter<T>[];
} & {
  $or?: IFilter<T>[];
  $and?: IFilter<T>[];
  $nor?: IFilter<T>[];
  $not?: mongoFilter;
};
