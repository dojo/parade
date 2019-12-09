import { create, tsx } from '@dojo/framework/core/vdom';
import Button from './button/Button';

const factory = create();

export default factory(function ButtonAdvanced() {
	return <Button label="Advanced" />;
});
