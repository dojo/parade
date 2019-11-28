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

export default function(readmeFilenames: any) {
	const readmes: any = {};
	readmeFilenames.forEach((readmeFilename: string) => {
		const readme = fs.readFileSync(
			path.join(process.cwd(), readmeFilename),
			'utf8'
		);
		const content = markdown(readme);
		readmes[readmeFilename] = content;
	});
	return readmes;
}
