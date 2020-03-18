import { tsx } from '@dojo/framework/core/vdom';

import * as css from '../theme/default/button.m.css';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import { theme, ThemedMixin, ThemedProperties } from '@dojo/framework/core/mixins/Themed';

export interface ButtonProperties extends ThemedProperties {
	label: string;
	extraArgument?: string;
}

@theme(css)
export default class Button extends ThemedMixin(WidgetBase)<ButtonProperties> {
	render() {
		const { label } = this.properties;

		return <button classes={[this.theme(css.root)]}>{label}</button>;
	}
}
