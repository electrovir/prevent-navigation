import {randomString} from '@augment-vir/common';
import {css, defineElementNoInputs, html, listen} from 'element-vir';
import {CloseX24Icon, ViraIcon, noNativeSpacing} from 'vira';
import {
    allowNavigation,
    getNavigationBlockerIds,
    isNavigationBlocked,
    preventNavigation,
    resetAllNavigationBlockers,
} from '../../index';

export const VirApp = defineElementNoInputs({
    tagName: 'vir-app',
    styles: css`
        :host {
            padding: 64px;
            padding-top: 32px;
            display: flex;
            flex-direction: column;
            gap: 32px;
            box-sizing: border-box;
            font-family: sans-serif;
            font-size: 2em;
        }

        p,
        h1 {
            ${noNativeSpacing};
        }

        button {
            font: inherit;
            padding: 16px;
            display: inline-flex;
        }

        .blockers {
            display: flex;
            flex-wrap: wrap;
            max-width: 100%;
            gap: 24px;
        }

        .blocker {
            font-family: monospace;
            font-size: 1.2em;
            border: 2px solid #eee;
            padding-left: 16px;
            border-radius: 8px;
            display: flex;
            align-items: center;
        }

        ${ViraIcon} {
            padding: 16px;
            cursor: pointer;
        }
        ${ViraIcon}:hover {
            color: red;
        }
    `,
    stateInitStatic: {
        blockedIds: [] as string[],
    },
    renderCallback({state, updateState}) {
        const blockersTemplate = state.blockedIds.map((blockedId) => {
            return html`
                <div class="blocker">
                    ${blockedId}
                    <${ViraIcon.assign({
                        icon: CloseX24Icon,
                    })}
                        ${listen('click', () => {
                            allowNavigation(blockedId);
                            updateState({
                                blockedIds: getNavigationBlockerIds(),
                            });
                        })}
                    ></${ViraIcon}>
                </div>
            `;
        });

        return html`
            <h1>prevent-navigation demo</h1>
            <div>
                <button
                    ${listen('click', () => {
                        preventNavigation(randomString(4));
                        updateState({
                            blockedIds: getNavigationBlockerIds(),
                        });
                    })}
                >
                    Block navigation
                </button>
                <button
                    ${listen('click', () => {
                        resetAllNavigationBlockers();
                        updateState({
                            blockedIds: getNavigationBlockerIds(),
                        });
                    })}
                >
                    Reset all
                </button>
            </div>
            <div class="blockers">${blockersTemplate}</div>
            <p>Is navigation blocked?: ${isNavigationBlocked() ? 'yes' : 'no'}</p>
            <p>Try refreshing!</p>
        `;
    },
});
