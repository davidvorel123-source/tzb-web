// Theme Switcher support for local files
(function() {
    const params = new URLSearchParams(window.location.search);
    const theme = params.get('theme');
    if (theme) {
        const link = document.querySelector('link[rel="stylesheet"]');
        if (link) {
            link.href = 'css/' + theme + '.css';
        }
        // Preserve theme when clicking internal links
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('a').forEach(a => {
                const href = a.getAttribute('href');
                if (href && !href.startsWith('http') && !href.startsWith('#') && href.endsWith('.html')) {
                    a.href = href + '?theme=' + theme;
                }
            });
        });
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });

        // Close when clicking a link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
            }
        });
    }

    // Scroll-based Header
    const header = document.querySelector('.header');
    if (header) {
        const onScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 60);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Run once on load
    }

    // Fade-in on Scroll (Fixed for local viewing)
    const animated = document.querySelectorAll('[data-animate]');
    if (animated.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05 }); // Lower threshold
        
        animated.forEach(el => io.observe(el));
        
        // FAILSAFE: Force visibility after 200ms in case observer fails locally
        setTimeout(() => {
            animated.forEach(el => el.classList.add('visible'));
        }, 200);
    }

    // Smooth Scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                const offset = header ? header.offsetHeight : 0;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Reference Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    const refCards = document.querySelectorAll('.reference-card');
    if (filterBtns.length && refCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                refCards.forEach(card => {
                    const show = filter === 'all' || card.dataset.category === filter;
                    card.style.display = show ? '' : 'none';
                });
            });
        });
    }

    // Form Validation
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            let valid = true;
            form.querySelectorAll('[required]').forEach(f => {
                f.classList.remove('invalid');
                if (!f.value.trim()) {
                    valid = false;
                    f.classList.add('invalid');
                }
                if (f.type === 'email' && f.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) {
                    valid = false;
                    f.classList.add('invalid');
                }
            });
            if (!valid) {
                e.preventDefault();
                const first = form.querySelector('.invalid');
                if (first) { first.focus(); first.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
            }
        });
        form.querySelectorAll('input, select, textarea').forEach(f => {
            f.addEventListener('input', () => f.classList.remove('invalid'));
        });
    });
});
