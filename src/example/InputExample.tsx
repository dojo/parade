import { create, tsx } from '@dojo/framework/core/vdom';
import Button from './input/Input';

const factory = create();

export default factory(function Basic() {
	return <Button label="Hello" value={''} onValue={() => {}} type="labeled" />;
});
