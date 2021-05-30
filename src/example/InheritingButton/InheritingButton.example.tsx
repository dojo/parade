import { create, tsx } from '@dojo/framework/core/vdom';
import Button from './InheritingButton';

const factory = create();

const example = factory(function InheritingButtonBasic() {
	return (
		<Button otherBaseMethod={() => ''} label="label" baz="foo">
			{{ label: 'Hello' }}
		</Button>
	);
});

export default {
	group: 'InheritingButton',
	module: example,
	overview: true
};
