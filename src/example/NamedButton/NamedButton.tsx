import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import i18n from '@dojo/framework/core/middleware/i18n';
import bundle from './nls/NamedButton';

import * as css from '../theme/default/button.m.css';

export interface ButtonProperties {
	label: string;
}

const factory = create({ theme, i18n }).properties<ButtonProperties>();
export const NamedButton = factory(function NamedButton({ properties, middleware: { theme, i18n } }) {
	const { label } = properties();
	const { messages } = i18n.localize(bundle);
	const themedCss = theme.classes(css);
	return <button classes={[themedCss.root]}>{`${label} - ${messages.message}`}</button>;
});

export default NamedButton;
