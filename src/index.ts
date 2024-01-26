/** Keep track of what has prevented navigation. */
const currentBlockerIds = new Set<string>();

/**
 * Prevent navigating away from a page. This is useful in situations where, for example, a user is
 * typing in info that they wouldn't want to lose what they typed by accidentally closing or
 * refreshing the current page.
 *
 * Make sure to call `unblockNavigation` after the user has finished making edits so they can
 * navigate again.
 *
 * Note that this does not block _router_ navigation for single page applications. Meaning, the URL
 * of the page can still change and this can't block that. For those cases, you should stick a
 * `isNavigationBlocked` check in your router.
 *
 * @returns The number of blockerIds currently blocking navigation.
 */
export function preventNavigation(
    /**
     * Unique identifiers for the processes or elements or parts of the code that are blocking
     * navigation. Use the same blocker ids to later unblock navigation with `unblockNavigation`.
     */
    ...blockerIds: ReadonlyArray<string>
): number {
    const atLeastEmptyStringBlockerIds = blockerIds.length ? blockerIds : [''];

    atLeastEmptyStringBlockerIds.forEach((blockerId) => {
        currentBlockerIds.add(blockerId);
        createOnBeforeUnload();
    });

    return currentBlockerIds.size;
}

/**
 * Remove the given ids from the set of ids that are blocking navigation. If there are no more ids
 * blocking navigation, then navigation is enabled again.
 *
 * @returns Whether navigation is fully allowed or not (`true` if it is allowed, `false` if it is
 *   still blocked by other blocker ids.)
 */
export function allowNavigation(
    /**
     * Unique identifiers for the processes or elements or parts of the code that have already
     * blocked navigation.
     */
    ...blockerIds: ReadonlyArray<string>
): boolean {
    const atLeastEmptyStringBlockerIds = blockerIds.length ? blockerIds : [''];

    atLeastEmptyStringBlockerIds.forEach((blockerId) => {
        currentBlockerIds.delete(blockerId);
    });

    return !isNavigationBlocked();
}

/**
 * Prefer using `unblockNavigation` if possible. Using this is potential dangerous for your users,
 * as it may allow page navigation that resets data they've input.
 *
 * Remove all navigation blockers, which completely frees up navigation.
 */
export function resetAllNavigationBlockers(): void {
    currentBlockerIds.clear();
}

function createOnBeforeUnload() {
    if (!window.onbeforeunload) {
        window.onbeforeunload = () => {
            return '';
        };
    }
}

function clearOnBeforeUnload() {
    if (window.onbeforeunload) {
        window.onbeforeunload = null;
    }
}

/** @returns The ids that are currently blocking navigation. */
export function getNavigationBlockerIds(): string[] {
    return Array.from(currentBlockerIds.values()).sort();
}

/**
 * Determine whether navigation is allowed or not based on how many blocker ids have been set with
 * `preventNavigation`.
 *
 * Use `getCurrentNavigationBlockers` to list all the ids that are currently blocking navigation.
 *
 * @returns `true` if navigation is allowed, `false` if it is not.
 */
export function isNavigationBlocked(): boolean {
    if (currentBlockerIds.size) {
        createOnBeforeUnload();
    } else {
        clearOnBeforeUnload();
    }

    return !!window.onbeforeunload;
}
