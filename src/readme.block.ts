import * as fs from 'fs';
import * as path from 'canonical-path';
import * as glob from 'glob';
const unified = require('unified');
const remarkParse = require('remark-parse');
const remark2rehype = require('remark-rehype');
const stringify = require('rehype-stringify');

function globExamples() {
	const files = glob.sync(path.join(__dirname, 'widgets/**/*'), { nodir: true });
	const prefix = path.join(__dirname, 'widgets');
	return files.map((file) => file.replace(`${prefix}/`, ''));
}

function markdown(content: string) {
	return unified()
		.use(remarkParse, { commonmark: true })
		.use(remark2rehype)
		.use(stringify)
		.processSync(content)
		.toString();
}

export default function() {
	const examples = globExamples();
	const widgets = [...new Set<string>(examples.map((example) => example.split('/')[0]))];
	return widgets.reduce((readmes, widget) => {
		const readme = fs.readFileSync(
			path.join(__dirname, '..', '..', widget, 'README.md'),
			'utf8'
		);
		readmes = { ...readmes, [widget]: markdown(readme) };
		return readmes;
	}, {});
}
