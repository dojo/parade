const locales = {
	zh: () => import('./zh-CN/NamedButton'),
	'zh-TW': () => import('./zh-TW/NamedButton')
};

const messages = {
	message: 'This is a message'
};

export default { locales, messages };
