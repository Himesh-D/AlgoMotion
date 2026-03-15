export class UIRenderer {
  constructor(stepCounterId, sliderId) {
    this.stepCounter = document.getElementById(stepCounterId);
    this.slider = document.getElementById(sliderId);
    this.canvasStepBadge = document.getElementById('canvas-step-badge');
    this.explanationText = document.getElementById('explanation-text');
    this.varChipsOverlay = document.getElementById('var-chips-overlay');
    this.previousVariables = {};
  }

  /**
   * Render floating variable chips inside the canvas overlay.
   */
  renderVariableChips(variables) {
    if (!this.varChipsOverlay) return;

    if (!variables || Object.keys(variables).length === 0) {
      this.varChipsOverlay.innerHTML = '';
      return;
    }

    this.varChipsOverlay.innerHTML = '';
    Object.keys(variables).forEach(key => {
      const value = variables[key];
      const isChanged =
        this.previousVariables[key] !== undefined &&
        this.previousVariables[key] !== value;

      const chip = document.createElement('div');
      chip.className = `var-chip${isChanged ? ' changed' : ''}`;

      const nameEl = document.createElement('span');
      nameEl.className = 'var-chip-name';
      nameEl.textContent = key;

      const sepEl = document.createElement('span');
      sepEl.className = 'var-chip-sep';
      sepEl.textContent = ':';

      const valEl = document.createElement('span');
      valEl.className = 'var-chip-value';
      valEl.textContent = typeof value === 'object' ? JSON.stringify(value) : value;

      chip.appendChild(nameEl);
      chip.appendChild(sepEl);
      chip.appendChild(valEl);
      this.varChipsOverlay.appendChild(chip);
    });

    this.previousVariables = { ...variables };
  }

  updateTimeline(currentStep, totalSteps) {
    if (this.stepCounter) this.stepCounter.innerText = `Step ${currentStep} / ${totalSteps}`;
    if (this.canvasStepBadge) this.canvasStepBadge.innerText = `${currentStep} / ${totalSteps}`;
    if (this.slider) {
      this.slider.value = currentStep;
      this.slider.max = totalSteps;
    }
  }

  updateExplanation(status) {
    if (this.explanationText) {
      this.explanationText.textContent = status || 'Step loaded.';
    }
  }

  reset() {
    this.previousVariables = {};
    if (this.varChipsOverlay) this.varChipsOverlay.innerHTML = '';
    if (this.stepCounter) this.stepCounter.innerText = 'Step 0 / 0';
    if (this.canvasStepBadge) this.canvasStepBadge.innerText = '0 / 0';
    if (this.explanationText) this.explanationText.textContent = 'Waiting for execution...';
    if (this.slider) { this.slider.value = 0; this.slider.max = 0; }
  }
}
