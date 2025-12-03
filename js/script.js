// --- Tailwind Configuration ---
tailwind.config = {
    darkMode: 'class', // Manual dark mode toggle
    theme: {
        extend: {
            fontFamily: {
                'sans': ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                // Brand colors extracted from the video style
                'brand-black': '#000000',
                'brand-white': '#ffffff',
                'brand-salmon': '#FF9B7D', // The orange/pink color
                'brand-cyan': '#81E6D9',   // The light blue color
                'brand-lemon': '#F6E05E',  // Yellow accent
                'brand-gray': '#1A1A1A',   // Slightly lighter black for cards
            },
            spacing: {
                '18': '4.5rem',
            }
        }
    }
}

// --- Application Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // --- Data ---
    // --- Data ---
    let updates = [];

    // Fetch posts and updates
    async function loadData() {
        try {
            const [postsResponse, updatesResponse] = await Promise.all([
                fetch('posts.json'),
                fetch('updates.json')
            ]);

            if (!postsResponse.ok) throw new Error('Failed to load posts');
            if (!updatesResponse.ok) throw new Error('Failed to load updates');

            blogPosts = await postsResponse.json();
            updates = await updatesResponse.json();

            // Re-render after loading
            renderFeatured();
            renderUpdates();
            renderArticlePage();

            // Check for deep links after data is loaded
            const path = window.location.pathname.replace(/^\/|\/$/g, '');
            if (path && path !== 'index.html') {
                const post = blogPosts.find(p => slugify(p.title) === path);
                if (post) {
                    openPostModal(post.id);
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    loadData();

    // --- Helper Functions ---
    function getRelativeTime(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "10:42 AM";
        if (diffDays === 1) return "Yesterday";
        return `${diffDays} Days Ago`;
    }

    function formatDate(dateString) {
        if (!dateString) return "";
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // --- Rendering Logic ---
    function renderFeatured() {
        const grid = document.getElementById('posts-grid');
        const list = document.getElementById('featured-logs-list');

        if (!grid || !list) return;

        // Sort posts by date (newest first)
        const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

        // Split posts: Top 2 for Grid, Rest for List
        const latestStories = sortedPosts.slice(0, 2);
        const featuredLogs = sortedPosts.slice(2);

        // Render Latest Stories (Grid)
        grid.innerHTML = latestStories.map(post => {
            if (post.style === 'image') {
                return `
                    <article class="group relative bg-gray-100 dark:bg-brand-gray overflow-hidden hover:translate-y-[-4px] transition-transform duration-300 cursor-pointer">
                        <div class="aspect-[4/3] bg-gray-300 relative">
                             <img src="${post.image}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="${post.tag}">
                        </div>
                        <div class="p-6">
                            <div class="flex gap-2 mb-3">
                                <span class="bg-brand-cyan text-brand-black px-2 py-0.5 text-[10px] font-bold uppercase">${post.tag}</span>
                            </div>
                            <h3 class="text-xl font-bold leading-tight mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                                ${post.title}
                            </h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${formatDate(post.date)}</p>
                        </div>
                        <a href="${post.link}" class="absolute inset-0 z-10" aria-label="Read article"></a>
                    </article>
                `;

            } else { // Default / Dark Text Style
                return `
                     <article class="group relative bg-gray-100 dark:bg-brand-gray p-8 min-h-[320px] flex flex-col justify-between hover:translate-y-[-4px] transition-transform duration-300 cursor-pointer">
                        <div>
                             <div class="flex gap-2 mb-4">
                                <span class="bg-brand-lemon text-brand-black px-2 py-0.5 text-[10px] font-bold uppercase">${post.tag}</span>
                            </div>
                            <h3 class="text-2xl font-bold leading-tight group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                                ${post.title}
                            </h3>
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400 border-t border-black/10 dark:border-white/10 pt-4 mt-8">
                            ${formatDate(post.date)} • ${post.category || 'Tech'}
                        </div>
                        <a href="${post.link}" class="absolute inset-0 z-10" aria-label="Read article"></a>
                    </article>
                `;
            }
        }).join('');

        // Render Featured Logs (List)
        list.innerHTML = featuredLogs.map(post => {
            // Determine tag color based on tag name or default
            let tagColor = "bg-gray-200 dark:bg-gray-700 text-black dark:text-white";
            if (post.tag === 'Machine Learning') tagColor = "bg-brand-cyan text-brand-black";
            if (post.tag === 'Front End') tagColor = "bg-brand-salmon text-brand-black";

            return `
                <div class="swiss-border-b py-6 flex flex-col md:flex-row md:items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors relative">
                    <div class="max-w-xl">
                        <h3 class="text-2xl font-bold mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                            ${post.title}
                        </h3>
                        <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <span class="${tagColor} px-1.5 py-0.5 text-[10px] font-bold uppercase">${post.tag}</span>
                            <span>${formatDate(post.date)}</span>
                        </div>
                    </div>
                    <div class="mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                        <span class="text-2xl">&rarr;</span>
                    </div>
                    <a href="${post.link}" class="absolute inset-0 z-10" aria-label="Read article"></a>
                </div>
            `;
        }).join('');
    }

    function renderUpdates(showAll = false) {
        const list = document.getElementById('updates-list');
        if (!list) return;

        const visibleUpdates = showAll ? updates : updates.slice(0, 3);

        list.innerHTML = visibleUpdates.map((update, index) => {
            const timeLabel = getRelativeTime(update.date);
            const tagHtml = update.tag ? `<span class="${update.tagColor} px-2 py-1 text-xs font-bold uppercase">${update.tag}</span>` : '';
            const separator = index < visibleUpdates.length - 1 ? `<div class="w-full h-px bg-black/10 dark:bg-white/10"></div>` : '';

            return `
                <div class="group cursor-pointer" onclick="openModal('${update.id}')">
                    <div class="mb-2">
                         ${tagHtml}
                         <span class="text-xs text-gray-500 dark:text-gray-400 ${update.tag ? 'ml-2' : ''}">${timeLabel}</span>
                    </div>
                    <h4 class="text-xl font-bold leading-snug group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                        ${update.title}
                    </h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                        ${update.content}
                    </p>
                    <div class="mt-2 text-xs font-bold underline decoration-1 underline-offset-2">Read update</div>
                </div>
                ${separator}
            `;
        }).join('');

        // Add Read More Button if needed
        if (!showAll && updates.length > 3) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'pt-4 text-center';
            buttonContainer.innerHTML = `
                <button id="read-more-updates" class="text-xs font-bold uppercase tracking-widest hover:underline">
                    Read More Updates ↓
                </button>
            `;
            list.appendChild(buttonContainer);

            document.getElementById('read-more-updates').addEventListener('click', () => {
                renderUpdates(true);
            });
        }
    }

    function renderArticlePage() {
        const articleWrapper = document.getElementById('article-wrapper');
        if (!articleWrapper) return;

        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        const post = blogPosts.find(p => p.id === postId);

        if (post) {
            // Process Content for TOC
            let content = Array.isArray(post.content) ? post.content.join('') : post.content;
            const headings = [];
            let index = 0;

            // Regex to find h2 and h3, add IDs, and collect for TOC
            content = content.replace(/<(h[23])(?: [^>]*)?>(.*?)<\/\1>/g, (match, tag, text) => {
                const id = `heading-${index++}`;
                // Strip HTML tags from the text for the TOC link
                const plainText = text.replace(/<[^>]*>/g, '');
                headings.push({ id, text: plainText, level: tag });
                // Reconstruct the tag with the new ID, preserving original attributes is hard with simple replace, 
                // so we'll just inject the ID. A better approach is to use DOMParser but for now:
                // Let's just add the ID to the existing tag.
                // Actually, the previous replacement was completely replacing the tag. 
                // Let's try to preserve attributes if possible, or just re-add the ID.
                // The simplest fix for now is to just add the ID to the tag.
                return match.replace(new RegExp(`^<${tag}`), `<${tag} id="${id}"`);
            });

            // Populate Content
            document.getElementById('article-tag').textContent = post.tag;
            document.getElementById('article-date').textContent = formatDate(post.date);
            document.getElementById('article-title').textContent = post.title;
            document.getElementById('article-content').innerHTML = content;

            // Generate TOC
            const tocContainer = document.getElementById('article-toc');
            if (tocContainer) {
                if (headings.length > 0) {
                    tocContainer.innerHTML = headings.map(h => `
                        <a href="#${h.id}" id="link-${h.id}" class="toc-link block text-gray-500 dark:text-gray-500 hover:text-black dark:hover:text-white transition-all duration-200 ${h.level === 'h3' ? 'pl-4 text-xs' : 'text-sm'} py-1 border-l-2 border-transparent pl-3 hover:border-gray-300">
                            ${h.text}
                        </a>
                    `).join('');
                    document.querySelector('aside').classList.remove('hidden');

                    // Scroll Spy / Intersection Observer
                    const observerOptions = {
                        root: null,
                        rootMargin: '-10% 0px -70% 0px', // More precise active zone
                        threshold: 0
                    };

                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                // Remove active class from all links
                                document.querySelectorAll('.toc-link').forEach(link => {
                                    link.classList.remove('text-brand-salmon', 'font-bold', 'border-brand-salmon');
                                    link.classList.add('text-gray-500', 'dark:text-gray-500', 'border-transparent');
                                });

                                // Add active class to current link
                                const activeLink = document.getElementById(`link-${entry.target.id}`);
                                if (activeLink) {
                                    activeLink.classList.remove('text-gray-500', 'dark:text-gray-500', 'border-transparent');
                                    activeLink.classList.add('text-brand-salmon', 'font-bold', 'border-brand-salmon');
                                }
                            }
                        });
                    }, observerOptions);

                    // Observe all headings
                    headings.forEach(h => {
                        const element = document.getElementById(h.id);
                        if (element) observer.observe(element);
                    });

                } else {
                    tocContainer.innerHTML = '<span class="text-xs italic">No sections</span>';
                }
            }

            // Handle Image
            const imageContainer = document.getElementById('article-image-container');
            if (post.image) {
                document.getElementById('article-image').src = post.image;
                imageContainer.classList.remove('hidden');
            } else {
                imageContainer.classList.add('hidden');
            }

            // Show Article Wrapper (Grid)
            document.getElementById('article-wrapper').classList.remove('hidden');
            document.getElementById('article-not-found').classList.add('hidden');
            document.title = `${post.title} - GlitchyKernel`;
        } else {
            // Show Not Found
            document.getElementById('article-not-found').classList.remove('hidden');
        }
    }

    // Initial Render
    // Data loading triggers rendering

    // Modal Logic
    const overlay = document.getElementById('modal-overlay');
    const modalContents = document.querySelectorAll('.modal-content');

    window.openModal = function (modalId) {
        modalContents.forEach(el => el.classList.add('hidden'));
        overlay.classList.remove('hidden');

        // Check if it's an update modal (starts with 'update-')
        if (modalId.startsWith('update-')) {
            const updateId = modalId;
            const update = updates.find(u => u.id === updateId);

            if (update) {
                const modal = document.getElementById('dynamic-update-modal');
                if (modal) {
                    // Populate Content
                    document.getElementById('modal-title').textContent = update.title;
                    document.getElementById('modal-content').textContent = update.fullContent;

                    // Populate Tag
                    const tagContainer = document.getElementById('modal-tag-container');
                    if (update.tag) {
                        tagContainer.innerHTML = `<span class="${update.tagColor} px-2 py-1 text-xs font-bold uppercase inline-block">${update.tag}</span>`;
                    } else {
                        tagContainer.innerHTML = '';
                    }

                    // Populate Image
                    const imageContainer = document.getElementById('modal-image-container');
                    const modalImage = document.getElementById('modal-image');
                    if (update.image) {
                        modalImage.src = update.image;
                        imageContainer.classList.remove('hidden');
                    } else {
                        imageContainer.classList.add('hidden');
                        modalImage.src = '';
                    }

                    modal.classList.remove('hidden');
                    // Animation
                    modal.style.opacity = '0';
                    modal.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        modal.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                        modal.style.opacity = '1';
                        modal.style.transform = 'translateY(0)';
                    }, 10);
                }
            }
        } else {
            // Static Modals (like About)
            const content = document.getElementById(modalId);
            if (content) {
                content.classList.remove('hidden');
                // Animation
                content.style.opacity = '0';
                content.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    content.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                }, 10);
            }
        }
        document.body.style.overflow = 'hidden';
    }

    window.closeAllModals = function () {
        overlay.classList.add('hidden');
        modalContents.forEach(el => el.classList.add('hidden'));
        document.body.style.overflow = 'auto';
    }

    window.closeModal = function (event) {
        if (event.target === overlay) {
            closeAllModals();
        }
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            closeAllModals();
        }
    });

    // Theme Toggle Logic
    window.toggleTheme = function () {
        const html = document.documentElement;
        const icon = document.getElementById('theme-icon');

        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            icon.classList.remove('ph-sun');
            icon.classList.add('ph-moon');
        } else {
            html.classList.add('dark');
            icon.classList.remove('ph-moon');
            icon.classList.add('ph-sun');
        }
    }

    // Initial Render
    renderFeatured();
    renderUpdates();

    // Deep Linking on Load
    const path = window.location.pathname.replace(/^\/|\/$/g, ''); // Remove leading/trailing slashes
    if (path && path !== 'index.html') {
        const post = blogPosts.find(p => slugify(p.title) === path);
        if (post) {
            openPostModal(post.id);
        }
    }


});