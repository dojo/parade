import dojoTheme from '@dojo/themes/dojo';
import '@dojo/themes/dojo/index.css';
import ButtonExample from './example/ButtonExample';

export default {
	themes: [ dojoTheme ],
	widgets: {
		button: {
			filename: 'Button',
			overview: {
				example: {
					filename: 'ButtonExample',
					module: ButtonExample
				}
			}
		},
	}
}
