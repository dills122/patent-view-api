import path from 'path';
import { EMPTY, Subject } from 'rxjs';
import { expand, map, reduce, takeUntil } from 'rxjs/operators';

import QueryBuilder, { SearchTerm } from '../../../query-system/build';
import { BaseEndpoint, PAGE_SIZE, Pagination } from '../../base';
import { DataPoints } from '../../shared-types';
import PatentConfig from '../config';
import { Patent } from '../models/patent.model';

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
        const { count, total_patent_count } = data;
        const hasHitMaxUserReqPageCount = this.pageSize * this.pages <= count;
        const hasHitMaxServerPageCount = count >= total_patent_count;
        if (hasHitMaxServerPageCount || hasHitMaxUserReqPageCount) {
          this.completeRequestSequence();
          return EMPTY;
        }
        const nextPage = index + 1;
        return this.request(requestArgs, nextPage);
      }),
      takeUntil(this.endNotifier),
      map((data) => [...data.patents]),
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
