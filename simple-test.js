// Simple test to check if Firebase module loads correctly with Jest
const { exec } = require('child_process');

// Run a simple Jest test to see what happens
const testCode = `
const { validateEnvironmentVariables } = require('./src/config/firebase');

console.log('Testing if validateEnvironmentVariables function exists...');
console.log('Type of validateEnvironmentVariables:', typeof validateEnvironmentVariables);

if (typeof validateEnvironmentVariables === 'function') {
  console.log('Function exists! Testing it...');
  try {
    const result = validateEnvironmentVariables();
    console.log('Function executed successfully:', result);
  } catch (error) {
    console.error('Error executing function:', error.message);
  }
} else {
  console.log('Function does not exist');
}
`;

// Write to a temporary test file
const fs = require('fs');
fs.writeFileSync('temp-test.js', testCode);

// Run with Node (simulating how Jest might load it)
exec('cd mindloop-mobile && node temp-test.js', (error, stdout, stderr) => {
  console.log('STDOUT:', stdout);
  console.error('STDERR:', stderr);
  if (error) {
    console.error('EXECUTION ERROR:', error);
  }
  
  // Clean up
  fs.unlinkSync('temp-test.js');
});