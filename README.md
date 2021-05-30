# @dojo/parade

A library to show off your widget library.

-   Show running demos
-   Syntax highlighted example code
-   Auto documented widget properties
-   Auto documented theme class hooks
-   Run on codesandbox
-   Run unit tests

![screenshot](/screenshot.png?raw=true 'screenshot')

## Compatibility

Each major release of Dojo Parade is compatible with a specific major version of the rest of the Dojo framework:

| Parade Version | Dojo Version |
| :------------: | :----------: |
|    `1.*.*`     |   `7.*.*`    |

## Usage

```bash
npm install @dojo/parade
```

#### **`.dojorc`**

```json
{
	"extends": "./node_modules/@dojo/parade/parade.json"
}
```

#### **`main.tsx`**

```tsx
import parade from '@dojo/parade';

// import your parade config
import config from './config';

parade({ config });
```

### Example global config:

#### **`config.tsx`**

```tsx
import dojoTheme from '@dojo/themes/dojo';
import '@dojo/themes/dojo/index.css';

import BasicAccordion from './widgets/accordion/Basic';
import BasicButton from './widgets/button/Basic';
import DisabledSubmit from './widgets/button/DisabledSubmit';
import ToggleButton from './widgets/button/ToggleButton';

const tests = (require as any).context('./', true, /\.spec\.ts(x)?$/);

export default {
  header: 'My Widget Library',
  codesandbox: {},
  tests,
  themes: [ dojoTheme ]
```

### Example local config:

#### **`AccordionBasic.example.tsx`**

```tsx
import dojoTheme from '@dojo/themes/dojo';
import '@dojo/themes/dojo/index.css';

import AccordionBasic from './widgets/accordion/Basic';

export default {
	module: AccordionBasic,
	overview: true
};
```
