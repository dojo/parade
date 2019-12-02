import { create, tsx } from '@dojo/framework/core/vdom';

const factory = create().properties();

export default factory(function HorizontalRule() {
	return <hr classes="my-6 border-b-2 border-gray-200" />;
});
