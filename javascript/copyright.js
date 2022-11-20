// This script will set the current year to the copyright notice
// in the footer of the page

document.getElementById('copy-year').textContent = String(new Date().getFullYear()).padStart(4, "0");