import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'commercecloud',
  connector: 'rest',
  baseURL: 'https://zzkd-003.dx.commercecloud.salesforce.com',
  crud: false
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class CommercecloudDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'commercecloud';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.commercecloud', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
