import * as fs from 'fs';
import * as path from 'canonical-path';
const unified = require('unified');
const remarkParse = require('remark-parse');
const remark2rehype = require('remark-rehype');
const stringify = require('rehype-stringify');

function markdown(content: string) {
	return unified()
		.use(remarkParse, { commonmark: true })
		.use(remark2rehype)
		.use(stringify)
		.processSync(content)
		.toString();
}

export default function(widgets: any) {
	const markdowns = widgets.reduce((readmes: any, widget: string) => {
		const readme = fs.readFileSync(
			path.join(process.cwd(), 'src', widget, 'README.md'),
			'utf8'
		);
		readmes = { ...readmes, [widget]: markdown(readme) };
		return readmes;
	}, {});
	return markdowns;
}
