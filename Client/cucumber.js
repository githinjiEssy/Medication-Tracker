// cucumber.js
export default {
  // Path to your feature files
  paths: ['tests/features/**/*.feature'],
  
  // Path to your step definition files
  import: ['tests/steps/**/*.js'],
  
  // Formatting for the terminal output
  format: ['summary', 'progress-bar'],
  
  // Enable snippets to help you write missing steps
  publishQuiet: true
};