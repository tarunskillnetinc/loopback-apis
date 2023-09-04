// vtex.datasource.ts
import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
  name: 'vtex',
  connector: 'rest',
  baseURL: 'https://skillnet.vtexcommercestable.com.br',
};

@lifeCycleObserver('datasource')
export class VtexDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'vtex';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.vtex', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
