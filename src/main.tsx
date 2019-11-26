import global from '@dojo/framework/shim/global';
import has from '@dojo/framework/core/has';
import renderer, { tsx } from '@dojo/framework/core/vdom';
import Registry from '@dojo/framework/core/Registry';
import { registerThemeInjector } from '@dojo/framework/core/mixins/Themed';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';
import dojo from '@dojo/themes/dojo';
import '@dojo/themes/dojo/index.css';

import routes from './routes';
import App from './App';

export default ({ configs, themes, domNode, tests }: { configs: any, themes?: any, domNode: HTMLElement, tests: any }) => {
	if (global.intern) {
		const url = new URL(window.location.href);
		const params = url.searchParams;
		const widget = params.get('widget');
		tests.keys().forEach((id: string) => {
			if (widget && id.indexOf(widget) !== -1) {
				tests(id);
			}
		});
	}
	else {
		const includeDocs = Boolean(
			has('docs') === 'false' ? false : has('docs') === 'true' ? true : has('docs')
		);
		const registry = new Registry();
		registerThemeInjector(dojo, registry);
		registerRouterInjector(routes, registry);

		const r = renderer(() => <App includeDocs={includeDocs} configs={configs} />);
		r.mount({ registry, domNode });
	}
}
