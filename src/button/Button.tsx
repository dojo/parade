import { create, tsx } from '@dojo/framework/core/vdom';

export interface ButtonProperties {
	label: string;
}

const factory = create().properties<ButtonProperties>();

export default factory(function Button({ properties }) {
	const { label } = properties();
	return <button>{ label }</button>;
});
