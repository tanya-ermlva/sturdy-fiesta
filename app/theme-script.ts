// This script runs before the page renders
// It checks: saved preference → system preference → default to light

export const themeScript = `
(function() {
  // Try to get saved preference
  var saved = localStorage.getItem('theme');
  
  // If saved preference exists, use it
  if (saved === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (saved === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // No saved preference, check system
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }
})();
`;