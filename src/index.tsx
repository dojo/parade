import global from '@dojo/framework/shim/global';
import renderer, { tsx } from '@dojo/framework/core/vdom';
import Registry from '@dojo/framework/core/Registry';
import { registerThemeInjector } from '@dojo/framework/core/mixins/Themed';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';

import './main.css';

import routes from './routes';
import App from './App';

export default ({ config }: { config: any }) => {
	const { themes, tests } = config;
	if (global.intern) {
		const url = new URL(window.location.href);
		const params = url.searchParams;
		const widget = params.get('widget');
		tests.keys().forEach((id: string) => {
			if (widget && id.indexOf(widget) !== -1) {
				tests(id);
			}
		});
	} else {
		const registry = new Registry();
		themes.map((theme: any) => {
			registerThemeInjector(theme, registry);
		});
		registerRouterInjector(routes, registry);

		const r = renderer(() => <App config={config} />);
		r.mount({ registry, domNode: document.getElementById('app')! });
	}
};
