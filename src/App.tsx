import global from '@dojo/framework/shim/global';
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
import getWidgetProperties from './interfaces.block';
import getTheme from './theme.block';
import code from './code.block';

import '@fortawesome/fontawesome-free/css/all.css';

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

const factory = create({ block, icache, theme }).properties<{ config: any }>();

export default factory(function App({ properties, middleware: { block, icache, theme } }) {
	const { config } = properties();
	const widgetFilenames = getWidgetFileNames(config);
	const exampleFilenames = getExampleFileNames(config);
	const readmeFilenames = getReadmeFileNames(config);
	const isCodeSandbox = !!global.window.csbJsonP;
	const changeTheme = (themeName: string) => {
		const { theme: newTheme, label } = config.themes[themeName];
		window.location.search = `theme=${label}`;
		theme.set(newTheme);
	};

	const widgetReadmeContent = isCodeSandbox ? {} : block(readme)(readmeFilenames) || {};
	const widgetExampleContent = isCodeSandbox ? {} : block(code)(exampleFilenames) || {};
	const widgetProperties = isCodeSandbox ? {} : block(getWidgetProperties)(widgetFilenames) || {};
	const widgetThemeClasses = isCodeSandbox ? {} : block(getTheme)(widgetFilenames) || {};

	const content = (
		<Outlet
			id="main"
			matcher={(matches, detailsMap) => {
				matches.example = detailsMap.has('example') || detailsMap.has('overview');
				return matches;
			}}
		>
			{{
				landing: <Landing config={config} widgetReadmes={widgetReadmeContent} />,
				example: ({ params: { widget, example } }) => (
					<Example
						key={`${widget}-${example || 'overview'}`}
						widgetName={widget}
						exampleName={example}
						config={config}
						widgetReadmes={widgetReadmeContent}
						widgetProperties={widgetProperties}
						widgetThemes={widgetThemeClasses}
						widgetExamples={widgetExampleContent}
					/>
				),
				tests: ({ params: { widget } }) => <Test widgetName={widget} />
			}}
		</Outlet>
	);

	return (
		<Outlet
			id="main"
			matcher={(_, detailsMap) => {
				const isSandbox = detailsMap.has('sandbox');
				return {
					app: !isSandbox,
					sandbox: isSandbox
				};
			}}
		>
			{{
				app: (
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
														{content}
													</div>
													<div classes="hidden xl:text-sm xl:block xl:w-1/4 xl:px-6">
														<Outlet id="side-menu">
															{({ params: { widget } }) => (
																<SideMenu
																	config={config}
																	widgetName={widget}
																	onThemeChange={changeTheme}
																/>
															)}
														</Outlet>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				),
				sandbox: ({ params: { widget, example }, queryParams: { theme } }) => (
					<ExampleSandbox
						widgetName={widget}
						exampleName={example}
						themeName={theme}
						config={config}
					/>
				)
			}}
		</Outlet>
	);
});
