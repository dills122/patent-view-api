# Patent View Api

[![CI Job](https://github.com/dills122/patent-view-api/actions/workflows/ci.action.yml/badge.svg)](https://github.com/dills122/patent-view-api/actions/workflows/ci.action.yml)
[![CodeFactor](https://www.codefactor.io/repository/github/dills122/patent-view-api/badge)](https://www.codefactor.io/repository/github/dills122/patent-view-api)

Checkout all the granted patents over the last 50 years.

## API Description

* `Endpoints`
  * `Patents` - retrieve details about patents and inventors
    * `Range` - Get all the patents between a period of time
      * `startDate` - string - Required
      * `endDate` - string - Required
      * `pageSize` - number Optional
      * `pages` - number Optional
