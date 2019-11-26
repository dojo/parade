# @dojo/sandpit

![Alt text](/sandpit.jpg?raw=true "sandpit")

## Usage

```bash
npm install @dojo/sandpit
```

main:
```ts
import sandpit from '@dojo/sandpit';
import configs from './path/to/your/config';

import dojo from '@dojo/themes/dojo';
import '@dojo/themes/dojo/index.css';

const tests = (require as any).context('./', true, /\.spec\.ts(x)?$/);
sandpit({ configs, themes: [dojo], tests });
```

.dojorc:
```json
{
	"extends": "./node_modules/@dojo/example-runner/.dojorc"
}
```
