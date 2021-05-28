import * as fs from 'fs';
import * as path from 'canonical-path';
const Prism = require('prismjs');
require('prismjs/components/prism-clike');
require('prismjs/components/prism-javascript');
require('prismjs/components/prism-jsx');
require('prismjs/components/prism-typescript');
require('prismjs/components/prism-tsx');

export default function(exampleFilenames: any) {
	const examples: any = {};
	exampleFilenames.forEach((exampleFilename: string) => {
		const ts = path.join(process.cwd(), exampleFilename);
		let code = '';
		console.log((process.cwd(), exampleFilename));
		if (fs.existsSync(ts)) {
			code = fs.readFileSync(ts, 'utf-8');
		}
		const content = Prism.highlight(code, Prism.languages.tsx, 'tsx');
		examples[exampleFilename] = content;
	});
	return examples;
}
