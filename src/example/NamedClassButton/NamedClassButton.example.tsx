import { create, tsx } from '@dojo/framework/core/vdom';
import Button from './NamedClassButton';

const factory = create();

const example = factory(function NamedClassButtonBasic() {
	return <Button label="Hello" />;
});

const exampleDescription = create()(
	() => 'This is an example of an optional description that is a widget.'
);

export default {
	group: 'NamedClassButton',
	overview: true,
	module: example,
	description: exampleDescription
};
