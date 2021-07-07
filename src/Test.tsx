import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

interface TestIcache {
	mainUrl?: string;
}
const icache = createICacheMiddleware<TestIcache>();
const factory = create({ icache }).properties<{ widgetName: string }>();

export default factory(function Test({ properties, middleware: { icache } }) {
	const { widgetName } = properties();
	const fetchPromise = import('@dojo/framework/shim/fetch');
	const mainUrl = icache.getOrSet('mainUrl', () => fetchPromise.then(({ default: fetch }) => fetch('manifest.json')
		.then(result => result && result.ok && result.json())
		.then(json => json && json['main.js'])
		.catch()));
	return (
		<div>
			<h2 classes="text-2xl mb-4">Tests</h2>
			{mainUrl && (
				<iframe
					classes="w-full iframe"
					onload={
						"this.style.height=(this.contentDocument.body.scrollHeight || 10000) +'px';" as any
					}
					src={`./intern?basePath=..&${encodeURI('plugins=./intern/reporter.js')}&widget=${widgetName}&suites=${encodeURI(mainUrl)}`}
				/>
			)}
		</div>
	);
});
