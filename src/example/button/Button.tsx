import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';

import * as css from '../theme/default/button.m.css';

export interface Base {
	/** A made up string property */
	foo: string;
	/** An optional method that does something and returns a string */
	baseMethod?(): string;
	baz: string;
}

export interface OtherBase {
	/** An optional base property */
	otherBaseProp?: string;
	otherBaseMethod(): string;
}

type PickSome = Pick<Base, Exclude<keyof Base, 'foo'>>;
export interface ButtonProperties extends PickSome, OtherBase {
	label: string;
}

const factory = create({ theme }).properties<ButtonProperties>();
export default factory(function Button({ properties, middleware: { theme } }) {
	const { label } = properties();
	const themedCss = theme.classes(css);
	return <button classes={[themedCss.root]}>{label}</button>;
});
