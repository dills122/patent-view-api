import got from 'got';
import path from 'path';
import { from, map } from 'rxjs';

import MainConfig from '../config';
import { QueryObject } from '../query-system';
import { DataPoints } from './shared-types';

export const PAGE_SIZE = 50;

export interface Pagination {
  pageSize?: number;
  pages?: number;
}

export class BaseEndpoint {
  protected apiEndpointUrl: string;
  protected pageSize: number;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  request(
    requestPayload: {
      dataPoints: DataPoints;
      queryParamObject: QueryObject;
    },
    page: number
  ) {
    return from(
      got<string>(path.join(MainConfig.apiUrl, this.apiEndpointUrl), {
        searchParams: {
          q: JSON.stringify(requestPayload.queryParamObject),
          f: JSON.stringify(['patent_number', 'patent_date', 'patent_title', ...requestPayload.dataPoints]),
          o: JSON.stringify({
            per_page: this.pageSize,
            page
          })
        }
      })
    ).pipe(
      map((data) => {
        return this.mapper(data.body);
      })
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected mapper(data: string) {
    return JSON.parse(data);
  }
}
