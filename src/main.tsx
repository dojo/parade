import parade, { Config, WidgetConfigMap } from './index';
import baseConfig from './example/config';

const getLocalConfig = (require as any).context('./', true, /\.exampleFoo\.ts(x)?$/);

const widgetConfig = getLocalConfig.keys().reduce((map: WidgetConfigMap, id: string) => {
	const localConfig = getLocalConfig(id).default;
	const existingConfigs = map[localConfig.group || id] || [];
	map[localConfig.group || id] = existingConfigs.concat(getLocalConfig(id).default);
	return map;
}, {});

const config: Config = {
	...baseConfig,
	widgets: {
		...baseConfig.widgets,
		...widgetConfig
	}
};

parade({ config });
