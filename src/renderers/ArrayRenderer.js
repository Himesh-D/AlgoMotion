import anime from 'animejs';

export class ArrayRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.boxWidth = 60;
    this.gap = 24; // 1.5rem equivalent
    this.boxElements = [];
    this.pointerElements = {};
    this.arrayContainer = null;
  }

  /**
   * Initializes the array canvas with given values.
   * Preserves non-array children (e.g. #prism-bg overlay).
   */
  initialize(array) {
    this.reset(); // removes only .array-container, preserves prism-bg

    const arrayContainer = document.createElement('div');
    arrayContainer.className = 'array-container';
    this.arrayContainer = arrayContainer;

    array.forEach((val, index) => {
      const box = document.createElement('div');
      box.className = 'array-box';
      box.innerText = val;
      box.dataset.index = index;
      arrayContainer.appendChild(box);
      this.boxElements.push(box);
    });

    this.container.appendChild(arrayContainer);
  }

  /**
   * Animates a pointer to a specific target index.
   */
  movePointer(name, targetIndex, isDown = false) {
    if (!this.pointerElements[name]) {
      this._createPointer(name, targetIndex, isDown);
      return;
    }

    const pointer = this.pointerElements[name];
    if (pointer.currentIndex === targetIndex) return;

    const targetLeftPx = targetIndex * (this.boxWidth + this.gap) + (this.boxWidth / 2);

    anime({
      targets: pointer.element,
      left: targetLeftPx,
      duration: 400,
      easing: 'easeInOutQuad'
    });

    pointer.currentIndex = targetIndex;
  }

  /**
   * Internal helper to create a new pointer.
   */
  _createPointer(name, initialIndex, isDown) {
    const pointerContainer = document.createElement('div');
    pointerContainer.className = 'pointer-indicator';

    const triangle = document.createElement('div');
    triangle.className = `pointer-triangle ${isDown ? 'down' : ''}`;

    const label = document.createElement('div');
    label.className = 'pointer-label';
    label.innerText = name;

    if (isDown) {
      pointerContainer.appendChild(label);
      pointerContainer.appendChild(triangle);
      pointerContainer.style.top = '-2.5rem';
    } else {
      pointerContainer.appendChild(triangle);
      pointerContainer.appendChild(label);
      pointerContainer.style.bottom = '-2.5rem';
    }

    pointerContainer.style.position = 'absolute';
    pointerContainer.style.left = `${initialIndex * (this.boxWidth + this.gap) + (this.boxWidth / 2)}px`;

    this.arrayContainer.appendChild(pointerContainer);

    this.pointerElements[name] = {
      element: pointerContainer,
      currentIndex: initialIndex
    };

    anime({
      targets: pointerContainer,
      opacity: [0, 1],
      translateY: isDown ? [-15, 0] : [15, 0],
      duration: 300,
      easing: 'easeOutBack'
    });
  }

  /**
   * Removes a pointer from DOM.
   */
  removePointer(name) {
    if (this.pointerElements[name]) {
      const el = this.pointerElements[name].element;
      anime.remove(el);
      el.remove();
      delete this.pointerElements[name];
    }
  }

  /**
   * Highlights specific boxes.
   */
  highlight(indices, type = 'highlight') {
    this.clearHighlights();
    indices.forEach(index => {
      if (this.boxElements[index]) {
        this.boxElements[index].classList.add(type);
        anime({
          targets: this.boxElements[index],
          scale: [1, 1.1, 1],
          duration: 400,
          easing: 'easeInOutQuad'
        });
      }
    });
  }

  /**
   * Main render function that processes a single execution state.
   */
  renderState(state) {
    if (!state) return;

    // 1. Array value updates
    if (state.array && state.array.length === this.boxElements.length) {
      state.array.forEach((val, i) => {
        const box = this.boxElements[i];
        if (box && box.innerText !== String(val)) {
          box.innerText = val;
          // CSS class flash
          box.classList.remove('flash');
          void box.offsetWidth; 
          box.classList.add('flash');
        }
      });
    }

    // 2. Swap operations - specialized animation
    if (state.operation === 'swap' && state.highlights && state.highlights.length === 2) {
      const idxA = state.highlights[0];
      const idxB = state.highlights[1];
      const boxA = this.boxElements[idxA];
      const boxB = this.boxElements[idxB];

      if (boxA && boxB) {
        // Cancel any pending animations on these boxes
        anime.remove([boxA, boxB]);

        const leftA = idxA * (this.boxWidth + this.gap);
        const leftB = idxB * (this.boxWidth + this.gap);

        anime({
          targets: boxA,
          translateX: leftB - leftA,
          duration: 600,
          easing: 'easeInOutQuint',
          complete: () => {
            anime.set(boxA, { translateX: 0 });
            if (state.array) boxA.innerText = state.array[idxA];
          }
        });

        anime({
          targets: boxB,
          translateX: leftA - leftB,
          duration: 600,
          easing: 'easeInOutQuint',
          complete: () => {
            anime.set(boxB, { translateX: 0 });
            if (state.array) boxB.innerText = state.array[idxB];
          }
        });
      }
    }

    // 3. Pointers
    const currentPointers = state.pointers || {};
    const currentNames = Object.keys(currentPointers);
    
    // Remove pointers not in current state
    Object.keys(this.pointerElements).forEach(existingName => {
      if (!currentNames.includes(existingName)) {
        this.removePointer(existingName);
      }
    });

    // Move or create current pointers
    currentNames.forEach((name, i) => {
      this.movePointer(name, currentPointers[name], i % 2 === 1);
    });

    // 4. Highlights
    this.highlight(state.highlights || [], state.operation === 'swap' ? 'highlight-swap' : 'highlight');
  }

  clearHighlights() {
    this.boxElements.forEach(box => { box.className = 'array-box'; });
  }

  /**
   * Resets only the array-container element.
   * Preserves #prism-bg and other overlays in the canvas.
   */
  reset() {
    this.boxElements.forEach(box => anime.remove(box));
    Object.values(this.pointerElements).forEach(ptr => anime.remove(ptr.element));

    // Only remove the managed array-container — leave everything else intact
    if (this.arrayContainer && this.arrayContainer.parentElement === this.container) {
      this.container.removeChild(this.arrayContainer);
    }
    this.arrayContainer = null;
    this.boxElements = [];
    this.pointerElements = {};
  }
}
