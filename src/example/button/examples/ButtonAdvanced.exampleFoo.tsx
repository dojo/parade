import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '../Button';

const factory = create();

const example = factory(function ButtonAdvanced() {
	return <Button label="Advanced" baz="baz" otherBaseMethod={() => 'other'} />;
});

export default {
	filename: 'ButtonAdvanced',
	group: 'Button',
	module: example,
	sandbox: true,
	size: 'large',
	title: 'Button Advanced'
};
