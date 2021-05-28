import { create, tsx } from '@dojo/framework/core/vdom';
import Button from './DefaultClassButton';

const factory = create();

const example = factory(function DefaultClassButtonBasic() {
	return <Button label="Hello" />;
});

export default {
	group: 'DefaultClassButton',
	module: example,
	overview: true
};
