import { create, tsx } from '@dojo/framework/core/vdom';
import Input from '../Input';

const factory = create();

export default factory(function Basic() {
	return <Input label="Hello" value={''} onValue={() => {}} type="labeled" />;
});
