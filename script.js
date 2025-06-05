const themeToggleButton = document.querySelector('.search-bar .icon:last-child'); // A better selector is needed
const body = document.body;

themeToggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
 
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark-mode');
    } else {
        localStorage.removeItem('theme');
    }
    
});


if (localStorage.getItem('theme') === 'dark-mode') {
    body.classList.add('dark-mode');
}