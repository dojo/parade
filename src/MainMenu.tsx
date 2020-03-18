import { create, tsx } from '@dojo/framework/core/vdom';
import ActiveLink from './ActiveLink';
import SideMenu from './SideMenu';

const factory = create().properties<{
	config: any;
	showMenu: boolean;
	widgetName?: string;
	onThemeChange: (themeName: string) => void;
	onMenuItemClick: () => void;
}>();

function formatWidgetName(widget: string) {
	return widget
		.split('-')
		.map((item) => `${item[0].toUpperCase()}${item.slice(1)}`)
		.join(' ');
}

export default factory(function MainMenu({ properties }) {
	const { config, showMenu, onMenuItemClick, widgetName, onThemeChange } = properties();

	const widgets = Object.keys(config.widgets).sort();
	return (
		<div
			classes={`${
				showMenu ? '' : 'hidden'
			} fixed inset-0 pt-16 h-full border-l-0 border-r-0 border-t-0 bg-white z-90 w-full border-b -mb-16 lg:-mb-0 lg:static lg:h-auto lg:overflow-y-visible lg:border-b-0 lg:pt-0 lg:w-1/4 lg:block lg:border-0 xl:w-1/5`}
		>
			<div classes="h-full overflow-y-auto scrolling-touch lg:h-auto lg:block lg:relative lg:sticky lg:top-16 bg-white lg:bg-transparent">
				<nav classes="px-6 pt-6 overflow-y-auto text-base lg:text-sm lg:py-12 lg:pl-6 lg:pr-8 sticky?lg:h-(screen-16)">
					<div classes="mb-10">
						<ActiveLink
							to="landing"
							classes="flex items-center px-2 -mx-2 py-1 hover:text-gray-900 font-medium text-gray-600"
							activeClasses={['font-bold']}
							onClick={() => onMenuItemClick()}
						>
							Home
						</ActiveLink>
						<hr classes="hr my-1 border-b-2 border-gray-200" />
						{widgets.map((widget) => {
							return (
								<ActiveLink
									to="overview"
									classes="flex items-center px-2 -mx-2 py-1 hover:text-gray-900 font-medium text-gray-600"
									params={{ widget }}
									matchParams={{ widget }}
									activeClasses={['font-bold']}
									onClick={() => onMenuItemClick()}
								>
									{formatWidgetName(widget)}
								</ActiveLink>
							);
						})}
						<div classes="xl:hidden block w-2/3">
							<hr classes="hr mt-10 my-1 border-b-2 border-gray-200" />
							{widgetName && (
								<SideMenu
									onThemeChange={onThemeChange}
									config={config}
									widgetName={widgetName}
								/>
							)}
						</div>
					</div>
				</nav>
			</div>
		</div>
	);
});
