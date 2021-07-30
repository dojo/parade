import red from './theme/red';
import blue from './theme/blue';
import { Config } from '..';
import ButtonExample from './button/ButtonExample';
import ButtonAdvanced from './button/ButtonAdvancedExample';

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
	widgetPath: (widget: string) => `src/example/${widget}/${widget}.tsx`,
	examplePath: (widget: string, filename: string) => `src/example/${widget}/${filename}.tsx`,
	codesandboxPath: (widget: string, filename: string) => {
		return `https://codesandbox.io/s/github/dojo/widgets/tree/master/src/examples?fontsize=14&initialpath=%23%2Fwidget%2F${widget}%2F${filename.toLowerCase()}&module=%2Fsrc%2Fwidgets%2F${widget}%2F${filename}.tsx`;
	},
	widgets: {
		button: {
			filename: 'Button',
			overview: {
				example: {
					filename: 'ButtonExampleExample',
					module: ButtonExample,
					description: 'This is an example of an optional description that is a string.'
				}
			},
			examples: [
				{
					filename: 'ButtonAdvancedExample',
					module: ButtonAdvanced,
					title: 'Button Advanced',
					size: 'large',
					sandbox: true
				}
			]
		}
	}
} as Config;
