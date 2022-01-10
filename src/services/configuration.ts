class ConfigurationService {
  config: any;

  constructor() {
    this.config = null;
  }

  setConfig(config: any): void {
    this.config = config;
  }

  getConfig<T = any>(): T {
    if (!this.config) {
      throw new Error('You are trying to access config, but it is not defined');
    }

    return this.config;
  }
}

const configService = new ConfigurationService();

export default configService;
