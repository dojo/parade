# @dojo/sandpit

![Alt text](/sandpit.jpg?raw=true "sandpit")

## Usage

```bash
npm install @dojo/sandpit
```


```bash
main.tsx
```
```tsx
import sandpit from '@dojo/sandpit';
// import your sandpit config
import configs from './path/to/your/config';

// import any themes
import dojo from '@dojo/themes/dojo';
import '@dojo/themes/dojo/index.css';

// path to your tests
const tests = (require as any).context('./', true, /\.spec\.ts(x)?$/);
sandpit({ configs, themes: [dojo], tests });
```

```bash
.dojorc
```
```json
{
	"extends": "./node_modules/@dojo/example-runner/.dojorc"
}
```
