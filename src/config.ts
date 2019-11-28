import dojoTheme from '@dojo/themes/dojo';
import '@dojo/themes/dojo/index.css';
import ButtonExample from './example/ButtonExample';
import ButtonAdvanced from './example/ButtonAdvanced';

export default {
	themes: [ dojoTheme ],
	readmePath: (widget: string) => `src/${widget}/README.md`,
	widgetPath: (widget: string, filename: string) => `src/${widget}/${filename}.tsx`,
	examplePath: (widget: string, filename: string) => `src/example/${filename}.tsx`,
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
					title: 'Button Advanced'
				}
			]
		},
	}
}
