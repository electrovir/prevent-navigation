import {assert} from '@open-wc/testing';
import {
    allowNavigation,
    getNavigationBlockerIds,
    isNavigationBlocked,
    preventNavigation,
    resetAllNavigationBlockers,
} from './index';

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
            assert.strictEqual(preventNavigation('hello'), 1);
            assert.isTrue(isNavigationBlocked());
        }),
    );
    it(
        'works with no inputs',
        navigationTest(() => {
            assert.strictEqual(preventNavigation(), 1);
            assert.isTrue(isNavigationBlocked());
        }),
    );
    it(
        'blocks multiple inputs',
        navigationTest(() => {
            assert.strictEqual(preventNavigation('hello', 'goodbye'), 2);
            assert.isTrue(isNavigationBlocked());
        }),
    );
    it(
        'can be called multiple times',
        navigationTest(() => {
            assert.strictEqual(preventNavigation('hello'), 1);
            assert.strictEqual(preventNavigation('goodbye'), 2);
            assert.isTrue(isNavigationBlocked());
        }),
    );
    it(
        'deduplicates blocker ids',
        navigationTest(() => {
            assert.strictEqual(preventNavigation('hello'), 1);
            assert.strictEqual(preventNavigation('hello'), 1);
            assert.isTrue(isNavigationBlocked());
        }),
    );
    it(
        'window.onbeforeunload just returns an empty string',
        navigationTest(() => {
            assert.strictEqual(preventNavigation('hello'), 1);
            assert.strictEqual((window.onbeforeunload as () => '')(), '');
            assert.isTrue(isNavigationBlocked());
        }),
    );
});

describe(allowNavigation.name, () => {
    it(
        'works (but does nothing) if navigation is not blocked',
        navigationTest(() => {
            assert.strictEqual(allowNavigation('hello'), true);
            assert.isFalse(isNavigationBlocked());
        }),
    );
    it(
        'works with no inputs',
        navigationTest(() => {
            assert.strictEqual(preventNavigation(), 1);
            assert.isTrue(isNavigationBlocked());
            assert.strictEqual(allowNavigation(), true);
            assert.isFalse(isNavigationBlocked());
        }),
    );
    it(
        'unblocks a key',
        navigationTest(() => {
            assert.strictEqual(preventNavigation('hello'), 1);
            assert.isTrue(isNavigationBlocked());
            assert.strictEqual(allowNavigation('hello'), true);
            assert.isFalse(isNavigationBlocked());
        }),
    );
    it(
        'unblocks multiple keys',
        navigationTest(() => {
            assert.strictEqual(preventNavigation('hello', 'goodbye'), 2);
            assert.isTrue(isNavigationBlocked());
            assert.strictEqual(allowNavigation('hello', 'goodbye'), true);
            assert.isFalse(isNavigationBlocked());
        }),
    );
    it(
        'can be called multiple times',
        navigationTest(() => {
            assert.strictEqual(preventNavigation('hello', 'goodbye'), 2);
            assert.isTrue(isNavigationBlocked());
            assert.strictEqual(allowNavigation('hello'), false);
            assert.isTrue(isNavigationBlocked());
            assert.strictEqual(allowNavigation('goodbye'), true);
            assert.isFalse(isNavigationBlocked());
        }),
    );
});

describe(getNavigationBlockerIds.name, () => {
    it('returns an empty array if there are no blocker ids', () => {
        assert.deepStrictEqual(getNavigationBlockerIds(), []);
    });
    it('returns added keys', () => {
        assert.strictEqual(preventNavigation('hello', 'goodbye'), 2);
        assert.deepStrictEqual(getNavigationBlockerIds(), [
            'goodbye',
            'hello',
        ]);
    });
    it('ignores removed keys', () => {
        assert.strictEqual(preventNavigation('hello', 'goodbye'), 2);
        assert.strictEqual(allowNavigation('hello'), false);
        assert.deepStrictEqual(getNavigationBlockerIds(), [
            'goodbye',
        ]);
    });
});
