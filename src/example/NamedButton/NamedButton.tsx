import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import i18n from '@dojo/framework/core/middleware/i18n';
import bundle from './nls/NamedButton';

import * as css from '../theme/default/button.m.css';
import { RenderResult } from '@dojo/framework/core/interfaces';

export interface ButtonChildren {
	label?: RenderResult;
}

export interface FunctionChild {
	(foo: string): RenderResult;
}

const factory = create({ theme, i18n }).children<ButtonChildren | RenderResult | FunctionChild>();
export const NamedButton = factory(function NamedButton({
	properties,
	children,
	middleware: { theme, i18n }
}) {
	const [labelChild] = children();
	const label = labelChild && (labelChild as any).label ? (labelChild as any).label : labelChild;
	const { messages } = i18n.localize(bundle);
	const themedCss = theme.classes(css);
	return <button classes={[themedCss.root]}>{`${label} - ${messages.message}`}</button>;
});

export default NamedButton;
