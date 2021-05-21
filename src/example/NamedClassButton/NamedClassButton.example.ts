import NamedClassButtonExample from './examples/NamedClassButtonExample';
import { create } from '@dojo/framework/core/vdom';

const ExampleDescription = create()(
	() => 'This is an example of an optional description that is a widget.'
);

export default {
	filename: 'NamedClassButton',
	overview: {
		example: {
			filename: 'NamedClassButtonExample',
			module: NamedClassButtonExample,
			description: ExampleDescription
		}
	}
};
