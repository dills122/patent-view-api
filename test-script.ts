import { lastValueFrom } from 'rxjs';
import { Range } from './src/endpoints/patents/range/get';

(async () => {
  const getter = new Range();
  const results = await lastValueFrom(
    getter.between({
      args: {
        startDate: '1999-03-03',
        endDate: '1999-03-12',
        pageSize: 50,
        pages: 80
      }
    })
  );
  const patentNumbers: {
    [key: string]: number;
  } = {};
  results.forEach((patent) => {
    const pNum = patent.patent_number;
    if (patentNumbers[pNum]) {
      patentNumbers[pNum]++;
      console.warn(`Dup found: ${pNum}`);
    } else {
      patentNumbers[pNum] = 1;
    }
  });
  // console.log(JSON.stringify(patentNumbers, null, 4));
  console.log(Object.keys(patentNumbers).length);
  // console.log(JSON.stringify(results, null, 4));
  const length = results.length;
  console.log(`Number of records: ${length}`);
})();
