import { create, tsx, destroy } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import icache from '@dojo/framework/core/middleware/icache';
import global from '@dojo/framework/shim/global';
import { isThemeInjectorPayloadWithVariant } from '@dojo/framework/core/ThemeInjector';

import HorizontalRule from './HorizontalRule';
import ThemeTable from './ThemeTable';
import InterfaceTable from './InterfaceTable';
import { Config } from '.';

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
	config: Config;
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
	const example =
		config.widgets &&
		config.widgets[widgetName].find((e: any) =>
			isOverview ? e.overview : e.filename.toLowerCase() === exampleName
		);
	if (!example) {
		return;
	}
	const codesandboxPath =
		config.codesandboxPath && config.codesandboxPath(widgetName, example.filename, themeName);
	const examplePath = config.examplePath(widgetName, example.filename);
	const readmePath = config.readmePath(widgetName);

	const widgetReadme = widgetReadmes[readmePath];
	const widgetExample = widgetExamples[examplePath];
	const { properties: widgetProperty, children: widgetChildren, messages, locales } =
		widgetProperties[widgetName] || ({} as any);
	const widgetTheme = widgetThemes[widgetName];
	const hasThemeKeys = Object.keys(widgetTheme).length > 0;

	const dimensions = postMessage();

	if (example.size === 'small') {
		dimensions.height = '100px';
	} else if (example.size === 'medium') {
		dimensions.height = '300px';
	} else if (example.size === 'large') {
		dimensions.height = '600px';
	}

	const isFullscreen = icache.get('isFullscreen');
	const isCodeShowing = icache.getOrSet('isCodeShowing', true);

	let description;
	if (example.description) {
		description =
			typeof example.description === 'string' ? example.description : <example.description />;
	}

	return (
		<div>
			{isOverview && <div innerHTML={widgetReadme} />}
			{isOverview && <HorizontalRule />}
			<h2 classes="text-2xl h mb-4">{example.title || 'Example'}</h2>
			<div
				classes={`bg-white overflow-hidden border-t border-l border-r border-gray-400 ${
					!isCodeShowing ? 'border-b' : 'border-b-0'
				} ${isFullscreen ? 'fixed top-0 left-0 w-screen h-screen z-50' : 'rounded-t-lg'}`}
			>
				<div
					classes={`border border-gray-400 border-t-0 border-l-0 border-r-0 flex justify-end ${
						isFullscreen ? 'p-6' : 'px-4 py-2'
					}`}
				>
					<button
						classes={`border-0 appearance-none bg-transparent cursor-pointer p-0 ${
							isFullscreen ? 'text-black mr-6' : 'text-gray-500 mr-4'
						}`}
						onclick={() => icache.set('isFullscreen', !isFullscreen)}
					>
						{isFullscreen ? (
							<i class="fas fa-compress-alt"></i>
						) : (
							<i class="fas fa-expand-alt"></i>
						)}
					</button>
					<button
						classes={`border-0 appearance-none bg-transparent cursor-pointer p-0 ${
							isCodeShowing ? 'text-black' : 'text-gray-500'
						}`}
						onclick={() => icache.set('isCodeShowing', !isCodeShowing)}
					>
						<i class="fas fa-code"></i>
					</button>
				</div>
				<div classes="p-4">
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
			</div>
			{isCodeShowing && (
				<div classes="rounded-b-lg bg-gray-800">
					<pre classes="bg-blue-900 language-ts rounded px-4 py-4">
						<code classes="language-ts" innerHTML={widgetExample} />
					</pre>
				</div>
			)}
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
			{description && (
				<virtual>
					<HorizontalRule />
					<h2 classes="text-2xl mb-4">Description</h2>
					{description}
				</virtual>
			)}
			{isOverview && widgetProperty && <InterfaceTable props={widgetProperty} />}
			{isOverview && widgetChildren && widgetChildren.length && (
				<InterfaceTable props={widgetChildren} tableName="Children" />
			)}
			{isOverview && messages.length && (
				<InterfaceTable
					props={messages}
					tableName="i18n Messages"
					descriptionLabel="Default"
					showTypes={false}
				/>
			)}
			{isOverview && locales.length && (
				<InterfaceTable
					props={locales}
					tableName="Supported Locales"
					showComments={false}
					showTypes={false}
				/>
			)}
			{isOverview && hasThemeKeys && <ThemeTable themes={widgetTheme} />}
		</div>
	);
});
