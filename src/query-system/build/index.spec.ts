import { describe } from 'mocha';
import { expect } from 'chai';

import { QueryBuilder } from './';

describe('Query System::', () => {
  describe('QueryBuilder::', () => {
    it('should build query param object, and', () => {
      const andQueryParamObject = QueryBuilder.build({
        and: []
      });
      expect(andQueryParamObject._and).to.not.be.undefined;
      expect(andQueryParamObject._and).to.be.an('array').and.length(0);
    });
    it('should build query param object, and', () => {
      const andQueryParamObject = QueryBuilder.build({
        and: [
          {
            _eq: {
              fake: 'fake'
            }
          },
          {
            _eq: {
              faker: 'faker'
            }
          }
        ]
      });
      expect(andQueryParamObject._and).to.not.be.undefined;
      expect(andQueryParamObject._and).to.be.an('array').and.length(2);
    });
    it('should build query param object, or', () => {
      const andQueryParamObject = QueryBuilder.build({
        or: []
      });
      expect(andQueryParamObject._or).to.not.be.undefined;
      expect(andQueryParamObject._or).to.be.an('array').and.length(0);
    });
    it('should build query param object, or', () => {
      const andQueryParamObject = QueryBuilder.build({
        or: [
          {
            _eq: {
              fake: 'fake'
            }
          },
          {
            _eq: {
              faker: 'faker'
            }
          }
        ]
      });
      expect(andQueryParamObject._or).to.not.be.undefined;
      expect(andQueryParamObject._or).to.be.an('array').and.length(2);
    });
  });
});
