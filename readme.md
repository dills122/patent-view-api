# Patent View Api

[![CI Job](https://github.com/dills122/patent-view-api/actions/workflows/ci.action.yml/badge.svg)](https://github.com/dills122/patent-view-api/actions/workflows/ci.action.yml)
[![CodeFactor](https://www.codefactor.io/repository/github/dills122/patent-view-api/badge)](https://www.codefactor.io/repository/github/dills122/patent-view-api)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/48b11072cd4f4b15b54b43aaec12c7d1)](https://www.codacy.com/gh/dills122/patent-view-api/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=dills122/patent-view-api&amp;utm_campaign=Badge_Grade)
[![npm version](https://badge.fury.io/js/uspto-patents-view-api.svg)](https://badge.fury.io/js/uspto-patents-view-api)

Checkout all the granted patents over the last 50 years.

## API Description

Examples of the

Shared arguments:

  * `dataPoints` - fields you want in your response; 
    * example: `["patent_number", "date"]`
  * `sortBy` - how you would like your results sorting in the response
    * example: `[{"patent_number":"desc"}]`

All endpoints support pagination, thus all endpoint's args object will have the following properties

```typescript
{
  pageSize?: number;
  pages?: number;
}
```

* `Endpoints`
  * `Patents` - retrieve details about patents and inventors
    * `Range` - Get all the patents between a period of time
      * ```typescript
        /*
          RangeArgs: {
            startDate: string;
            endDate: string;
          }
        */
        const resp = await new Range().between({
          args: RangeArgs;
          dataPoints: DataPoints;
          sortBy?: SortingOptions;
        })
        ```
