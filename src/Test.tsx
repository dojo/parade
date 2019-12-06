import { create, tsx } from '@dojo/framework/core/vdom';

const factory = create().properties<{ widgetName: string }>();

export default factory(function Test({ properties }) {
	const { widgetName } = properties();
	return (
		<div>
			<h2 classes="text-2xl mb-4">Tests</h2>
			<iframe
				classes="w-full"
				onload={
					"this.style.height=(this.contentDocument.body.scrollHeight || 10000) +'px';" as any
				}
				src={`./intern?config=intern/intern.json&widget=${widgetName}`}
			/>
		</div>
	);
});
