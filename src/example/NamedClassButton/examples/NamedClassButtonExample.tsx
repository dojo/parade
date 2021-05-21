import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '../NamedClassButton';

const factory = create();

export default factory(function Basic() {
	return <Button label="Hello" />;
});
