// (() => { "use strict"; ({ 8224: function (i, e) { var n = this && this.__awaiter || function (i, e, n, o) { return new (n || (n = Promise))((function (t, s) { function r(i) { try { d(o.next(i)) } catch (i) { s(i) } } function c(i) { try { d(o.throw(i)) } catch (i) { s(i) } } function d(i) { var e; i.done ? t(i.value) : (e = i.value, e instanceof n ? e : new n((function (i) { i(e) }))).then(r, c) } d((o = o.apply(i, e || [])).next()) })) }; Object.defineProperty(e, "__esModule", { value: !0 }); const o = () => n(void 0, void 0, void 0, (function* () { return yield chrome.permissions.request({ origins: [ "<all_urls>" ], permissions: [ "webNavigation" ] }) })), t = () => n(void 0, void 0, void 0, (function* () { return yield chrome.permissions.contains({ origins: [ "<all_urls>" ], permissions: [ "webNavigation" ] }) })), s = () => n(void 0, void 0, void 0, (function* () { yield chrome.action.setBadgeText({ text: "!" }) })), r = () => n(void 0, void 0, void 0, (function* () { yield chrome.action.setBadgeText({ text: "" }) })); Object.assign(globalThis, { ecommerceConfig: () => n(void 0, void 0, void 0, (function* () { return yield new Promise((i => { i({ requestPermissions: o, permissionsEnabled: t, setPermissionsBadge: s, removePermissionsBadge: r }) })) })) }) } })[ 8224 ](0, {}) })();


(() => {
    "use strict";
    ({
        8224: function(i, e) {
            var n = this && this.__awaiter || function(i, e, n, o) {
                return new(n || (n = Promise))((function(t, s) {
                    function r(i) {
                        try {
                            d(o.next(i))
                        } catch (i) {
                            s(i)
                        }
                    }

                    function c(i) {
                        try {
                            d(o.throw(i))
                        } catch (i) {
                            s(i)
                        }
                    }

                    function d(i) {
                        var e;
                        i.done ? t(i.value) : (e = i.value, e instanceof n ? e : new n((function(i) {
                            i(e)
                        }))).then(r, c)
                    }
                    d((o = o.apply(i, e || [])).next())
                }))
            };
            Object.defineProperty(e, "__esModule", {
                value: !0
            });
            const o = () => n(void 0, void 0, void 0, (function*() {
                    return yield chrome.permissions.request({
                        origins: ["<all_urls>"],
                        permissions: ["webNavigation"]
                    })
                })),
                t = () => n(void 0, void 0, void 0, (function*() {
                    return yield chrome.permissions.contains({
                        origins: ["<all_urls>"],
                        permissions: ["webNavigation"]
                    })
                })),
                s = () => n(void 0, void 0, void 0, (function*() {
                    yield chrome.action.setBadgeText({
                        text: "!"
                    })
                })),
                r = () => n(void 0, void 0, void 0, (function*() {
                    yield chrome.action.setBadgeText({
                        text: ""
                    })
                }));
            Object.assign(globalThis, {
                ecommerceConfig: () => n(void 0, void 0, void 0, (function*() {
                    return yield new Promise((i => {
                        i({
                            requestPermissions: o,
                            permissionsEnabled: t,
                            setPermissionsBadge: s,
                            removePermissionsBadge: r
                        })
                    }))
                }))
            })
        }
    })[8224](0, {})
})();