import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'commercetools',
  connector: 'rest',
  baseURL: 'https://api.us-central1.gcp.commercetools.com/skillnet-b2c',
  crud: false
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class CommercetoolsDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'commercetools';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.commercetools', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
