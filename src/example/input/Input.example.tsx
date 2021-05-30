import { create, tsx } from '@dojo/framework/core/vdom';
import Input from './Input';

const factory = create();

const example = factory(function InputBasic() {
	return <Input label="Hello" value={''} onValue={() => {}} type="labeled" />;
});

export default {
	group: 'Input',
	overview: true,
	module: example
};
