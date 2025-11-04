/**
 * Content Data - Static content for the website
 * Centralized content management for easy maintenance
 */

export const CONTENT_DATA = {
    // Home page content
    home: {
        hero: {
            title: "Karl's Digital Space",
            subtitle: "Software Engineer & Technology Enthusiast",
            description: "Exploring the intersection of technology, creativity, and human experience."
        },
        
        experience: [
            {
                title: "Software Engineer",
                company: "Tech Innovation Corp",
                period: "2022 - Present",
                description: "Building scalable web applications and leading frontend architecture initiatives."
            },
            {
                title: "Full Stack Developer",
                company: "Digital Solutions Ltd",
                period: "2020 - 2022",
                description: "Developed and maintained multiple client projects using modern web technologies."
            },
            {
                title: "Junior Developer",
                company: "Startup Hub",
                period: "2018 - 2020",
                description: "Contributed to various projects and gained experience in agile development."
            }
        ],
        
        education: [
            {
                degree: "Bachelor of Computer Science",
                institution: "University of Technology",
                period: "2014 - 2018",
                description: "Focused on software engineering, algorithms, and system design."
            }
        ],
        
        skills: [
            "JavaScript", "TypeScript", "React", "Vue.js", "Node.js", 
            "Python", "Go", "Docker", "AWS", "MongoDB", "PostgreSQL"
        ],
        
        quotes: [
            "Code is poetry written in logic.",
            "Simplicity is the ultimate sophistication.",
            "Technology should empower, not complicate."
        ]
    },
    
    // Blogs page content
    blogs: {
        title: "Technical Insights",
        subtitle: "Thoughts on software development, technology trends, and digital innovation",
        articles: [
            {
                title: "The Art of Clean Code",
                description: "Exploring principles and practices for writing maintainable, readable code that stands the test of time.",
                date: "2024-01-15",
                readTime: "8 min read",
                tags: ["Clean Code", "Best Practices", "Software Engineering"]
            },
            {
                title: "Modern Frontend Architecture",
                description: "A deep dive into building scalable frontend applications with modern tools and frameworks.",
                date: "2024-01-08",
                readTime: "12 min read",
                tags: ["Frontend", "Architecture", "React"]
            },
            {
                title: "The Future of Web Development",
                description: "Examining emerging trends and technologies that will shape the future of web development.",
                date: "2023-12-20",
                readTime: "10 min read",
                tags: ["Web Development", "Future Tech", "Innovation"]
            },
            {
                title: "Performance Optimization Strategies",
                description: "Practical techniques for optimizing web application performance and user experience.",
                date: "2023-12-05",
                readTime: "15 min read",
                tags: ["Performance", "Optimization", "User Experience"]
            },
            {
                title: "Understanding System Design",
                description: "Fundamental concepts and patterns for designing scalable and reliable systems.",
                date: "2023-11-15",
                readTime: "20 min read",
                tags: ["System Design", "Architecture", "Scalability"]
            }
        ]
    },
    
    // Projects page content
    projects: {
        title: "Featured Projects",
        subtitle: "A selection of projects that showcase my skills and interests",
        items: [
            {
                title: "E-Commerce Platform",
                description: "Full-stack e-commerce solution with modern UI, payment integration, and inventory management.",
                technologies: ["React", "Node.js", "MongoDB", "Stripe"],
                links: {
                    github: "https://github.com/0xKarl98/ecommerce-platform",
                    demo: "https://demo-ecommerce.com",
                    live: "https://ecommerce-platform.vercel.app"
                }
            },
            {
                title: "Task Management System",
                description: "Collaborative task management application with real-time updates and team collaboration features.",
                technologies: ["Vue.js", "Express", "PostgreSQL", "Socket.io"],
                links: {
                    github: "https://github.com/0xKarl98/task-manager",
                    demo: "https://demo-tasks.com"
                }
            },
            {
                title: "Personal Portfolio",
                description: "This modular portfolio website built with modern web technologies and clean architecture.",
                technologies: ["HTML5", "CSS3", "JavaScript", "ES6 Modules"],
                links: {
                    github: "https://github.com/0xKarl98/0xKarl98.github.io"
                }
            },
            {
                title: "API Gateway Service",
                description: "Microservices API gateway with authentication, rate limiting, and request routing.",
                technologies: ["Go", "Docker", "Kubernetes", "Redis"],
                links: {
                    github: "https://github.com/0xKarl98/api-gateway"
                }
            },
            {
                title: "Data Visualization Dashboard",
                description: "Interactive dashboard for data visualization with charts, graphs, and real-time updates.",
                technologies: ["React", "D3.js", "Python", "Flask"],
                links: {
                    github: "https://github.com/0xKarl98/data-dashboard",
                    demo: "https://demo-dashboard.com"
                }
            }
        ]
    },
    
    // Miscellaneous page content
    misc: {
        title: "Miscellaneous",
        subtitle: "Random thoughts, interesting links, and other curiosities",
        
        thoughts: [
            {
                title: "On Continuous Learning",
                content: "Technology evolves rapidly, and staying current requires constant learning. I believe in the power of curiosity and the importance of building a strong foundation in computer science fundamentals.",
                date: "2024-01-10"
            },
            {
                title: "The Beauty of Simple Solutions",
                content: "Complex problems don't always require complex solutions. Sometimes the most elegant approach is the simplest one that gets the job done effectively.",
                date: "2023-12-25"
            },
            {
                title: "Collaboration in Tech",
                content: "Great software is rarely built in isolation. The best projects come from teams that communicate well, share knowledge, and support each other's growth.",
                date: "2023-11-30"
            }
        ],
        
        links: [
            {
                title: "MDN Web Docs",
                url: "https://developer.mozilla.org/",
                description: "Comprehensive resource for web developers"
            },
            {
                title: "GitHub",
                url: "https://github.com/",
                description: "Platform for version control and collaboration"
            },
            {
                title: "Stack Overflow",
                url: "https://stackoverflow.com/",
                description: "Q&A community for programmers"
            },
            {
                title: "CSS-Tricks",
                url: "https://css-tricks.com/",
                description: "Articles and tutorials on web development"
            },
            {
                title: "Smashing Magazine",
                url: "https://www.smashingmagazine.com/",
                description: "Magazine for web designers and developers"
            }
        ]
    },
    
    // Navigation structure
    navigation: [
        { name: "Home", page: "home", icon: "🏠" },
        { name: "Blogs", page: "blogs", icon: "📝" },
        { name: "Projects", page: "projects", icon: "💻" },
        { name: "Misc", page: "misc", icon: "🔗" }
    ],
    
    // Site metadata
    site: {
        title: "Karl's Digital Space",
        description: "Personal website and portfolio of Karl, software engineer and technology enthusiast",
        author: "Karl",
        keywords: ["software engineer", "web developer", "programming", "technology"],
        social: {
            github: "https://github.com/0xKarl98",
            linkedin: "https://linkedin.com/in/karl-developer",
            email: "karl@example.com"
        }
    }
};

/**
 * Content utility functions
 */
export const ContentUtils = {
    /**
     * Get content for specific page
     * @param {string} page - Page name
     * @returns {Object} Page content
     */
    getPageContent(page) {
        return CONTENT_DATA[page] || null;
    },
    
    /**
     * Get navigation items
     * @returns {Array} Navigation items
     */
    getNavigation() {
        return CONTENT_DATA.navigation;
    },
    
    /**
     * Get site metadata
     * @returns {Object} Site metadata
     */
    getSiteMetadata() {
        return CONTENT_DATA.site;
    },
    
    /**
     * Format date to readable format
     * @param {string} dateString - Date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    /**
     * Get current year
     * @returns {number} Current year
     */
    getCurrentYear() {
        return new Date().getFullYear();
    }
};