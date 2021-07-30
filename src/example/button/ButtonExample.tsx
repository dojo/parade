import { create, tsx } from '@dojo/framework/core/vdom';
import Button from './Button';

const factory = create();

export default factory(function ButtonBasic() {
	return <Button label="Hello" baz="baz" otherBaseMethod={() => 'other'} />;
});
