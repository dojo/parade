import global from '@dojo/framework/shim/global';
import renderer, { tsx } from '@dojo/framework/core/vdom';
import Registry from '@dojo/framework/core/Registry';
import { registerThemeInjector } from '@dojo/framework/core/mixins/Themed';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';
import transition from '@dojo/framework/core/animations/cssTransitions';
import { ThemeWithVariants, Theme } from '@dojo/framework/core/interfaces';

import './main.css';

import routes from './routes';
import App from './App';
import { getThemeFromConfig } from './utils';

export interface ConfigThemes {
	label: string;
	theme: Theme | ThemeWithVariants;
}

export interface WidgetExampleConfig {
	filename: string;
	module: any;
	title?: string;
	description?: string;
	size?: string;
	sandbox?: boolean;
}

export interface WidgetConfig {
	filename?: string;
	overview: {
		example: WidgetExampleConfig;
	};
	examples?: WidgetExampleConfig[];
}

export interface Config {
	name: string;
	themes: ConfigThemes[];
	tests?: any;
	home: string;
	readmePath: (widget: string) => string;
	widgetPath: (widget: string, filename: string) => string;
	examplePath: (widget: string, filename: string) => string;
	codesandboxPath?: (widget: string, filename: string, themeName?: string) => string;
	widgets: { [index: string]: WidgetConfig };
}

export default ({ config }: { config: Config }) => {
	const { themes, tests } = config;
	if (global.intern && tests && tests.keys) {
		const url = new URL(window.location.href);
		const params = url.searchParams;
		const widget = params.get('widget');
		tests.keys().forEach((id: string) => {
			if (widget && id.indexOf(widget) !== -1) {
				tests(id);
			}
		});
	} else {
		const theme = getThemeFromConfig(config);
		const registry = new Registry();
		registerThemeInjector(theme.theme, registry);
		registerRouterInjector(routes, registry);

		const r = renderer(() => <App config={config} />);
		r.mount({ registry, domNode: document.getElementById('app')!, transition });
	}
};
