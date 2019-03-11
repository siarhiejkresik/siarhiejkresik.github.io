export default class {
  constructor(node) {
    this.node = node;
  }

  findCheckboxes() {
    // FIX filter to only chart checkboxes, we don't need all inputs in the node
    return this.node.getElementsByTagName('input');
  }

  disable() {
    for (const c of this.findCheckboxes()) {
      if (!c.checked) {
        c.disabled = true;
      }
    }
  }

  enable() {
    for (const c of this.findCheckboxes()) {
      if (c.disabled) {
        c.disabled = false;
      }
    }
  }
}
