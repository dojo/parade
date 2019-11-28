import * as fs from 'fs';
import * as path from 'canonical-path';
const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');

export default function(exampleFilenames: any) {
	loadLanguages(['tsx']);
	const examples: any = {};
	exampleFilenames.forEach((exampleFilename: string) => {
		const ts = path.join(process.cwd(), 'src', 'example', `${exampleFilename}.ts`);
		const tsx = path.join(process.cwd(), 'src', 'example', `${exampleFilename}.tsx`);
		let code = '';
		if (fs.existsSync(tsx)) {
			code = fs.readFileSync(tsx, 'utf-8');
		}
		else if (fs.existsSync(ts)) {
			code = fs.readFileSync(ts, 'utf-8');
		}
		const content = Prism.highlight(code, Prism.languages.tsx, 'tsx');
		examples[exampleFilename] = content;
	});
	return examples;
}
