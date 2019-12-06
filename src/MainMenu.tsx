import { create, tsx } from '@dojo/framework/core/vdom';
import ActiveLink from './ActiveLink';

const factory = create().properties<{ config: any }>();

function formatWidgetName(widget: string) {
	return widget
		.split('-')
		.map((item) => `${item[0].toUpperCase()}${item.slice(1)}`)
		.join(' ');
}

export default factory(function MainMenu({ properties }) {
	const { config } = properties();

	const widgets = Object.keys(config.widgets).sort();
	return (
		<div classes="hidden fixed inset-0 pt-16 h-full bg-white z-90 w-full border-b -mb-16 lg:-mb-0 lg:static lg:h-auto lg:overflow-y-visible lg:border-b-0 lg:pt-0 lg:w-1/4 lg:block lg:border-0 xl:w-1/5">
			<div classes="h-full overflow-y-auto scrolling-touch lg:h-auto lg:block lg:relative lg:sticky lg:top-16 bg-white lg:bg-transparent">
				<nav classes="px-6 pt-6 overflow-y-auto text-base lg:text-sm lg:py-12 lg:pl-6 lg:pr-8 sticky?lg:h-(screen-16)">
					<div classes="mb-10">
						<ActiveLink
							to="landing"
							classes="flex items-center px-2 -mx-2 py-1 hover:text-gray-900 font-medium text-gray-600"
							activeClasses={['font-bold']}
						>
							Home
						</ActiveLink>
						<hr classes="my-1 border-b-2 border-gray-200" />
						{widgets.map((widget) => {
							return (
								<ActiveLink
									to="overview"
									classes="flex items-center px-2 -mx-2 py-1 hover:text-gray-900 font-medium text-gray-600"
									params={{ widget }}
									matchParams={{ widget }}
									activeClasses={['font-bold']}
								>
									{formatWidgetName(widget)}
								</ActiveLink>
							);
						})}
					</div>
				</nav>
			</div>
		</div>
	);
});
