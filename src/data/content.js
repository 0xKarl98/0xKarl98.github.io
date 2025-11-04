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
                title: "Smart Contract Engineer",
                company: "Hashcloak",
                period: "2020 - 2022",
                description: "Smart contract engineering at Hashcloak."
            },
            {
                title: "Security Engineer",
                company: "Silent Protocol",
                period: "2022 - 2025",
                description: "Security engineering at Silent Protocol."
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
            "Rust", "TypeScript", "JavaScript", "Solidity", "Zero-knowledge"
        ],
        
        // 新增 Hackathon 模块
        hackathons: [
            {
                title: "Noir Hackathon",
                event: "Noir Hackathon",
                period: "May 2025",
                description: "Team 'Genie' demo: crypto on-ramping via Binance internal transfer.",
                link: "https://www.youtube.com/watch?v=Tf8v8zD6Bb4&t=2s"
            }
        ],
        
        // 新增 Grants 模块
        grants: [
            {
                title: "NRG#4 Grant",
                organization: "Noir Lang",
                period: "June 2025",
                description: "Proposal awarded grant: Noir WebProof SDK.",
                link: "https://github.com/orgs/noir-lang/discussions/8595"
            }
        ]
    },
    
    // Blogs page content
    blogs: {
        title: "Technical Insights",
        subtitle: "Thoughts on software development, technology trends, and digital innovation",
        articles: [
            {
                title: "Veil: Regulatory-compliant stablecoin design",
                description: "Regulatory-compliant stablecoin design at Privacy-focused ZK-driven blockchain like Miden",
                date: "2025-01-01",
                readTime: "15 min read",
                tags: ["ZK", "Stablecoin", "Compliance", "Miden"],
                link: "https://hackmd.io/YyX-ngvkSM-N1V5_OnLHMQ"
            },
            {
                title: "How Bulletproofs Leverage the Sum-check Protocol",
                description: "Short note on Bulletproof",
                date: "2025-01-01",
                readTime: "10 min read",
                tags: ["ZK", "Bulletproofs", "Cryptography"],
                link: "https://hackmd.io/30uvG7yTQHChUIBIXAflSw"
            }
        ]
    },
    
    // Projects page content
    projects: {
        title: "Featured Projects",
        subtitle: "I have contributed to a bunch of cutting-edge open-source projects",
        items: [
            {
                title: "Noir Circuits",
                description: "A monorepo of reusable Noir circuits.",
                technologies: ["Noir"],
                links: {
                    github: "https://github.com/ModoriLabs/noir-web-prover-circuits"
                }
            },
            {
                title: "Ethereum Protocol",
                description: "Modular, contributor-friendly and blazing-fast implementation of the Ethereum protocol, in Rust.",
                technologies: ["Rust"],
                links: {
                    github: "https://github.com/paradigmxyz/reth"
                }
            },

            {
                title: "Noir Symmetric Crypto",
                description: "A collection of symmetric cryptographic algorithms implemented in Noir, including AES-128, AES-256, and ChaCha20.",
                technologies: ["Noir", "Cryptography"],
                links: {
                    github: "https://github.com/ModoriLabs/noir-symmetric-crypto"
                }
            }
        ]
    },
    
    // Miscellaneous page content
    misc: {
        title: "Miscellaneous",
        subtitle: "Technical talks, research insights, and professional activities",
        
        thoughts: [
            {
                title: "zBlock2 fellowship",
                content: "Participated in zBlock2 fellowship program focusing on blockchain technology and zero-knowledge proofs, presenting research on Proof of Solvency applications.",
                date: "2024-06-24"
            },
            {
                title: "An overview of additive PCS",
                content: "Technical talk on additive polynomial commitment schemes including Bulletproof, KZG, DARK, DORY, and their applications in zero-knowledge proofs, covering transformations to hiding PCS and efficient proof aggregation.",
                date: "2024-01-01"
            }
        ],
        
        links: [
            {
                title: "ZKProof Community",
                url: "https://zkproof.org/",
                description: "Zero-knowledge proof research community"
            },
            {
                title: "Ethereum Research",
                url: "https://ethresear.ch/",
                description: "Ethereum research and discussion forum"
            },
            {
                title: "Cryptography Stack Exchange",
                url: "https://crypto.stackexchange.com/",
                description: "Q&A for cryptography professionals"
            },
            {
                title: "MDN Web Docs",
                url: "https://developer.mozilla.org/",
                description: "Comprehensive resource for web developers"
            },
            {
                title: "GitHub",
                url: "https://github.com/",
                description: "Platform for version control and collaboration"
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