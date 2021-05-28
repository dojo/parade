import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import resize from '@dojo/framework/core/middleware/resize';
import * as css from './ExampleSandbox.m.css';

const factory = create({ theme, resize }).properties<{
	themeName: string;
	config: any;
	widgetName: string;
	exampleName: string;
}>();

export default factory(function Example({ properties, middleware: { theme, resize } }) {
	const { themeName, config, widgetName, exampleName } = properties();
	let newTheme = config.themes[0].theme;
	const currentTheme = theme.get();
	config.themes.forEach((theme: any, i: number) => {
		if (theme.label === themeName) {
			newTheme = config.themes[i].theme;
		}
	});
	if (currentTheme && currentTheme.theme !== newTheme) {
		theme.set(newTheme);
	}
	const { height } = resize.get('example-container') || { height: 0 };
	if (height) {
		parent.postMessage(JSON.stringify({ height: `${height}px` }), '*');
	}
	const example =
		config.widgets &&
		config.widgets[widgetName].find((e: any) => e.filename.toLowerCase() === exampleName);
	return (
		example && (
			<div key="example-container" classes={css.container}>
				<example.module />
			</div>
		)
	);
});
