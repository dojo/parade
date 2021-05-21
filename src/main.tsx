import parade, { Config, WidgetConfigMap } from './index';
import baseConfig from './example/config';
import { dirname, sep } from 'path';

const getLocalConfig = (require as any).context('./', true, /\.example\.ts(x)?$/);

const widgetConfig = getLocalConfig.keys().reduce((map: WidgetConfigMap, id: string) => {
	const widgetKey = dirname(id)
		.split(sep)
		.pop();
	map[widgetKey || id] = getLocalConfig(id).default;
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
