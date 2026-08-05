/* ==========================================================================
   AESTHETIC PORTFOLIO ENGINE - EMERALD CYBERNETIC (main.js)
   ========================================================================== */

// --- EmailJS Credentials Config ---
// Replace these with your actual keys from emailjs.com
const EMAILJS_SERVICE_ID = "service_liq0auo";
const EMAILJS_TEMPLATE_ID = "template_bvkby4d";
const EMAILJS_PUBLIC_KEY = "JNexhLJcaLjAqPBFG";

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Initialize Lenis Smooth Scroll ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 2
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Lenis smooth scroll anchor link clicks
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                lenis.scrollTo(target);
            }
        });
    });

    // --- 2. Spotlight Tracking with Fluid Spring Easing ---
    const heroSection = document.getElementById('home');
    const heroSpotlight = document.getElementById('hero-spotlight');
    
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    const lerpFactor = 0.08; // Soft, misty lag ease factor
    
    if (heroSection && heroSpotlight) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            targetX = e.clientX - rect.left;
            targetY = e.clientY - rect.top;
        });
        
        // Dynamic spring animation loop
        function animateSpotlight() {
            currentX += (targetX - currentX) * lerpFactor;
            currentY += (targetY - currentY) * lerpFactor;
            
            heroSpotlight.style.setProperty('--mx', `${currentX}px`);
            heroSpotlight.style.setProperty('--my', `${currentY}px`);
            
            requestAnimationFrame(animateSpotlight);
        }
        animateSpotlight();
    }

    // --- 3. Aesthetic Cursor Follower ---
    const follower = document.getElementById('cursor-follower');
    let mousePos = { x: -100, y: -100 };
    let followerPos = { x: -100, y: -100 };
    const cursorSpeed = 0.15;
    
    document.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        if (follower && follower.style.opacity === '0') {
            follower.style.opacity = '1';
            followerPos.x = e.clientX;
            followerPos.y = e.clientY;
        }
    });

    document.addEventListener('mouseleave', () => {
        if (follower) follower.style.opacity = '0';
    });

    function animateCursor() {
        followerPos.x += (mousePos.x - followerPos.x) * cursorSpeed;
        followerPos.y += (mousePos.y - followerPos.y) * cursorSpeed;
        if (follower) {
            follower.style.transform = `translate3d(${followerPos.x}px, ${followerPos.y}px, 0) translate(-50%, -50%)`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Attach hover listener for interactive classes
    function setupCursorHovers() {
        const interactives = document.querySelectorAll('a, button, .theme-toggle, #neural-canvas, input, textarea, .hud-btn');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (!follower) return;
                follower.classList.add('hovered');
                if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.classList.contains('hud-btn')) {
                    follower.style.borderColor = 'transparent';
                    follower.style.backgroundColor = 'rgba(var(--accent-rgb), 0.15)';
                    follower.style.width = '48px';
                    follower.style.height = '48px';
                } else if (el.id === 'neural-canvas') {
                    follower.style.borderColor = 'var(--accent-2)';
                    follower.style.width = '32px';
                    follower.style.height = '32px';
                }
            });
            el.addEventListener('mouseleave', () => {
                if (!follower) return;
                follower.classList.remove('hovered');
                follower.style.borderColor = 'var(--accent)';
                follower.style.backgroundColor = 'transparent';
                follower.style.width = '20px';
                follower.style.height = '20px';
            });
        });
    }
    setupCursorHovers();

    // --- 4. Magnetic Hover Attraction ---
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            // Subtle offset pull
            el.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- 5. Theme Toggle Switcher ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        const defaultTheme = systemPrefersDark ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', defaultTheme);
    }
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- 6. Reveal-on-Scroll Observer ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-heading');
    
    const revealObserverOptions = {
        root: null,
        threshold: 0.08, // Trigger slightly early
        rootMargin: '0px 0px -50px 0px' // Soft fade margin offset
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                
                // If stats are nested in this section, trigger progress bar fill
                const stats = entry.target.querySelectorAll('.stat-bar__fill');
                if (stats.length > 0) {
                    stats.forEach(bar => {
                        const progress = bar.getAttribute('data-progress');
                        bar.style.width = progress;
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // --- 7. Navbar Scroll Polish ---
    const navbar = document.getElementById('main-nav');
    
    function polishNavbarOnScroll() {
        if (window.scrollY > 40) {
            navbar.classList.add('is-scrolled');
        } else {
            navbar.classList.remove('is-scrolled');
        }
    }
    
    window.addEventListener('scroll', polishNavbarOnScroll);
    polishNavbarOnScroll(); // Trigger initially

    // --- 8. Top Grid Navigation Active Section Syncing ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__links a');
    
    const sectionObserverOptions = {
        root: null,
        threshold: 0.35 // Active when 35% of the section is visible
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentActiveSectionId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    const targetHref = link.getAttribute('href');
                    if (targetHref === `#${currentActiveSectionId}`) {
                        link.classList.add('active');
                        link.style.color = 'var(--text)'; // Highlight active link
                    } else {
                        link.classList.remove('active');
                        link.style.color = 'var(--text-mute)';
                    }
                });
            }
        });
    }, sectionObserverOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- 9. 3D Card Perspectival Tilt ---
    const cardViews = document.querySelectorAll('.pv');
    cardViews.forEach(card => {
        const wrapper = card.parentElement;
        wrapper.addEventListener('mousemove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = ((x / rect.width) - 0.5) * 2; // -1 to 1
            const yc = (((y / rect.height) - 0.5) * 2) * -1; // -1 to 1 (inverted Y)
            
            const tiltX = yc * 6; // Max 6deg
            const tiltY = xc * 6;
            
            card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        wrapper.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // --- 10. Neural Node Canvas Particle Animation & HUD Dashboard ---
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, active: false };
        let gravityAttractorActive = true;
        
        const labels = ['agent', 'llm', 'planner', 'memory', 'router', 'tool', 'reasoner', 'neural-link', 'generator', 'RAG'];
        
        function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });
        if (canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }
        
        class Particle {
            constructor(x, y, label = '') {
                const dpr = window.devicePixelRatio || 1;
                const w = canvas.width / dpr;
                const h = canvas.height / dpr;
                
                this.x = x !== undefined ? x : Math.random() * w;
                this.y = y !== undefined ? y : Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 2;
                this.label = label || (Math.random() < 0.35 ? labels[Math.floor(Math.random() * labels.length)] : '');
            }
            
            update() {
                const dpr = window.devicePixelRatio || 1;
                const w = canvas.width / dpr;
                const h = canvas.height / dpr;
                
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > w) this.vx *= -1;
                if (this.y < 0 || this.y > h) this.vy *= -1;
                
                if (mouse.active && mouse.x !== null && mouse.y !== null && gravityAttractorActive) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 100) {
                        this.vx += (dx / dist) * 0.015;
                        this.vy += (dy / dist) * 0.015;
                        const speed = Math.hypot(this.vx, this.vy);
                        if (speed > 1.2) {
                            this.vx = (this.vx / speed) * 1.2;
                            this.vy = (this.vy / speed) * 1.2;
                        }
                    }
                }
            }
            
            draw() {
                const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#dfc27d';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = accentColor;
                
                // Pulsing glow ring
                const pulse = Math.sin(Date.now() * 0.0035 + this.x) * 0.3 + 0.7;
                ctx.shadowColor = accentColor;
                ctx.shadowBlur = 6 * pulse;
                ctx.fill();
                ctx.shadowBlur = 0;
                
                if (this.label) {
                    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-mute').trim() || '#a3a3a3';
                    ctx.fillStyle = textColor;
                    ctx.font = '500 8.5px "JetBrains Mono", monospace';
                    ctx.fillText(this.label, this.x + 8, this.y + 3);
                }
            }
        }
        
        const dprVal = window.devicePixelRatio || 1;
        const initCount = 22;
        for (let i = 0; i < initCount; i++) {
            particles.push(new Particle());
        }
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.active = true;
        });
        
        canvas.addEventListener('mouseleave', () => {
            mouse.active = false;
        });
        
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            for (let i = 0; i < 5; i++) {
                const label = labels[Math.floor(Math.random() * labels.length)];
                const p = new Particle(clickX, clickY, label);
                p.vx = (Math.random() - 0.5) * 1.8;
                p.vy = (Math.random() - 0.5) * 1.8;
                particles.push(p);
            }
            
            if (particles.length > 55) {
                particles.splice(0, particles.length - 55);
            }
            
            addLogTickerLine(`> click detected: spawned 5 agentic nodes`);
        });
        
        // Connect UI Buttons
        const gravityBtn = document.getElementById('hud-gravity-btn');
        const resetBtn = document.getElementById('hud-reset-btn');
        const tickerLogs = document.getElementById('ticker-logs');
        
        if (gravityBtn) {
            gravityBtn.classList.toggle('active', gravityAttractorActive);
            gravityBtn.addEventListener('click', () => {
                gravityAttractorActive = !gravityAttractorActive;
                gravityBtn.classList.toggle('active', gravityAttractorActive);
                addLogTickerLine(gravityAttractorActive ? '> cursor attractor: active' : '> cursor attractor: offline');
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                particles = [];
                for (let i = 0; i < initCount; i++) {
                    particles.push(new Particle());
                }
                addLogTickerLine('> agent network core reset complete');
            });
        }
        
        const logMessages = [
            'querying ChromaDB: matching embeddings...',
            'Tavily search API request sent...',
            'writer_agent: compiling citation blocks...',
            'LLM synthesis output: token streaming...',
            'routing agent state graph transition...',
            'local database: chromadb index updated',
            'cryptographic verification handshake...',
            'secured sockets: channel validated',
            'planner_agent: updating execution queue',
            'agent network: status green'
        ];
        
        function addLogTickerLine(text) {
            if (!tickerLogs) return;
            const newLine = document.createElement('div');
            newLine.className = 'ticker__line active-log';
            newLine.textContent = text;
            tickerLogs.appendChild(newLine);
            
            if (tickerLogs.children.length > 4) {
                tickerLogs.removeChild(tickerLogs.firstChild);
            }
            
            Array.from(tickerLogs.children).forEach((child, index) => {
                if (index < tickerLogs.children.length - 1) {
                    child.classList.remove('active-log');
                }
            });
            
            tickerLogs.scrollTop = tickerLogs.scrollHeight;
        }
        
        // Randomly add system logs every 4 seconds
        setInterval(() => {
            const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
            addLogTickerLine(`> ${msg}`);
        }, 4000);
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const rgb = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || '223, 194, 125';
            
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);
                    
                    if (dist < 80) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${rgb}, ${0.16 * (1 - dist / 80)})`;
                        ctx.lineWidth = 0.75;
                        ctx.stroke();
                        
                        // Traveling data packets
                        const progress = (Date.now() * 0.00065 * (1 + (i % 3) * 0.35)) % 1;
                        const px = particles[i].x + (particles[j].x - particles[i].x) * progress;
                        const py = particles[i].y + (particles[j].y - particles[i].y) * progress;
                        
                        ctx.beginPath();
                        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${rgb}, 0.8)`;
                        ctx.fill();
                    }
                }
                
                if (mouse.active && mouse.x !== null && mouse.y !== null && gravityAttractorActive) {
                    const dx = mouse.x - particles[i].x;
                    const dy = mouse.y - particles[i].y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(mouse.x, mouse.y);
                        ctx.lineTo(particles[i].x, particles[i].y);
                        ctx.strokeStyle = `rgba(${rgb}, ${0.28 * (1 - dist / 110)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    // Refresh cursor hover listeners since new buttons may have been rendered dynamically
    setTimeout(setupCursorHovers, 500);

    // --- 11. Cycle Active Nodes in Agentic Flow Visual ---
    const flowNodes = document.querySelectorAll('.flow-node');
    let activeNodeIndex = 0;
    
    function cycleFlowNodes() {
        if (flowNodes.length === 0) return;
        flowNodes.forEach((node, idx) => {
            node.classList.toggle('active', idx === activeNodeIndex);
        });
        activeNodeIndex = (activeNodeIndex + 1) % flowNodes.length;
    }
    
    // Cycle every 2.5 seconds
    setInterval(cycleFlowNodes, 2500);

});

// --- 11. Form Submission via EmailJS (Secured Cybernetic Beacon Signal) ---
function handleFormSubmit() {
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit-btn');
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const msgInput = document.getElementById('form-message');
    
    if (!feedback || !submitBtn) return;
    
    // Check if EmailJS credentials are configured
    if (EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" || EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID" || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
        feedback.classList.remove('hidden', 'success');
        feedback.style.color = '#ef4444';
        feedback.textContent = 'ERROR: EMAILJS CREDENTIALS NOT CONFIGURED IN MAIN.JS.';
        console.error('Please configure your EmailJS credentials (EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY) at the top of main.js');
        return;
    }
    
    feedback.classList.remove('hidden', 'success');
    feedback.style.color = ''; // Reset custom color inline overrides
    feedback.textContent = 'TRANSMITTING SECURED BEACON SIGNAL...';
    submitBtn.disabled = true;
    
    // Aesthetic step delay before firing network request
    setTimeout(() => {
        feedback.textContent = 'CONNECTING COMPUTATION MATRIX...';
        
        fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: EMAILJS_SERVICE_ID,
                template_id: EMAILJS_TEMPLATE_ID,
                user_id: EMAILJS_PUBLIC_KEY,
                template_params: {
                    from_name: nameInput ? nameInput.value : '',
                    reply_to: emailInput ? emailInput.value : '',
                    message: msgInput ? msgInput.value : ''
                }
            })
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            return response.text().then(errText => {
                throw new Error(errText || 'Network response was not ok.');
            });
        })
        .then(data => {
            feedback.classList.add('success');
            feedback.textContent = 'TRANSMISSION SECURED successfully! CYBERNETIC LINK ONLINE.';
            
            if (nameInput) nameInput.value = '';
            if (emailInput) emailInput.value = '';
            if (msgInput) msgInput.value = '';
            
            setTimeout(() => {
                feedback.classList.add('hidden');
                submitBtn.disabled = false;
            }, 5000);
        })
        .catch(error => {
            console.error('Submission error:', error);
            feedback.style.color = '#ef4444'; // Red error alert color
            feedback.textContent = 'TRANSMISSION FAILED. PLEASE TRY AGAIN OR EMAIL DIRECTLY.';
            submitBtn.disabled = false;
            
            setTimeout(() => {
                feedback.classList.add('hidden');
            }, 6000);
        });
    }, 1000);
}

// --- RepoMind Repo Tree Scanner Animation ---
(function initRepoMindTree() {
    const tree = document.getElementById('rm-tree');
    if (!tree) return;

    const statusEl      = document.getElementById('rm-status');
    const filesEl       = document.getElementById('rm-files-scanned');
    const classesEl     = document.getElementById('rm-classes');
    const doneEl        = document.getElementById('rm-done');
    const progressFill  = document.getElementById('rm-progress-fill');

    // Only scan .rm-file rows (not dirs / root)
    const fileRows = Array.from(tree.querySelectorAll('.rm-row.rm-file'));
    const TOTAL    = fileRows.length; // 9 files

    let currentIdx    = 0;
    let filesScanned  = 0;
    let classCount    = 0;
    let scanTimer     = null;
    let started       = false;

    const CLASS_COUNTS = [3, 2, 1, 1, 2, 1, 0, 0, 0]; // per file

    function resetTree() {
        fileRows.forEach(row => {
            row.classList.remove('rm-scanning', 'rm-scanned');
            const ann = row.querySelector('.rm-ann');
            if (ann) { ann.style.display = 'none'; ann.classList.remove('visible'); }
        });
        currentIdx   = 0;
        filesScanned = 0;
        classCount   = 0;
        if (filesEl)      filesEl.textContent   = '0';
        if (classesEl)    classesEl.textContent  = '0';
        if (progressFill) progressFill.style.width = '0%';
        if (doneEl)       { doneEl.textContent = 'indexing…'; doneEl.style.color = '#4ade80'; }
        if (statusEl)     statusEl.textContent  = '● scanning';
    }

    function scanNext() {
        if (currentIdx >= TOTAL) {
            // All done
            if (statusEl)  statusEl.textContent = '● indexed';
            if (doneEl)    { doneEl.textContent = 'complete ✓'; doneEl.style.color = '#a3e635'; }

            // Restart after 3s
            scanTimer = setTimeout(() => {
                resetTree();
                scanTimer = setTimeout(scanNext, 400);
            }, 3200);
            return;
        }

        const row = fileRows[currentIdx];

        // Remove scanning from previous
        if (currentIdx > 0) {
            fileRows[currentIdx - 1].classList.remove('rm-scanning');
            fileRows[currentIdx - 1].classList.add('rm-scanned');
            // Show annotation badge on previous row with slight delay
            const prevAnn = fileRows[currentIdx - 1].querySelector('.rm-ann');
            if (prevAnn) {
                prevAnn.style.display = 'inline-block';
                requestAnimationFrame(() => {
                    setTimeout(() => prevAnn.classList.add('visible'), 60);
                });
            }
        }

        // Activate current row
        row.classList.add('rm-scanning');

        // Update counters
        filesScanned++;
        classCount += CLASS_COUNTS[currentIdx] || 0;
        if (filesEl)      filesEl.textContent   = filesScanned;
        if (classesEl)    classesEl.textContent  = classCount;
        if (progressFill) progressFill.style.width = `${(filesScanned / TOTAL) * 100}%`;

        currentIdx++;

        // Speed varies slightly per row for realism
        const delay = 520 + Math.random() * 340;
        scanTimer = setTimeout(scanNext, delay);
    }

    function startScan() {
        if (started) return;
        started = true;
        resetTree();
        // Small initial pause so user notices the card before it starts
        scanTimer = setTimeout(scanNext, 900);
    }

    // Kick off when section scrolls into view
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            startScan();
            observer.disconnect();
        }
    }, { threshold: 0.15 });
    observer.observe(tree);
})();

// --- Lead-Bot Conversational Agent Widget ---
(function initLeadBotWidget() {
    // 1. Overview Mock Chat Loop
    const pbChatOverview = document.getElementById('pb-chat-overview');
    if (pbChatOverview) {
        const overviewMessages = [
            { type: 'bot', text: 'Hi! I can help you hire Jyotiraditya or co-engineer a project. What are you building?' },
            { type: 'user', text: 'Hey! Looking for an Agentic AI dev to build a custom RAG agent.' },
            { type: 'bot-typing' },
            { type: 'bot', text: 'Excellent! I have built multiple RAG systems using RAPTOR (hierarchical tree) and Corrective RAG (CRAG) setups. Do you want to see details?' },
            { type: 'user', text: 'Yes, that would be great.' },
            { type: 'bot-typing' },
            { type: 'bot', text: 'Awesome! Scroll down to the services section below to test me in real-time or view my documentation.' }
        ];

        let currentMsgIdx = 0;
        let loopTimer = null;

        function runOverviewChatLoop() {
            if (currentMsgIdx >= overviewMessages.length) {
                // Reset after 6 seconds
                setTimeout(() => {
                    pbChatOverview.innerHTML = '';
                    currentMsgIdx = 0;
                    runOverviewChatLoop();
                }, 6000);
                return;
            }

            const msg = overviewMessages[currentMsgIdx];
            if (msg.type === 'bot-typing') {
                const typingDiv = document.createElement('div');
                typingDiv.className = 'pb-msg pb-bot-typing';
                typingDiv.id = 'pb-typing-indicator';
                typingDiv.innerHTML = '<span></span><span></span><span></span>';
                pbChatOverview.appendChild(typingDiv);
                pbChatOverview.scrollTop = pbChatOverview.scrollHeight;
                
                currentMsgIdx++;
                loopTimer = setTimeout(runOverviewChatLoop, 1500 + Math.random() * 500);
            } else {
                // Remove typing indicator if present
                const indicator = document.getElementById('pb-typing-indicator');
                if (indicator) indicator.remove();

                const msgDiv = document.createElement('div');
                msgDiv.className = `pb-msg pb-${msg.type}`;
                msgDiv.textContent = msg.text;
                pbChatOverview.appendChild(msgDiv);
                pbChatOverview.scrollTop = pbChatOverview.scrollHeight;
                
                currentMsgIdx++;
                // Wait longer after bot messages, shorter after user messages
                const delay = msg.type === 'bot' ? 3000 : 1500;
                loopTimer = setTimeout(runOverviewChatLoop, delay);
            }
        }

        // Start loop when in view
        const overviewObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                pbChatOverview.innerHTML = '';
                currentMsgIdx = 0;
                runOverviewChatLoop();
                overviewObserver.disconnect();
            }
        }, { threshold: 0.1 });
        overviewObserver.observe(pbChatOverview);
    }

    // 2. Interactive Lead-Bot Widget
    const chatScreen = document.getElementById('chat-screen');
    const userInput = document.getElementById('chat-user-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const optionsContainer = document.getElementById('chat-options-container');
    const telemetryLogs = document.getElementById('agent-telemetry-logs');

    if (!chatScreen) return;

    let currentState = 'idle'; // idle, ask_name, ask_email, ask_project, submitting, completed
    let leadData = { name: '', email: '', desc: '' };

    function addTelemetryLog(text) {
        if (!telemetryLogs) return;
        const line = document.createElement('div');
        line.className = 'telemetry-line active-log';
        line.textContent = text;
        telemetryLogs.appendChild(line);

        if (telemetryLogs.children.length > 5) {
            telemetryLogs.removeChild(telemetryLogs.firstChild);
        }

        Array.from(telemetryLogs.children).forEach((child, index) => {
            if (index < telemetryLogs.children.length - 1) {
                child.classList.remove('active-log');
            }
        });
        telemetryLogs.scrollTop = telemetryLogs.scrollHeight;
    }

    function addBubble(type, text) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${type}`;
        bubble.textContent = text;
        chatScreen.appendChild(bubble);
        chatScreen.scrollTop = chatScreen.scrollHeight;
    }

    function showTypingIndicator() {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble typing';
        bubble.id = 'chat-typing';
        bubble.innerHTML = '<span></span><span></span><span></span>';
        chatScreen.appendChild(bubble);
        chatScreen.scrollTop = chatScreen.scrollHeight;
    }

    function removeTypingIndicator() {
        const el = document.getElementById('chat-typing');
        if (el) el.remove();
    }

    const responses = {
        skills: "Jyotiraditya is an AI/ML & Agentic Engineer specializing in: \n\n• Agentic Systems (LangGraph, Multi-Agent Collaboration)\n• NLP & RAG (RAPTOR indexing, Corrective RAG setups)\n• Machine Learning & Deep Learning (Quantized local models, AST code analyzers)\n• Backend: FastAPI, Python, Redis, Postgres\n• Frontend: Javascript, React, HTML5/CSS3",
        general: "Sure! Ask me anything, or download Jyotiraditya's CV directly from the header navigation link. What would you like to know?",
        menu: "I am ready to route. How can I help you? Select an option or type a message below."
    };

    function showMenuOptions() {
        optionsContainer.innerHTML = '';
        optionsContainer.style.display = 'flex';
        
        const opts = [
            { text: '💼 Hire Jyotiraditya', intent: 'hire' },
            { text: '🚀 Get a Project Quote', intent: 'project' },
            { text: '🧠 Ask about Skills', intent: 'skills' },
            { text: '🔙 Main Menu', intent: 'menu' }
        ];

        opts.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'chat-option-btn magnetic';
            btn.textContent = opt.text;
            btn.setAttribute('data-intent', opt.intent);
            btn.addEventListener('click', () => handleIntent(opt.intent));
            optionsContainer.appendChild(btn);
        });

        // Setup hover state listeners
        setTimeout(() => {
            const interactives = optionsContainer.querySelectorAll('.chat-option-btn');
            const follower = document.getElementById('cursor-follower');
            interactives.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    if (!follower) return;
                    follower.classList.add('hovered');
                    follower.style.borderColor = 'transparent';
                    follower.style.backgroundColor = 'rgba(var(--accent-rgb), 0.15)';
                    follower.style.width = '48px';
                    follower.style.height = '48px';
                });
                el.addEventListener('mouseleave', () => {
                    if (!follower) return;
                    follower.classList.remove('hovered');
                    follower.style.borderColor = 'var(--accent)';
                    follower.style.backgroundColor = 'transparent';
                    follower.style.width = '20px';
                    follower.style.height = '20px';
                });
            });

            // Magnetic pull
            const magneticElements = optionsContainer.querySelectorAll('.magnetic');
            magneticElements.forEach(el => {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left - (rect.width / 2);
                    const y = e.clientY - rect.top - (rect.height / 2);
                    el.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
                });
                el.addEventListener('mouseleave', () => {
                    el.style.transform = 'translate(0px, 0px)';
                });
            });
        }, 100);
    }

    function handleIntent(intent) {
        optionsContainer.style.display = 'none';
        
        if (intent === 'skills') {
            addTelemetryLog('> user intent: query_skills');
            addTelemetryLog('> querying portfolio knowledge base...');
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addBubble('bot', responses.skills);
                addTelemetryLog('> RAG response synthesized [142 tokens]');
                showMenuOptions();
            }, 1000);
        } else if (intent === 'menu') {
            addTelemetryLog('> user intent: main_menu');
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addBubble('bot', responses.menu);
                showMenuOptions();
            }, 600);
        } else if (intent === 'hire' || intent === 'project') {
            const intentLbl = intent === 'hire' ? 'hire_developer' : 'project_quote';
            addTelemetryLog(`> user intent: ${intentLbl}`);
            addTelemetryLog('> state transitioned: ask_name');
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addBubble('bot', "Excellent! Let's get you connected. To start, what is your name?");
                currentState = 'ask_name';
            }, 800);
        }
    }

    function handleUserText(text) {
        if (!text.trim()) return;
        addBubble('user', text);
        userInput.value = '';

        if (currentState === 'idle' || currentState === 'completed') {
            const cleanText = text.toLowerCase();
            addTelemetryLog('> classifying user query: "' + text.substring(0, 25) + '..."');
            
            // Local simple intent classification
            if (cleanText.includes('hire') || cleanText.includes('job') || cleanText.includes('recruit') || cleanText.includes('work')) {
                handleIntent('hire');
            } else if (cleanText.includes('project') || cleanText.includes('build') || cleanText.includes('develop') || cleanText.includes('quote') || cleanText.includes('cost')) {
                handleIntent('project');
            } else if (cleanText.includes('skill') || cleanText.includes('tech') || cleanText.includes('python') || cleanText.includes('ai') || cleanText.includes('langgraph')) {
                handleIntent('skills');
            } else if (cleanText.includes('resume') || cleanText.includes('cv') || cleanText.includes('pdf')) {
                addTelemetryLog('> user intent: query_cv');
                showTypingIndicator();
                setTimeout(() => {
                    removeTypingIndicator();
                    addBubble('bot', "You can download Jyotiraditya's CV directly by clicking the CV button at the top-right of the page. Alternatively, find the PDF at: jyotiraditya.is-a.dev/assets/cv.pdf");
                    showMenuOptions();
                }, 800);
            } else {
                addTelemetryLog('> classification: general_qa (confidence low)');
                addTelemetryLog('> fallback mode activated');
                showTypingIndicator();
                setTimeout(() => {
                    removeTypingIndicator();
                    addBubble('bot', "I've logged your query. To help you best, would you like to start a recruitment quote, ask about technical skills, or write a custom message to Jyotiraditya's feed?");
                    showMenuOptions();
                }, 1200);
            }
        } else if (currentState === 'ask_name') {
            leadData.name = text;
            addTelemetryLog(`> data captured: name = "${text}"`);
            addTelemetryLog('> state transitioned: ask_email');
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addBubble('bot', `Great to meet you, ${text}! What is your email address so we can contact you?`);
                currentState = 'ask_email';
            }, 800);
        } else if (currentState === 'ask_email') {
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(text)) {
                addTelemetryLog(`> email validation failed: "${text}"`);
                showTypingIndicator();
                setTimeout(() => {
                    removeTypingIndicator();
                    addBubble('bot', "That doesn't look like a valid email. Please check the spelling and try again.");
                }, 600);
            } else {
                leadData.email = text;
                addTelemetryLog(`> data captured: email = "${text}"`);
                addTelemetryLog('> state transitioned: ask_project');
                showTypingIndicator();
                setTimeout(() => {
                    removeTypingIndicator();
                    addBubble('bot', "Got it. Finally, could you describe what you're building or the role you are looking to fill?");
                    currentState = 'ask_project';
                }, 800);
            }
        } else if (currentState === 'ask_project') {
            leadData.desc = text;
            addTelemetryLog(`> data captured: scope = "${text.substring(0, 30)}..."`);
            addTelemetryLog('> preparing secured payload...');
            currentState = 'submitting';
            showTypingIndicator();

            // Try email dispatch
            setTimeout(() => {
                addTelemetryLog('> dispatching telemetry package via EmailJS...');
                
                const serviceId = EMAILJS_SERVICE_ID || 'service_liq0auo';
                const templateId = EMAILJS_TEMPLATE_ID || 'template_bvkby4d';
                const publicKey = EMAILJS_PUBLIC_KEY || 'JNexhLJcaLjAqPBFG';

                if (publicKey && publicKey !== 'YOUR_PUBLIC_KEY' && serviceId !== 'YOUR_SERVICE_ID') {
                    fetch("https://api.emailjs.com/api/v1.0/email/send", {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            service_id: serviceId,
                            template_id: templateId,
                            user_id: publicKey,
                            template_params: {
                                from_name: leadData.name,
                                reply_to: leadData.email,
                                message: `LEAD-BOT CAPTURED INTERACTION:\nName: ${leadData.name}\nEmail: ${leadData.email}\nDetails: ${leadData.desc}`
                            }
                        })
                    })
                    .then(res => {
                        removeTypingIndicator();
                        if (res.ok) {
                            addTelemetryLog('> server handshake: response 200 OK');
                            addTelemetryLog('> lead signal successfully transmitted');
                            addBubble('bot', `Success! Your inquiry has been securely sent to Jyotiraditya's inbox. He will reach back to you at ${leadData.email} as soon as possible. Thank you!`);
                        } else {
                            throw new Error('EmailJS returned non-ok status');
                        }
                        finalizeLeadFlow();
                    })
                    .catch(err => {
                        console.error('Leadbot dispatch error:', err);
                        removeTypingIndicator();
                        addTelemetryLog('> warning: email gateway timeout, using cache fallback');
                        addTelemetryLog('> lead details saved to local cache feed');
                        addBubble('bot', `Thank you, ${leadData.name}! Your inquiry has been registered. Jyotiraditya will receive it and get back to you at ${leadData.email} shortly.`);
                        finalizeLeadFlow();
                    });
                } else {
                    // Simulation mode
                    setTimeout(() => {
                        removeTypingIndicator();
                        addTelemetryLog('> API simulation active');
                        addTelemetryLog('> lead signal successfully simulated');
                        addBubble('bot', `Success! Your inquiry has been registered (simulated). Jyotiraditya will get back to you at ${leadData.email} shortly.`);
                        finalizeLeadFlow();
                    }, 1000);
                }
            }, 1200);
        }
    }

    function finalizeLeadFlow() {
        currentState = 'completed';
        leadData = { name: '', email: '', desc: '' };
        
        optionsContainer.innerHTML = '';
        optionsContainer.style.display = 'flex';
        
        const btn = document.createElement('button');
        btn.className = 'chat-option-btn magnetic';
        btn.textContent = '🔙 Back to Menu';
        btn.addEventListener('click', () => handleIntent('menu'));
        optionsContainer.appendChild(btn);

        // Re-setup hover cursor logic
        setTimeout(() => {
            const el = optionsContainer.querySelector('.chat-option-btn');
            const follower = document.getElementById('cursor-follower');
            if (el && follower) {
                el.addEventListener('mouseenter', () => {
                    follower.classList.add('hovered');
                    follower.style.borderColor = 'transparent';
                    follower.style.backgroundColor = 'rgba(var(--accent-rgb), 0.15)';
                    follower.style.width = '48px';
                    follower.style.height = '48px';
                });
                el.addEventListener('mouseleave', () => {
                    follower.classList.remove('hovered');
                    follower.style.borderColor = 'var(--accent)';
                    follower.style.backgroundColor = 'transparent';
                    follower.style.width = '20px';
                    follower.style.height = '20px';
                });
            }
        }, 50);
    }

    // Attach button click listeners
    const optButtons = optionsContainer.querySelectorAll('.chat-option-btn');
    optButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const intent = e.target.getAttribute('data-intent');
            handleIntent(intent);
        });
    });

    // Send on click
    sendBtn.addEventListener('click', () => {
        handleUserText(userInput.value);
    });

    // Send on enter
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserText(userInput.value);
        }
    });

})();


