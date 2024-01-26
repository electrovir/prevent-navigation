import {allowNavigation} from '../index';

allowNavigation('user-form-1');

/** Multiple ids can be unblocked at once. */
allowNavigation('user-form-2', 'user-form-3', 'user-form-4');

/** `allowNavigation` can be called again from multiple places without issue. */
allowNavigation('user-form-5');
