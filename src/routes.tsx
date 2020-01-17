export default [
	{
		path: '/',
		outlet: 'landing',
		defaultRoute: true
	},
	{
		path: 'widget/{widget}',
		outlet: 'widget',
		children: [
			{
				path: 'tests',
				outlet: 'tests'
			},
			{
				path: 'overview',
				outlet: 'overview'
			},
			{
				path: 'example/{example}',
				outlet: 'example'
			},
			{
				path: 'standalone/{example}',
				outlet: 'standalone-example'
			},

		]
	}
];
