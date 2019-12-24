import { create, tsx } from '@dojo/framework/core/vdom';

const factory = create().properties<{
	config: any;
	open: boolean;
	onMenuToggle: (open: boolean) => void;
}>();

export default factory(function Header({ properties }) {
	const { config, onMenuToggle, open } = properties();
	return (
		<div classes="flex bg-white border-b border-gray-200 fixed top-0 inset-x-0 z-100 h-16 items-center">
			<div classes="w-full max-w-screen-xl relative mx-auto px-6">
				<div classes="flex items-center -mx-6">
					<div classes="lg:w-1/4 xl:w-1/5 pl-6 pr-6 lg:pr-8">
						<h1 classes="text-4xl">{config.name || 'Parade'}</h1>
					</div>
					<div class="flex flex-grow lg:w-3/4 xl:w-4/5">
						<div class="w-full lg:px-6 xl:w-3/4 xl:px-12">
							<div class="relative"></div>
						</div>

						<button
							type="button"
							onclick={() => {
								onMenuToggle(!open);
							}}
							class={`${
								open ? 'hidden' : ''
							} flex px-6 items-center lg:hidden text-gray-500 focus:outline-none focus:text-gray-700`}
						>
							<svg
								class="fill-current w-4 h-4"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
							>
								<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
							</svg>
						</button>

						<button
							type="button"
							onclick={() => {
								onMenuToggle(!open);
							}}
							class={`${
								open ? '' : 'hidden'
							} flex px-6 items-center lg:hidden text-gray-500 focus:outline-none focus:text-gray-700`}
						>
							<svg
								class="fill-current w-4 h-4"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
							>
								<path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"></path>
							</svg>
						</button>

						<div class="hidden lg:flex lg:items-center lg:justify-between xl:w-1/4 px-6">
							<div class="relative mr-4"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});
