/*! For license information please see main.js.LICENSE.txt */
(() => {
    var e = {
            245: e => {
                e.exports = function(e) {
                    ! function(e) {
                        if (!e) throw new Error("Eventify cannot use falsy object as events subject");
                        for (var t = ["on", "fire", "off"], n = 0; n < t.length; ++n)
                            if (e.hasOwnProperty(t[n])) throw new Error("Subject cannot be eventified, since it already has property '" + t[n] + "'")
                    }(e);
                    var t = function(e) {
                        var t = Object.create(null);
                        return {
                            on: function(n, r, o) { if ("function" != typeof r) throw new Error("callback is expected to be a function"); var i = t[n]; return i || (i = t[n] = []), i.push({ callback: r, ctx: o }), e },
                            off: function(n, r) {
                                if (void 0 === n) return t = Object.create(null), e;
                                if (t[n])
                                    if ("function" != typeof r) delete t[n];
                                    else
                                        for (var o = t[n], i = 0; i < o.length; ++i) o[i].callback === r && o.splice(i, 1);
                                return e
                            },
                            fire: function(n) {
                                var r, o = t[n];
                                if (!o) return e;
                                arguments.length > 1 && (r = Array.prototype.splice.call(arguments, 1));
                                for (var i = 0; i < o.length; ++i) {
                                    var a = o[i];
                                    a.callback.apply(a.ctx, r)
                                }
                                return e
                            }
                        }
                    }(e);
                    return e.on = t.on, e.off = t.off, e.fire = t.fire, e
                }
            },
            736: (e, t, n) => {
                e.exports = function(e) {
                    if ("uniqueLinkId" in (e = e || {}) && (console.warn("ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\nUse `multigraph` option instead\n", "\n", "Note: there is also change in default behavior: From now on each graph\nis considered to be not a multigraph by default (each edge is unique)."), e.multigraph = e.uniqueLinkId), void 0 === e.multigraph && (e.multigraph = !1), "function" != typeof Map) throw new Error("ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph");
                    var t, n = new Map,
                        u = [],
                        f = {},
                        l = 0,
                        d = e.multigraph ? function(e, t, n) {
                            var r = c(e, t),
                                o = f.hasOwnProperty(r);
                            if (o || _(e, t)) {
                                o || (f[r] = 0);
                                var i = "@" + ++f[r];
                                r = c(e + i, t + i)
                            }
                            return new s(e, t, n, r)
                        } : function(e, t, n) { return new s(e, t, n, c(e, t)) },
                        h = [],
                        p = A,
                        m = A,
                        v = A,
                        g = A,
                        y = {
                            addNode: x,
                            addLink: function(e, t, n) {
                                v();
                                var r = E(e) || x(e),
                                    o = E(t) || x(t),
                                    i = d(e, t, n);
                                return u.push(i), a(r, i), e !== t && a(o, i), p(i, "add"), g(), i
                            },
                            removeLink: N,
                            removeNode: I,
                            getNode: E,
                            getNodeCount: T,
                            getLinkCount: S,
                            getLinksCount: S,
                            getNodesCount: T,
                            getLinks: function(e) { var t = E(e); return t ? t.links : null },
                            forEachNode: L,
                            forEachLinkedNode: function(e, t, r) {
                                var o = E(e);
                                if (o && o.links && "function" == typeof t) return r ? function(e, t, r) { for (var o = 0; o < e.length; ++o) { var i = e[o]; if (i.fromId === t && r(n.get(i.toId), i)) return !0 } }(o.links, e, t) : function(e, t, r) {
                                    for (var o = 0; o < e.length; ++o) {
                                        var i = e[o],
                                            a = i.fromId === t ? i.toId : i.fromId;
                                        if (r(n.get(a), i)) return !0
                                    }
                                }(o.links, e, t)
                            },
                            forEachLink: function(e) {
                                var t, n;
                                if ("function" == typeof e)
                                    for (t = 0, n = u.length; t < n; ++t) e(u[t])
                            },
                            beginUpdate: v,
                            endUpdate: g,
                            clear: function() { v(), L((function(e) { I(e.id) })), g() },
                            hasLink: _,
                            hasNode: E,
                            getLink: _
                        };
                    return r(y), t = y.on, y.on = function() { return y.beginUpdate = v = P, y.endUpdate = g = C, p = w, m = b, y.on = t, t.apply(y, arguments) }, y;

                    function w(e, t) { h.push({ link: e, changeType: t }) }

                    function b(e, t) { h.push({ node: e, changeType: t }) }

                    function x(e, t) {
                        if (void 0 === e) throw new Error("Invalid node identifier");
                        v();
                        var r = E(e);
                        return r ? (r.data = t, m(r, "update")) : (r = new i(e, t), m(r, "add")), n.set(e, r), g(), r
                    }

                    function E(e) { return n.get(e) }

                    function I(e) {
                        var t = E(e);
                        if (!t) return !1;
                        v();
                        var r = t.links;
                        if (r) { t.links = null; for (var o = 0; o < r.length; ++o) N(r[o]) }
                        return n.delete(e), m(t, "remove"), g(), !0
                    }

                    function T() { return n.size }

                    function S() { return u.length }

                    function N(e) {
                        if (!e) return !1;
                        var t = o(e, u);
                        if (t < 0) return !1;
                        v(), u.splice(t, 1);
                        var n = E(e.fromId),
                            r = E(e.toId);
                        return n && (t = o(e, n.links)) >= 0 && n.links.splice(t, 1), r && (t = o(e, r.links)) >= 0 && r.links.splice(t, 1), p(e, "remove"), g(), !0
                    }

                    function _(e, t) { var n, r = E(e); if (!r || !r.links) return null; for (n = 0; n < r.links.length; ++n) { var o = r.links[n]; if (o.fromId === e && o.toId === t) return o } return null }

                    function A() {}

                    function P() { l += 1 }

                    function C() { 0 == (l -= 1) && h.length > 0 && (y.fire("changed", h), h.length = 0) }

                    function L(e) {
                        if ("function" != typeof e) throw new Error("Function is expected to iterate over graph nodes. You passed " + e);
                        for (var t = n.values(), r = t.next(); !r.done;) {
                            if (e(r.value)) return !0;
                            r = t.next()
                        }
                    }
                };
                var r = n(245);

                function o(e, t) {
                    if (!t) return -1;
                    if (t.indexOf) return t.indexOf(e);
                    var n, r = t.length;
                    for (n = 0; n < r; n += 1)
                        if (t[n] === e) return n;
                    return -1
                }

                function i(e, t) { this.id = e, this.links = null, this.data = t }

                function a(e, t) { e.links ? e.links.push(t) : e.links = [t] }

                function s(e, t, n, r) { this.fromId = e, this.toId = t, this.data = n, this.id = r }

                function c(e, t) { return e.toString() + "👉 " + t.toString() }
            },
            39: e => {
                function t(e, o) {
                    if (!(this instanceof t)) return new t(e, o);
                    if (Array.isArray(e) || (o = e, e = []), o = o || {}, this.data = e || [], this.length = this.data.length, this.compare = o.compare || r, this.setNodeId = o.setNodeId || n, this.length > 0)
                        for (var i = this.length >> 1; i >= 0; i--) this._down(i);
                    if (o.setNodeId)
                        for (i = 0; i < this.length; ++i) this.setNodeId(this.data[i], i)
                }

                function n() {}

                function r(e, t) { return e - t }
                e.exports = t, t.prototype = {
                    push: function(e) { this.data.push(e), this.setNodeId(e, this.length), this.length++, this._up(this.length - 1) },
                    pop: function() { if (0 !== this.length) { var e = this.data[0]; return this.length--, this.length > 0 && (this.data[0] = this.data[this.length], this.setNodeId(this.data[0], 0), this._down(0)), this.data.pop(), e } },
                    peek: function() { return this.data[0] },
                    updateItem: function(e) { this._down(e), this._up(e) },
                    _up: function(e) {
                        for (var t = this.data, n = this.compare, r = this.setNodeId, o = t[e]; e > 0;) {
                            var i = e - 1 >> 1,
                                a = t[i];
                            if (n(o, a) >= 0) break;
                            t[e] = a, r(a, e), e = i
                        }
                        t[e] = o, r(o, e)
                    },
                    _down: function(e) {
                        for (var t = this.data, n = this.compare, r = this.length >> 1, o = t[e], i = this.setNodeId; e < r;) {
                            var a = 1 + (e << 1),
                                s = a + 1,
                                c = t[a];
                            if (s < this.length && n(t[s], c) < 0 && (a = s, c = t[s]), n(c, o) >= 0) break;
                            t[e] = c, i(c, e), e = a
                        }
                        t[e] = o, i(o, e)
                    }
                }
            },
            394: (e, t, n) => {
                e.exports = function(e, t) {
                    var n = (t = t || {}).oriented,
                        i = t.heuristic;
                    i || (i = a.heuristic);
                    var c = t.distance;
                    c || (c = a.distance);
                    var u = o();
                    return {
                        find: function(t, o) {
                            var f = e.getNode(t);
                            if (!f) throw new Error("fromId is not defined in this graph: " + t);
                            var l = e.getNode(o);
                            if (!l) throw new Error("toId is not defined in this graph: " + o);
                            if (f === l) return [f];
                            u.reset();
                            var d = n ? function(e, t) { if (1 === E) { if (t.fromId === I.node.id) return S(e, t, I) } else if (2 === E && t.toId === I.node.id) return S(e, t, I) } : function(e, t) { return S(e, t, I) },
                                h = new Map,
                                p = new r({ compare: a.compareFScore, setNodeId: a.setHeapIndex }),
                                m = new r({ compare: a.compareFScore, setNodeId: a.setHeapIndex }),
                                v = u.createNewState(f);
                            h.set(t, v), v.fScore = i(f, l), v.distanceToSource = 0, p.push(v), v.open = 1;
                            var g = u.createNewState(l);
                            g.fScore = i(l, f), g.distanceToSource = 0, m.push(g), g.open = 2;
                            for (var y, w, b = Number.POSITIVE_INFINITY, x = p, E = 1; p.length > 0 && m.length > 0;) { p.length < m.length ? (E = 1, x = p) : (E = 2, x = m); var I = x.pop(); if (I.closed = !0, !(I.distanceToSource > b) && (e.forEachLinkedNode(I.node.id, d), y && w)) return T(y, w) }
                            return s;

                            function T(e, t) { for (var n = [], r = e; r;) n.push(r.node), r = r.parent; for (var o = t; o;) n.unshift(o.node), o = o.parent; return n }

                            function S(e, t, n) {
                                var r, o = h.get(e.id);
                                if (o || (o = u.createNewState(e), h.set(e.id, o)), !o.closed)
                                    if ((r = o.open) && r !== E) {
                                        var a = o.distanceToSource + n.distanceToSource;
                                        a < b && (y = o, w = n, b = a)
                                    } else {
                                        var s = n.distanceToSource + c(o.node, n.node, t);
                                        if (!(s >= o.distanceToSource)) {
                                            var d = 1 === E ? l : f,
                                                p = s + i(o.node, d);
                                            p >= b || (o.fScore = p, 0 === o.open && (x.push(o), x.updateItem(o.heapIndex), o.open = E), o.parent = n, o.distanceToSource = s)
                                        }
                                    }
                            }
                        }
                    }
                };
                var r = n(39),
                    o = n(492),
                    i = n(276),
                    a = n(100),
                    s = a.NO_PATH;
                e.exports.l2 = i.l2, e.exports.l1 = i.l1
            },
            5: (e, t, n) => {
                e.exports = function(e, t) {
                    var n = (t = t || {}).oriented,
                        i = t.heuristic;
                    i || (i = a.heuristic);
                    var u = t.distance;
                    u || (u = a.distance);
                    var f = o();
                    return {
                        find: function(t, o) {
                            var l = e.getNode(t);
                            if (!l) throw new Error("fromId is not defined in this graph: " + t);
                            var d = e.getNode(o);
                            if (!d) throw new Error("toId is not defined in this graph: " + o);
                            f.reset();
                            var h, p, m, v = new Map,
                                g = new r({ compare: a.compareFScore, setNodeId: a.setHeapIndex }),
                                y = f.createNewState(l);
                            for (v.set(t, y), y.fScore = i(l, d), y.distanceToSource = 0, g.push(y), y.open = 1; g.length > 0;) {
                                if (p = h = g.pop(), m = d, p.node === m) return c(h);
                                h.closed = !0, e.forEachLinkedNode(h.node.id, w, n)
                            }
                            return s;

                            function w(e, t) {
                                var n = v.get(e.id);
                                if (n || (n = f.createNewState(e), v.set(e.id, n)), !n.closed) {
                                    0 === n.open && (g.push(n), n.open = 1);
                                    var r = h.distanceToSource + u(e, h.node, t);
                                    r >= n.distanceToSource || (n.parent = h, n.distanceToSource = r, n.fScore = r + i(n.node, d), g.updateItem(n.heapIndex))
                                }
                            }
                        }
                    }
                };
                var r = n(39),
                    o = n(492),
                    i = n(276),
                    a = n(100),
                    s = a.NO_PATH;

                function c(e) { for (var t = [e.node], n = e.parent; n;) t.push(n.node), n = n.parent; return t }
                e.exports.l2 = i.l2, e.exports.l1 = i.l1
            },
            100: e => { var t = []; "function" == typeof Object.freeze && Object.freeze(t), e.exports = { heuristic: function() { return 0 }, distance: function() { return 1 }, compareFScore: function(e, t) { return e.fScore - t.fScore }, NO_PATH: t, setHeapIndex: function(e, t) { e.heapIndex = t }, setH1: function(e, t) { e.h1 = t }, setH2: function(e, t) { e.h2 = t }, compareF1Score: function(e, t) { return e.f1 - t.f1 }, compareF2Score: function(e, t) { return e.f2 - t.f2 } } },
            276: e => {
                e.exports = {
                    l2: function(e, t) {
                        var n = e.x - t.x,
                            r = e.y - t.y;
                        return Math.sqrt(n * n + r * r)
                    },
                    l1: function(e, t) {
                        var n = e.x - t.x,
                            r = e.y - t.y;
                        return Math.abs(n) + Math.abs(r)
                    }
                }
            },
            492: e => {
                function t(e) { this.node = e, this.parent = null, this.closed = !1, this.open = 0, this.distanceToSource = Number.POSITIVE_INFINITY, this.fScore = Number.POSITIVE_INFINITY, this.heapIndex = -1 }
                e.exports = function() {
                    var e = 0,
                        n = [];
                    return { createNewState: function(r) { var o = n[e]; return o ? (o.node = r, o.parent = null, o.closed = !1, o.open = 0, o.distanceToSource = Number.POSITIVE_INFINITY, o.fScore = Number.POSITIVE_INFINITY, o.heapIndex = -1) : (o = new t(r), n[e] = o), e++, o }, reset: function() { e = 0 } }
                }
            },
            238: (e, t, n) => {
                e.exports = function(e, t) {
                    var n = (t = t || {}).oriented,
                        o = t.quitFast,
                        c = t.heuristic;
                    c || (c = i.heuristic);
                    var u = t.distance;
                    u || (u = i.distance);
                    var f = a();
                    return {
                        find: function(t, a) {
                            var l = e.getNode(t);
                            if (!l) throw new Error("fromId is not defined in this graph: " + t);
                            var d = e.getNode(a);
                            if (!d) throw new Error("toId is not defined in this graph: " + a);
                            f.reset();
                            var h, p = n ? function(e, t) { if (t.fromId === I.node.id) return S(e, t) } : S,
                                m = n ? function(e, t) { if (t.toId === I.node.id) return N(e, t) } : N,
                                v = new Map,
                                g = new r({ compare: i.compareF1Score, setNodeId: i.setH1 }),
                                y = new r({ compare: i.compareF2Score, setNodeId: i.setH2 }),
                                w = Number.POSITIVE_INFINITY,
                                b = f.createNewState(l);
                            v.set(t, b), b.g1 = 0;
                            var x = c(l, d);
                            b.f1 = x, g.push(b);
                            var E = f.createNewState(d);
                            v.set(a, E), E.g2 = 0;
                            var I, T = x;
                            for (E.f2 = T, y.push(E); y.length && g.length && (g.length < y.length ? (I = g.pop()).closed || (I.closed = !0, I.f1 < w && I.g1 + T - c(l, I.node) < w && e.forEachLinkedNode(I.node.id, p), g.length > 0 && (x = g.peek().f1)) : (I = y.pop()).closed || (I.closed = !0, I.f2 < w && I.g2 + x - c(I.node, d) < w && e.forEachLinkedNode(I.node.id, m), y.length > 0 && (T = y.peek().f2)), !o || !h););
                            return function(e) { if (!e) return s; for (var t = [e.node], n = e.p1; n;) t.push(n.node), n = n.p1; for (var r = e.p2; r;) t.unshift(r.node), r = r.p2; return t }(h);

                            function S(e, t) {
                                var n = v.get(e.id);
                                if (n || (n = f.createNewState(e), v.set(e.id, n)), !n.closed) {
                                    var r = I.g1 + u(I.node, e, t);
                                    r < n.g1 && (n.g1 = r, n.f1 = r + c(n.node, d), n.p1 = I, n.h1 < 0 ? g.push(n) : g.updateItem(n.h1));
                                    var o = n.g1 + n.g2;
                                    o < w && (w = o, h = n)
                                }
                            }

                            function N(e, t) {
                                var n = v.get(e.id);
                                if (n || (n = f.createNewState(e), v.set(e.id, n)), !n.closed) {
                                    var r = I.g2 + u(I.node, e, t);
                                    r < n.g2 && (n.g2 = r, n.f2 = r + c(l, n.node), n.p2 = I, n.h2 < 0 ? y.push(n) : y.updateItem(n.h2));
                                    var o = n.g1 + n.g2;
                                    o < w && (w = o, h = n)
                                }
                            }
                        }
                    }
                };
                var r = n(39),
                    o = n(276),
                    i = n(100),
                    a = n(653),
                    s = i.NO_PATH;
                e.exports.l2 = o.l2, e.exports.l1 = o.l1
            },
            653: e => {
                function t(e) { this.node = e, this.p1 = null, this.p2 = null, this.closed = !1, this.g1 = Number.POSITIVE_INFINITY, this.g2 = Number.POSITIVE_INFINITY, this.f1 = Number.POSITIVE_INFINITY, this.f2 = Number.POSITIVE_INFINITY, this.h1 = -1, this.h2 = -1 }
                e.exports = function() {
                    var e = 0,
                        n = [];
                    return { createNewState: function(r) { var o = n[e]; return o ? (o.node = r, o.p1 = null, o.p2 = null, o.closed = !1, o.g1 = Number.POSITIVE_INFINITY, o.g2 = Number.POSITIVE_INFINITY, o.f1 = Number.POSITIVE_INFINITY, o.f2 = Number.POSITIVE_INFINITY, o.h1 = -1, o.h2 = -1) : (o = new t(r), n[e] = o), e++, o }, reset: function() { e = 0 } }
                }
            },
            901: (e, t, n) => { e.exports = { aStar: n(5), aGreedy: n(394), nba: n(238) } },
            959: e => {
                e.exports = function(e, t, n, r) {
                    var o = 0,
                        i = 0,
                        a = (r = r || {}).step || 1,
                        s = r.maxTimeMS || 8,
                        c = r.probeElements || 5e3;
                    setTimeout((function r() {
                        var u = Math.min(e.length, o + c),
                            f = o,
                            l = new Date;
                        for (f = o; f < u; f += a) t(e[f], f, e);
                        f < e.length ? (i += new Date - l, o = f, c = Math.round(o * s / i), setTimeout(r, 0)) : n(e)
                    }), 0)
                }
            },
            964: (e, t, n) => {
                "use strict";
                n.r(t), n.d(t, { scene: () => z, PointCollection: () => Q, Point: () => ee, LineCollection: () => ae, WireCollection: () => ce, LineStripCollection: () => fe, Element: () => U, isWebGLEnabled: () => le, utils: () => V });
                var r, o, i, a = u,
                    s = u,
                    c = "";

                function u(e, t, n) { f(e, i, t, n), "DOMMouseScroll" == i && f(e, "MozMousePixelScroll", t, n) }

                function f(e, t, n, o) { e[r](c + t, "wheel" == i ? n : function(e) {!e && (e = window.event); var t = { originalEvent: e, target: e.target || e.srcElement, type: "wheel", deltaMode: "MozMousePixelScroll" == e.type ? 0 : 1, deltaX: 0, deltaY: 0, deltaZ: 0, clientX: e.clientX, clientY: e.clientY, preventDefault: function() { e.preventDefault ? e.preventDefault() : e.returnValue = !1 }, stopPropagation: function() { e.stopPropagation && e.stopPropagation() }, stopImmediatePropagation: function() { e.stopImmediatePropagation && e.stopImmediatePropagation() } }; return "mousewheel" == i ? (t.deltaY = -1 / 40 * e.wheelDelta, e.wheelDeltaX && (t.deltaX = -1 / 40 * e.wheelDeltaX)) : t.deltaY = e.detail, n(t) }, o || !1) }

                function l(e, t, n, r) { e[o](c + t, n, r || !1) }! function(e, t) { e && e.addEventListener ? (r = "addEventListener", o = "removeEventListener") : (r = "attachEvent", o = "detachEvent", c = "on"), i = t ? "onwheel" in t.createElement("div") ? "wheel" : void 0 !== t.onmousewheel ? "mousewheel" : "DOMMouseScroll" : "wheel" }("undefined" != typeof window && window, "undefined" != typeof document && document), a.addWheelListener = s, a.removeWheelListener = function(e, t, n) { l(e, i, t, n), "DOMMouseScroll" == i && l(e, "MozMousePixelScroll", t, n) };
                var d = .1,
                    h = "function" == typeof Float32Array;

                function p(e, t) { return 1 - 3 * t + 3 * e }

                function m(e, t) { return 3 * t - 6 * e }

                function v(e) { return 3 * e }

                function g(e, t, n) { return ((p(t, n) * e + m(t, n)) * e + v(t)) * e }

                function y(e, t, n) { return 3 * p(t, n) * e * e + 2 * m(t, n) * e + v(t) }

                function w(e) { return e }
                var b = function(e, t, n, r) {
                        if (!(0 <= e && e <= 1 && 0 <= n && n <= 1)) throw new Error("bezier x values must be in [0, 1] range");
                        if (e === t && n === r) return w;
                        for (var o = h ? new Float32Array(11) : new Array(11), i = 0; i < 11; ++i) o[i] = g(i * d, e, n);
                        return function(i) {
                            return 0 === i ? 0 : 1 === i ? 1 : g(function(t) {
                                for (var r = 0, i = 1; 10 !== i && o[i] <= t; ++i) r += d;
                                --i;
                                var a = r + (t - o[i]) / (o[i + 1] - o[i]) * d,
                                    s = y(a, e, n);
                                return s >= .001 ? function(e, t, n, r) {
                                    for (var o = 0; o < 4; ++o) {
                                        var i = y(t, n, r);
                                        if (0 === i) return t;
                                        t -= (g(t, n, r) - e) / i
                                    }
                                    return t
                                }(t, a, e, n) : 0 === s ? a : function(e, t, n, r, o) {
                                    var i, a, s = 0;
                                    do {
                                        (i = g(a = t + (n - t) / 2, r, o) - e) > 0 ? n = a : t = a
                                    } while (Math.abs(i) > 1e-7 && ++s < 10);
                                    return a
                                }(t, r, r + d, e, n)
                            }(i), t, r)
                        }
                    },
                    x = { ease: b(.25, .1, .25, 1), easeIn: b(.42, 0, 1, 1), easeOut: b(0, 0, .58, 1), easeInOut: b(.42, 0, .58, 1), linear: b(0, 0, 1, 1) },
                    E = function(e, t, n) {
                        var r = Object.create(null),
                            o = Object.create(null),
                            i = "function" == typeof(n = n || {}).easing ? n.easing : x[n.easing];
                        i || (n.easing && console.warn("Unknown easing function in amator: " + n.easing), i = x.ease);
                        var a = "function" == typeof n.step ? n.step : S,
                            s = "function" == typeof n.done ? n.done : S,
                            c = function(e) { if (!e) return "undefined" != typeof window && window.requestAnimationFrame ? { next: window.requestAnimationFrame.bind(window), cancel: window.cancelAnimationFrame.bind(window) } : { next: function(e) { return setTimeout(e, 1e3 / 60) }, cancel: function(e) { return clearTimeout(e) } }; if ("function" != typeof e.next) throw new Error("Scheduler is supposed to have next(cb) function"); if ("function" != typeof e.cancel) throw new Error("Scheduler is supposed to have cancel(handle) function"); return e }(n.scheduler),
                            u = Object.keys(t);
                        u.forEach((function(n) { r[n] = e[n], o[n] = t[n] - e[n] }));
                        var f, l = "number" == typeof n.duration ? n.duration : 400,
                            d = Math.max(1, .06 * l),
                            h = 0;
                        return f = c.next((function t() {
                            var n = i(h / d);
                            h += 1,
                                function(t) { u.forEach((function(n) { e[n] = o[n] * t + r[n] })) }(n), h <= d ? (f = c.next(t), a(e)) : (f = 0, setTimeout((function() { s(e) }), 0))
                        })), { cancel: function() { c.cancel(f), f = 0 } }
                    },
                    I = N,
                    T = N();

                function S() {}

                function N() {
                    var e = new Set,
                        t = new Set,
                        n = 0;
                    return { next: r, cancel: r, clearAll: function() { e.clear(), t.clear(), cancelAnimationFrame(n), n = 0 } };

                    function r(e) { t.add(e), n || (n = requestAnimationFrame(o)) }

                    function o() {
                        n = 0;
                        var r = t;
                        t = e, (e = r).forEach((function(e) { e() })), e.clear()
                    }
                }
                E.makeAggregateRaf = I, E.sharedScheduler = T;
                var _ = "function" != typeof Event;

                function A(e) { return e.stopPropagation(), !1 }
                var P, C, L, F = function() { this.x = 0, this.y = 0, this.scale = 1 },
                    k = { capture: function(e) { C = window.document.onselectstart, L = window.document.ondragstart, window.document.onselectstart = A, (P = e).ondragstart = A }, release: function() { window.document.onselectstart = C, P && (P.ondragstart = L) } },
                    R = function(e, t) {
                        var n = (t = t || {}).controller;
                        if (n || (e instanceof SVGElement && (n = function(e) {
                                if (!(e instanceof SVGElement)) throw new Error("svg element is required for svg.panzoom to work");
                                var t = e.ownerSVGElement;
                                if (!t) throw new Error("Do not apply panzoom to the root <svg> element. Use its child instead (e.g. <g></g>). As of March 2016 only FireFox supported transform on the root element");
                                return t.setAttribute("tabindex", 1), {
                                    getBBox: function() { var t = e.getBBox(); return { left: t.x, top: t.y, width: t.width, height: t.height } },
                                    getScreenCTM: function() { return t.getScreenCTM() },
                                    getOwner: function() { return t },
                                    applyTransform: function(t) { e.setAttribute("transform", "matrix(" + t.scale + " 0 0 " + t.scale + " " + t.x + " " + t.y + ")") },
                                    initTransform: function(n) {
                                        var r = e.getScreenCTM();
                                        n.x = r.e, n.y = r.f, n.scale = r.a, t.removeAttributeNS(null, "viewBox")
                                    }
                                }
                            }(e)), e instanceof HTMLElement && (n = function(e) { if (!(e instanceof HTMLElement)) throw new Error("svg element is required for svg.panzoom to work"); var t = e.parentElement; if (!t) throw new Error("Do not apply panzoom to the detached DOM element. "); return e.scrollTop = 0, t.setAttribute("tabindex", 1), { getBBox: function() { return { left: 0, top: 0, width: e.clientWidth, height: e.clientHeight } }, getOwner: function() { return t }, applyTransform: function(t) { e.style.transformOrigin = "0 0 0", e.style.transform = "matrix(" + t.scale + ", 0, 0, " + t.scale + ", " + t.x + ", " + t.y + ")" } } }(e))), !n) throw new Error("Cannot create panzoom for the current type of dom element");
                        var r = n.getOwner(),
                            o = { x: 0, y: 0 },
                            i = !1,
                            s = new F;
                        n.initTransform && n.initTransform(s);
                        var c, u = "boolean" == typeof t.realPinch && t.realPinch,
                            f = t.bounds,
                            l = "number" == typeof t.maxZoom ? t.maxZoom : Number.POSITIVE_INFINITY,
                            d = "number" == typeof t.minZoom ? t.minZoom : 0,
                            h = "number" == typeof t.boundsPadding ? t.boundsPadding : .05,
                            p = "number" == typeof t.zoomDoubleClickSpeed ? t.zoomDoubleClickSpeed : 1.75,
                            m = t.beforeWheel || O,
                            v = "number" == typeof t.zoomSpeed ? t.zoomSpeed : .065;
                        (function(e) { var t = typeof e; if ("undefined" !== t && "boolean" !== t && !(M(e.left) && M(e.top) && M(e.bottom) && M(e.right))) throw new Error("Bounds object is not valid. It can be: undefined, boolean (true|false) or an object {left, top, right, bottom}") })(f), t.autocenter && function() {
                            var e, t, o = 0,
                                i = 0,
                                a = D();
                            a ? (o = a.left, i = a.top, e = a.right - a.left, t = a.bottom - a.top) : (e = r.clientWidth, t = r.clientHeight);
                            var c = n.getBBox();
                            if (0 !== c.width && 0 !== c.height) {
                                var u = t / c.height,
                                    f = e / c.width,
                                    l = Math.min(f, u);
                                s.x = -(c.left + c.width / 2) * l + e / 2 + o, s.y = -(c.top + c.height / 2) * l + t / 2 + i, s.scale = l
                            }
                        }();
                        var g, y, w, b, x, I, T, S = 0,
                            N = !1,
                            A = !1;
                        return b = "smoothScroll" in t && !t.smoothScroll ? { start: O, stop: O, cancel: O } : function(e, t, n) {
                            "object" != typeof n && (n = {});
                            var r, o, i, a, s, c, u, f, l, d, h = "number" == typeof n.minVelocity ? n.minVelocity : 5,
                                p = "number" == typeof n.amplitude ? n.amplitude : .25;
                            return {
                                start: function() { r = e(), c = l = a = u = 0, o = new Date, window.clearInterval(i), window.cancelAnimationFrame(d), i = window.setInterval(m, 100) },
                                stop: function() {
                                    window.clearInterval(i), window.cancelAnimationFrame(d);
                                    var t = e();
                                    s = t.x, f = t.y, o = Date.now(), (a < -h || a > h) && (s += c = p * a), (u < -h || u > h) && (f += l = p * u), d = window.requestAnimationFrame(v)
                                },
                                cancel: function() { window.clearInterval(i), window.cancelAnimationFrame(d) }
                            };

                            function m() {
                                var t = Date.now(),
                                    n = t - o;
                                o = t;
                                var i = e(),
                                    s = i.x - r.x,
                                    c = i.y - r.y;
                                r = i;
                                var f = 1e3 / (1 + n);
                                a = .8 * s * f + .2 * a, u = .8 * c * f + .2 * u
                            }

                            function v() {
                                var e = Date.now() - o,
                                    n = !1,
                                    r = 0,
                                    i = 0;
                                c && ((r = -c * Math.exp(-e / 342)) > .5 || r < -.5 ? n = !0 : r = c = 0), l && ((i = -l * Math.exp(-e / 342)) > .5 || i < -.5 ? n = !0 : i = l = 0), n && (t(s + r, f + i), d = window.requestAnimationFrame(v))
                            }
                        }((function() { return { x: s.x, y: s.y } }), (function(e, t) { se(), C(e, t) }), t.smoothScroll), r.addEventListener("mousedown", K), r.addEventListener("dblclick", Z), r.addEventListener("touchstart", j), r.addEventListener("keydown", q), a.addWheelListener(r, ne), Y(), {
                            dispose: function() { a.removeWheelListener(r, ne), r.removeEventListener("mousedown", K), r.removeEventListener("keydown", q), r.removeEventListener("dblclick", Z), c && (window.cancelAnimationFrame(c), c = 0), b.cancel(), ee(), te(), fe() },
                            moveBy: V,
                            moveTo: C,
                            centerOn: function(e) {
                                var t = e.ownerSVGElement;
                                if (!t) throw new Error("ui element is required to be within the scene");
                                var n = e.getBoundingClientRect(),
                                    r = n.left + n.width / 2,
                                    o = n.top + n.height / 2,
                                    i = t.getBoundingClientRect();
                                V(i.width / 2 - r, i.height / 2 - o, !0)
                            },
                            zoomTo: ae,
                            zoomAbs: z,
                            getTransform: function() { return s },
                            showRectangle: function(e) {
                                var t = P(r.clientWidth, r.clientHeight),
                                    n = e.right - e.left,
                                    o = e.bottom - e.top;
                                if (!Number.isFinite(n) || !Number.isFinite(o)) throw new Error("Invalid rectangle");
                                var i = t.x / n,
                                    a = t.y / o,
                                    c = Math.min(i, a);
                                s.x = -(e.left + n / 2) * c + t.x / 2, s.y = -(e.top + o / 2) * c + t.y / 2, s.scale = c
                            }
                        };

                        function P(e, t) {
                            if (n.getScreenCTM) {
                                var r = n.getScreenCTM(),
                                    i = r.a,
                                    a = r.d,
                                    s = r.e,
                                    c = r.f;
                                o.x = e * i - s, o.y = t * a - c
                            } else o.x = e, o.y = t;
                            return o
                        }

                        function C(e, t) { s.x = e, s.y = t, R(), le("pan"), Y() }

                        function L(e, t) { C(s.x + e, s.y + t) }

                        function R() {
                            var e = D();
                            if (e) {
                                var t, r, o, i, a = !1,
                                    c = (o = (t = n.getBBox()).left, i = t.top, { left: (r = { x: o * s.scale + s.x, y: i * s.scale + s.y }).x, top: r.y, right: t.width * s.scale + r.x, bottom: t.height * s.scale + r.y }),
                                    u = e.left - c.right;
                                return u > 0 && (s.x += u, a = !0), (u = e.right - c.left) < 0 && (s.x += u, a = !0), (u = e.top - c.bottom) > 0 && (s.y += u, a = !0), (u = e.bottom - c.top) < 0 && (s.y += u, a = !0), a
                            }
                        }

                        function D() {
                            if (f) {
                                if ("boolean" == typeof f) {
                                    var e = r.clientWidth,
                                        t = r.clientHeight;
                                    return { left: e * h, top: t * h, right: e * (1 - h), bottom: t * (1 - h) }
                                }
                                return f
                            }
                        }

                        function Y() { i = !0, c = window.requestAnimationFrame(X) }

                        function U(e, t, n) {
                            if (B(e) || B(t) || B(n)) throw new Error("zoom requires valid numbers");
                            var r = s.scale * n;
                            if (r < d) {
                                if (s.scale === d) return;
                                n = d / s.scale
                            }
                            if (r > l) {
                                if (s.scale === l) return;
                                n = l / s.scale
                            }
                            var o = P(e, t);
                            s.x = o.x - n * (o.x - s.x), s.y = o.y - n * (o.y - s.y), R() || (s.scale *= n), le("zoom"), Y()
                        }

                        function z(e, t, n) { U(e, t, n / s.scale) }

                        function V(e, t, n) {
                            if (!n) return L(e, t);
                            x && x.cancel();
                            var r = 0,
                                o = 0;
                            x = E({ x: 0, y: 0 }, { x: e, y: t }, { step: function(e) { L(e.x - r, e.y - o), r = e.x, o = e.y } })
                        }

                        function X() { i && (i = !1, n.applyTransform(s), le("transform"), c = 0) }

                        function q(e) {
                            var t = 0,
                                n = 0,
                                o = 0;
                            if (38 === e.keyCode ? n = 1 : 40 === e.keyCode ? n = -1 : 37 === e.keyCode ? t = 1 : 39 === e.keyCode ? t = -1 : 189 === e.keyCode || 109 === e.keyCode ? o = 1 : 187 !== e.keyCode && 107 !== e.keyCode || (o = -1), t || n) {
                                e.preventDefault(), e.stopPropagation();
                                var i = r.getBoundingClientRect(),
                                    a = Math.min(i.width, i.height);
                                V(.05 * a * t, .05 * a * n)
                            }
                            if (o) {
                                var s = ce(o);
                                ae(r.clientWidth / 2, r.clientHeight / 2, s)
                            }
                        }

                        function j(e) {
                            if (function(e) { t.onTouch && !t.onTouch(e) || (e.stopPropagation(), e.preventDefault()) }(e), 1 === e.touches.length) return function(e) {
                                var t = oe(e.touches[0], e.target);
                                g = t.x, y = t.y, W()
                            }(e, e.touches[0]);
                            2 === e.touches.length && (w = $(e.touches[0], e.touches[1]), T = !0, W())
                        }

                        function W() { N || (N = !0, document.addEventListener("touchmove", H), document.addEventListener("touchend", G), document.addEventListener("touchcancel", G)) }

                        function H(e) {
                            if (1 === e.touches.length) {
                                e.stopPropagation();
                                var t = oe(e.touches[0], e.target),
                                    n = t.x - g,
                                    r = t.y - y;
                                0 !== n && 0 !== r && ue(), g = t.x, y = t.y;
                                var o = P(n, r);
                                V(o.x, o.y)
                            } else if (2 === e.touches.length) {
                                T = !0;
                                var i = e.touches[0],
                                    a = e.touches[1],
                                    s = $(i, a),
                                    c = 1;
                                if (u) c = s / w;
                                else {
                                    var f = 0;
                                    s < w ? f = 1 : s > w && (f = -1), c = ce(f)
                                }
                                g = (i.clientX + a.clientX) / 2, y = (i.clientY + a.clientY) / 2, ae(g, y, c), w = s, e.stopPropagation(), e.preventDefault()
                            }
                        }

                        function G(e) {
                            if (e.touches.length > 0) {
                                var t = oe(e.touches[0], e.target);
                                g = t.x, y = t.y
                            } else {
                                var n = new Date;
                                n - S < 300 && ie(g, y, p), S = n, N = !1, fe(), te()
                            }
                        }

                        function $(e, t) { return Math.sqrt((e.clientX - t.clientX) * (e.clientX - t.clientX) + (e.clientY - t.clientY) * (e.clientY - t.clientY)) }

                        function Z(e) {
                            var t = re(e);
                            ie(t.x, t.y, p), e.preventDefault(), e.stopPropagation()
                        }

                        function K(e) {
                            if (N) return e.stopPropagation(), !1;
                            if (1 === e.button && null !== window.event || 0 === e.button) {
                                var t = re(e),
                                    n = P(t.x, t.y);
                                return g = n.x, y = n.y, document.addEventListener("mousemove", J), document.addEventListener("mouseup", Q), k.capture(e.target || e.srcElement), !1
                            }
                        }

                        function J(e) {
                            if (!N) {
                                ue();
                                var t = re(e),
                                    n = P(t.x, t.y),
                                    r = n.x - g,
                                    o = n.y - y;
                                g = n.x, y = n.y, V(r, o)
                            }
                        }

                        function Q() { k.release(), fe(), ee() }

                        function ee() { document.removeEventListener("mousemove", J), document.removeEventListener("mouseup", Q), A = !1 }

                        function te() { document.removeEventListener("touchmove", H), document.removeEventListener("touchend", G), document.removeEventListener("touchcancel", G), A = !1, T = !1 }

                        function ne(e) {
                            if (!m(e)) {
                                b.cancel();
                                var t = ce(e.deltaY);
                                if (1 !== t) {
                                    var n = re(e);
                                    ae(n.x, n.y, t), e.preventDefault()
                                }
                            }
                        }

                        function re(e) {
                            var t = e.offsetX,
                                n = e.offsetY;
                            if (void 0 === t) {
                                var r = e.target.getBoundingClientRect();
                                t = e.clientX - r.left, n = e.clientY - r.top
                            }
                            return { x: t, y: n }
                        }

                        function oe(e, t) { var n = t.getBoundingClientRect(); return { x: e.clientX - n.left, y: e.clientY - n.top } }

                        function ie(e, t, n) {
                            var r = s.scale,
                                o = { scale: r },
                                i = { scale: n * r };
                            b.cancel(), se(), le("zoom"), I = E(o, i, { step: function(n) { z(e, t, n.scale) } })
                        }

                        function ae(e, t, n) { return b.cancel(), se(), U(e, t, n) }

                        function se() { I && (I.cancel(), I = null) }

                        function ce(e) { var t = 1; return e > 0 ? t = 1 - v : e < 0 && (t = 1 + v), t }

                        function ue() { A || (le("panstart"), A = !0, b.start()) }

                        function fe() { A && (T || b.stop(), le("panend")) }

                        function le(t) {
                            var n = function(e) { if (_) { var t = document.createEvent("CustomEvent"); return t.initCustomEvent(e, !0, !0, void 0), t } return new Event(e, { bubbles: !0 }) }(t);
                            e.dispatchEvent(n)
                        }
                    };

                function O() {}

                function M(e) { return Number.isFinite(e) }

                function B(e) { return Number.isNaN ? Number.isNaN(e) : e != e }
                var D = function(e, t, n) { e = e || 1, t = t || 0, n = n || 0, this._array = [e, 0, 0, 0, 0, e, 0, 0, 0, 0, 1, 0, t, n, 0, 1] },
                    Y = { scale: {}, dx: {}, dy: {} };
                D.prototype.multiply = function(e, t) {
                    var n = e.scale * t.scale,
                        r = e.scale * t.dx + e.dx,
                        o = e.scale * t.dy + e.dy;
                    return this.scale = n, this.dx = r, this.dy = o, this
                }, Y.scale.get = function() { return this._array[0] }, Y.dx.get = function() { return this._array[12] }, Y.dy.get = function() { return this._array[13] }, Y.dx.set = function(e) { this._array[12] = e }, Y.dy.set = function(e) { this._array[13] = e }, Y.scale.set = function(e) { this._array[0] = e, this._array[5] = e }, D.prototype.copyTo = function(e) { return function(e, t) { if (e.length !== t.length) throw new Error("Array length mismatch"); for (var n = 0; n < e.length; ++n) t[n] = e[n] }(this._array, e._array), this }, D.prototype.getArray = function() { return this._array }, Object.defineProperties(D.prototype, Y);
                var U = function() { this.children = [], this.transform = new D, this.worldTransform = new D, this.worldTransformNeedsUpdate = !0, this.type = "Element", this.scene = null };
                U.prototype.appendChild = function(e, t) { e.parent = this, t ? this.children.unshift(e) : this.children.push(e), e.bindScene && e.bindScene(this.scene), this.scene && this.scene.renderFrame() }, U.prototype.bindScene = function(e) { this.scene = e }, U.prototype.traverse = function(e, t) {
                    e(this);
                    for (var n = 0; n < this.children.length; ++n) this.children[n].traverse(e, t);
                    t && t(this)
                }, U.prototype.removeChild = function(e) {
                    var t = this.children.indexOf(e);
                    t > -1 && this.children.splice(t, 1), this.scene && this.scene.renderFrame()
                }, U.prototype.updateWorldTransform = function(e) {
                    (this.worldTransformNeedsUpdate || e) && (this.parent ? this.worldTransform.multiply(this.parent.worldTransform, this.transform) : this.transform.copyTo(this.worldTransform), this.worldTransformNeedsUpdate = !1, e = !0);
                    for (var t = e, n = this.children, r = 0; r < n.length; r++) t = n[r].updateWorldTransform(e) || t;
                    return t
                }, U.prototype.draw = function(e, t) { for (var n = 0; n < this.children.length; ++n) this.children[n].draw(e, t) }, U.prototype.dispose = function() { for (var e = 0; e < this.children.length; ++e) this.children[e].dispose() };

                function z(e, t) {
                    var n, r, o = { width: 0, height: 0 },
                        i = window.devicePixelRatio;
                    t || (t = {});
                    var a = t.wglContext,
                        s = e.getContext("webgl", a) || e.getContext("experimental-webgl", a);
                    s.blendFunc(s.SRC_ALPHA, s.ONE_MINUS_SRC_ALPHA), s.enable(s.BLEND), s.clearColor(0, 0, 0, 1), s.clear(s.COLOR_BUFFER_BIT);
                    var c = 0,
                        u = new U;
                    m();
                    var f, l = function(e) {
                            ! function(e) {
                                if (!e) throw new Error("Eventify cannot use falsy object as events subject");
                                for (var t = ["on", "fire", "off"], n = 0; n < t.length; ++n)
                                    if (e.hasOwnProperty(t[n])) throw new Error("Subject cannot be eventified, since it already has property '" + t[n] + "'")
                            }(e);
                            var t = function(e) {
                                var t = Object.create(null);
                                return {
                                    on: function(n, r, o) { if ("function" != typeof r) throw new Error("callback is expected to be a function"); var i = t[n]; return i || (i = t[n] = []), i.push({ callback: r, ctx: o }), e },
                                    off: function(n, r) {
                                        if (void 0 === n) return t = Object.create(null), e;
                                        if (t[n])
                                            if ("function" != typeof r) delete t[n];
                                            else
                                                for (var o = t[n], i = 0; i < o.length; ++i) o[i].callback === r && o.splice(i, 1);
                                        return e
                                    },
                                    fire: function(n) {
                                        var r, o = t[n];
                                        if (!o) return e;
                                        arguments.length > 1 && (r = Array.prototype.splice.call(arguments, 1));
                                        for (var i = 0; i < o.length; ++i) {
                                            var a = o[i];
                                            a.callback.apply(a.ctx, r)
                                        }
                                        return e
                                    }
                                }
                            }(e);
                            return e.on = t.on, e.off = t.off, e.fire = t.fire, e
                        }({
                            appendChild: function(e, t) { u.appendChild(e, t) },
                            getSceneCoordinate: w,
                            getClientCoordinate: function(e, t) { var n = u.transform; return { x: (e * n.scale + n.dx) / i, y: (t * n.scale + n.dy) / i } },
                            getTransform: function() { return u.transform },
                            getRoot: function() { return u },
                            removeChild: function(e) { u.removeChild(e) },
                            setViewBox: function(e) {
                                h.showRectangle(e, { width: n, height: r });
                                var t = h.getTransform();
                                d.applyTransform(t)
                            },
                            setClearColor: function(e, t, n, r) { s.clearColor(e, t, n, r) },
                            dispose: function() { e.removeEventListener("mousemove", y), e.removeEventListener("transform", v), f && f(), window.removeEventListener("resize", p, !0), h.dispose(), u.dispose(), c && (cancelAnimationFrame(c), c = 0) },
                            renderFrame: b,
                            getPixelRatio: function() { return i },
                            setPixelRatio: function(e) { i = e, m() }
                        }),
                        d = function(e, n, r) {
                            var o = {
                                applyTransform: function(e) {
                                    var t = n.transform,
                                        o = r.getPixelRatio();
                                    t.dx = e.x * o, t.dy = e.y * o, t.scale = e.scale, n.worldTransformNeedsUpdate = !0, r.renderFrame()
                                },
                                getOwner: function() { return e }
                            };
                            return t.size && (o.getScreenCTM = function() { return { a: t.size.width / e.offsetWidth, d: t.size.height / e.offsetHeight, e: 0, f: 0 } }), o
                        }(e, u, l),
                        h = R(e, { zoomSpeed: .025, controller: d });
                    return u.bindScene(l),
                        function() {
                            e.addEventListener("mousemove", y), e.addEventListener("transform", v), f = function(e, t, n) {
                                var r, o = new Date;
                                return e.addEventListener("click", s), e.addEventListener("touchend", a), e.addEventListener("touchstart", i),
                                    function() { e.removeEventListener("click", s), e.removeEventListener("touchend", a), e.removeEventListener("touchstart", i) };

                                function i(e) { 1 === e.touches.length && (o = new Date, r = { x: e.touches[0].pageX, y: e.touches[0].pageY }) }

                                function a(e) {
                                    if (!(e.touches.length > 1 || new Date - o > 300)) {
                                        var t = e.changedTouches[0],
                                            n = t.pageX - r.x,
                                            i = t.pageY - r.y;
                                        n * n + i * i < 25 && s(t)
                                    }
                                }

                                function s(e) { t.call(n, e) }
                            }(e, g, this), window.addEventListener("resize", p, !0)
                        }(), b(), l;

                    function p() { m() }

                    function m() { t.size ? (n = e.width = t.size.width, r = e.height = t.size.height) : (n = e.width = e.offsetWidth * i, r = e.height = e.offsetHeight * i), s.viewport(0, 0, n, r), o.width = n, o.height = r, u.worldTransformNeedsUpdate = !0, b() }

                    function v(e) { l.fire("transform", e) }

                    function g(e) {
                        var t = w(e.clientX, e.clientY);
                        l.fire("click", { originalEvent: e, sceneX: t.x, sceneY: t.y })
                    }

                    function y(e) {
                        var t = w(e.clientX, e.clientY);
                        l.fire("mousemove", { originalEvent: e, sceneX: t.x, sceneY: t.y })
                    }

                    function w(e, t) {
                        var n = u.transform,
                            r = t * i;
                        return { x: (e * i - n.dx) / n.scale, y: (r - n.dy) / n.scale }
                    }

                    function b() { c || (c = requestAnimationFrame(x)) }

                    function x() { s.clear(s.COLOR_BUFFER_BIT), o.wasDirty = u.updateWorldTransform(), u.draw(s, o), c = 0 }
                }
                var V = {
                    compile: function(e, t, n) { var r = e.createShader(t); if (e.shaderSource(r, n), e.compileShader(r), !e.getShaderParameter(r, e.COMPILE_STATUS)) throw new Error(e.getShaderInfoLog(r)); return r },
                    link: function(e, t, n) { var r = e.createProgram(); if (e.attachShader(r, t), e.attachShader(r, n), e.linkProgram(r), !e.getProgramParameter(r, e.LINK_STATUS)) throw new Error(e.getProgramInfoLog(r)); return r },
                    getLocations: function(e, t) { return { attributes: X(e, t), uniforms: q(e, t) } },
                    getAttributes: X,
                    getUniforms: q,
                    initBuffer: function(e, t, n, r) {
                        var o = e.createBuffer();
                        if (!o) throw new Error("Failed to create a buffer");
                        e.bindBuffer(e.ARRAY_BUFFER, o), e.bufferData(e.ARRAY_BUFFER, t, e.STATIC_DRAW), e.vertexAttribPointer(r, n, e.FLOAT, !1, 0, 0), e.enableVertexAttribArray(r)
                    }
                };

                function X(e, t) {
                    for (var n = Object.create(null), r = e.getProgramParameter(t, e.ACTIVE_ATTRIBUTES), o = 0; o < r; ++o) {
                        var i = e.getActiveAttrib(t, o).name;
                        n[i] = e.getAttribLocation(t, i)
                    }
                    return n
                }

                function q(e, t) {
                    for (var n = Object.create(null), r = e.getProgramParameter(t, e.ACTIVE_UNIFORMS), o = 0; o < r; ++o) {
                        var i = e.getActiveUniform(t, o).name;
                        n[i] = e.getUniformLocation(t, i)
                    }
                    return n
                }
                var j = function(e) { var t = []; return e.forEach((function(e) { e.globals && t.push(e.globals()) })), t.push("void main() {"), e.forEach((function(e) { e.mainBody && t.push(e.mainBody()) })), t.push("}"), t.join("\n") },
                    W = { globals: function() { return "\nattribute vec2 aPosition;\nuniform vec2 uScreenSize;\nuniform mat4 uTransform;\n" }, mainBody: function() { return "\n  mat4 transformed = mat4(uTransform);\n\n  // Translate screen coordinates to webgl space\n  vec2 vv = 2.0 * uTransform[3].xy/uScreenSize;\n  transformed[3][0] = vv.x - 1.0;\n  transformed[3][1] = 1.0 - vv.y;\n  vec2 xy = 2.0 * aPosition/uScreenSize;\n  gl_Position = transformed * vec4(xy.x, -xy.y, 0.0, 1.0);\n" } },
                    H = j([W, { globals: function() { return "\nattribute float aPointSize;\nattribute vec4 aColor;\nvarying vec4 vColor;\n" }, mainBody: function() { return "\n  gl_PointSize = aPointSize * transformed[0][0];\n  vColor = aColor;\n" } }]),
                    G = new Map;

                function $(e, t, n, r, o) {
                    for (var i = 0, a = 0, s = e - n; s < e + n; ++s)
                        if (!(s < 0 || s >= o))
                            for (var c = t - n; c < t + n; ++c) c < 0 || c >= o || (i += r[4 * (s * o + c) + 3], a += 1);
                    return i / a
                }
                var Z = function(e, t, n, r) { this.r = e, this.g = t, this.b = n, this.a = void 0 === r ? 1 : r },
                    K = function(e, t, n, r) { this.offset = t, this.buffer = e, this.color = n || new Z(1, 1, 1, 1), void 0 !== r && (this.data = r) },
                    J = { x: {}, y: {} };
                J.x.get = function() { return this.buffer[this.offset] }, J.y.get = function() { return this.buffer[this.offset + 1] }, K.prototype.update = function(e, t) {
                    var n = this.offset,
                        r = this.buffer;
                    r[n + 0] = e.x, r[n + 1] = e.y, (e.size || t) && (r[n + 2] = "number" == typeof e.size ? e.size : t.size), this.setColor(this.color)
                }, K.prototype.setColor = function(e) { this.color = e, this.buffer[this.offset + 3] = e.r, this.buffer[this.offset + 4] = e.g, this.buffer[this.offset + 5] = e.b }, Object.defineProperties(K.prototype, J);
                var Q = function(e) {
                        function t(t) { e.call(this), this.type = "PointCollection", this.pointsAccessor = [], this.capacity = t, this.pointsBuffer = new Float32Array(6 * t), this.count = 0, this._program = null, this.color = new Z(1, 1, 1, 1), this.size = 1 }
                        return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.draw = function(e, t) {
                            this._program || (this._program = function(e, t) {
                                var n = G.get(e);
                                if (!n) {
                                    var r = V.compile(e, e.VERTEX_SHADER, H),
                                        o = V.compile(e, e.FRAGMENT_SHADER, "\nprecision highp float;\nvarying vec4 vColor;\nuniform sampler2D texture;\n\nvoid main() {\n  vec4 tColor = texture2D( texture, gl_PointCoord );\n  gl_FragColor = vec4(vColor.rgb, tColor.a);\n  //gl_FragColor = vec4(vColor.rgb, 1.0);\n  // vec2 t = 2.0 * gl_PointCoord - 1.0;\n  // float a = 1.0 - pow(t.x, 2.0) - pow(t.y, 2.0);\n  // gl_FragColor = vec4(vColor.rgb, a);\n}\n");
                                    n = V.link(e, r, o), G.set(e, n)
                                }
                                var i = V.getLocations(e, n),
                                    a = e.createBuffer();
                                if (!a) throw new Error("failed to create a nodesBuffer");
                                e.bindBuffer(e.ARRAY_BUFFER, a), e.bufferData(e.ARRAY_BUFFER, t.byteLength, e.DYNAMIC_DRAW);
                                var s = function(e) {
                                    var t = e.createTexture();
                                    if (!t) throw new Error("Failed to create circle texture");
                                    e.bindTexture(e.TEXTURE_2D, t);
                                    var n = function(e) {
                                        for (var t = new Uint8Array(e * e * 4), n = (e - 8) / 2, r = 0; r < e; ++r)
                                            for (var o = r * e, i = 0; i < e; ++i) {
                                                var a = 4 * (o + i),
                                                    s = r - n,
                                                    c = i - n,
                                                    u = Math.sqrt(c * c + s * s);
                                                if (u < n) {
                                                    var f = 1 - u / n;
                                                    t[a + 3] = f > .3 ? 255 : 255 * f
                                                } else t[a + 3] = 0
                                            }
                                        return function(e, t) {
                                            for (var n = new Uint8Array(t * t * 4), r = 0; r < t; ++r)
                                                for (var o = 0; o < t; ++o) n[4 * (r * t + o) + 3] = $(r, o, 3, e, t);
                                            return n
                                        }(t, e)
                                    }(64);
                                    return e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, 64, 64, 0, e.RGBA, e.UNSIGNED_BYTE, n), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.generateMipmap(e.TEXTURE_2D), t
                                }(e);
                                return {
                                    draw: function(r, o, c) {
                                        e.useProgram(n);
                                        var u = t.BYTES_PER_ELEMENT;
                                        r && e.uniformMatrix4fv(i.uniforms.uTransform, !1, r.getArray()), e.uniform2f(i.uniforms.uScreenSize, o.width, o.height), e.bindTexture(e.TEXTURE_2D, s), e.bindBuffer(e.ARRAY_BUFFER, a), e.bufferData(e.ARRAY_BUFFER, t, e.DYNAMIC_DRAW), e.vertexAttribPointer(i.attributes.aPosition, 2, e.FLOAT, !1, 6 * u, 0), e.enableVertexAttribArray(i.attributes.aPosition), e.vertexAttribPointer(i.attributes.aPointSize, 1, e.FLOAT, !1, 6 * u, 2 * u), e.enableVertexAttribArray(i.attributes.aPointSize), e.vertexAttribPointer(i.attributes.aColor, 3, e.FLOAT, !1, 6 * u, 3 * u), e.enableVertexAttribArray(i.attributes.aColor), e.drawArrays(e.POINTS, 0, c)
                                    },
                                    updateData: function(e) { t = e },
                                    dispose: function() { e.deleteProgram(n), e.deleteTexture(s), G.delete(e) }
                                }
                            }(e, this.pointsBuffer)), this._program.draw(this.worldTransform, t, this.count)
                        }, t.prototype.dispose = function() { this._program && (this._program.dispose(), this._program = null) }, t.prototype.add = function(e, t) {
                            if (!e) throw new Error("Point is required");
                            this.count >= this.capacity && this._extendArray();
                            var n = this.pointsBuffer,
                                r = this.count,
                                o = new K(n, 6 * r, e.color || this.color, t);
                            return this.pointsAccessor.push(o), o.update(e, this), this.count += 1, o
                        }, t.prototype._extendArray = function() { throw new Error("Cannot extend array at the moment :(") }, t
                    }(U),
                    ee = function(e, t, n) {
                        if (Number.isNaN(e)) throw new Error("x is not a number");
                        if (Number.isNaN(t)) throw new Error("y is not a number");
                        this.x = e, this.y = t, this.color = new Z(255, 255, 255), this.size = Number.isFinite(n) ? n : 4
                    },
                    te = function(e) {
                        function t(t, n) { e.call(this), this.itemsPerLine = n, this.capacity = t, this.count = 0, this._program = null, this.color = new Z(1, 1, 1, 1), this.buffer = new Float32Array(t * this.itemsPerLine) }
                        return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.draw = function(e, t) {
                            this._program || (this._program = this._makeProgram(e));
                            var n = this.worldTransform;
                            this._program.draw(n, this.color, t)
                        }, t.prototype._makeProgram = function() { throw new Error("Not implemented") }, t.prototype._addInternal = function() { throw new Error("Not implemented") }, t.prototype.add = function(e) {
                            if (!e) throw new Error("Line is required");
                            this.count >= this.capacity && this._extendArray();
                            var t = this.count * this.itemsPerLine,
                                n = this._addInternal(e, t);
                            return this.count += 1, n
                        }, t.prototype.dispose = function() { this._program && (this._program.dispose(), this._program = null) }, t.prototype._extendArray = function() {
                            var e = this.capacity * this.itemsPerLine * 2,
                                t = new Float32Array(e);
                            this.buffer && t.set(this.buffer), this.buffer = t, this.capacity = e
                        }, t
                    }(U),
                    ne = j([W]),
                    re = new Map;

                function oe(e, t, n) {
                    var r = re.get(e);
                    if (!r) {
                        var o = V.compile(e, e.VERTEX_SHADER, ne),
                            i = V.compile(e, e.FRAGMENT_SHADER, "\nprecision highp float;\nuniform vec4 uColor;\n\nvoid main() {\n  gl_FragColor = uColor;\n}\n");
                        r = V.link(e, o, i), re.set(e, r)
                    }
                    var a = V.getLocations(e, r),
                        s = e.createBuffer(),
                        c = t.BYTES_PER_ELEMENT,
                        u = n ? e.TRIANGLES : e.LINES;
                    return e.bindBuffer(e.ARRAY_BUFFER, s), e.bufferData(e.ARRAY_BUFFER, t.byteLength, e.STATIC_DRAW), e.bufferSubData(e.ARRAY_BUFFER, 0, t), { draw: function(n, o, i) { 0 !== t.length && (e.useProgram(r), e.uniformMatrix4fv(a.uniforms.uTransform, !1, n.getArray()), e.uniform2f(a.uniforms.uScreenSize, i.width, i.height), e.uniform4f(a.uniforms.uColor, o.r, o.g, o.b, o.a), e.bindBuffer(e.ARRAY_BUFFER, s), e.enableVertexAttribArray(a.attributes.aPosition), e.bufferData(e.ARRAY_BUFFER, t, e.STATIC_DRAW), e.vertexAttribPointer(a.attributes.aPosition, 2, e.FLOAT, !1, 2 * c, 0), e.drawArrays(u, 0, t.length / 2)) }, dispose: function() { e.deleteBuffer(s), e.deleteProgram(r), re.delete(e) } }
                }
                var ie = function(e, t) { this.offset = t, this.buffer = e, this.width = 1 };
                ie.prototype.setWidth = function(e) { this.width = e }, ie.prototype.update = function(e, t) {
                    var n = this.buffer,
                        r = this.offset,
                        o = t.x - e.x,
                        i = t.y - e.y;
                    0 === o && (o = 1e-4), 0 === i && (i = 1e-4);
                    var a = Math.sqrt(o * o + i * i),
                        s = o / a,
                        c = i / a,
                        u = this.width,
                        f = u * s,
                        l = u * c,
                        d = e.x + l,
                        h = e.y - f,
                        p = t.x + l,
                        m = t.y - f,
                        v = e.x - l,
                        g = e.y + f,
                        y = t.x - l,
                        w = t.y + f;
                    n[r + 0] = d, n[r + 1] = h, n[r + 2] = p, n[r + 3] = m, n[r + 4] = v, n[r + 5] = g, n[(r += 6) + 0] = p, n[r + 1] = m, n[r + 2] = v, n[r + 3] = g, n[r + 4] = y, n[r + 5] = w
                };
                var ae = function(e) {
                        function t(t) { e.call(this, t, 12), this.type = "LineCollection" }
                        return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype._makeProgram = function(e) { return oe(e, this.buffer, !0) }, t.prototype._addInternal = function(e, t) { var n = new ie(this.buffer, t); return n.update(e.from, e.to), n }, t
                    }(te),
                    se = function(e, t) { this.offset = t, this.buffer = e };
                se.prototype.update = function(e, t) {
                    var n = this.buffer,
                        r = this.offset;
                    n[r + 0] = e.x, n[r + 1] = e.y, n[r + 2] = t.x, n[r + 3] = t.y
                };
                var ce = function(e) {
                        function t(t) { e.call(this, t, 4), this.type = "WireCollection" }
                        return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype._makeProgram = function(e) { return oe(e, this.buffer, !1) }, t.prototype._addInternal = function(e, t) { var n = new se(this.buffer, t); return n.update(e.from, e.to), n }, t
                    }(te),
                    ue = new Map;
                var fe = function(e) {
                    function t(t, n) { void 0 === n && (n = !1), e.call(this), this.drawCount = 0, this.madeFullCircle = !1, this.allowColors = n, this.itemsPerLine = n ? 3 : 2, this.capacity = t, this.nextElementIndex = 1, this._program = null, this.color = new Z(1, 1, 1, 1), this.buffer = new ArrayBuffer((t + 1) * this.itemsPerLine * 4), this.positions = new Float32Array(this.buffer), n && (this.colors = new Uint32Array(this.buffer)) }
                    return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.draw = function(e, t) {
                        this._program || (this._program = function(e, t, n) {
                            var r = ue.get(e),
                                o = n ? 3 : 2;
                            if (!r) {
                                var i = function(e) { return { lineVSSrc: j([{ globals: function() { return "\n  attribute vec2 aPosition;\n  varying vec4 vColor;\n  " + (e ? "attribute vec4 aColor;" : "") + "\n  uniform vec4 uColor;\n  uniform vec2 uScreenSize;\n  uniform mat4 uTransform;\n" }, mainBody: function() { return "\n  mat4 transformed = mat4(uTransform);\n\n  // Translate screen coordinates to webgl space\n  vec2 vv = 2.0 * uTransform[3].xy/uScreenSize;\n  transformed[3][0] = vv.x - 1.0;\n  transformed[3][1] = 1.0 - vv.y;\n  vec2 xy = 2.0 * aPosition.xy/uScreenSize;\n  gl_Position = transformed * vec4(xy.x, -xy.y, 0.0, 1.0);\n  vColor = " + (e ? "aColor.abgr" : "uColor") + ";\n" } }]), lineFSSrc: "precision mediump float;\nvarying vec4 vColor;\nvoid main() {\n  gl_FragColor = vColor;\n}\n" } }(n),
                                    a = i.lineFSSrc,
                                    s = i.lineVSSrc,
                                    c = V.compile(e, e.VERTEX_SHADER, s),
                                    u = V.compile(e, e.FRAGMENT_SHADER, a);
                                r = V.link(e, c, u), ue.set(e, r)
                            }
                            var f = V.getLocations(e, r),
                                l = e.createBuffer();
                            return {
                                draw: function(i, a, s, c, u) {
                                    if (0 !== t.length) {
                                        e.useProgram(r);
                                        var d = i.getArray();
                                        if (e.uniformMatrix4fv(f.uniforms.uTransform, !1, d), e.uniform2f(f.uniforms.uScreenSize, s.width, s.height), e.uniform4f(f.uniforms.uColor, a.r, a.g, a.b, a.a), e.bindBuffer(e.ARRAY_BUFFER, l), e.enableVertexAttribArray(f.attributes.aPosition), e.bufferData(e.ARRAY_BUFFER, t, e.DYNAMIC_DRAW), n ? (e.vertexAttribPointer(f.attributes.aPosition, 2, e.FLOAT, !1, 12, 0), e.enableVertexAttribArray(f.attributes.aColor), e.vertexAttribPointer(f.attributes.aColor, 4, e.UNSIGNED_BYTE, !0, 12, 8)) : e.vertexAttribPointer(f.attributes.aPosition, 2, e.FLOAT, !1, 0, 0), u) {
                                            var h = t.byteLength / 4 / o - c;
                                            e.drawArrays(e.LINE_STRIP, c, h), c > 1 && e.drawArrays(e.LINE_STRIP, 0, c - 1)
                                        } else e.drawArrays(e.LINE_STRIP, 1, c - 1)
                                    }
                                },
                                dispose: function() { e.deleteBuffer(l), e.deleteProgram(r), ue.delete(e) }
                            }
                        }(e, this.buffer, this.allowColors));
                        var n = this.worldTransform;
                        this._program.draw(n, this.color, t, this.nextElementIndex, this.madeFullCircle)
                    }, t.prototype.add = function(e, t, n) {
                        var r = this.nextElementIndex * this.itemsPerLine,
                            o = this.positions;
                        o[r] = e, o[r + 1] = t, this.allowColors && (this.colors[r + 2] = void 0 === n ? 0 : n), this.nextElementIndex += 1, this.drawCount += 1, this.nextElementIndex > this.capacity && (this.nextElementIndex = 1, o[0] = e, o[1] = t, this.allowColors && (this.colors[2] = this.colors[r + 2]), this.madeFullCircle = !0)
                    }, t.prototype.dispose = function() { this._program && (this._program.dispose(), this._program = null) }, t
                }(U);

                function le(e) { try { return !(!window.WebGLRenderingContext || (e || (e = document.createElement("canvas")), !e.getContext("webgl") && !e.getContext("experimental-webgl"))) } catch (e) { return !1 } }
            },
            738: (e, t, n) => {
                var r = n(590),
                    o = n(236),
                    i = new r,
                    a = n(806),
                    s = n(959);
                e.exports = function() {
                    var e, t, n = new r,
                        c = {
                            init: function(n) { u(n), t = n, e = f(n); for (var r = 0; r < n.length; r += 2) e.insert(r, t) },
                            initAsync: function(n, r) {
                                u(n);
                                var o = r && r.done,
                                    i = r && r.progress;
                                e = f(n), t = n, s(n, (function(t, r) { e.insert(r, n, 0), i && i(r, n.length) }), (function() { "function" == typeof o && o(c) }), { step: 2 })
                            },
                            bounds: function() { return e ? e.bounds : i },
                            pointsAround: function(r, o, i, s) { "function" != typeof s && (s = a); var c = []; return n.x = r, n.y = o, n.half = i, e.query(n, c, t, s), c },
                            visit: function(t) { return e.visit(t) }
                        };
                    return c;

                    function u(e) { if (!e) throw new Error("Points array is required for quadtree to work"); if ("number" != typeof e.length) throw new Error("Points should be array-like object"); if (e.length % 2 != 0) throw new Error("Points array should consist of series of x,y coordinates and be multiple of 2") }

                    function f(e) {
                        if (0 === e.length) { var t = new r; return new o(t) }
                        for (var n = Number.POSITIVE_INFINITY, i = Number.POSITIVE_INFINITY, a = Number.NEGATIVE_INFINITY, s = Number.NEGATIVE_INFINITY, c = 0; c < e.length; c += 2) {
                            var u = e[c],
                                f = e[c + 1];
                            u < n && (n = u), u > a && (a = u), f < i && (i = f), f > s && (s = f)
                        }
                        var l = Math.max(a - n, s - i),
                            d = (l += 2) / 2,
                            h = new r((n -= 1) + d, (i -= 1) + d, d);
                        return new o(h)
                    }
                }
            },
            590: e => {
                function t(e, t, n) { this.x = "number" == typeof e ? e : 0, this.y = "number" == typeof t ? t : 0, this.half = "number" == typeof n ? n : 0 }
                e.exports = t, t.prototype.left = function() { return this.x - this.half }, t.prototype.top = function() { return this.y - this.half }, t.prototype.width = function() { return 2 * this.half }, t.prototype.height = function() { return 2 * this.half }, t.prototype.centerX = function() { return this.x }, t.prototype.centerY = function() { return this.y }, t.prototype.contains = function(e, t) { var n = this.half; return this.x - n <= e && e < this.x + n && this.y - n <= t && t < this.y + n }
            },
            806: e => { e.exports = function(e, t) { return e.x - e.half < t.x + t.half && e.x + e.half > t.x - t.half && e.y - e.half < t.y + t.half && e.y + e.half > t.y - t.half } },
            236: (e, t, n) => {
                var r = n(590);

                function o(e) { this.bounds = e, this.nw = null, this.ne = null, this.sw = null, this.se = null, this.items = null }
                e.exports = o, o.prototype.subdivide = function() {
                    var e = this.bounds,
                        t = e.half / 2;
                    this.nw = new o(new r(e.x - t, e.y - t, t)), this.ne = new o(new r(e.x + t, e.y - t, t)), this.sw = new o(new r(e.x - t, e.y + t, t)), this.se = new o(new r(e.x + t, e.y + t, t))
                }, o.prototype.insert = function(e, t, n) {
                    if (n || (n = 0), !(n > 24))
                        if (null === this.nw) {
                            if (null === this.items ? this.items = [e] : this.items.push(e), this.bounds.half > .1 && this.items.length >= 4) {
                                this.subdivide();
                                for (var r = 0; r < this.items.length; ++r) this.insert(this.items[r], t, n + 1);
                                this.items = null
                            }
                        } else {
                            var o = t[e],
                                i = t[e + 1],
                                a = this.bounds,
                                s = 0;
                            o > a.x && (s += 1), i > a.y && (s += 2),
                                function(e, t) { return 0 === t ? e.nw : 1 === t ? e.ne : 2 === t ? e.sw : 3 === t ? e.se : void 0 }(this, s).insert(e, t, n + 1)
                        }
                }, o.prototype.visit = function(e) { e(this) && this.nw && (this.nw.visit(e), this.ne.visit(e), this.sw.visit(e), this.se.visit(e)) }, o.prototype.query = function(e, t, n, r) {
                    if (r(this.bounds, e)) {
                        var o = this.items;
                        if (o)
                            for (var i = 0; i < o.length; ++i) {
                                var a = o[i],
                                    s = n[a],
                                    c = n[a + 1];
                                e.contains(s, c) && t.push(a)
                            }
                        this.nw && (this.nw.query(e, t, n, r), this.ne.query(e, t, n, r), this.sw.query(e, t, n, r), this.se.query(e, t, n, r))
                    }
                }
            },
            805: (e, t, n) => {
                const r = n(901);
                e.exports = function(e, t, n) {
                    let o = r.aStar(n, {
                            distance(e, t) {
                                let n = e.data.x - t.data.x,
                                    r = e.data.y - t.data.y;
                                return Math.sqrt(n * n + r * r)
                            },
                            heuristic(e, t) {
                                let n = e.data.x - t.data.x,
                                    r = e.data.y - t.data.y;
                                return Math.sqrt(n * n + r * r)
                            }
                        }).find(e, t),
                        i = 0;
                    for (let e = 0; e < o.length; e++) {
                        const t = o[e];
                        if (e === o.length - 1) break;
                        const n = o[e + 1];
                        let r = (t.data.x - n.data.x) ** 2,
                            a = (t.data.y - n.data.y) ** 2;
                        i += Math.sqrt(r + a)
                    }
                    return i
                }
            },
            508: e => {
                e.exports = function(e) {
                    var t = [],
                        n = {},
                        r = {};
                    for (let o = 0; o < e.length; o++) {
                        let i = e[o];
                        switch (o % 4) {
                            case 0:
                                n.x = i;
                                break;
                            case 1:
                                n.y = i;
                                break;
                            case 2:
                                r.x = i;
                                break;
                            case 3:
                                r.y = i, t.push({ from: n, to: r }), n = {}, r = {}
                        }
                    }
                    return t
                }
            },
            493: e => {
                e.exports = function(e, t) {
                    var n;
                    if (e.touches) {
                        let r = (e.changedTouches || e.touches)[0];
                        n = t.getSceneCoordinate(r.clientX, r.clientY), r.identifier
                    } else n = t.getSceneCoordinate(e.clientX, e.clientY);
                    return n
                }
            },
            68: e => { e.exports = function(e) { let t = []; return e.forEachNode((function(e) { t.push(e.data.x, e.data.y) })), t } },
            205: (e, t, n) => {
                const r = n(738);
                e.exports = function(e) { return hetTestTree = r(), hetTestTree.initAsync(e, {}), hetTestTree }
            },
            575: e => {
                e.exports = function(e, t, n, r, o = .1, i = .1, a = "yellow", s = "circle") {
                    g = document.getElementById(n);
                    var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    c.setAttribute("cx", e), c.setAttribute("cy", t), c.setAttribute("r", o), c.setAttribute("stroke", "green"), c.setAttribute("stroke-width", "" + i), c.setAttribute("fill", a), c.setAttribute("class", s), c.setAttribute("id", "circle_" + r), g.appendChild(c)
                }
            },
            885: (e, t, n) => {
                let r = n(964);
                class o extends r.Element {
                    constructor(e, t) { super(), this.g = e, this.dx = 0, this.dy = 0, this.scale = 0, this.drawCallback = t || i }
                    draw() {
                        let e = this.worldTransform;
                        if (n = this, (t = this.worldTransform).scale == n.scale && t.dx === n.dx && t.dy === n.dy) return;
                        var t, n;
                        let r = this.scene.getPixelRatio(),
                            o = e.scale / r,
                            i = e.dx / r,
                            a = e.dy / r;
                        this.g.setAttributeNS(null, "transform", `matrix(${o}, 0, 0, ${o}, ${i}, ${a})`), this.scale = e.scale, this.dx = e.dx, this.dy = e.dy, this.drawCallback(this)
                    }
                }

                function i() {}
                e.exports = o
            },
            223: e => {
                e.exports = function(e) {
                    var t = [];
                    for (let n = 0; n < e.length; n++) {
                        const r = e[n];
                        t.push(r.id)
                    }
                    return t
                }
            },
            330: (e, t, n) => {
                const r = n(901),
                    o = n(223);
                e.exports = function(e) {
                    let t = r.aStar(e),
                        n = [],
                        i = {};
                    e.forEachNode((function(e) { n.push(e.id), i[e.id] = {}, i[e.id].found = 0, i[e.id].x = e.data.x, i[e.id].y = e.data.y }));
                    for (let e = 0; e < n.length; e++) {
                        const r = n[e];
                        for (let e = 0; e < n.length; e++) {
                            const a = n[e];
                            o(t.find(r, a)).forEach((e => { i[e].found += 1 }))
                        }
                    }
                    return i
                }
            },
            296: e => { e.exports = function(e, t, n, r, o = 2e3) { let i = n.pointsAround(e, t, o).map((e => r[e / 2])); return i.length > 0 ? i[0] : null } }
        },
        t = {};

    function n(r) { var o = t[r]; if (void 0 !== o) return o.exports; var i = t[r] = { exports: {} }; return e[r](i, i.exports, n), i.exports }
    n.d = (e, t) => { for (var r in t) n.o(t, r) && !n.o(e, r) && Object.defineProperty(e, r, { enumerable: !0, get: t[r] }) }, n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), n.r = e => { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 }) }, (() => {
        n(508);
        const e = n(330),
            t = n(493),
            r = n(296),
            o = n(205),
            i = n(68),
            a = n(885),
            c = n(575);
        n(805);
        let u = n(736),
            f = n(964),
            l = u(),
            d = n(901);
        $("#remove-marks-button").click((function() { $(".circle").remove() })), l.addNode("b", { x: 0, y: 0 }), l.addNode("a", { x: 3, y: -4 }), l.addNode("c", { x: 3, y: 4 }), l.addNode("d", { x: 4, y: 2 }), l.addNode("e", { x: 6, y: 1 }), l.addNode("f", { x: 8, y: 5 }), l.addNode("g", { x: 10, y: 4 }), l.addNode("i", { x: 10, y: 8 }), l.addNode("h", { x: 13, y: 6 }), l.addLink("a", "b"), l.addLink("b", "d"), l.addLink("b", "c"), l.addLink("c", "d"), l.addLink("d", "e"), l.addLink("e", "f"), l.addLink("f", "g"), l.addLink("f", "i"), l.addLink("g", "i"), l.addLink("i", "h"), l.addLink("g", "h"), d.aStar(l, { distance: (e, t, n) => 1 });
        var h = !1,
            p = null,
            m = [],
            v = null,
            g = null,
            y = null;

        function w(e) { e.scale }

        function b(t) {
            var n = e(l);
            y = n;
            var r = null,
                o = null,
                i = null,
                a = Number.NEGATIVE_INFINITY;
            for (nodeId in n) n[nodeId].found > a && (i = nodeId, r = n[nodeId].x, o = n[nodeId].y, a = n[nodeId].found);
            $("#selected-node").text(i), null == y && (y = e(l));
            let s = l.getNode(i),
                u = y[s.id].found;
            $("#selected-node-betweenness").text(u), $("#selected-node-straightness-ceterality").text();
            let f = l.getNode(s.id).links.length;
            $("#selected-node-ceterality").text(f), c(r, o, "my_g", i, radius = .3, stroke = .1, color = "black")
        }

        function x(n) {
            ! function(n) {
                if ($("#actiavate-selecting-btn").prop("checked") && (h = !0), h && (s = t(n, g), find = r(s.x, s.y, p, m, maxDistanceToExplore = 1), find)) {
                    $(".selected-circle").remove(), c(find.data.x, find.data.y, "my_g", "1", .3, .1, "yellow", "selected-circle"), find, $("#actiavate-selecting-btn").prop("checked", !1), $("#selected-node").text(find.id), null == y && (y = e(l));
                    let t = y[find.id].found;
                    $("#selected-node-betweenness").text(t);
                    let n = l.getNode(find.id).links.length;
                    $("#selected-node-ceterality").text(n), h = !1
                }
            }(n)
        }

        function E() { console.log($("circle")), g.removeChild(v), l.clear() }! function() {
            let e = document.getElementById("betweenness-id");
            (g = f.scene(e)).setClearColor(16 / 255, 16 / 255, 16 / 255, 1), g.setClearColor(1, 1, 1, 1), g.setViewBox({ left: -10, top: -10, right: 10, bottom: 10 }), g.setPixelRatio(2), svgConntainerWays = new a(document.getElementsByTagName("svg")[0].querySelector(".scene"), w), g.appendChild(svgConntainerWays), v = new f.WireCollection(l.getLinksCount()), l.forEachLink((function(e) {
                let t = l.getNode(e.fromId).data,
                    n = l.getNode(e.toId).data;
                v.add({ from: t, to: n })
            })), l.forEachNode((function(e) { m.push(e) })), v.color = { r: 244 / 255, g: 250 / 255, b: 230 / 255, a: 1 }, g.setClearColor(.2, .2, .2, 1), g.appendChild(v), allPoint = i(l), p = o(allPoint), $("#betweenness-id").click(x), $("#find-best-betweenness").click(b), $("#reset-graph").click(E)
        }()
    })()
})();