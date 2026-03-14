export const track = (event, params = {}) => {
    if (typeof gtag !== "function") return;
    gtag("event", event, params);
};
