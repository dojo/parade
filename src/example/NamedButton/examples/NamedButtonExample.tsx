import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '../NamedButton';

const factory = create();

export default factory(function Basic() {
	return <Button>Hello</Button>;
});