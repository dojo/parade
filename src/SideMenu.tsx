import { create, tsx } from '@dojo/framework/core/vdom';

import ActiveLink from './ActiveLink';

const factory = create().properties<{ widgetName: string; config: any }>();

export default factory(function SideBar({ properties }) {
	const { widgetName, config } = properties();
	return (
		<div classes="flex flex-col justify-between overflow-y-auto sticky top-16 max-h-(screen-16) pt-12 pb-4 -mt-12">
			<div classes="mb-8">
				<h5 classes="text-gray-500 uppercase tracking-wide font-bold text-sm lg:text-xs">
					{widgetName}
				</h5>
				<ul classes="mt-4 overflow-x-hidden">
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
					<li classes="mb-2">
						<ActiveLink
							classes="block transition-fast hover:translate-r-2px hover:text-gray-900 text-gray-600 font-medium"
							to="tests"
							activeClasses={['font-bold']}
						>
							Tests
						</ActiveLink>
					</li>
				</ul>
				<hr classes="my-1 border-b-2 border-gray-200" />
				<ul classes="mt-4 overflow-x-hidden">
					{(config.widgets[widgetName].examples || []).map((example: any) => {
						return (
							<li classes="mb-2">
								<ActiveLink
									key={example.filename}
									classes="block transition-fast hover:translate-r-2px hover:text-gray-900 text-gray-600 font-medium"
									to="example"
									params={{
										widget: widgetName,
										example: example.filename.toLowerCase()
									}}
									activeClasses={['font-bold']}
								>
									{example.filename.replace(/([A-Z])/g, ' $1').trim()}
								</ActiveLink>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
});
