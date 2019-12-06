import * as fs from 'fs';
import * as path from 'canonical-path';
const unified = require('unified');
const remarkParse = require('remark-parse');
const remark2rehype = require('remark-rehype');
const stringify = require('rehype-stringify');
const addClasses = require('rehype-add-classes');
const sectionize = require('remark-sectionize');

function markdown(content: string) {
	return unified()
		.use(remarkParse, { commonmark: true })
		.use(sectionize)
		.use(remark2rehype)
		.use(addClasses, {
			p: 'inline',
			ul: 'list-disc list-inside my-4',
			h1: 'text-3xl mb-4',
			h2: 'text-2xl my-4',
			h3: 'text-2xl my-4',
			pre: 'bg-blue-900 rounded px-4 py-4 my-4'
		})
		.use(stringify)
		.processSync(content)
		.toString();
}

export default function(readmeFilenames: any) {
	const readmes: any = {};
	readmeFilenames.forEach((readmeFilename: string) => {
		const readme = fs.readFileSync(path.join(process.cwd(), readmeFilename), 'utf8');
		const content = markdown(readme);
		readmes[readmeFilename] = content;
	});
	return readmes;
}
