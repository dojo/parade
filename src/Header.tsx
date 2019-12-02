import { create, tsx } from '@dojo/framework/core/vdom';

const factory = create().properties<{ config: any }>();

export default factory(function Test({ properties }) {
	const { config } = properties();
	return (
		<div classes="flex bg-white border-b border-gray-200 fixed top-0 inset-x-0 z-100 h-16 items-center">
			<div classes="w-full max-w-screen-xl relative mx-auto px-6">
				<div classes="flex items-center -mx-6">
					<div classes="lg:w-1/4 xl:w-1/5 pl-6 pr-6 lg:pr-8">
						<h1 classes="text-4xl">{config.name || 'Parade'}</h1>
					</div>
				</div>
			</div>
		</div>
	);
});
