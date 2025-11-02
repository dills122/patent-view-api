import path from 'path';
import { EMPTY, Observable, Subject } from 'rxjs';
import { expand, map, reduce, takeUntil } from 'rxjs/operators';
import { RequestPayload, SortingOptions } from '../..';

import { SearchTerm, QueryBuilder } from '../../../query-system';
import { BaseEndpoint, PAGE_SIZE, Pagination } from '../../base';
import { DataPoints } from '../../shared-types';
import PatentConfig from '../config';
import { Patent } from '../models';

export interface RangeArgs extends Pagination {
  startDate: string;
  endDate: string;
}

export interface PatentResponse {
  patents: Patent[];
  count: number;
  total_patent_count: number;
}

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

export class Range extends BaseEndpoint {
  protected pageSize: number;
  private pages: number;
  private endNotifier = new Subject<boolean>();
  constructor() {
    super();
    this.apiEndpointUrl = path.join(PatentConfig.subsdirectory, PatentConfig.endpoint);
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  between({
    args,
    dataPoints = [],
    sortBy
  }: {
    args: RangeArgs;
    dataPoints?: DataPoints;
    sortBy?: SortingOptions;
  }): Observable<Patent[]> {
    const { pageSize, ...rangeArgs } = args;
    this.pageSize = pageSize || PAGE_SIZE;
    this.pages = args.pages || 10;
    const queryObject = QueryBuilder.build({
      and: buildRangeQueryStringObject(args)
    });
    const requestArgs = {
      args: rangeArgs,
      dataPoints,
      queryParamObject: queryObject,
      sortingOptions: sortBy
    } as RequestPayload;
    let page = 1;
    return this.request<PatentResponse>(requestArgs, page).pipe(
      expand((data) => {
        const { count, total_patent_count } = data;
        console.log(`total_patent_count:${total_patent_count}`);
        const hasHitMaxUserReqPageCount = this.pages <= page;
        const hasHitMaxServerPageCount = count < this.pageSize || this.pageSize * page >= total_patent_count;
        if (hasHitMaxServerPageCount || hasHitMaxUserReqPageCount || data.patents == null) {
          this.completeRequestSequence();
          return EMPTY;
        }
        const nextPage = page++;
        return this.request<PatentResponse>(requestArgs, nextPage);
      }),
      takeUntil(this.endNotifier),
      map((data) => {
        if (!data.patents) {
          this.completeRequestSequence();
          return [];
        } else {
          return [...data.patents];
        }
      }),
      reduce((acc, data) => {
        return acc.concat(...data);
      })
    );
  }

  protected override mapper(data: string): PatentResponse {
    return JSON.parse(data) as PatentResponse;
  }

  private completeRequestSequence() {
    this.endNotifier.next(true);
    this.endNotifier.complete();
  }
}
