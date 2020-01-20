import ButtonExample from './ButtonExample';
import ButtonAdvanced from './ButtonAdvanced';
import InputExample from './InputExample';

import red from './theme/red';
import blue from './theme/blue';

export default {
	name: '@dojo/widgets',
	themes: [
		{ label: 'Red', theme: red },
		{ label: 'Blue', theme: blue }
	],
	tests: (require as any).context('./', true, /\.spec\.ts(x)?$/),
	home: 'src/example/home.md',
	readmePath: (widget: string) => `src/example/${widget}/README.md`,
	widgetPath: (widget: string, filename: string) => `src/example/${widget}/${filename}.tsx`,
	examplePath: (widget: string, filename: string) => `src/example/${filename}.tsx`,
	codesandboxPath: (widget: string, filename: string) => {
		return `https://codesandbox.io/s/github/dojo/widgets/tree/master/src/examples?fontsize=14&initialpath=%23%2Fwidget%2F${widget}%2F${filename.toLowerCase()}&module=%2Fsrc%2Fwidgets%2F${widget}%2F${filename}.tsx`;
	},
	widgets: {
		button: {
			filename: 'Button',
			overview: {
				example: {
					filename: 'ButtonExample',
					module: ButtonExample
				}
			},
			examples: [
				{
					filename: 'ButtonAdvanced',
					module: ButtonAdvanced,
					title: 'Button Advanced',
					size: 'large',
					sandbox: true
				}
			]
		},
		input: {
			filename: 'Input',
			overview: {
				example: {
					filename: 'InputExample',
					module: InputExample
				}
			}
		}
	}
};
