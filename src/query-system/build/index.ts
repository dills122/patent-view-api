export interface BuildArgs {
  and?: SearchTerm[];
  or?: SearchTerm[];
}

export interface SearchTerm {
  [key: string]: {
    [key: string]: string;
  };
}

export interface QueryObject {
  [key: string]: SearchTerm[];
}

export abstract class QueryBuilder {
  static build(args: BuildArgs): QueryObject {
    if (args.and) {
      return this.generateQuery('_and', args.and);
    }
    if (args.or) {
      return this.generateQuery('_or', args.or);
    }
    throw Error('Need to supply some search paramter');
  }

  private static generateQuery(type: string, searchTerms: SearchTerm[]) {
    return {
      [type]: searchTerms
    };
  }
}
