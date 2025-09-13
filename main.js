// main.js

document.addEventListener('DOMContentLoaded', () => {
  // Highlight active nav link based on current page URL
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPath = window.location.pathname.split('/').pop();

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // Role selector (basic stub, can expand for role-based UI)
  const roleSelect = document.getElementById('user-role');
  if (roleSelect) {
    roleSelect.value = localStorage.getItem('userRole') || 'admin';

    roleSelect.addEventListener('change', (e) => {
      localStorage.setItem('userRole', e.target.value);
      // Optional: trigger UI change based on role here
      alert(`Role changed to ${e.target.value}`);
    });
  }

  // Dark mode toggle (optional)
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    // Load saved preference
    if (localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('dark-mode');
      darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener('change', () => {
      if (darkModeToggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
      }
    });
  }
});