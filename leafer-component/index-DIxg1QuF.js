const G = (e, t) => e === t, C = {
  equals: G
};
let H = L;
const y = 1, S = 2, B = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var h = null;
let j = null, Q = null, u = null, a = null, d = null, E = 0;
function W(e, t) {
  const s = u, r = h, n = e.length === 0, l = t === void 0 ? r : t, i = n ? B : {
    owned: null,
    cleanups: null,
    context: l ? l.context : null,
    owner: l
  }, o = n ? e : () => e(() => N(() => b(i)));
  h = i, u = null;
  try {
    return w(o, !0);
  } finally {
    u = s, h = r;
  }
}
function Z(e, t) {
  t = t ? Object.assign({}, C, t) : C;
  const s = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, r = (n) => (typeof n == "function" && (n = n(s.value)), $(s, n));
  return [U.bind(s), r];
}
function T(e, t, s) {
  const r = q(e, t, !1, y);
  x(r);
}
function ge(e, t, s) {
  s = s ? Object.assign({}, C, s) : C;
  const r = q(e, t, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = s.equals || void 0, x(r), U.bind(r);
}
function N(e) {
  if (u === null) return e();
  const t = u;
  u = null;
  try {
    return e();
  } finally {
    u = t;
  }
}
function U() {
  if (this.sources && this.state)
    if (this.state === y) x(this);
    else {
      const e = a;
      a = null, w(() => A(this), !1), a = e;
    }
  if (u) {
    const e = this.observers ? this.observers.length : 0;
    u.sources ? (u.sources.push(this), u.sourceSlots.push(e)) : (u.sources = [this], u.sourceSlots = [e]), this.observers ? (this.observers.push(u), this.observerSlots.push(u.sources.length - 1)) : (this.observers = [u], this.observerSlots = [u.sources.length - 1]);
  }
  return this.value;
}
function $(e, t, s) {
  let r = e.value;
  return (!e.comparator || !e.comparator(r, t)) && (e.value = t, e.observers && e.observers.length && w(() => {
    for (let n = 0; n < e.observers.length; n += 1) {
      const l = e.observers[n], i = j && j.running;
      i && j.disposed.has(l), (i ? !l.tState : !l.state) && (l.pure ? a.push(l) : d.push(l), l.observers && V(l)), i || (l.state = y);
    }
    if (a.length > 1e6)
      throw a = [], new Error();
  }, !1)), t;
}
function x(e) {
  if (!e.fn) return;
  b(e);
  const t = E;
  X(
    e,
    e.value,
    t
  );
}
function X(e, t, s) {
  let r;
  const n = h, l = u;
  u = h = e;
  try {
    r = e.fn(t);
  } catch (i) {
    return e.pure && (e.state = y, e.owned && e.owned.forEach(b), e.owned = null), e.updatedAt = s + 1, I(i);
  } finally {
    u = l, h = n;
  }
  (!e.updatedAt || e.updatedAt <= s) && (e.updatedAt != null && "observers" in e ? $(e, r) : e.value = r, e.updatedAt = s);
}
function q(e, t, s, r = y, n) {
  const l = {
    fn: e,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: h,
    context: h ? h.context : null,
    pure: s
  };
  return h === null || h !== B && (h.owned ? h.owned.push(l) : h.owned = [l]), l;
}
function F(e) {
  if (e.state === 0) return;
  if (e.state === S) return A(e);
  if (e.suspense && N(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < E); )
    e.state && t.push(e);
  for (let s = t.length - 1; s >= 0; s--)
    if (e = t[s], e.state === y)
      x(e);
    else if (e.state === S) {
      const r = a;
      a = null, w(() => A(e, t[0]), !1), a = r;
    }
}
function w(e, t) {
  if (a) return e();
  let s = !1;
  t || (a = []), d ? s = !0 : d = [], E++;
  try {
    const r = e();
    return Y(s), r;
  } catch (r) {
    s || (d = null), a = null, I(r);
  }
}
function Y(e) {
  if (a && (L(a), a = null), e) return;
  const t = d;
  d = null, t.length && w(() => H(t), !1);
}
function L(e) {
  for (let t = 0; t < e.length; t++) F(e[t]);
}
function A(e, t) {
  e.state = 0;
  for (let s = 0; s < e.sources.length; s += 1) {
    const r = e.sources[s];
    if (r.sources) {
      const n = r.state;
      n === y ? r !== t && (!r.updatedAt || r.updatedAt < E) && F(r) : n === S && A(r, t);
    }
  }
}
function V(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const s = e.observers[t];
    s.state || (s.state = S, s.pure ? a.push(s) : d.push(s), s.observers && V(s));
  }
}
function b(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const s = e.sources.pop(), r = e.sourceSlots.pop(), n = s.observers;
      if (n && n.length) {
        const l = n.pop(), i = s.observerSlots.pop();
        r < n.length && (l.sourceSlots[i] = r, n[r] = l, s.observerSlots[r] = i);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) b(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) b(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function D(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function I(e, t = h) {
  throw D(e);
}
function ee(e, t, s) {
  let r = s.length, n = t.length, l = r, i = 0, o = 0, f = t[n - 1].nextSibling, p = null;
  for (; i < n || o < l; ) {
    if (t[i] === s[o]) {
      i++, o++;
      continue;
    }
    for (; t[n - 1] === s[l - 1]; )
      n--, l--;
    if (n === i) {
      const c = l < r ? o ? s[o - 1].nextSibling : s[l - o] : f;
      for (; o < l; ) e.insertBefore(s[o++], c);
    } else if (l === o)
      for (; i < n; )
        (!p || !p.has(t[i])) && t[i].remove(), i++;
    else if (t[i] === s[l - 1] && s[o] === t[n - 1]) {
      const c = t[--n].nextSibling;
      e.insertBefore(s[o++], t[i++].nextSibling), e.insertBefore(s[--l], c), t[n] = s[l];
    } else {
      if (!p) {
        p = /* @__PURE__ */ new Map();
        let g = o;
        for (; g < l; ) p.set(s[g], g++);
      }
      const c = p.get(t[i]);
      if (c != null)
        if (o < c && c < l) {
          let g = i, O = 1, K;
          for (; ++g < n && g < l && !((K = p.get(t[g])) == null || K !== c + O); )
            O++;
          if (O > c - o) {
            const J = t[i];
            for (; o < c; ) e.insertBefore(s[o++], J);
          } else e.replaceChild(s[o++], t[i++]);
        } else i++;
      else t[i++].remove();
    }
  }
}
function te(e, t, s, r) {
  if (typeof t != "function") return v(e, t, r, s);
  T((n) => v(e, t(), n, s), r);
}
function v(e, t, s, r, n) {
  for (; typeof s == "function"; ) s = s();
  if (t === s) return s;
  const l = typeof t;
  if (e = e, l === "string" || l === "number") {
    if (l === "number" && (t = t.toString(), t === s))
      return s;
    s !== "" && typeof s == "string" ? s = e.firstChild.data = t : s = e.textContent = t;
  } else if (t == null || l === "boolean")
    s = _(e, s, r);
  else {
    if (l === "function")
      return T(() => {
        let i = t();
        for (; typeof i == "function"; ) i = i();
        s = v(e, i, s, r);
      }), () => s;
    if (Array.isArray(t)) {
      const i = [], o = s && Array.isArray(s);
      if (k(i, t, s, n))
        return T(() => s = v(e, i, s, r, !0)), () => s;
      i.length === 0 ? s = _(e, s, r) : o ? s.length === 0 ? R(e, i, r) : ee(e, s, i) : (s && _(e), R(e, i)), s = i;
    } else t.nodeType && (Array.isArray(s) ? _(e, s, null, t) : s == null || s === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild), s = t);
  }
  return s;
}
function k(e, t, s, r) {
  let n = !1;
  for (let l = 0, i = t.length; l < i; l++) {
    let o = t[l], f = s && s[e.length], p;
    if (!(o == null || o === !0 || o === !1)) if ((p = typeof o) == "object" && o.nodeType)
      e.push(o);
    else if (Array.isArray(o))
      n = k(e, o, f) || n;
    else if (p === "function")
      if (r) {
        for (; typeof o == "function"; ) o = o();
        n = k(
          e,
          Array.isArray(o) ? o : [o],
          Array.isArray(f) ? f : [f]
        ) || n;
      } else
        e.push(o), n = !0;
    else {
      const c = String(o);
      f && f.nodeType === 3 && f.data === c ? e.push(f) : e.push(document.createTextNode(c));
    }
  }
  return n;
}
function R(e, t, s = null) {
  for (let r = 0, n = t.length; r < n; r++) e.insertBefore(t[r], s);
}
function _(e, t, s, r) {
  if (s === void 0) return e.textContent = "";
  const n = r || document.createTextNode("");
  if (t.length) {
    let l = !1;
    for (let i = t.length - 1; i >= 0; i--) {
      const o = t[i];
      if (n !== o) {
        const f = o.parentNode === e;
        !l && !i ? f ? e.replaceChild(n, o) : e.insertBefore(n, s) : f && o.remove();
      } else l = !0;
    }
  } else e.insertBefore(n, s);
  return [n];
}
function se(e) {
  return Object.keys(e).reduce((s, r) => {
    const n = e[r];
    return s[r] = Object.assign({}, n), z(n.value) && !oe(n.value) && !Array.isArray(n.value) && (s[r].value = Object.assign({}, n.value)), Array.isArray(n.value) && (s[r].value = n.value.slice(0)), s;
  }, {});
}
function ne(e) {
  return e ? Object.keys(e).reduce((s, r) => {
    const n = e[r];
    return s[r] = z(n) && "value" in n ? n : {
      value: n
    }, s[r].attribute || (s[r].attribute = ie(r)), s[r].parse = "parse" in s[r] ? s[r].parse : typeof s[r].value != "string", s;
  }, {}) : {};
}
function re(e) {
  return Object.keys(e).reduce((s, r) => (s[r] = e[r].value, s), {});
}
function le(e, t) {
  const s = se(t);
  return Object.keys(t).forEach((n) => {
    const l = s[n], i = e.getAttribute(l.attribute), o = e[n];
    i != null && (l.value = l.parse ? M(i) : i), o != null && (l.value = Array.isArray(o) ? o.slice(0) : o), l.reflect && m(e, l.attribute, l.value, !!l.parse), Object.defineProperty(e, n, {
      get() {
        return l.value;
      },
      set(f) {
        const p = l.value;
        l.value = f, l.reflect && m(this, l.attribute, l.value, !!l.parse);
        for (let c = 0, g = this.__propertyChangedCallbacks.length; c < g; c++)
          this.__propertyChangedCallbacks[c](n, f, p);
      },
      enumerable: !0,
      configurable: !0
    });
  }), s;
}
function M(e) {
  if (e)
    try {
      return JSON.parse(e);
    } catch {
      return e;
    }
}
function m(e, t, s, r) {
  if (s == null || s === !1) return e.removeAttribute(t);
  let n = r ? JSON.stringify(s) : s;
  e.__updating[t] = !0, n === "true" && (n = ""), e.setAttribute(t, n), Promise.resolve().then(() => delete e.__updating[t]);
}
function ie(e) {
  return e.replace(/\.?([A-Z]+)/g, (t, s) => "-" + s.toLowerCase()).replace("_", "-").replace(/^-/, "");
}
function z(e) {
  return e != null && (typeof e == "object" || typeof e == "function");
}
function oe(e) {
  return Object.prototype.toString.call(e) === "[object Function]";
}
function ue(e) {
  return typeof e == "function" && e.toString().indexOf("class") === 0;
}
let P;
function fe(e, t) {
  const s = Object.keys(t);
  return class extends e {
    static get observedAttributes() {
      return s.map((n) => t[n].attribute);
    }
    constructor() {
      super(), this.__initialized = !1, this.__released = !1, this.__releaseCallbacks = [], this.__propertyChangedCallbacks = [], this.__updating = {}, this.props = {};
    }
    connectedCallback() {
      if (this.__initialized) return;
      this.__releaseCallbacks = [], this.__propertyChangedCallbacks = [], this.__updating = {}, this.props = le(this, t);
      const n = re(this.props), l = this.Component, i = P;
      try {
        P = this, this.__initialized = !0, ue(l) ? new l(n, {
          element: this
        }) : l(n, {
          element: this
        });
      } finally {
        P = i;
      }
    }
    async disconnectedCallback() {
      if (await Promise.resolve(), this.isConnected) return;
      this.__propertyChangedCallbacks.length = 0;
      let n = null;
      for (; n = this.__releaseCallbacks.pop(); ) n(this);
      delete this.__initialized, this.__released = !0;
    }
    attributeChangedCallback(n, l, i) {
      if (this.__initialized && !this.__updating[n] && (n = this.lookupProp(n), n in t)) {
        if (i == null && !this[n]) return;
        this[n] = t[n].parse ? M(i) : i;
      }
    }
    lookupProp(n) {
      if (t)
        return s.find((l) => n === l || n === t[l].attribute);
    }
    get renderRoot() {
      return this.shadowRoot || this.attachShadow({
        mode: "open"
      });
    }
    addReleaseCallback(n) {
      this.__releaseCallbacks.push(n);
    }
    addPropertyChangedCallback(n) {
      this.__propertyChangedCallbacks.push(n);
    }
  };
}
function ce(e, t = {}, s = {}) {
  const {
    BaseElement: r = HTMLElement,
    extension: n,
    customElements: l = window.customElements
  } = s;
  return (i) => {
    if (!e) throw new Error("tag is required to register a Component");
    let o = l.get(e);
    return o ? (o.prototype.Component = i, o) : (o = fe(r, ne(t)), o.prototype.Component = i, o.prototype.registeredTag = e, l.define(e, o, n), o);
  };
}
function ae(e) {
  const t = Object.keys(e), s = {};
  for (let r = 0; r < t.length; r++) {
    const [n, l] = Z(e[t[r]]);
    Object.defineProperty(s, t[r], {
      get: n,
      set(i) {
        l(() => i);
      }
    });
  }
  return s;
}
function he(e) {
  if (e.assignedSlot && e.assignedSlot._$owner) return e.assignedSlot._$owner;
  let t = e.parentNode;
  for (; t && !t._$owner && !(t.assignedSlot && t.assignedSlot._$owner); )
    t = t.parentNode;
  return t && t.assignedSlot ? t.assignedSlot._$owner : e._$owner;
}
function pe(e) {
  return (t, s) => {
    const { element: r } = s;
    return W((n) => {
      const l = ae(t);
      r.addPropertyChangedCallback((o, f) => l[o] = f), r.addReleaseCallback(() => {
        r.renderRoot.textContent = "", n();
      });
      const i = e(l, s);
      return te(r.renderRoot, i);
    }, he(r));
  };
}
function ye(e, t, s) {
  return arguments.length === 2 && (s = t, t = {}), ce(e, t)(pe(s));
}
export {
  ge as a,
  ye as c
};
