declare module "pg" {
  export interface PoolConfig { connectionString?: string; ssl?: unknown }
  export class Pool {
    constructor(config?: PoolConfig)
    end(): Promise<void>
  }
}
