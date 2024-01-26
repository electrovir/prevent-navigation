import {preventNavigation} from '../index';

preventNavigation('user-form-1');

/** Multiple ids can be used at once. */
preventNavigation('user-form-2', 'user-form-3', 'user-form-4');

/** `preventNavigation` can be called again from multiple places without issue. */
preventNavigation('user-form-5');
