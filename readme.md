# Patent View Api

[![CI Job](https://github.com/dills122/patent-view-api/actions/workflows/ci.action.yml/badge.svg)](https://github.com/dills122/patent-view-api/actions/workflows/ci.action.yml)
[![CodeFactor](https://www.codefactor.io/repository/github/dills122/patent-view-api/badge)](https://www.codefactor.io/repository/github/dills122/patent-view-api)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/48b11072cd4f4b15b54b43aaec12c7d1)](https://www.codacy.com/gh/dills122/patent-view-api/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=dills122/patent-view-api&amp;utm_campaign=Badge_Grade)

Checkout all the granted patents over the last 50 years.

## API Description

* `Endpoints`
  * `Patents` - retrieve details about patents and inventors
    * `Range` - Get all the patents between a period of time
      * `startDate` - string - Required
      * `endDate` - string - Required
      * `pageSize` - number Optional
      * `pages` - number Optional
