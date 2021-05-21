import ButtonExample from './examples/ButtonExample';
import ButtonAdvanced from './examples/ButtonAdvanced';

export default {
	filename: 'Button',
	overview: {
		example: {
			filename: 'ButtonExample',
			module: ButtonExample,
			description: 'This is an example of an optional description that is a string.'
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
};
