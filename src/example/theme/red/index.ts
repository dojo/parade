import * as button from './button.m.css';

import * as light from './variants/light.m.css';
import * as dark from './variants/dark.m.css';

export default {
	theme: {
        '@dojo/parade/button': button
    },
    variants: {
        default: light,
        dark,
        light
    }
};
