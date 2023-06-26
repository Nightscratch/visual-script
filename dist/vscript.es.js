const r = (s) => s.getBoundingClientRect();
function p(s, e) {
  let n = r(s), t = r(e);
  s.style.left = `${n.left - t.left}px`, s.style.top = `${n.top - t.top}px`;
}
function g(s) {
  let e = !1, n = 0, t = 0, l = null;
  function a(u) {
    s.draggableBlock.includes(u.target) && (e = !0, l = r(s.element), s.parentInput && p(s.element, s.space.element), s.displayElement.classList.add("drag-block"), s.dragStart(), n = u.clientX - l.left, t = u.clientY - l.top, h());
  }
  function o(u) {
    if (e) {
      const f = u.clientX - n, v = u.clientY - t;
      s.element.style.left = `${f}px`, s.element.style.top = `${v}px`;
    }
  }
  function i() {
    e = !1, s.displayElement.classList.remove("drag-block"), s.dragEnd(), m();
  }
  function h() {
    document.addEventListener("mousemove", o), document.addEventListener("mouseup", i);
  }
  function m() {
    document.removeEventListener("mousemove", o), document.removeEventListener("mouseup", i);
  }
  s.element.addEventListener("mousedown", a);
}
const b = (s) => {
  let e = null;
  s.element.addEventListener("contextmenu", (n) => {
    if (!s.draggableBlock.includes(n.target))
      return;
    if (n.preventDefault(), e) {
      document.body.removeChild(e), e = null;
      return;
    }
    e = document.createElement("div"), e.style.position = "absolute", e.style.left = `${n.clientX}px`, e.style.top = `${n.clientY}px`;
    const t = document.createElement("button");
    t.innerText = "复制", t.addEventListener("click", () => {
      s.copy();
    }), e.appendChild(t);
    const l = document.createElement("button");
    l.addEventListener("click", () => {
      s.delete();
    }), l.innerText = "删除", e.appendChild(l), document.body.appendChild(e);
  }), document.addEventListener("click", (n) => {
    e && !s.element.contains(n.target) && (document.body.removeChild(e), e = null);
  });
}, d = (s, e) => {
  const n = r(s), t = r(e);
  return { dis: Math.round(Math.abs(t.left - n.left) + Math.abs(t.top - n.top)), e1: n, e2: t };
};
class c {
  constructor(e) {
    this.parentInput = null, this.draggableBlock = [], !e.create && e.element && (this.element = e.element);
  }
  getInput() {
    Object.keys(this.inputs).forEach((e) => {
      this.inputs[e].element = this.element.querySelector(`[id="input-${e}"]`);
    }), this.draggableBlock = Array.from(this.element.querySelectorAll('[drag="true"]')), this.displayElement = this.element.querySelector('[id="block-display"]');
  }
  dragEnd() {
    const e = this.getSmallestChild(), n = [];
    for (const t of this.space.blocks)
      if (t != this)
        for (const [l, a] of Object.entries(t.inputs)) {
          const o = d(a.element, this.element);
          if (o.dis < 25)
            n.push({
              inputId: l,
              distance: o.dis,
              block: t,
              down: null
            });
          else if (l === "next" && !t.parentInput) {
            const i = d(t.element, e.element);
            Math.abs(i.e1.left - i.e2.left) < 25 && Math.abs(i.e1.top - i.e2.bottom) < 25 && n.push({
              inputId: l,
              distance: o.dis,
              block: t,
              down: e
            });
          }
        }
    if (n.length > 0) {
      const t = n.reduce((l, a) => a.distance < l.distance ? a : l);
      this.handleConnect(t.block.inputs[t.inputId], t);
    }
  }
  dragStart() {
    this.element.classList.remove("input-block"), this.space.element.appendChild(this.element), this.parentInput && (this.parentInput.value = null), this.parentInput = null;
  }
  // a 将该积木脱离输入
  solitary() {
    this.parentInput && (this.parentInput.value = null), p(this.element, this.space.element), this.dragStart();
  }
  // 将该积木放入输入
  enterInput(e) {
    e.value = this, e.element.appendChild(this.element), this.element.classList.add("input-block"), this.parentInput = e;
  }
  getSmallestChild() {
    let e = this;
    for (; e.inputs.next.value instanceof c; )
      e = e.inputs.next.value;
    return e;
  }
  handleConnect(e, n) {
    if (n.down && n.block != this)
      n.block.enterInput(n.down.inputs.next);
    else {
      let t = null;
      e.value && (t = e.value, t.solitary()), this.enterInput(e), t && this.inputs.next && t.enterInput(this.getSmallestChild().inputs.next);
    }
  }
  clone() {
    return new this.space.blockClasses[this.constructor.name]({ create: !0 });
  }
  copy(e = !0) {
    e && (this.parentInput = null);
    let n = this.clone();
    return this.space.addBlock(n), Object.keys(this.inputs).forEach((t) => {
      if (this.inputs[t].value instanceof c) {
        console.log(this.inputs[t]);
        let l = this.inputs[t].value.copy(!1);
        n.inputs[t].value = l, l.enterInput(n.inputs[t]);
      } else
        n.inputs[t].value = this.inputs[t].value;
    }), n;
  }
  delete(e = !0) {
    e && this.element.remove(), this.parentInput && (this.parentInput.value = null), this.space.removeBlock(this), Object.keys(this.inputs).forEach((n) => {
      this.inputs[n].value instanceof c && this.inputs[n].value.delete(!1);
    });
  }
}
class y extends c {
  constructor(e) {
    super(e), this.inputs = {
      step: {
        type: "input",
        value: null,
        element: null
      },
      next: {
        type: "next",
        value: null,
        element: null
      }
    }, this.blockName = "moveBlock", this.create();
  }
  create() {
    this.element = document.createElement("div"), this.element.setAttribute("class", "block"), this.element.innerHTML = `
        <div id="block-display" drag="true">
            <p class="block-text" drag="true">action</p>
            <div class="block-input" id="input-step"></div>
        </div>
        <div class="next-input" id="input-next"></div>
        `.replace(" ", ""), this.getInput();
  }
}
const E = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Block: c,
  MoveBlock: y
}, Symbol.toStringTag, { value: "Module" }));
class x {
  constructor(e) {
    this.blocks = [], this.blockClasses = {}, this.element = e.element;
  }
  addBlock(e) {
    e.space = this, this.blocks.push(e), this.element.appendChild(e.element), g(e), b(e);
  }
  removeBlock(e) {
    this.blocks.splice(this.blocks.indexOf(e), 1);
  }
  registerBlock(e) {
    this.blockClasses[e.name] = e;
  }
}
export {
  x as VisualBlock,
  E as blocks
};
