declare module "pg" {
  interface QueryResult<T = any> {
    rows: T[];
    rowCount: number;
  }
  interface PoolClient {
    query<T = any>(text: string, values?: unknown[]): Promise<QueryResult<T>>;
    release(): void;
  }
  interface Pool {
    connect(): Promise<PoolClient>;
    query<T = any>(text: string, values?: unknown[]): Promise<QueryResult<T>>;
  }
}
