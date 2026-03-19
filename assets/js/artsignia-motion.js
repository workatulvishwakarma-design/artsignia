/* =============================================
   ARTSIGNIA — Premium Motion System (JS Engine)
   GSAP + ScrollTrigger + SplitText + Lenis
   ============================================= */

/* =============================================
   STANDALONE PRELOADER SAFETY NET
   Runs immediately, before any other code.
   CSS handles entrance animations; this is exit-only.
   ============================================= */
(function () {
    'use strict';
    var p = document.querySelector('.as-preloader');
    if (p) {
        // Lock scroll while preloader is visible
        document.body.style.overflow = 'hidden';
        // Force-remove preloader after 3.8s no matter what
        setTimeout(function () {
            if (p.parentNode && !p.classList.contains('as-preloader--exit')) {
                p.classList.add('as-preloader--exit');
                setTimeout(function () {
                    p.style.display = 'none';
                    document.body.style.overflow = '';
                }, 700);
            }
        }, 3800);
    }
})();

(function () {
    'use strict';

    /* =============================================
       0. REDUCED MOTION — handle preloader first
       ============================================= */
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.querySelectorAll('.as-reveal, .as-reveal-up, .as-reveal-left, .as-reveal-right, .as-reveal-scale').forEach(function(el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        // Still remove preloader even with reduced motion
        var pre = document.querySelector('.as-preloader');
        if (pre) {
            pre.style.display = 'none';
            document.body.style.overflow = '';
        }
        return;
    }

    /* =============================================
       1. WAIT FOR DOM + GSAP
       ============================================= */
    document.addEventListener('DOMContentLoaded', function () {
        // Ensure GSAP and plugins are available
        if (typeof gsap === 'undefined') return;

        // Register plugins
        if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
        if (typeof SplitText !== 'undefined') gsap.registerPlugin(SplitText);
        if (typeof CustomEase !== 'undefined') {
            gsap.registerPlugin(CustomEase);
            CustomEase.create('asPremium', '0.25, 0.46, 0.45, 0.94');
            CustomEase.create('asSmooth', '0.16, 1, 0.3, 1');
        }

        // Default GSAP settings
        gsap.defaults({
            ease: 'asPremium',
            duration: 0.9
        });

        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 992;

        /* =============================================
           2. LENIS SMOOTH SCROLL
           ============================================= */
        let lenis;
        try {
            if (typeof Lenis !== 'undefined') {
                lenis = new Lenis({
                    duration: 1.2,
                    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
                    orientation: 'vertical',
                    gestureOrientation: 'vertical',
                    smoothWheel: true,
                    wheelMultiplier: 1,
                    touchMultiplier: 2,
                    infinite: false
                });

                // Sync Lenis with GSAP ticker
                gsap.ticker.add(function (time) {
                    lenis.raf(time * 1000);
                });
                gsap.ticker.lagSmoothing(0);

                // Update ScrollTrigger on Lenis scroll
                lenis.on('scroll', ScrollTrigger.update);
            }
        } catch (e) {
            // Lenis not available; continue without smooth scroll
        }

        /* =============================================
           3. HEADER SCROLL BEHAVIOUR
           ============================================= */
        (function initHeader() {
            var header = document.querySelector('.bs-header-1-area');
            if (!header) return;

            ScrollTrigger.create({
                start: 'top -80',
                end: 99999,
                onUpdate: function (self) {
                    if (self.direction === 1 && self.scroll() > 80) {
                        header.classList.add('as-header-scrolled');
                    } else if (self.scroll() < 60) {
                        header.classList.remove('as-header-scrolled');
                    }
                }
            });
        })();

        /* =============================================
           4. PAGE LOAD ENTRANCE — HERO
           ============================================= */
        (function initHeroEntrance() {
            var heroTl = gsap.timeline({ delay: 0.2 });

            // Logo + nav items
            var headerLogo = document.querySelector('.bs-header-logo-1');
            var headerActions = document.querySelector('.bs-header-1-action-link');
            if (headerLogo) {
                heroTl.from(headerLogo, { opacity: 0, y: -20, duration: 0.6 }, 0);
            }
            if (headerActions) {
                heroTl.from(headerActions.children, {
                    opacity: 0, y: -15, stagger: 0.1, duration: 0.5
                }, 0.15);
            }

            // Hero title
            var heroTitle = document.querySelector('.bs-hero-1-title');
            if (heroTitle) {
                heroTl.from(heroTitle, {
                    opacity: 0, y: 60, duration: 1.1, ease: 'asSmooth'
                }, 0.3);
            }

            // Hero secondary title
            var heroTitle2 = document.querySelector('.bs-hero-1-title-2');
            if (heroTitle2) {
                heroTl.from(heroTitle2, {
                    opacity: 0, y: 40, duration: 1.0, ease: 'asSmooth'
                }, 0.5);
            }

            // Hero subtitle / page header descriptions
            var heroDesc = document.querySelector('.as-page-header p, .bs-hero-1-right .bs-h-1');
            if (heroDesc) {
                heroTl.from(heroDesc, {
                    opacity: 0, y: 30, duration: 0.8
                }, 0.6);
            }

            // Hero CTA buttons
            var heroBtns = document.querySelectorAll('.bs-hero-1-left .btn-wrap, .bs-hero-1-play-btn');
            if (heroBtns.length) {
                heroTl.from(heroBtns, {
                    opacity: 0, y: 25, stagger: 0.12, duration: 0.7
                }, 0.7);
            }

            // Hero image
            var heroImg = document.querySelector('.bs-hero-1-img');
            if (heroImg) {
                heroTl.from(heroImg, {
                    opacity: 0, scale: 1.06, duration: 1.3, ease: 'asSmooth'
                }, 0.4);
            }

            // Hero success counter block
            var heroCounter = document.querySelector('.bs-hero-1-success');
            if (heroCounter) {
                heroTl.from(heroCounter, {
                    opacity: 0, x: -40, duration: 0.9, ease: 'asSmooth'
                }, 0.35);
            }

            // Page headers (inner pages)
            var pageHeader = document.querySelector('.as-page-header h1');
            if (pageHeader && !heroTitle) {
                heroTl.from(pageHeader, {
                    opacity: 0, y: 50, duration: 1.0, ease: 'asSmooth'
                }, 0.25);
            }
            var pageHeaderP = document.querySelector('.as-page-header p');
            if (pageHeaderP && !heroDesc) {
                heroTl.from(pageHeaderP, {
                    opacity: 0, y: 25, duration: 0.8
                }, 0.5);
            }
        })();

        /* =============================================
           5. SCROLL REVEAL SYSTEM
           ============================================= */
        (function initScrollReveals() {
            // Generic reveal: fade up
            var revealUps = document.querySelectorAll(
                '.bs-subtitle-1, .bs-sec-title-1, .bs-p-1.disc, .mb-35, .text-center.mb-55, ' +
                '.bs-about-1-content, .bs-about-1-slider, ' +
                '.as-capabilities-strip, .as-differentiators-area, ' +
                '.bs-blog-1-all-btn, .as-cta-band'
            );
            revealUps.forEach(function (el) {
                gsap.from(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 40,
                    duration: 0.9
                });
            });

            // Section titles: elegant rise
            var sectionTitles = document.querySelectorAll('.bs-sec-title-1, .as-page-header h1');
            sectionTitles.forEach(function (el) {
                if (typeof SplitText !== 'undefined') {
                    try {
                        var split = new SplitText(el, { type: 'lines', linesClass: 'as-split-line' });
                        gsap.from(split.lines, {
                            scrollTrigger: {
                                trigger: el,
                                start: 'top 85%',
                                toggleActions: 'play none none none'
                            },
                            opacity: 0,
                            y: 35,
                            stagger: 0.12,
                            duration: 0.8,
                            ease: 'asSmooth'
                        });
                    } catch (e) { /* SplitText may fail on empty elements */ }
                }
            });
        })();

        /* =============================================
           6. CARD STAGGER REVEALS
           ============================================= */
        (function initCardStagger() {
            // Find all grid rows with columns
            var gridRows = document.querySelectorAll('.row.g-4, .row.g-5');
            gridRows.forEach(function (row) {
                var cols = row.querySelectorAll('[class*="col-"]');
                if (cols.length < 2) return;

                gsap.from(cols, {
                    scrollTrigger: {
                        trigger: row,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 50,
                    stagger: {
                        each: 0.12,
                        from: 'start'
                    },
                    duration: 0.8,
                    ease: 'asSmooth'
                });
            });

            // Blog items
            var blogItems = document.querySelectorAll('.bs-blog-1-item');
            blogItems.forEach(function (item, i) {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 60,
                    duration: 0.9,
                    delay: i * 0.05,
                    ease: 'asSmooth'
                });
            });

            // Service cards in additional capabilities
            var workCards = document.querySelectorAll('.bs-work-5-card');
            workCards.forEach(function (card, i) {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 40,
                    scale: 0.96,
                    duration: 0.7,
                    delay: i * 0.08
                });
            });

            // Portfolio project items
            var projectItems = document.querySelectorAll('.bs-project-5-item');
            projectItems.forEach(function (item, i) {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 50,
                    duration: 0.85,
                    delay: (i % 2) * 0.1,
                    ease: 'asSmooth'
                });
            });

            // Core features strip
            var coreItems = document.querySelectorAll('.bs-core-features-1-item');
            if (coreItems.length) {
                gsap.from(coreItems, {
                    scrollTrigger: {
                        trigger: '.bs-core-features-1-wrap',
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 30,
                    stagger: 0.1,
                    duration: 0.7
                });
            }
        })();

        /* =============================================
           7. PARALLAX EFFECTS
           ============================================= */
        (function initParallax() {
            if (isMobile) return; // Skip parallax on mobile for performance

            // Hero image
            var heroImg = document.querySelector('.bs-hero-1-img img');
            if (heroImg) {
                gsap.to(heroImg, {
                    scrollTrigger: {
                        trigger: '.bs-hero-1-area',
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1.5
                    },
                    y: 80,
                    scale: 1.04,
                    ease: 'none'
                });
            }

            // About slider images
            var aboutSlider = document.querySelector('.bs-about-1-slider');
            if (aboutSlider) {
                gsap.to(aboutSlider, {
                    scrollTrigger: {
                        trigger: aboutSlider,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 2
                    },
                    y: -30,
                    ease: 'none'
                });
            }

            // Service tab images
            var tabMainImgs = document.querySelectorAll('.bs-projects-1-tabs-item .main-img img, .tab-pane .wa-img-cover img');
            tabMainImgs.forEach(function (img) {
                gsap.to(img, {
                    scrollTrigger: {
                        trigger: img.closest('section') || img,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 2
                    },
                    y: 40,
                    ease: 'none'
                });
            });

            // Portfolio images
            var portfolioImgs = document.querySelectorAll('.bs-project-5-item .main-img img');
            portfolioImgs.forEach(function (img) {
                gsap.to(img, {
                    scrollTrigger: {
                        trigger: img,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 2.5
                    },
                    y: 30,
                    ease: 'none'
                });
            });
        })();

        /* =============================================
           8. IMAGE REVEAL ON SCROLL
           ============================================= */
        (function initImageReveal() {
            // Large cover images: soft zoom on entry
            var coverImages = document.querySelectorAll('.wa-img-cover img, .item-img img');
            coverImages.forEach(function (img) {
                gsap.from(img, {
                    scrollTrigger: {
                        trigger: img,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    },
                    scale: 1.08,
                    opacity: 0.5,
                    duration: 1.2,
                    ease: 'asSmooth'
                });
            });
        })();

        /* =============================================
           9. EXPERTISE TABS CROSSFADE
           ============================================= */
        (function initTabCrossfade() {
            // Add subtle animation when Bootstrap tabs switch
            var tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
            tabButtons.forEach(function (btn) {
                btn.addEventListener('shown.bs.tab', function (e) {
                    var paneId = e.target.getAttribute('data-bs-target') || e.target.getAttribute('href');
                    var pane = document.querySelector(paneId);
                    if (!pane) return;

                    // Animate pane content in
                    var img = pane.querySelector('.main-img, .wa-img-cover');
                    var content = pane.querySelector('.col-lg-6:last-child, .bs-projects-1-tabs-item-table');

                    if (img) {
                        gsap.from(img, { opacity: 0, x: -30, duration: 0.6, ease: 'asSmooth' });
                    }
                    if (content) {
                        gsap.from(content, { opacity: 0, x: 30, duration: 0.6, delay: 0.1, ease: 'asSmooth' });
                    }
                });
            });
        })();

        /* =============================================
           10. COUNTER ANIMATION
           ============================================= */
        (function initCounters() {
            var counters = document.querySelectorAll('.counter');
            counters.forEach(function (counter) {
                var target = parseInt(counter.textContent, 10);
                if (isNaN(target)) return;

                counter.textContent = '0';

                ScrollTrigger.create({
                    trigger: counter,
                    start: 'top 90%',
                    once: true,
                    onEnter: function () {
                        gsap.to(counter, {
                            duration: 2,
                            ease: 'power2.out',
                            onUpdate: function () {
                                var progress = this.progress();
                                counter.textContent = Math.round(target * progress);
                            }.bind(this)
                        });

                        // Fallback: use raw tween with innerText
                        var obj = { val: 0 };
                        gsap.to(obj, {
                            val: target,
                            duration: 2,
                            ease: 'power2.out',
                            onUpdate: function () {
                                counter.textContent = Math.round(obj.val);
                            }
                        });
                    }
                });
            });
        })();

        /* =============================================
           11. FOOTER REVEAL
           ============================================= */
        (function initFooterReveal() {
            var footer = document.querySelector('footer, .bs-footer-1-area');
            if (!footer) return;

            var footerCols = footer.querySelectorAll('.col-lg-3, .col-lg-4, .col-md-6, .bs-footer-1-widget');
            if (footerCols.length) {
                gsap.from(footerCols, {
                    scrollTrigger: {
                        trigger: footer,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 35,
                    stagger: 0.1,
                    duration: 0.7,
                    ease: 'asSmooth'
                });
            }

            // Footer logo
            var footerLogo = footer.querySelector('.bs-footer-1-logo, img');
            if (footerLogo) {
                gsap.from(footerLogo, {
                    scrollTrigger: {
                        trigger: footer,
                        start: 'top 92%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 20,
                    duration: 0.6
                });
            }

            // Copyright bar
            var copyright = footer.querySelector('.bs-footer-1-copyright');
            if (copyright) {
                gsap.from(copyright, {
                    scrollTrigger: {
                        trigger: copyright,
                        start: 'top 95%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    duration: 0.8
                });
            }
        })();

        /* =============================================
           12. CONTACT FORM ANIMATION
           ============================================= */
        (function initFormAnimation() {
            var formItems = document.querySelectorAll('.bs-form-1-item');
            if (!formItems.length) return;

            gsap.from(formItems, {
                scrollTrigger: {
                    trigger: '.bs-form-1',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 30,
                stagger: 0.08,
                duration: 0.6,
                ease: 'asSmooth'
            });

            // Submit button
            var submitBtn = document.querySelector('.bs-form-1 .bs-btn-1');
            if (submitBtn) {
                gsap.from(submitBtn, {
                    scrollTrigger: {
                        trigger: submitBtn,
                        start: 'top 92%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 20,
                    duration: 0.7,
                    delay: 0.3
                });
            }
        })();

        /* =============================================
           13. CTA BAND REVEAL
           ============================================= */
        (function initCtaBand() {
            var ctaBands = document.querySelectorAll('.as-cta-band');
            ctaBands.forEach(function (band) {
                var h2 = band.querySelector('h2');
                var p = band.querySelector('p');
                var btn = band.querySelector('.bs-btn-1');

                if (h2) {
                    gsap.from(h2, {
                        scrollTrigger: {
                            trigger: band,
                            start: 'top 80%',
                            toggleActions: 'play none none none'
                        },
                        opacity: 0,
                        y: 40,
                        duration: 0.9,
                        ease: 'asSmooth'
                    });
                }
                if (p) {
                    gsap.from(p, {
                        scrollTrigger: {
                            trigger: band,
                            start: 'top 80%',
                            toggleActions: 'play none none none'
                        },
                        opacity: 0,
                        y: 25,
                        duration: 0.8,
                        delay: 0.2
                    });
                }
                if (btn) {
                    gsap.from(btn, {
                        scrollTrigger: {
                            trigger: band,
                            start: 'top 80%',
                            toggleActions: 'play none none none'
                        },
                        opacity: 0,
                        y: 20,
                        duration: 0.7,
                        delay: 0.35
                    });
                }
            });
        })();

        /* =============================================
           14. BACK TO TOP VISIBILITY
           ============================================= */
        (function initBackToTop() {
            var btn = document.querySelector('.wa-back-to-top');
            if (!btn) return;

            ScrollTrigger.create({
                start: 'top -400',
                end: 99999,
                onUpdate: function (self) {
                    if (self.scroll() > 400) {
                        btn.classList.add('as-visible');
                    } else {
                        btn.classList.remove('as-visible');
                    }
                }
            });

            btn.addEventListener('click', function () {
                if (lenis) {
                    lenis.scrollTo(0, { duration: 1.5 });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        })();

        /* =============================================
           15. AMBIENT GRAIN
           ============================================= */
        (function initGrain() {
            if (isMobile) return; // Skip grain on mobile
            document.body.classList.add('as-grain');
        })();

        /* =============================================
           16. SECTION BACKGROUND TRANSITIONS
           ============================================= */
        (function initSectionTransitions() {
            var sections = document.querySelectorAll('section');
            sections.forEach(function (section) {
                gsap.from(section, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 95%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0.6,
                    duration: 0.8,
                    ease: 'power1.out'
                });
            });
        })();

        /* =============================================
           17. ABOUT PAGE SPECIFIC
           ============================================= */
        (function initAboutSpecific() {
            // Capabilities strip cards
            var capCards = document.querySelectorAll('.as-cap-card');
            if (capCards.length) {
                gsap.from(capCards, {
                    scrollTrigger: {
                        trigger: '.as-capabilities-strip',
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 40,
                    scale: 0.95,
                    stagger: 0.1,
                    duration: 0.7
                });
            }

            // Differentiator feature cards
            var featureCards = document.querySelectorAll('.as-feature-card');
            if (featureCards.length) {
                gsap.from(featureCards, {
                    scrollTrigger: {
                        trigger: '.as-differentiators-area',
                        start: 'top 82%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 45,
                    stagger: 0.12,
                    duration: 0.8,
                    ease: 'asSmooth'
                });
            }
        })();

        /* =============================================
           18. SERVICES PAGE TAB NAV ANIMATION
           ============================================= */
        (function initServiceTabs() {
            var tabBtns = document.querySelectorAll('.bs-projects-1-tabs-btn .nav-link');
            if (tabBtns.length) {
                gsap.from(tabBtns, {
                    scrollTrigger: {
                        trigger: '.bs-projects-1-tabs-btn',
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    x: -30,
                    stagger: 0.1,
                    duration: 0.7,
                    ease: 'asSmooth'
                });
            }
        })();

        /* =============================================
           19. CONTACT INFO CARDS
           ============================================= */
        (function initContactCards() {
            var contactCards = document.querySelectorAll('.bs-work-5-card');
            if (!contactCards.length) return;

            var parentSection = contactCards[0].closest('section');
            if (!parentSection) return;

            gsap.from(contactCards, {
                scrollTrigger: {
                    trigger: parentSection,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 40,
                scale: 0.96,
                stagger: 0.12,
                duration: 0.7,
                ease: 'asSmooth'
            });
        })();

        /* =============================================
           20. CLIENT LOGOS REVEAL
           ============================================= */
        (function initClientsReveal() {
            var clientsGrid = document.querySelector('.as-clients-grid');
            if (!clientsGrid) return;

            var items = clientsGrid.querySelectorAll('.as-clients-grid__item');
            if (!items.length) return;

            gsap.from(items, {
                scrollTrigger: {
                    trigger: clientsGrid,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 25,
                scale: 0.9,
                stagger: {
                    each: 0.04,
                    grid: 'auto',
                    from: 'start'
                },
                duration: 0.6,
                ease: 'asSmooth'
            });
        })();

        /* =============================================
           21. MAP REVEAL (Contact Page)
           ============================================= */
        (function initMapReveal() {
            var mapWrap = document.querySelector('.bs-contact-page-map, [style*="border-radius"] iframe');
            if (!mapWrap) return;

            var container = mapWrap.closest('.col-lg-5, .wa-fix') || mapWrap;
            gsap.from(container, {
                scrollTrigger: {
                    trigger: container,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                x: 40,
                duration: 0.9,
                ease: 'asSmooth'
            });
        })();

        /* =============================================
           REFRESH SCROLL TRIGGERS
           ============================================= */
        window.addEventListener('load', function () {
            setTimeout(function () {
                ScrollTrigger.refresh();
            }, 500);
        });

        // Refresh on resize
        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                ScrollTrigger.refresh();
            }, 250);
        });

        /* =============================================
           22. OFFCANVAS MENU TOGGLE
           ============================================= */
        (function initOffcanvasMenu() {
            var toggleBtn = document.querySelector('.offcanvas_toggle, .bs-offcanvas-btn-1');
            var closeBtn = document.querySelector('.offcanvas_box_close, .wa-offcanvas-close');
            var offcanvas = document.querySelector('.wa-offcanvas-area');
            var overlay = document.querySelector('.wa-overly');

            if (!offcanvas || !toggleBtn) return;

            function openMenu() {
                offcanvas.classList.add('active');
                if (overlay) overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                // Stagger-reveal nav links
                var links = offcanvas.querySelectorAll('.navbar-nav li');
                if (links.length && typeof gsap !== 'undefined') {
                    gsap.from(links, {
                        opacity: 0, x: 30,
                        stagger: 0.07,
                        duration: 0.5,
                        ease: 'asSmooth',
                        delay: 0.2
                    });
                }
            }

            function closeMenu() {
                offcanvas.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
            }

            toggleBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (offcanvas.classList.contains('active')) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    closeMenu();
                });
            }

            if (overlay) {
                overlay.addEventListener('click', function () {
                    closeMenu();
                });
            }

            // Close on Escape key
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && offcanvas.classList.contains('active')) {
                    closeMenu();
                }
            });
        })();

        /* =============================================
           23. HOME PAGE PRELOADER
           CSS handles entrance animations.
           JS only triggers the smooth exit after 3s.
           ============================================= */
        (function initPreloader() {
            var preloader = document.querySelector('.as-preloader');
            if (!preloader) return;

            function exitPreloader() {
                if (preloader.classList.contains('as-preloader--exit')) return;
                preloader.classList.add('as-preloader--exit');
                setTimeout(function () {
                    preloader.style.display = 'none';
                    document.body.style.overflow = '';
                    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
                }, 700);
            }

            // Trigger exit after 3 seconds (CSS animations finish by ~2s)
            setTimeout(exitPreloader, 3000);
        })();

    }); // end DOMContentLoaded
})();

/* =========================================================================
   GLOBAL OFFCANVAS MENU FIX (Mobile/Tablet/Desktop Menu Consistency)
   ========================================================================= */
(function() {
    'use strict';
    document.addEventListener('DOMContentLoaded', function() {
        const offcanvasArea = document.querySelector('.wa-offcanvas-area');
        const overlay = document.querySelector('.wa-overly');
        const toggleBtns = document.querySelectorAll('.offcanvas_toggle');
        const closeBtns = document.querySelectorAll('.offcanvas_box_close, .wa-overly, .wa-offcanvas-area .navbar-nav a');

        function openMenu(e) {
            e.preventDefault();
            if(offcanvasArea) offcanvasArea.classList.add('active');
            if(overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        }

        function closeMenu(e) {
            // Only prevent default if it's the close button or overlay, not links navigating away
            if(this.classList && (this.classList.contains('offcanvas_box_close') || this.classList.contains('wa-overly'))) {
                e.preventDefault();
            }
            if(offcanvasArea) offcanvasArea.classList.remove('active');
            if(overlay) overlay.classList.remove('active');
            document.body.style.overflow = ''; 
        }

        toggleBtns.forEach(btn => {
            btn.addEventListener('click', openMenu);
            // Redundant touchstart sometimes conflicts with click on mobile browsers, 
            // but for absolute certainty on custom UI we map both if no pointer-events
            btn.addEventListener('touchstart', openMenu, {passive: true});
        });

        closeBtns.forEach(btn => {
            btn.addEventListener('click', closeMenu);
        });
    });
})();
