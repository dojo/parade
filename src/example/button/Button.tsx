import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';

import * as css from '../theme/default/button.m.css';

export interface ButtonProperties {
	label: string;
}

const factory = create({ theme }).properties<ButtonProperties>();

export default factory(function Button({ properties, middleware: { theme } }) {
	const { label } = properties();
	const themedCss = theme.classes(css);
	return <button classes={[themedCss.root]}>{label}</button>;
});
