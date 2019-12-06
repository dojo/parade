import { create, tsx } from '@dojo/framework/core/vdom';
import block from '@dojo/framework/core/middleware/block';
import Outlet from '@dojo/framework/routing/Outlet';

import MainMenu from './MainMenu';
import Landing from './Landing';
import SideMenu from './SideMenu';
import Example from './Example';
import Test from './Test';
import Header from './Header';

import readme from './readme.block';
import getWidgetProperties from './properties.block';
import getTheme from './theme.block';
import code from './code.block';

function getWidgetFileNames(config: any): { [index: string]: string } {
	return Object.keys(config.widgets).reduce((newConfig, widget) => {
		return {
			...newConfig,
			[widget]: config.widgetPath(widget, config.widgets[widget].filename)
		};
	}, {});
}

function getReadmeFileNames(config: any): string[] {
	const filenames: string[] = [];
	Object.keys(config.widgets).forEach((key) => {
		filenames.push(config.readmePath(key));
	});
	if (config.home) {
		filenames.push(config.home);
	}
	return filenames;
}

function getExampleFileNames(config: any): string[] {
	const filenames: string[] = [];
	Object.keys(config.widgets).forEach((key) => {
		const widget = config.widgets[key];
		if (widget.overview && widget.overview.example) {
			filenames.push(config.examplePath(key, widget.overview.example.filename));
		}
		if (widget.examples) {
			widget.examples.forEach((example: any) => {
				filenames.push(config.examplePath(key, example.filename));
			});
		}
	});
	return filenames;
}

const factory = create({ block }).properties<{ config: any }>();

export default factory(function App({ properties, middleware: { block } }) {
	const { config } = properties();
	const widgetFilenames = getWidgetFileNames(config);
	const exampleFilenames = getExampleFileNames(config);
	const readmeFilenames = getReadmeFileNames(config);

	const widgetReadmeContent = block(readme)(readmeFilenames) || {};
	const widgetExampleContent = block(code)(exampleFilenames) || {};
	const widgetProperties = block(getWidgetProperties)(widgetFilenames) || {};
	const widgetThemeClasses = block(getTheme)(widgetFilenames) || {};

	return (
		<div>
			<Header config={config} />
			<div classes="w-full max-w-screen-xl mx-auto px-6">
				<div classes="lg:flex -mx-6">
					<MainMenu config={config} />
					<div
						id="content-wrapper"
						classes="min-h-screen w-full lg:static lg:max-h-full lg:overflow-visible lg:w-3/4 xl:w-4/5"
					>
						<div id="content">
							<div id="app" classes="flex">
								<div classes="pt-24 pb-16 lg:pt-28 w-full">
									<Outlet
										key="landing"
										id="landing"
										renderer={() => {
											return (
												<div classes="flex">
													<div classes="markdown px-6 xl:px-12 w-full max-w-3xl mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:w-3/4">
														<Landing
															config={config}
															widgetReadmes={widgetReadmeContent}
														/>
													</div>
												</div>
											);
										}}
									/>
									<Outlet
										key="tests"
										id="tests"
										renderer={({ params, queryParams }) => {
											const { widget: widgetName } = params;
											return (
												<div classes="flex">
													<div classes="markdown px-6 xl:px-12 w-full max-w-3xl mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:w-3/4">
														<Test widgetName={widgetName} />
													</div>
													<div classes="hidden xl:text-sm xl:block xl:w-1/4 xl:px-6">
														<SideMenu
															config={config}
															widgetName={widgetName}
														/>
													</div>
												</div>
											);
										}}
									/>
									<Outlet
										key="overview"
										id="overview"
										renderer={({ params, queryParams }) => {
											const { widget: widgetName } = params;
											return (
												<div classes="flex">
													<div classes="markdown px-6 xl:px-12 w-full max-w-3xl mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:w-3/4">
														<Example
															widgetName={widgetName}
															config={config}
															widgetReadmes={widgetReadmeContent}
															widgetProperties={widgetProperties}
															widgetThemes={widgetThemeClasses}
															widgetExamples={widgetExampleContent}
														/>
													</div>
													<div classes="hidden xl:text-sm xl:block xl:w-1/4 xl:px-6">
														<SideMenu
															config={config}
															widgetName={widgetName}
														/>
													</div>
												</div>
											);
										}}
									/>
									<Outlet
										key="example"
										id="example"
										renderer={({ params, queryParams }) => {
											const {
												widget: widgetName,
												example: exampleName
											} = params;
											return (
												<div classes="flex">
													<div classes="markdown px-6 xl:px-12 w-full max-w-3xl mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:w-3/4">
														<Example
															widgetName={widgetName}
															exampleName={exampleName}
															config={config}
															widgetReadmes={widgetReadmeContent}
															widgetProperties={widgetProperties}
															widgetThemes={widgetThemeClasses}
															widgetExamples={widgetExampleContent}
														/>
													</div>
													<div classes="hidden xl:text-sm xl:block xl:w-1/4 xl:px-6">
														<SideMenu
															config={config}
															widgetName={widgetName}
														/>
													</div>
												</div>
											);
										}}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});
