# Patent View Api

Checkout all the granted patents over the last 50 years.

## API Description

* `Endpoints`
  * `Patents` - retrieve details about patents and inventors
    * `Range` - Get all the patents between a period of time
      * `startDate` - string - Required
      * `endDate` - string - Required
      * `pageSize` - number Optional
      * `pages` - number Optional