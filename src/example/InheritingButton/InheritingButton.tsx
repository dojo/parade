import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';

import * as css from '../theme/default/button.m.css';
import { ButtonChildren } from '../NamedButton/NamedButton';
import { ButtonProperties } from '../Button/Button';

const factory = create({ theme })
	.properties<ButtonProperties>()
	.children<ButtonChildren>();
export const InheritingButton = factory(function InheritingButton({
	children,
	middleware: { theme }
}) {
	const [labelChild] = children();
	const label = labelChild && (labelChild as any).label ? (labelChild as any).label : labelChild;
	const themedCss = theme.classes(css);
	return <button classes={[themedCss.root]}>{label}</button>;
});

export default InheritingButton;
