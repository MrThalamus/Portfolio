document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggling
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const icon = themeBtn.querySelector('i');
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // 2. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Only enable custom cursor on non-touch devices
    if(matchMedia('(pointer:fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Add a slight delay for the outline for a smooth effect
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: "forwards" });
        });

        // Add hover effect to interactive elements
        const interactables = document.querySelectorAll('a, button, input, textarea, .gallery-item');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    } else {
        // Hide custom cursor on mobile/touch devices
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    // 3. Scroll Reveal Animation via Intersection Observer
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    el.classList.add('revealed');
                }, delay);
                
                observer.unobserve(el);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        // Simple animation for hamburger icon
        hamburger.classList.toggle('open');
        if(hamburger.classList.contains('open')){
            hamburger.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            hamburger.children[1].style.opacity = '0';
            hamburger.children[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            hamburger.children[0].style.transform = 'none';
            hamburger.children[1].style.opacity = '1';
            hamburger.children[2].style.transform = 'none';
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('open');
            hamburger.children[0].style.transform = 'none';
            hamburger.children[1].style.opacity = '1';
            hamburger.children[2].style.transform = 'none';
        });
    });

    // 5. Gallery Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            // Get higher quality image url by removing size constraint for demo
            lightboxImg.src = imgSrc.replace('&w=600', '&w=1200');
            lightbox.classList.add('active');
        });
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // 6. Smooth scroll for anchor links & Set year in footer
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const targetElement = document.querySelector(targetId);
            if(targetElement){
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Prevent form submission redirect for demo
    const form = document.getElementById('contact-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
            btn.classList.replace('btn-primary', 'btn-success');
            btn.style.background = 'var(--status-success)';
            btn.style.boxShadow = 'none';
            form.reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.classList.replace('btn-success', 'btn-primary');
            }, 3000);
        });
    }

    // 7. Video Modal Logic
    const videoModal = document.getElementById('video-modal');
    const htmlPlayer = document.getElementById('html-player');
    const closeVideo = document.querySelector('.close-video');
    const videoTriggers = document.querySelectorAll('.video-trigger');

    if(videoModal && htmlPlayer) {
        videoTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const videoUrl = trigger.closest('.video-trigger').getAttribute('data-video-url');
                htmlPlayer.src = videoUrl;
                videoModal.classList.add('active');
                htmlPlayer.play().catch(e => console.log('Autoplay prevented:', e));
            });
        });

        const closePlayer = () => {
            videoModal.classList.remove('active');
            htmlPlayer.pause();
            htmlPlayer.src = ''; // Clear source to stop video
        };

        closeVideo?.addEventListener('click', closePlayer);

        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closePlayer();
            }
        });
    }

    // 8. Project Tabs Switching
    const tabBtns = document.querySelectorAll('.project-tab-btn');
    const tabContents = document.querySelectorAll('.project-tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Update active button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update active content panel (re-add class to retrigger animation)
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `tab-${targetTab}`) {
                    // Remove and re-add to retrigger CSS animation
                    void content.offsetWidth;
                    content.classList.add('active');
                }
            });
        });
    });

    // 9. Photography Expand Option
    const photographySection = document.getElementById('photography');
    if (photographySection) {
        const galleryItemsList = photographySection.querySelectorAll('.gallery-item');
        const INITIAL_COUNT = 6;
        
        if (galleryItemsList.length > INITIAL_COUNT) {
            // Hide items beyond INITIAL_COUNT
            for (let i = INITIAL_COUNT; i < galleryItemsList.length; i++) {
                galleryItemsList[i].classList.add('hidden');
            }
            
            // Add "View More" button
            const viewMoreBtn = document.createElement('button');
            viewMoreBtn.className = 'btn btn-outline';
            viewMoreBtn.style.margin = '2rem auto 0';
            viewMoreBtn.style.display = 'block';
            viewMoreBtn.textContent = 'View More Photographs';
            
            photographySection.querySelector('.container').appendChild(viewMoreBtn);
            
            viewMoreBtn.addEventListener('click', () => {
                galleryItemsList.forEach(item => {
                    item.classList.remove('hidden');
                    // Retrigger animation if any
                    item.style.animation = 'none';
                    item.offsetHeight; /* trigger reflow */
                    item.style.animation = null; 
                });
                viewMoreBtn.style.display = 'none';
            });
        }
    }

});
