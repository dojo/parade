export default [
	{
		id: 'landing',
		outlet: 'main',
		path: '/',
		defaultRoute: true
	},
	{
		id: 'widget',
		outlet: 'side-menu',
		path: 'widget/{widget}',
		children: [
			{
				id: 'tests',
				outlet: 'main',
				path: 'tests'
			},
			{
				id: 'overview',
				outlet: 'main',
				path: 'overview'
			},
			{
				id: 'example',
				outlet: 'main',
				path: 'example/{example}'
			},
			{
				id: 'sandbox',
				outlet: 'main',
				path: 'sandbox/{example}'
			}
		]
	}
];
