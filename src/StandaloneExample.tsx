import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import resize from '@dojo/framework/core/middleware/resize';

const factory = create({ theme, resize }).properties<{
	themeName: string,
	config: any
	widgetName: string,
	exampleName: string;
}>();

export default factory(function Example({ properties, middleware: { theme, resize } }) {
	const { themeName, config, widgetName, exampleName } = properties();
	let newTheme = config.themes[0].theme;
	config.themes.forEach((theme: any, i: number) => {
		if (theme.label === themeName) {
			newTheme = config.themes[i].theme;
		}
	});
	if (theme.get() !== newTheme) {
		theme.set(newTheme);
	}
	const { height } = resize.get('example-container') || { height: 0 };
	if (height) {
		parent.postMessage(JSON.stringify({ height: `${height}px` }), '*');
	}
	const isOverview = config.widgets[widgetName].overview.example.filename.toLowerCase() === exampleName
	const example = isOverview ? config.widgets[widgetName].overview.example : config.widgets[widgetName].examples.find(
			(e: any) => e.filename.toLowerCase() === exampleName
		);
	return <div key="example-container"><example.module /></div>;
});
