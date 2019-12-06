import { create, tsx } from '@dojo/framework/core/vdom';

import HorizontalRule from './HorizontalRule';
import ThemeTable from './ThemeTable';
import PropertyTable from './PropertyTable';

const factory = create().properties<{
	widgetName: string;
	exampleName?: string;
	widgetReadmes: any;
	widgetExamples: any;
	widgetProperties: any;
	widgetThemes: any;
	config: any;
}>();

export default factory(function Example({ properties }) {
	const {
		config,
		widgetName,
		exampleName,
		widgetReadmes,
		widgetExamples,
		widgetProperties,
		widgetThemes
	} = properties();

	const isExample = !exampleName;
	const example = isExample
		? config.widgets[widgetName].overview.example
		: config.widgets[widgetName].examples.find(
				(e: any) => e.filename.toLowerCase() === exampleName
		  );
	const codesandboxPath = config.codesandboxPath(widgetName, example.filename);
	const examplePath = config.examplePath(widgetName, example.filename);
	const readmePath = config.readmePath(widgetName);

	const widgetReadme = widgetReadmes[readmePath];
	const widgetExample = widgetExamples[examplePath];
	const widgetProperty = widgetProperties[widgetName];
	const widgetTheme = widgetThemes[widgetName];

	return (
		<div>
			{isExample && <div innerHTML={widgetReadme} />}
			{isExample && <HorizontalRule />}
			<h2 classes="text-2xl mb-4">{example.title || 'Example'}</h2>
			<div classes="bg-white rounded-t-lg overflow-hidden border-t border-l border-r border-gray-400 p-4">
				<example.module />
			</div>
			<div classes="rounded-b-lg bg-gray-800">
				<pre classes="bg-blue-900 language-ts rounded px-4 py-4">
					<code classes="language-ts" innerHTML={widgetExample} />
				</pre>
			</div>
			<div classes="my-4">
				<a href={codesandboxPath}>
					<img
						alt={`Edit ${examplePath} example`}
						src="https://codesandbox.io/static/img/play-codesandbox.svg"
					/>
				</a>
			</div>
			{isExample && <PropertyTable props={widgetProperty} />}
			{isExample && <ThemeTable themes={widgetTheme} />}
		</div>
	);
});
