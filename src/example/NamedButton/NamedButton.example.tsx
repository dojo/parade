import { create, tsx } from '@dojo/framework/core/vdom';
import Button from './NamedButton';

const factory = create();

const example = factory(function NamedButtonBasic() {
	return <Button>Hello</Button>;
});

export default {
	group: 'NamedButton',
	overview: true,
	module: example
};
