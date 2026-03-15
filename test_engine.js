import { ExecutionEngine } from './src/engine/ExecutionEngine.js';

const engine = new ExecutionEngine();
const array = [2, 7, 11, 15];
const params = { target: 9 };
const code = `
let left = 0;
let right = array.length - 1;

while (left < right) {
  let sum = array[left] + array[right];
  
  if (sum === target) {
    return [left, right];
  } else if (sum < target) {
    left++;
  } else {
    right--;
  }
}
return [];
`;

console.log("Instrumented:", engine.instrumentCode(code));

const result = engine.execute(array, params, code);
console.log("\nSuccess:", result.success);
if (!result.success) console.error("Error:", result.error);
console.log("\nNumber of states:", result.states.length);
if (result.states.length > 0) {
  console.log("First state:", result.states[0]);
  console.log("Last state:", result.states[result.states.length - 1]);
}
