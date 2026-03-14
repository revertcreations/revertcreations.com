import { SOURCE_OVERRIDE_EVENT, SOURCE_UNLOCK_EVENT } from './stateSignals';

const STATE_CHANGED_EVENT = 'sourceviewer:state-changed';

export class SourceStateManager {
    constructor(config = {}) {
        this.config = config;
        this.statesMeta = config.states || {};
        this.defaultState = config.defaultState || Object.keys(this.statesMeta)[0] || null;
        this.unlockedStates = new Set();
        this.overrideState = null;
        this.stateChangedDetail = null;

        if (this.defaultState) {
            this.unlockedStates.add(this.defaultState);
        }

        this.handleUnlock = this.handleUnlock.bind(this);
        this.handleOverride = this.handleOverride.bind(this);

        if (typeof window !== 'undefined') {
            window.addEventListener(SOURCE_UNLOCK_EVENT, this.handleUnlock);
            window.addEventListener(SOURCE_OVERRIDE_EVENT, this.handleOverride);
        }

        this.dispatchStateChanged();
    }

    destroy() {
        if (typeof window === 'undefined') return;
        window.removeEventListener(SOURCE_UNLOCK_EVENT, this.handleUnlock);
        window.removeEventListener(SOURCE_OVERRIDE_EVENT, this.handleOverride);
    }

    getStateOrder(state) {
        const meta = this.statesMeta[state] || {};
        if (typeof meta.order === 'number') {
            return meta.order;
        }
        return Number.MAX_SAFE_INTEGER;
    }

    getHighestUnlockedState() {
        if (!this.unlockedStates.size) {
            return this.defaultState;
        }
        return Array.from(this.unlockedStates).sort((a, b) => this.getStateOrder(a) - this.getStateOrder(b)).pop();
    }

    getActiveState() {
        return this.overrideState || this.getHighestUnlockedState();
    }

    handleUnlock(event) {
        const { state } = event.detail || {};
        if (!state || !this.statesMeta[state]) {
            return;
        }
        if (this.unlockedStates.has(state)) {
            return;
        }
        this.unlockedStates.add(state);
        this.dispatchStateChanged();
    }

    handleOverride(event) {
        const { state } = event.detail || {};
        const nextState = state && this.statesMeta[state] ? state : null;
        if (this.overrideState === nextState) {
            return;
        }
        this.overrideState = nextState;
        this.dispatchStateChanged();
    }

    dispatchStateChanged() {
        if (typeof window === 'undefined') return;
        const detail = {
            state: this.getActiveState(),
            unlocked: Array.from(this.unlockedStates),
            override: this.overrideState,
        };

        this.stateChangedDetail = detail;

        window.dispatchEvent(
            new CustomEvent(STATE_CHANGED_EVENT, {
                detail,
            }),
        );
    }
}

export { STATE_CHANGED_EVENT };
