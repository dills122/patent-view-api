import got from 'got';
import PatentConfig from './config';
import MainConfig from '../../config';
import path from 'path';
import { reduce, EMPTY, expand, from, lastValueFrom, take, tap, map } from 'rxjs';
import QueryBuilder, { QueryObject, SearchTerm } from '../../query-system/build';
import { DataPoints, PatentResponse, RangeArgs } from './range/get';

const request = (
  requestPayload: {
    args: RangeArgs;
    dataPoints: DataPoints;
    queryParamObject: QueryObject;
  },
  page: number
) => {
  return got<PatentResponse>(
    path.join(MainConfig.apiUrl, PatentConfig.subsdirectory, PatentConfig.endpoint),
    {
      searchParams: {
        q: JSON.stringify(requestPayload.queryParamObject),
        f: JSON.stringify(['patent_number', 'patent_date', 'patent_title', ...requestPayload.dataPoints]),
        o: JSON.stringify({
          per_page: 50,
          page
        })
      }
    }
  );
};

const querystringObj: SearchTerm[] = [
  {
    _eq: {
      patent_type: 'design'
    }
  },
  {
    _gte: {
      patent_date: '2021-03-01'
    }
  },
  {
    _lte: {
      patent_date: '2021-09-06'
    }
  }
];

const queryObject = QueryBuilder.build({
  and: querystringObj
});

const reqObj = {
  queryParamObject: queryObject,
  args: {
    startDate: '2021-08-01',
    endDate: '2021-09-06'
  },
  dataPoints: []
};

// const req$ = from(request(reqObj, 1));

const pageSize = 2;

(async () => {
  try {
    // console.log('Sending Api Req');
    // const data = await request(reqObj, 1);
    // console.log('DATA: ---');
    // console.log(data.body);
    // const dataRx = await lastValueFrom(req$);
    // console.log('DATA RXJS: ---');
    // console.log(dataRx.body);
    console.log('OBJ', JSON.stringify(reqObj, null, 4));
    console.log('Pagination: ---');
    const itemOrItems = await lastValueFrom(
      from(request(reqObj, 1)).pipe(
        expand((data, index) => {
          const { count } = data.body;
          if (count < pageSize) {
            return EMPTY;
          }
          const nextPage = index + 1;
          return from(request(reqObj, nextPage));
        }),

        tap((data) => {
          console.log('Body: ---');
          console.log(data.body);
        }),
        take(3),
        map((data) => [data.body]),
        reduce((acc, data) => {
          return acc.concat(data);
        })
      )
    );
    console.log('FINAL: ---');
    console.log(itemOrItems);
  } catch (err) {
    console.error(err);
  }
})();
