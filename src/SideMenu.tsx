import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';

import ActiveLink from './ActiveLink';
import { TransformedConfig } from '.';
import { getThemeFromConfig } from './utils';
import { basename, extname } from 'path';

const factory = create({ theme }).properties<{
	widgetName: string;
	config: TransformedConfig;
	onThemeChange: (theme: string) => void;
}>();

function cleanExampleName(filename: string) {
	return basename(basename(filename, extname(filename)), '.example').toLowerCase();
}

export default factory(function SideBar({ properties }) {
	const { widgetName, config, onThemeChange } = properties();
	const currentTheme = getThemeFromConfig(config);
	const regularExamples =
		config.widgets && config.widgets[widgetName].filter((example) => !example.overview);

	return (
		<div classes="flex flex-col justify-between overflow-y-auto sticky top-16 max-h-(screen-16) pt-12 pb-4 -mt-12">
			<div classes="mb-8">
				<h5 classes="text-gray-500 h uppercase tracking-wide font-bold text-sm lg:text-xs">
					{widgetName}
				</h5>
				<ul classes="list mt-4 overflow-x-hidden">
					<li classes="mb-2">
						<ActiveLink
							classes="block transition-fast hover:translate-r-2px hover:text-gray-900 text-gray-600 font-medium"
							to="overview"
							params={{
								widget: widgetName
							}}
							activeClasses={['font-bold']}
						>
							Overview
						</ActiveLink>
					</li>
					{config.tests && (
						<li classes="mb-2">
							<ActiveLink
								classes="block transition-fast hover:translate-r-2px hover:text-gray-900 text-gray-600 font-medium"
								to="tests"
								activeClasses={['font-bold']}
							>
								Tests
							</ActiveLink>
						</li>
					)}
				</ul>
				{regularExamples && regularExamples.length > 0 && (
					<virtual>
						<hr classes="hr my-1 border-b-2 border-gray-200" />
						<ul classes="list mt-4 overflow-x-hidden">
							{regularExamples.map((example: any) => {
								return (
									<li classes="mb-2">
										<ActiveLink
											key={example.filename}
											classes="block transition-fast hover:translate-r-2px hover:text-gray-900 text-gray-600 font-medium"
											to="example"
											params={{
												widget: widgetName,
												example: cleanExampleName(example.filename)
											}}
											activeClasses={['font-bold']}
										>
											{example.title.replace(/([A-Z])/g, ' $1').trim()}
										</ActiveLink>
									</li>
								);
							})}
						</ul>
					</virtual>
				)}
				<hr classes="hr my-1 border-b-2 border-gray-200" />
				<ul classes="list mt-4 overflow-x-hidden">
					<li classes="mb-2">
						<div classes="text-gray-600 font-medium">Theme</div>
						<div classes="inline-block relative w-4/5">
							<select
								onchange={(e) => {
									const themeName = (e.target as HTMLSelectElement).value;
									onThemeChange(themeName);
								}}
								classes="select block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
							>
								{config.themes.map((theme: any, i: number) => {
									return (
										<option
											selected={theme.label === currentTheme.label}
											value={`${i}`}
										>
											{theme.label}
										</option>
									);
								})}
							</select>
							<div classes="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
								<svg
									classes="fill-current h-4 w-4"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
								>
									<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
								</svg>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	);
});
