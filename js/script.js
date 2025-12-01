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
    const blogPosts = [
        {
            id: "post-1",
            title: "Driving AI adoption: A conversation with our CTO",
            date: "2025-08-19",
            category: "Culture",
            tag: "Engineering",
            style: "default",
            link: "article.html?id=post-1",
            content: `
                <p>Artificial Intelligence is no longer just a buzzword; it's a fundamental shift in how we approach engineering problems. In this candid conversation, we explore the practical challenges and immense opportunities of integrating AI into legacy workflows.</p>
                <p>We discuss the importance of data governance, the ethical considerations of automated decision-making, and how to foster a culture of continuous learning within engineering teams.</p>
                <h3>Key Takeaways</h3>
                <ul>
                    <li>Start small: Implement AI in non-critical paths first.</li>
                    <li>Data is king: Clean, structured data is more valuable than complex models.</li>
                    <li>Human-in-the-loop: AI should augment human intelligence, not replace it.</li>
                </ul>
            `
        },
        {
            id: "post-2",
            title: "Restoring a 1994 ThinkPad to its former glory",
            date: "2025-11-17",
            category: null,
            tag: "Hardware",
            style: "image",
            image: "assets/how-gpu-works.png",
            link: "article.html?id=post-2",
            content: `
                <p>There's something special about the clicky keyboards and boxy designs of 90s laptops. This week, I picked up a non-functional IBM ThinkPad 755C and attempted to bring it back to life.</p>

                <br>

                <pre><code>" Basic Settings
set number          " Show line numbers
set relativenumber  " Show relative line numbers
set tabstop=4       " Tab width
set shiftwidth=4    " Indent width
set expandtab       " Use spaces instead of tabs
syntax on           " Enable syntax highlighting</code></pre>

                <h2>The Hunt for Parts</h2>
                <p>The journey involved sourcing a replacement battery, fixing a corroded motherboard trace, and finding a working floppy drive to install Windows 95. It was a nostalgic trip down memory lane, reminding me of a time when hardware felt more repairable and tangible.</p>
                <h3>Battery Woes</h3>
                <p>Finding a working NiMH battery pack was impossible, so I had to rebuild one using modern cells.</p>
                <h2>Installation Day</h2>
                <p>The result? A fully functional retro gaming machine that runs DOOM perfectly.</p>
            `
        }
    ];

    const updates = [
        {
            id: "update-1",
            title: "Silicon photonics breakthrough announced.",
            content: "Data transfer speeds x100. Scientists have successfully demonstrated a stable silicon photonics chip...",
            fullContent: "Scientists have successfully demonstrated a stable silicon photonics chip capable of transmitting data at speeds 100x faster than current copper interconnects within data centers. This could revolutionize how we architect server farms in the coming decade.",
            date: "2025-11-29T10:42:00", // Today
            tag: "New",
            tagColor: "bg-brand-black dark:bg-brand-white text-brand-white dark:text-brand-black"
        },
        {
            id: "update-2",
            title: "Open source graphics drivers update (v5.4.1).",
            content: "Fixes major rendering pipeline bug causing artifacts in high-load scenarios...",
            fullContent: "The open-source community has pushed a critical fix for the rendering pipeline that was causing artifacts in high-load scenarios. This specifically targets the Vulkan implementation on older architecture cards.",
            date: "2025-11-28T09:00:00", // Yesterday
            tag: "Yesterday",
            tagColor: "bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
        }
    ];

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
        if (!grid) return;

        grid.innerHTML = blogPosts.map(post => {
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
                     <article class="group relative bg-gray-100 dark:bg-brand-gray p-8 min-h-[280px] flex flex-col justify-between hover:translate-y-[-4px] transition-transform duration-300 cursor-pointer">
                        <div>
                             <div class="flex gap-2 mb-4">
                                <span class="bg-brand-lemon text-brand-black px-2 py-0.5 text-[10px] font-bold uppercase">${post.tag}</span>
                            </div>
                            <h3 class="text-2xl font-bold leading-tight group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                                ${post.title}
                            </h3>
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400 border-t border-black/10 dark:border-white/10 pt-4 mt-8">
                            ${formatDate(post.date)} • ${post.category}
                        </div>
                        <a href="${post.link}" class="absolute inset-0 z-10" aria-label="Read article"></a>
                    </article>
                `;
            }
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
                         <span class="text-xs text-gray-500 ${update.tag ? 'ml-2' : ''}">${timeLabel}</span>
                    </div>
                    <h4 class="text-lg font-bold leading-snug group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
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
            let content = post.content;
            const headings = [];
            let index = 0;

            // Regex to find h2 and h3, add IDs, and collect for TOC
            content = content.replace(/<(h[23])>(.*?)<\/\1>/g, (match, tag, text) => {
                const id = `heading-${index++}`;
                headings.push({ id, text, level: tag });
                return `<${tag} id="${id}">${text}</${tag}>`;
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
                        <a href="#${h.id}" id="link-${h.id}" class="toc-link block text-gray-500 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors ${h.level === 'h3' ? 'pl-4' : ''} py-1">
                            ${h.text}
                        </a>
                    `).join('');
                    document.querySelector('aside').classList.remove('hidden');

                    // Scroll Spy / Intersection Observer
                    const observerOptions = {
                        root: null,
                        rootMargin: '-100px 0px -60% 0px', // Adjust active zone
                        threshold: 0
                    };

                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                // Remove active class from all links
                                document.querySelectorAll('.toc-link').forEach(link => {
                                    link.classList.remove('text-black', 'dark:text-white', 'font-bold');
                                    link.classList.add('text-gray-500', 'dark:text-gray-500');
                                });

                                // Add active class to current link
                                const activeLink = document.getElementById(`link-${entry.target.id}`);
                                if (activeLink) {
                                    activeLink.classList.remove('text-gray-500', 'dark:text-gray-500');
                                    activeLink.classList.add('text-black', 'dark:text-white', 'font-bold');
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
            document.title = `${post.title} - GlitchyKernel`;
        } else {
            // Show Not Found
            document.getElementById('article-not-found').classList.remove('hidden');
        }
    }

    // Initial Render
    renderFeatured();
    renderUpdates();
    renderArticlePage();

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