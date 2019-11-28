import { create, tsx } from '@dojo/framework/core/vdom';
import block from '@dojo/framework/core/middleware/block';
import Outlet from '@dojo/framework/routing/Outlet';

import readme from './readme.block';
import getWidgetProperties, { PropertyInterface } from './properties.block';
import getTheme from './theme.block';
import code from './code.block';
import Menu from './Menu';
import SideMenu from './SideMenu';
import Example from './Example';
import ThemeTable from './ThemeTable';
import PropertyTable from './PropertyTable';

import * as css from './App.m.css';
import Landing from './Landing';

function getWidgetFileNames(config: any): { [index: string]: string } {
	return Object.keys(config).reduce((newConfig, widget) => {
		return { ...newConfig, [widget]: config[widget].filename || 'index' };
	}, {});
}

function getExampleFileNames(config: any): string[] {
	const filenames: string[] = [];
	Object.keys(config).forEach((key) => {
		const widget = config[key];
		if (widget.overview && widget.overview.example) {
			filenames.push(widget.overview.example.filename);
		}
		if (widget.examples) {
			widget.examples.forEach((example: any) => {
				filenames.push(example.filename);
			});
		}
	});
	return filenames;
}

export function formatWidgetName(widget: string) {
	return widget
		.split('-')
		.map((item) => `${item[0].toUpperCase()}${item.slice(1)}`)
		.join(' ');
}

interface AppProperties {
	includeDocs: boolean;
	configs: any;
}

const factory = create({ block }).properties<AppProperties>();

interface Content {
	[index: string]: string;
}

export default factory(function App({ properties, middleware: { block } }) {
	const { includeDocs, configs } = properties();
	const widgets = Object.keys(configs).sort();
	const widgetFilenames = getWidgetFileNames(configs);
	const exampleFilenames = getExampleFileNames(configs);
	let widgetReadmeContent: Content = {};
	let widgetExampleContent: Content = {};
	let widgetProperties: { [index: string]: PropertyInterface[] } = {};
	let widgetThemeClasses: { [index: string]: { [index: string]: string } } = {};
	if (includeDocs) {
		widgetReadmeContent = block(readme)(Object.keys(widgetFilenames)) || {};
		widgetExampleContent = block(code)(exampleFilenames) || {};
		widgetProperties = block(getWidgetProperties)(widgetFilenames) || {};
		widgetThemeClasses = block(getTheme)(widgetFilenames) || {};
	}
	return (
		<div classes={[css.root]}>
			<Menu widgetNames={widgets} />
			<main classes={[css.main]}>
				<Outlet
					id="example"
					renderer={({ params, queryParams }) => {
						const { widget: widgetName, example: exampleName } = params;
						const active = queryParams.active ? queryParams.active : 'example';
						const widgetConfig = configs[widgetName];
						const { overview, examples = [] } = widgetConfig;
						const isBasic = exampleName === 'basic';
						const readmeContent = widgetReadmeContent[widgetName];
						const example = isBasic
							? overview.example
							: examples.find(
									(example: any) => example.filename.toLowerCase() === exampleName
							  );
						if (!example) {
							return null;
						}
						const widgetPath = `${example.filename}`;
						const content = widgetExampleContent[widgetPath];
						const propertyInterface = widgetProperties[widgetName];
						const themeClasses = widgetThemeClasses[widgetName];
						return (
							<virtual key={widgetPath}>
								<SideMenu name={widgetName} config={widgetConfig} />
								<div classes={[css.content]}>
									{isBasic && includeDocs && <div innerHTML={readmeContent} />}
									<h1>{isBasic ? 'Basic Usage' : example.title}</h1>
									<Example
										widgetName={widgetName}
										content={content}
										active={active}
									>
										<example.module />
									</Example>
									{includeDocs && (
										<a
											href={`https://codesandbox.io/s/github/dojo/widgets/tree/master/src/examples?fontsize=14&initialpath=%23%2Fwidget%2F${widgetName}%2F${example.filename.toLowerCase()}&module=%2Fsrc%2Fwidgets%2F${widgetName}%2F${
												example.filename
											}.tsx`}
										>
											<img
												alt={`Edit ${widgetPath} example`}
												src="https://codesandbox.io/static/img/play-codesandbox.svg"
											/>
										</a>
									)}
									{isBasic && includeDocs && (
										<PropertyTable props={propertyInterface} />
									)}
									{isBasic && includeDocs && <ThemeTable themes={themeClasses} />}
								</div>
							</virtual>
						);
					}}
				/>
				<Outlet
					id="landing"
					renderer={({ params }) => {
						return <Landing widgets={widgets} />;
					}}
				/>
			</main>
		</div>
	);
});
