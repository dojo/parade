import * as glob from 'glob';
import * as path from 'canonical-path';

export default function() {
	const files = glob.sync(path.join(__dirname, 'widgets/**/*'), {
		nodir: true
	});
	const prefix = path.join(__dirname, 'widgets');
	return files.map((file) => file.replace(`${prefix}/`, ''));
}
