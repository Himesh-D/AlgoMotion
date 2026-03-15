import { ExecutionEngine } from './src/engine/ExecutionEngine.js';

const engine = new ExecutionEngine();
const array = [2, 7, 11, 15];
const params = {};
const code = `
let left = 0;
let right = array.length - 1;

while (left < right) {
  let temp = array[left];
  array[left] = array[right];
  array[right] = temp;
  left++;
  right--;
}
`;

const result = engine.execute(array, params, code);
console.log("\nSuccess:", result.success);
console.log("Number of states:", result.states.length);
if (result.states.length > 0) {
  result.states.forEach((state, i) => {
     console.log(`State ${i} [${state.status}]: array = ${state.array}, pointers = ${JSON.stringify(state.pointers)}`);
  });
}
