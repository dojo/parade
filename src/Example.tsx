import { create, tsx, destroy } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import icache from '@dojo/framework/core/middleware/icache';
import global from '@dojo/framework/shim/global';
import { isThemeInjectorPayloadWithVariant } from '@dojo/framework/core/ThemeInjector';

import HorizontalRule from './HorizontalRule';
import ThemeTable from './ThemeTable';
import InterfaceTable from './InterfaceTable';

const middleware = create({ destroy, icache });

const postMessage = middleware(({ middleware: { destroy, icache } }) => {
	const callback = (e: any) => {
		const dimensions = JSON.parse(e.data);
		icache.set('iframe-dimensions', dimensions);
	};
	global.window.addEventListener('message', callback);
	destroy(() => {
		global.window.removeEventListener('message', callback);
	});
	return () => icache.getOrSet<{ height: string }>('iframe-dimensions', { height: '0px' });
});

const factory = create({ theme, icache, postMessage }).properties<{
	widgetName: string;
	exampleName?: string;
	widgetReadmes: any;
	widgetExamples: any;
	widgetProperties: any;
	widgetThemes: any;
	config: any;
}>();

export default factory(function Example({
	properties,
	middleware: { icache, theme, postMessage }
}) {
	const {
		config,
		widgetName,
		exampleName,
		widgetReadmes,
		widgetExamples,
		widgetProperties,
		widgetThemes
	} = properties();

	const currentTheme = theme.get();
	let themeName = config.themes[0].label;
	config.themes.forEach((theme: any, i: number) => {
		if (isThemeInjectorPayloadWithVariant(currentTheme)) {
			if (currentTheme.theme.theme === theme.theme.theme) {
				themeName = theme.label;
			}
		} else if (currentTheme && currentTheme.theme === theme.theme) {
			themeName = theme.label;
		}
	});
	const isOverview = !exampleName;
	const example = isOverview
		? config.widgets[widgetName].overview.example
		: config.widgets[widgetName].examples.find(
				(e: any) => e.filename.toLowerCase() === exampleName
		  );
	const codesandboxPath =
		config.codesandboxPath && config.codesandboxPath(widgetName, example.filename, themeName);
	const examplePath = config.examplePath(widgetName, example.filename);
	const readmePath = config.readmePath(widgetName);

	const widgetReadme = widgetReadmes[readmePath];
	const widgetExample = widgetExamples[examplePath];
	const { properties: widgetProperty, children: widgetChildren } = widgetProperties[widgetName] || {} as any;
	const widgetTheme = widgetThemes[widgetName];

	const dimensions = postMessage();

	if (example.size === 'small') {
		dimensions.height = '100px';
	} else if (example.size === 'medium') {
		dimensions.height = '300px';
	} else if (example.size === 'large') {
		dimensions.height = '600px';
	}

	return (
		<div>
			{isOverview && <div innerHTML={widgetReadme} />}
			{isOverview && <HorizontalRule />}
			<h2 classes="text-2xl h mb-4">{example.title || 'Example'}</h2>
			<div classes="bg-white rounded-t-lg overflow-hidden border-b-0 border-t border-l border-r border-gray-400 p-4">
				{example.sandbox ? (
					<iframe
						src={`?cacheBust=${widgetName}-${
							example.filename
						}-${themeName}#widget/${widgetName}/sandbox/${example.filename.toLowerCase()}?theme=${themeName}`}
						classes="w-full iframe"
						styles={dimensions}
					/>
				) : (
					<div key="example-container" styles={example.size ? dimensions : {}}>
						<example.module />
					</div>
				)}
			</div>
			<div classes="rounded-b-lg bg-gray-800">
				<pre classes="bg-blue-900 language-ts rounded px-4 py-4">
					<code classes="language-ts" innerHTML={widgetExample} />
				</pre>
			</div>
			{codesandboxPath && (
				<div classes="my-4">
					<a href={codesandboxPath}>
						<img
							alt={`Edit ${examplePath} example`}
							src="https://codesandbox.io/static/img/play-codesandbox.svg"
						/>
					</a>
				</div>
			)}
			{isOverview && widgetProperty && <InterfaceTable props={widgetProperty} />}
			{isOverview && widgetChildren && (
				<InterfaceTable props={widgetChildren} tableName="Children" />
			)}
			{isOverview && <ThemeTable themes={widgetTheme} />}
		</div>
	);
});
