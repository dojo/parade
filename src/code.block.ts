import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');

function globExamples() {
	const files = glob.sync(path.join(__dirname, 'widgets/**/*'), { nodir: true });
	const prefix = path.join(__dirname, 'widgets');
	return files.map((file) => file.replace(`${prefix}/`, ''));
}

export default function() {
	loadLanguages(['tsx']);
	const examples = globExamples();
	return examples.reduce((content, widget) => {
		const code = fs.readFileSync(path.join(__dirname, 'widgets', widget), 'utf8');
		content = { ...content, [widget]: Prism.highlight(code, Prism.languages.tsx, 'tsx') };
		return content;
	}, {});
}
