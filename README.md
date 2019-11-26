# @dojo/sandpit

![Alt text](/sandpit.jpg?raw=true "sandpit")

## Usage

```bash
npm install @dojo/sandpit
```


#### **`main.tsx`**
```tsx
import sandpit from '@dojo/sandpit';

// import your sandpit config
import config from './config';

// path to your tests
sandpit({ config, tests });
```

#### **`.dojorc`**
```json
{
  "extends": "./node_modules/@dojo/example-runner/.dojorc"
}
```

#### **`config.tsx`**
```tsx
import dojoTheme from '@dojo/themes/dojo';
import '@dojo/themes/dojo/index.css';

import BasicAccordionPane from './widgets/accordion-pane/Basic';
import Exclusive from './widgets/accordion-pane/Exclusive';
import BasicButton from './widgets/button/Basic';
import DisabledSubmit from './widgets/button/DisabledSubmit';
import ToggleButton from './widgets/button/ToggleButton';

const tests = (require as any).context('./', true, /\.spec\.ts(x)?$/);

export default {
  codesandbox: {},
  tests,
  themes: [ dojoTheme ],
  'widgets': {
    'accordion-pane': {
      examples: [
        {
          filename: 'Exclusive',
          module: Exclusive
        }
      ],
      filename: 'index',
      overview: {
        example: {
          filename: 'Basic',
          module: BasicAccordionPane
        }
      }
    },
    button: {
      examples: [
        {
          filename: 'DisabledSubmit',
          module: DisabledSubmit,
          title: 'Disabled Submit Button'
        },
        {
          filename: 'ToggleButton',
          module: ToggleButton,
          title: 'Toggle Button'
        }
      ],
      filename: 'index',
      overview: {
        example: {
          filename: 'Basic',
          module: BasicButton
        }
      }
    }
  }
```
