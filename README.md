# prevent-navigation

Easily prevent and enable page navigation from multiple sources and keep track of those sources.

# installation

```sh
npm i prevent-navigation
```

# usage

## `preventNavigation`

You can quickly and simply block navigation without any smartness by calling `preventNavigation` directly with no arguments:

<!-- example-link: src/readme-examples/prevention-basic.example.ts -->

```TypeScript
import {preventNavigation} from '../index';

preventNavigation();
```

For smarter prevention or preventing in multiple places, pass in id strings:

<!-- example-link: src/readme-examples/prevention-by-id.example.ts -->

```TypeScript
import {preventNavigation} from '../index';

preventNavigation('user-form-1');

/** Multiple ids can be used at once. */
preventNavigation('user-form-2', 'user-form-3', 'user-form-4');

/** `preventNavigation` can be called again from multiple places without issue. */
preventNavigation('user-form-5');
```

## `allowNavigation`

Re-enable navigation with `allowNavigation`:

<!-- example-link: src/readme-examples/allowance-basic.example.ts -->

```TypeScript
import {allowNavigation} from '../index';

allowNavigation();
```

It can also be used with ids:

<!-- example-link: src/readme-examples/allowance-by-id.example.ts -->

```TypeScript
import {allowNavigation} from '../index';

allowNavigation('user-form-1');

/** Multiple ids can be unblocked at once. */
allowNavigation('user-form-2', 'user-form-3', 'user-form-4');

/** `allowNavigation` can be called again from multiple places without issue. */
allowNavigation('user-form-5');
```

## Checking navigation status

<!-- example-link: src/readme-examples/checking.example.ts -->

```TypeScript
import {getNavigationBlockerIds, isNavigationBlocked} from '../index';

/** Get all the ids currently blocking navigation (if any). */
getNavigationBlockerIds();

/** Check if navigation is blocked. */
isNavigationBlocked();
```
