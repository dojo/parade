# @dojo/parade

![parade](/parade.jpg?raw=true "parade")

![screenshot](/screenshot.png?raw=true "screenshot")

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

#### **`config.tsx`**
```tsx
import dojoTheme from '@dojo/themes/dojo';
import '@dojo/themes/dojo/index.css';

import BasicAccordion from './widgets/accordion/Basic';
import Exclusive from './widgets/accordion/Exclusive';
import BasicButton from './widgets/button/Basic';
import DisabledSubmit from './widgets/button/DisabledSubmit';
import ToggleButton from './widgets/button/ToggleButton';

const tests = (require as any).context('./', true, /\.spec\.ts(x)?$/);

export default {
  header: 'My Widget Library',
  codesandbox: {},
  tests,
  themes: [ dojoTheme ],
  widgets: {
    accordion: {
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
          module: BasicAccordion
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

#### **`main.tsx`**
```tsx
import parade from '@dojo/parade';

// import your parade config
import config from './config';

parade({ config });
```
