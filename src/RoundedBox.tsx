import { create, tsx } from '@dojo/framework/core/vdom';

const factory = create().properties();

export default factory(function RoundedBox({ children }) {
	return (
		<div classes="bg-white rounded-lg border border-gray-400 inline-block">{children()}</div>
	);
});
