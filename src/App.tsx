import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import block from '@dojo/framework/core/middleware/block';
import theme from '@dojo/framework/core/middleware/theme';
import Outlet from '@dojo/framework/routing/Outlet';

import MainMenu from './MainMenu';
import Landing from './Landing';
import SideMenu from './SideMenu';
import Example from './Example';
import ExampleSandbox from './ExampleSandbox';
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

const Main = create({ icache, theme }).properties<{ config: any; widgetName?: string }>()(
	({ properties, children, middleware: { theme, icache } }) => {
		const { config, widgetName } = properties();
		const changeTheme = (themeName: string) => {
			const newTheme = config.themes[themeName].theme;
			theme.set(newTheme);
		};
		return (
			<div>
				<Header
					config={config}
					open={!!icache.get('open')}
					onMenuToggle={(open) => {
						icache.set('open', open);
					}}
				/>
				<div classes="w-full max-w-screen-xl mx-auto px-6">
					<div classes="lg:flex -mx-6">
						<MainMenu
							onThemeChange={changeTheme}
							widgetName={widgetName}
							config={config}
							showMenu={!!icache.get('open')}
							onMenuItemClick={() => {
								icache.set('open', false);
							}}
						/>
						<div
							classes={`${
								icache.get('open')
									? 'overflow-hidden max-h-screen fixed hidden'
									: ''
							} min-h-screen w-full lg:static lg:max-h-full lg:overflow-visible lg:w-3/4 xl:w-4/5`}
						>
							<div id="content">
								<div id="app" classes="flex">
									<div classes="pt-24 pb-16 lg:pt-28 w-full">
										<div classes="flex">
											<div classes="markdown px-6 xl:px-12 w-full max-w-3xl mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:w-3/4">
												{children()}
											</div>
											<div classes="hidden xl:text-sm xl:block xl:w-1/4 xl:px-6">
												{widgetName && (
													<SideMenu
														config={config}
														widgetName={widgetName}
														onThemeChange={changeTheme}
													/>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
);

const factory = create({ block, icache, theme }).properties<{ config: any }>();

export default factory(function App({ properties, middleware: { block, icache, theme } }) {
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
			<Outlet
				key="standalone-example"
				id="standalone-example"
				renderer={({ params: { widget, example }, queryParams: { theme } }) => {
					return <ExampleSandbox
						widgetName={widget}
						exampleName={example}
						themeName={theme}
						config={config}
					/>
				}}
			/>
			<Outlet
				key="landing"
				id="landing"
				renderer={() => {
					return (
						<Main config={config}>
							<Landing config={config} widgetReadmes={widgetReadmeContent} />
						</Main>
					);
				}}
			/>
			<Outlet
				key="tests"
				id="tests"
				renderer={({ params, queryParams }) => {
					const { widget: widgetName } = params;
					return (
						<Main config={config} widgetName={widgetName}>
							<Test widgetName={widgetName} />
						</Main>
					);
				}}
			/>
			<Outlet
				key="overview"
				id="overview"
				renderer={({ params, queryParams }) => {
					const { widget: widgetName } = params;
					return (
						<Main config={config} widgetName={widgetName}>
							<Example
								key={`${widgetName}-overview`}
								widgetName={widgetName}
								config={config}
								widgetReadmes={widgetReadmeContent}
								widgetProperties={widgetProperties}
								widgetThemes={widgetThemeClasses}
								widgetExamples={widgetExampleContent}
							/>
						</Main>
					);
				}}
			/>
			<Outlet
				key="example"
				id="example"
				renderer={({ params, queryParams }) => {
					const { widget: widgetName, example: exampleName } = params;
					return (
						<Main config={config} widgetName={widgetName}>
							<Example
								key={`${widgetName}-${exampleName}`}
								widgetName={widgetName}
								exampleName={exampleName}
								config={config}
								widgetReadmes={widgetReadmeContent}
								widgetProperties={widgetProperties}
								widgetThemes={widgetThemeClasses}
								widgetExamples={widgetExampleContent}
							/>
						</Main>
					);
				}}
			/>
		</div>
	);
});
