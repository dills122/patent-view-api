import { describe } from 'mocha';
// import { expect } from 'chai';

import { lastValueFrom } from 'rxjs';

import { Range } from './get';

describe('Endpoints::', () => {
  describe('Patents::', () => {
    describe('Range::', () => {
      describe('Get::', () => {
        it('should test it out', async () => {
          const getter = new Range();
          const results = await lastValueFrom(
            getter.between({
              startDate: '2021-03-01',
              endDate: '2021-09-06',
              pageSize: 5,
              pages: 3
            })
          );
          console.log(results);
        });
      });
    });
  });
});
