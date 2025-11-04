/**
 * Content Loader - Dynamic content loading and rendering
 * Handles loading and rendering of page content components
 */

import { CONTENT_DATA, ContentUtils } from '../data/content.js';

export class ContentLoader {
    constructor() {
        this.contentCache = new Map();
        this.loadingPromises = new Map();
        this.init();
    }

    /**
     * Initialize content loader
     */
    init() {
        this.setupContentCache();
        this.preloadCriticalContent();
    }

    /**
     * Set up content cache with pre-rendered content
     */
    setupContentCache() {
        // Pre-render home content
        this.contentCache.set('home', this.renderHomeContent());
        
        // Pre-render other content
        this.contentCache.set('blogs', this.renderBlogsContent());
        this.contentCache.set('projects', this.renderProjectsContent());
        this.contentCache.set('misc', this.renderMiscContent());
    }

    /**
     * Preload critical content for better performance
     */
    preloadCriticalContent() {
        // Preload home content first
        this.loadContentComponent('home').catch(error => {
            console.warn('Failed to preload home content:', error);
        });
    }

    /**
     * Load content component
     * @param {string} page - Page name
     * @returns {Promise<string>} HTML content
     */
    async loadContentComponent(page) {
        // Return cached content if available
        if (this.contentCache.has(page)) {
            return this.contentCache.get(page);
        }

        // Return existing promise if already loading
        if (this.loadingPromises.has(page)) {
            return this.loadingPromises.get(page);
        }

        // Create loading promise
        const loadingPromise = this.fetchContentComponent(page);
        this.loadingPromises.set(page, loadingPromise);

        try {
            const content = await loadingPromise;
            this.contentCache.set(page, content);
            this.loadingPromises.delete(page);
            return content;
        } catch (error) {
            this.loadingPromises.delete(page);
            throw error;
        }
    }

    /**
     * Fetch content component from server
     * @param {string} page - Page name
     * @returns {Promise<string>} HTML content
     */
    async fetchContentComponent(page) {
        try {
            const response = await fetch(`./src/components/content-${page}.html`);
            
            if (!response.ok) {
                throw new Error(`Content not found: ${page}`);
            }
            
            return await response.text();
        } catch (error) {
            console.error(`Failed to load content for page: ${page}`, error);
            
            // Fallback to generated content
            return this.generateFallbackContent(page);
        }
    }

    /**
     * Generate fallback content if component loading fails
     * @param {string} page - Page name
     * @returns {string} Generated HTML content
     */
    generateFallbackContent(page) {
        const content = CONTENT_DATA[page];
        if (!content) {
            return this.generateErrorContent(page);
        }

        switch (page) {
            case 'home':
                return this.renderHomeContent();
            case 'blogs':
                return this.renderBlogsContent();
            case 'projects':
                return this.renderProjectsContent();
            case 'misc':
                return this.renderMiscContent();
            default:
                return this.generateErrorContent(page);
        }
    }

    /**
     * Render home page content
     * @returns {string} HTML content
     */
    renderHomeContent() {
        const data = CONTENT_DATA.home;
        
        return `
            <div class="page-content">
                <!-- Hero Section -->
                <section class="hero-section">
                    <div class="hero-content">
                        <h1 class="hero-title">${data.hero.title}</h1>
                        <p class="hero-subtitle">${data.hero.subtitle}</p>
                        <p class="hero-description">${data.hero.description}</p>
                    </div>
                </section>

                <!-- Resume Section -->
                <section class="resume-section">
                    <!-- Experience -->
                    <div class="resume-block">
                        <h2 class="resume-title">Experience</h2>
                        <div class="experience-list">
                            ${data.experience.map(job => `
                                <div class="experience-item">
                                    <div class="experience-header">
                                        <h3 class="experience-title">${job.title}</h3>
                                        <span class="experience-period">${job.period}</span>
                                    </div>
                                    <div class="experience-company">${job.company}</div>
                                    <p class="experience-description">${job.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Education -->
                    <div class="resume-block">
                        <h2 class="resume-title">Education</h2>
                        <div class="education-list">
                            ${data.education.map(edu => `
                                <div class="education-item">
                                    <div class="education-header">
                                        <h3 class="education-degree">${edu.degree}</h3>
                                        <span class="education-period">${edu.period}</span>
                                    </div>
                                    <div class="education-institution">${edu.institution}</div>
                                    <p class="education-description">${edu.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Hackathons -->
                    <div class="resume-block">
                        <h2 class="resume-title">Hackathons</h2>
                        <div class="hackathon-list">
                            ${data.hackathons.map(hackathon => `
                                <div class="hackathon-item">
                                    <div class="hackathon-header">
                                        <h3 class="hackathon-title">${hackathon.title}</h3>
                                        <span class="hackathon-period">${hackathon.period}</span>
                                    </div>
                                    <div class="hackathon-event">${hackathon.event}</div>
                                    <p class="hackathon-description">${hackathon.description}</p>
                                    ${hackathon.link ? `<a href="${hackathon.link}" target="_blank" class="hackathon-link">View Project →</a>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Grants -->
                    <div class="resume-block">
                        <h2 class="resume-title">Grants & Awards</h2>
                        <div class="grants-list">
                            ${data.grants.map(grant => `
                                <div class="grant-item">
                                    <div class="grant-header">
                                        <h3 class="grant-title">${grant.title}</h3>
                                        <span class="grant-period">${grant.period}</span>
                                    </div>
                                    <div class="grant-organization">${grant.organization}</div>
                                    <p class="grant-description">${grant.description}</p>
                                    ${grant.link ? `<a href="${grant.link}" target="_blank" class="grant-link">View Proposal →</a>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Skills -->
                    <div class="resume-block">
                        <h2 class="resume-title">Skills</h2>
                        <div class="skills-grid">
                            ${data.skills.map(skill => `
                                <span class="skill-tag">${skill}</span>
                            `).join('')}
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    /**
     * Render blogs page content
     * @returns {string} HTML content
     */
    renderBlogsContent() {
        const data = CONTENT_DATA.blogs;
        
        return `
            <div class="page-content">
                <header class="page-header">
                    <h1 class="page-title">${data.title}</h1>
                    <p class="page-subtitle">${data.subtitle}</p>
                </header>

                <div class="articles-grid">
                    ${data.articles.map(article => `
                        <article class="article-card">
                            <div class="article-header">
                                <h3 class="article-title">${article.title}</h3>
                                <div class="article-meta">
                                    <time class="article-date">${ContentUtils.formatDate(article.date)}</time>
                                    <span class="article-read-time">${article.readTime}</span>
                                </div>
                            </div>
                            <p class="article-description">${article.description}</p>
                            <div class="article-tags">
                                ${article.tags.map(tag => `
                                    <span class="tag">${tag}</span>
                                `).join('')}
                            </div>
                        </article>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render projects page content
     * @returns {string} HTML content
     */
    renderProjectsContent() {
        const data = CONTENT_DATA.projects;
        
        return `
            <div class="page-content">
                <header class="page-header">
                    <h1 class="page-title">${data.title}</h1>
                    <p class="page-subtitle">${data.subtitle}</p>
                </header>

                <div class="projects-grid">
                    ${data.items.map(project => `
                        <div class="project-card">
                            <div class="project-header">
                                <h3 class="project-title">${project.title}</h3>
                                <div class="project-links">
                                    ${project.links.github ? `<a href="${project.links.github}" target="_blank" rel="noopener noreferrer" class="project-link">GitHub</a>` : ''}
                                    ${project.links.demo ? `<a href="${project.links.demo}" target="_blank" rel="noopener noreferrer" class="project-link">Demo</a>` : ''}
                                    ${project.links.live ? `<a href="${project.links.live}" target="_blank" rel="noopener noreferrer" class="project-link">Live</a>` : ''}
                                </div>
                            </div>
                            <p class="project-description">${project.description}</p>
                            <div class="project-technologies">
                                ${project.technologies.map(tech => `
                                    <span class="tech-tag">${tech}</span>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render miscellaneous page content
     * @returns {string} HTML content
     */
    renderMiscContent() {
        const data = CONTENT_DATA.misc;
        
        return `
            <div class="page-content">
                <header class="page-header">
                    <h1 class="page-title">${data.title}</h1>
                    <p class="page-subtitle">${data.subtitle}</p>
                </header>

                <!-- Thoughts Section -->
                <section class="misc-section">
                    <h2 class="misc-title">Random Thoughts</h2>
                    <div class="thoughts-list">
                        ${data.thoughts.map(thought => `
                            <div class="thought-item">
                                <h3 class="thought-title">${thought.title}</h3>
                                <p class="thought-content">${thought.content}</p>
                                <time class="thought-date">${ContentUtils.formatDate(thought.date)}</time>
                            </div>
                        `).join('')}
                    </div>
                </section>

                <!-- Links Section -->
                <section class="misc-section">
                    <h2 class="misc-title">Interesting Links</h2>
                    <div class="links-list">
                        ${data.links.map(link => `
                            <div class="link-item">
                                <h3 class="link-title">
                                    <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.title}</a>
                                </h3>
                                <p class="link-description">${link.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </section>
            </div>
        `;
    }

    /**
     * Generate error content
     * @param {string} page - Page that failed to load
     * @returns {string} Error HTML content
     */
    generateErrorContent(page) {
        return `
            <div class="page-content">
                <div class="error-state">
                    <div class="error-icon">⚠️</div>
                    <h2>Content Not Available</h2>
                    <p>Sorry, we couldn't load the content for "${page}". Please try refreshing the page.</p>
                    <button onclick="location.reload()" class="error-retry-btn">Refresh Page</button>
                </div>
            </div>
        `;
    }

    /**
     * Clear content cache
     */
    clearCache() {
        this.contentCache.clear();
        this.loadingPromises.clear();
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        return {
            cachedItems: this.contentCache.size,
            loadingItems: this.loadingPromises.size,
            totalItems: this.contentCache.size + this.loadingPromises.size
        };
    }
}