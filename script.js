const themeToggleButton = document.querySelector('.search-bar .icon:last-child'); 
const body = document.body;

// Theme toggle functionality
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

// Navigation functionality
const navItems = document.querySelectorAll('.menu li'); 
const contentSections = document.querySelectorAll('.content-section'); 

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetId = item.textContent.trim().toLowerCase(); 
        contentSections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add('active'); 
            } else {
                section.classList.remove('active'); 
            }
        });
    });
});

document.getElementById('home')?.classList.add('active');

