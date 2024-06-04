export type ValueUnits = {
  value?: number;
  units?: string;
};

type Cost = {
  total?: ValueUnits;
  markup?: ValueUnits;
  raw?: any;
  usage?: any;
};

type Meta = {
  total?: { cost?: Cost };
};

type ClusterValue = {
  clusters?: string[];
  cluster?: string;
  cost?: Cost;
};

type Cluster = {
  values: ClusterValue[];
};

export type Report = {
  data: { clusters: Cluster[] }[];
  meta?: Meta;
  pending: boolean;
  fulfilled: boolean;
};
