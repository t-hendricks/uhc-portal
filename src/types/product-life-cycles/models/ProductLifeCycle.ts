export type ProductLifeCycle = {
  name: string;
  versions: {
    name: string;
    type: string;
    ['last_minor_release']?: string;
    ['final_minor_release']?: string;
    ['extra_header_value']?: string;
    phases?: { name: string; date: string; ['date_format']: string }[];
    ['extra_dependences']: string[];
  }[];
  uuid: string;
  ['former_names']: string[];
  ['show_last_minor_release']: boolean;
  ['show_final_minor_release']: boolean;
  ['is_layered_product']: boolean;
  ['all_phases']: { name: string; ptype: string; tooltip?: string; ['display_name']: string }[];
  link: string;
  policies: string;
};

export type ProductLifeCycles = {
  data: ProductLifeCycle[];
};
