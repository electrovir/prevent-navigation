import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {
    allowNavigation,
    getNavigationBlockerIds,
    isNavigationBlocked,
    preventNavigation,
    resetAllNavigationBlockers,
} from './index.js';

function navigationTest(testCallback: () => void) {
    return () => {
        assert.isFalse(isNavigationBlocked());
        testCallback();
        resetAllNavigationBlockers();
        assert.isFalse(isNavigationBlocked());
    };
}

describe(preventNavigation.name, () => {
    it(
        'blocks a single input',
        navigationTest(() => {
            assert.strictEquals(preventNavigation('hello'), 1);
            assert.isTrue(isNavigationBlocked());
        }),
    );
    it(
        'works with no inputs',
        navigationTest(() => {
            assert.strictEquals(preventNavigation(), 1);
            assert.isTrue(isNavigationBlocked());
        }),
    );
    it(
        'blocks multiple inputs',
        navigationTest(() => {
            assert.strictEquals(preventNavigation('hello', 'goodbye'), 2);
            assert.isTrue(isNavigationBlocked());
        }),
    );
    it(
        'can be called multiple times',
        navigationTest(() => {
            assert.strictEquals(preventNavigation('hello'), 1);
            assert.strictEquals(preventNavigation('goodbye'), 2);
            assert.isTrue(isNavigationBlocked());
        }),
    );
    it(
        'deduplicates blocker ids',
        navigationTest(() => {
            assert.strictEquals(preventNavigation('hello'), 1);
            assert.strictEquals(preventNavigation('hello'), 1);
            assert.isTrue(isNavigationBlocked());
        }),
    );
    it(
        'window.onbeforeunload just returns an empty string',
        navigationTest(() => {
            assert.strictEquals(preventNavigation('hello'), 1);
            assert.strictEquals((window.onbeforeunload as () => '')(), '');
            assert.isTrue(isNavigationBlocked());
        }),
    );
});

describe(allowNavigation.name, () => {
    it(
        'works (but does nothing) if navigation is not blocked',
        navigationTest(() => {
            assert.strictEquals(allowNavigation('hello'), true);
            assert.isFalse(isNavigationBlocked());
        }),
    );
    it(
        'works with no inputs',
        navigationTest(() => {
            assert.strictEquals(preventNavigation(), 1);
            assert.isTrue(isNavigationBlocked());
            assert.strictEquals(allowNavigation(), true);
            assert.isFalse(isNavigationBlocked());
        }),
    );
    it(
        'unblocks a key',
        navigationTest(() => {
            assert.strictEquals(preventNavigation('hello'), 1);
            assert.isTrue(isNavigationBlocked());
            assert.strictEquals(allowNavigation('hello'), true);
            assert.isFalse(isNavigationBlocked());
        }),
    );
    it(
        'unblocks multiple keys',
        navigationTest(() => {
            assert.strictEquals(preventNavigation('hello', 'goodbye'), 2);
            assert.isTrue(isNavigationBlocked());
            assert.strictEquals(allowNavigation('hello', 'goodbye'), true);
            assert.isFalse(isNavigationBlocked());
        }),
    );
    it(
        'can be called multiple times',
        navigationTest(() => {
            assert.strictEquals(preventNavigation('hello', 'goodbye'), 2);
            assert.isTrue(isNavigationBlocked());
            assert.strictEquals(allowNavigation('hello'), false);
            assert.isTrue(isNavigationBlocked());
            assert.strictEquals(allowNavigation('goodbye'), true);
            assert.isFalse(isNavigationBlocked());
        }),
    );
});

describe(getNavigationBlockerIds.name, () => {
    it('returns an empty array if there are no blocker ids', () => {
        assert.deepEquals(getNavigationBlockerIds(), []);
    });
    it('returns added keys', () => {
        assert.strictEquals(preventNavigation('hello', 'goodbye'), 2);
        assert.deepEquals(getNavigationBlockerIds(), [
            'goodbye',
            'hello',
        ]);
    });
    it('ignores removed keys', () => {
        assert.strictEquals(preventNavigation('hello', 'goodbye'), 2);
        assert.strictEquals(allowNavigation('hello'), false);
        assert.deepEquals(getNavigationBlockerIds(), [
            'goodbye',
        ]);
    });
});
