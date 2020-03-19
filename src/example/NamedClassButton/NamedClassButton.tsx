import { tsx } from '@dojo/framework/core/vdom';

import * as css from '../theme/default/button.m.css';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import { theme, ThemedMixin, ThemedProperties } from '@dojo/framework/core/mixins/Themed';

export interface ButtonProperties extends ThemedProperties {
	label: string;
}

@theme(css)
export class Button extends ThemedMixin(WidgetBase)<ButtonProperties> {
	render() {
		const { label } = this.properties;

		return <button classes={[this.theme(css.root)]}>{label}</button>;
	}
}

export default Button;
