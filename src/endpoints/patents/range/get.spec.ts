import { describe } from 'mocha';
import { expect } from 'chai';
import Sinon from 'sinon';
import { lastValueFrom, of } from 'rxjs';

import { PatentResponse, Range } from './get';

describe('Endpoints::', () => {
  describe('Patents::', () => {
    describe('Range::', () => {
      const stubs: any = {};
      let sandbox: Sinon.SinonSandbox;
      const getResponseMock = {
        count: 0,
        patents: [],
        total_patent_count: 0
      } as PatentResponse;
      describe('Get::', () => {
        beforeEach(() => {
          sandbox = Sinon.createSandbox();
          stubs.requestStub = sandbox.stub(Range.prototype, 'request').returns(of(getResponseMock));
        });
        afterEach(() => {
          sandbox.reset();
          sandbox.restore();
        });
        it('should return empty array if no patents are found', async () => {
          const getter = new Range();
          const results = await lastValueFrom(
            getter.between({
              startDate: '2021-03-01',
              endDate: '2021-09-06',
              pageSize: 5,
              pages: 3
            })
          );
          expect(results).to.be.an('array').and.length(0);
          expect(stubs.requestStub.callCount).to.equal(1);
        });
        it('should return one page if thats all thats found', async () => {
          stubs.requestStub.returns(
            of({
              ...getResponseMock,
              count: 5,
              total_patent_count: 5
            })
          );
          const getter = new Range();
          const results = await lastValueFrom(
            getter.between({
              startDate: '2021-03-01',
              endDate: '2021-09-06',
              pageSize: 5,
              pages: 3
            })
          );
          expect(results).to.be.an('array').and.length(0);
          expect(stubs.requestStub.callCount).to.equal(1);
        });
        it('should return all pages if under max pages', async () => {
          stubs.requestStub
            .onCall(0)
            .returns(
              of({
                ...getResponseMock,
                count: 5,
                total_patent_count: 10
              })
            )
            .onCall(1)
            .returns(
              of({
                ...getResponseMock,
                count: 10,
                total_patent_count: 10
              })
            );
          const getter = new Range();
          const results = await lastValueFrom(
            getter.between({
              startDate: '2021-03-01',
              endDate: '2021-09-06',
              pageSize: 5,
              pages: 3
            })
          );
          expect(results).to.be.an('array').and.length(0);
          expect(stubs.requestStub.callCount).to.equal(2);
        });
        it('should return all pages until hit the max requested page count is reached', async () => {
          stubs.requestStub
            .onCall(0)
            .returns(
              of({
                ...getResponseMock,
                count: 1,
                total_patent_count: 5
              })
            )
            .onCall(1)
            .returns(
              of({
                ...getResponseMock,
                count: 2,
                total_patent_count: 5
              })
            )
            .onCall(2)
            .returns(
              of({
                ...getResponseMock,
                count: 3,
                total_patent_count: 5
              })
            )
            .onCall(3)
            .returns(
              of({
                ...getResponseMock,
                count: 4,
                total_patent_count: 5
              })
            );
          const getter = new Range();
          const results = await lastValueFrom(
            getter.between({
              startDate: '2021-03-01',
              endDate: '2021-09-06',
              pageSize: 1,
              pages: 3
            })
          );
          expect(results).to.be.an('array').and.length(0);
          expect(stubs.requestStub.callCount).to.equal(3);
        });
      });
    });
  });
});
