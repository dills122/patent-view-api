import { describe } from 'mocha';
import { expect } from 'chai';

import Build from './index';

describe('Query System::', () => {
  describe('Build::', () => {
    it('should build query param object, and', () => {
      const andQueryParamObject = Build.build({
        and: []
      });
      expect(andQueryParamObject._and).to.not.be.undefined;
      expect(andQueryParamObject._and).to.be.an('array').and.length(0);
    });
    it('should build query param object, and', () => {
      const andQueryParamObject = Build.build({
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
      const andQueryParamObject = Build.build({
        or: []
      });
      expect(andQueryParamObject._or).to.not.be.undefined;
      expect(andQueryParamObject._or).to.be.an('array').and.length(0);
    });
    it('should build query param object, or', () => {
      const andQueryParamObject = Build.build({
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
