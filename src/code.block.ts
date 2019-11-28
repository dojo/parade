import * as fs from 'fs';
import * as path from 'canonical-path';
const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');

export default function(exampleFilenames: any) {
	loadLanguages(['tsx']);
	const examples: any = {};
	exampleFilenames.forEach((exampleFilename: string) => {
		const ts = path.join(process.cwd(), exampleFilename);
		let code = '';
		if (fs.existsSync(ts)) {
			code = fs.readFileSync(ts, 'utf-8');
		}
		const content = Prism.highlight(code, Prism.languages.tsx, 'tsx');
		examples[exampleFilename] = content;
	});
	return examples;
}
