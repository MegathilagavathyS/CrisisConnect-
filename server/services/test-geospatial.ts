import { identifyGeospatialEntities, formatGeospatialOutput } from './geospatial-query';

// Test cases based on the examples provided
const testCases = [
  {
    input: "Which of the following saw the highest average temperature in January, Maharashtra, Ahmedabad or entire New-Zealand?",
    expected: ["Maharashtra", "Ahmedabad", "New Zealand"]
  },
  {
    input: "Show me a graph of rainfall for Chennai for the month of October",
    expected: ["Chennai"]
  },
  {
    input: "Compare population density between California, Texas and New York",
    expected: ["California", "Texas", "New York"]
  },
  {
    input: "What's the weather like in Mumbai, Delhi and Bangalore?",
    expected: ["Mumbai", "Delhi", "Bangalore"]
  },
  {
    input: "Emergency in TN, food shortage in New Dlhi area.",
    expected: ["Tamil Nadu", "New Delhi"]
  }
];

function runTests() {
  console.log("=== Geospatial Query System Tests ===\n");
  
  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: "${testCase.input}"`);
    console.log(`Expected: [${testCase.expected.join(', ')}]`);
    
    const entities = identifyGeospatialEntities(testCase.input);
    const identifiedNames = entities.map(e => e.canonicalName);
    
    console.log(`Identified: [${identifiedNames.join(', ')}]`);
    console.log(`Match: ${JSON.stringify(testCase.expected.sort()) === JSON.stringify(identifiedNames.sort()) ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Formatted Output:\n${formatGeospatialOutput(testCase.input)}`);
    console.log("---\n");
  });
}

// Run tests
runTests();

export { runTests };
