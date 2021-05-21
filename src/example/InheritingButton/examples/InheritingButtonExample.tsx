import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '../InheritingButton';

const factory = create();

export default factory(function Basic() {
	return (
		<Button otherBaseMethod={() => ''} label="label" baz="foo">
			{{ label: 'Hello' }}
		</Button>
	);
});
