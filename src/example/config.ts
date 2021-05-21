import red from './theme/red';
import blue from './theme/blue';
import { Config } from '..';

export default {
	name: '@dojo/widgets',
	themes: [
		{ label: 'Blue', theme: blue },
		{ label: 'Red', theme: red },
		{ label: 'default', theme: {} }
	],
	tests: (require as any).context('./', true, /\.spec\.ts(x)?$/),
	home: 'src/example/home.md',
	readmePath: (widget: string) => `src/example/${widget}/README.md`,
	widgetPath: (widget: string, filename: string) => `src/example/${widget}/${filename}.tsx`,
	examplePath: (widget: string, filename: string) => `src/example/${filename}.tsx`,
	codesandboxPath: (widget: string, filename: string) => {
		return `https://codesandbox.io/s/github/dojo/widgets/tree/master/src/examples?fontsize=14&initialpath=%23%2Fwidget%2F${widget}%2F${filename.toLowerCase()}&module=%2Fsrc%2Fwidgets%2F${widget}%2F${filename}.tsx`;
	},
	widgets: {}
} as Config;
