import { create, tsx } from '@dojo/framework/core/vdom';
import * as css from '../theme/button.m.css';

export interface ButtonProperties {
	label: string;
}

const factory = create().properties<ButtonProperties>();

export default factory(function Button({ properties }) {
	const { label } = properties();
	return <button classes={[css.root]}>{label}</button>;
});
