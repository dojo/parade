import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '../Button';

const factory = create();

export default factory(function ButtonAdvanced() {
	return <Button label="Advanced" baz="baz" otherBaseMethod={() => 'other'} />;
});
