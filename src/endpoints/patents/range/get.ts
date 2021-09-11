import got from 'got';
import PatentConfig from '../config';
import MainConfig from '../../../config';
import path from 'path';
import { EMPTY, from } from 'rxjs';
import { expand, take, map, reduce } from 'rxjs/operators';
import QueryBuilder, { QueryObject, SearchTerm } from '../../../query-system/build';

const PAGE_SIZE = 50;

export interface Pagination {
  pageSize?: number;
  pages?: number;
}

export interface RangeArgs extends Pagination {
  startDate: string;
  endDate: string;
}

export interface PatentResponse {
  patents: Patent[];
  count: number;
  total_patent_count: number;
}

export interface Patent {
  patent_number: string;
  patent_date: string;
  patent_title: string;
  patent_abstract?: string;
  inventors?: Investor[];
}

export interface Investor {
  investor_last_name: string;
  investor_first_name: string;
  investor_key_id: string;
}

export type DataPoints = string[];

function buildRangeQueryStringObject(args: RangeArgs): SearchTerm[] {
  return [
    {
      _eq: {
        patent_type: 'design'
      }
    },
    {
      _gte: {
        patent_date: args.startDate
      }
    },
    {
      _lte: {
        patent_date: args.endDate
      }
    }
  ];
}

export class Range {
  private pageSize: number;
  private pages: number;
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  between(args: RangeArgs, dataPoints: DataPoints = []) {
    const { pageSize, ...rangeArgs } = args;
    this.pageSize = pageSize || PAGE_SIZE;
    this.pages = args.pages || 10;
    const queryObject = QueryBuilder.build({
      and: buildRangeQueryStringObject(args)
    });
    const requestArgs = {
      args: rangeArgs,
      dataPoints,
      queryParamObject: queryObject
    };
    return this.request(requestArgs, 1).pipe(
      expand((data, index) => {
        const { count } = data;
        console.log(count);
        if (count < this.pageSize) {
          return EMPTY;
        }
        const nextPage = index + 1;
        return this.request(requestArgs, nextPage);
      }),
      take(this.pages),
      map((data) => [...data.patents]),
      reduce((acc, data) => {
        return acc.concat(...data);
      })
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  request(
    requestPayload: {
      args: RangeArgs;
      dataPoints: DataPoints;
      queryParamObject: QueryObject;
    },
    page: number
  ) {
    return from(
      got<string>(path.join(MainConfig.apiUrl, PatentConfig.subsdirectory, PatentConfig.endpoint), {
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
        return JSON.parse(data.body) as PatentResponse;
      })
    );
  }
}
