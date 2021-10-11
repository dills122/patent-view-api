import { Investor } from './investor.model';

export interface Patent {
  patent_number: string;
  patent_date: string;
  patent_title: string;
  patent_abstract?: string;
  inventors?: Investor[];
}
