import parade, { TransformedConfig, WidgetConfigMap } from './index';
import baseConfig from './example/config';
import { basename, extname } from 'path';

const getLocalConfig = (require as any).context('./', true, /\.example\.ts(x)?$/);

const widgetConfig = getLocalConfig.keys().reduce((configMap: WidgetConfigMap, id: string) => {
	const exampleFilename = basename(basename(id, extname(id)), '.example');
	const exampleConfig = { filename: exampleFilename, ...getLocalConfig(id).default };
	const existingConfigs = configMap[exampleConfig.group || id] || [];
	configMap[exampleConfig.group || id] = existingConfigs.concat(exampleConfig);
	return configMap;
}, {});

const config: TransformedConfig = {
	...baseConfig,
	widgets: {
		...baseConfig.widgets,
		...widgetConfig
	}
};

parade({ config });
