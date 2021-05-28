import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '../Button';

const factory = create();

const example = factory(function Basic() {
	return <Button label="Hello" baz="baz" otherBaseMethod={() => 'other'} />;
});

export default {
	description: 'This is an example of an optional description that is a string.',
	filename: 'ButtonBasic',
	group: 'Button',
	module: example,
	overview: true
};
