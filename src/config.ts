import dojoTheme from '@dojo/themes/dojo';
import '@dojo/themes/dojo/index.css';
import ButtonExample from './example/ButtonExample';
import ButtonAdvanced from './example/ButtonAdvanced';

export default {
	themes: [ dojoTheme ],
	widgetPath: (widget: string, filename: string) => `src/${widget}/${filename}`,
	examplePath: (widget: string, filename: string) => `src/example/${filename}`,
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
