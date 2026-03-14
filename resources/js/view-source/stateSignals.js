const SOURCE_UNLOCK_EVENT = "sourceviewer:unlock";
const SOURCE_OVERRIDE_EVENT = "sourceviewer:override";

const dispatch = (type, detail = {}) => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
        new CustomEvent(type, {
            detail,
        }),
    );
};

export const notifySourceUnlock = (state, meta = {}) => {
    if (!state) return;
    dispatch(SOURCE_UNLOCK_EVENT, { state, meta });
};

export const notifySourceOverride = (state, meta = {}) => {
    dispatch(SOURCE_OVERRIDE_EVENT, { state, meta });
};

export { SOURCE_OVERRIDE_EVENT, SOURCE_UNLOCK_EVENT };
