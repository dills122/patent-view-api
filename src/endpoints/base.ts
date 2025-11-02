import got from 'got';
import path from 'path';
import { Observable, from, map } from 'rxjs';

import MainConfig from '../config';
import { QueryObject } from '../query-system';
import { DataPoints, SortingOptions } from './shared-types';

export const PAGE_SIZE = 50;

export interface Pagination {
  pageSize?: number;
  pages?: number;
}

export interface RequestPayload {
  dataPoints: DataPoints;
  queryParamObject: QueryObject;
  sortingOptions?: SortingOptions;
}

interface BaseQueryParameters {
  q?: string;
  f?: string;
  o?: string;
  s?: string;
}

export class BaseEndpoint {
  protected apiEndpointUrl: string;
  protected pageSize: number;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  request<T>(requestPayload: RequestPayload, page: number): Observable<T> {
    const searchParams = this.setupSearchParams(requestPayload, page);
    return from(
      got<string>(path.join(MainConfig.apiUrl, this.apiEndpointUrl), {
        searchParams: {
          ...searchParams
        }
      })
    ).pipe(
      map((data) => {
        return this.mapper(data.body);
      })
    );
  }

  private setupSearchParams(requestPayload: RequestPayload, page: number) {
    try {
      const searchParams: BaseQueryParameters = {
        q: JSON.stringify(requestPayload.queryParamObject),
        f: JSON.stringify(['patent_number', 'patent_date', 'patent_title', ...requestPayload.dataPoints]),
        o: JSON.stringify({
          per_page: this.pageSize,
          page
        })
      };
      if (requestPayload.sortingOptions) {
        searchParams.s = JSON.stringify(requestPayload.sortingOptions);
      }
      return searchParams;
    } catch (err) {
      console.error(err);
      throw Error('Issue building search parameters');
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected mapper(data: string) {
    return JSON.parse(data);
  }
}
