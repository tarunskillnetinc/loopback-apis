import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
  name: 'category',
  connector: 'rest',
  baseURL: 'https://glue.de.faas-suite-prod.cloud.spryker.toys',
  options: {
    headers: {
      'content-type': 'application/json',
    },
  },
};

@lifeCycleObserver('datasource')
export class CategoryDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'category';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.category', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}