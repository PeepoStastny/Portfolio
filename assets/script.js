const hamburger = document.getElementById('hamburger-menu');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-odkazy a');
const navOverlay = document.getElementById('nav-overlay');

function toggleMobileMenu(open) {
    const shouldOpen = open !== undefined ? open : !navMenu.classList.contains('active');
    hamburger.classList.toggle('active', shouldOpen);
    navMenu.classList.toggle('active', shouldOpen);
    if (navOverlay) navOverlay.classList.toggle('active', shouldOpen);
    hamburger.setAttribute('aria-expanded', shouldOpen);
    document.body.style.overflow = shouldOpen ? 'hidden' : 'auto';
}

hamburger.addEventListener('click', () => toggleMobileMenu());

if (navOverlay) {
    navOverlay.addEventListener('click', () => toggleMobileMenu(false));
}

// Plynulá navigace bez layout shiftu a s dynamickým dorovnáním
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.slice(1);
            const targetElement = document.getElementById(targetId);

            if (navMenu && navMenu.classList.contains('active')) {
                toggleMobileMenu(false);
            }

            if (targetElement) {
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth' });

                    const zkontrolovatADorovnat = () => {
                        const rect = targetElement.getBoundingClientRect();
                        const cilovaVyska = 80;
                        if (Math.abs(rect.top - cilovaVyska) > 10) {
                            window.scrollBy({
                                top: rect.top - cilovaVyska,
                                behavior: 'smooth'
                            });
                        }
                    };

                    setTimeout(zkontrolovatADorovnat, 350);
                    setTimeout(zkontrolovatADorovnat, 700);

                    history.pushState(null, null, href);
                }, 50);
            }
        }
    });
});

window.addEventListener('load', () => {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
});

const sections = document.querySelectorAll('header, section[id]');
const observerOptions = { 
    root: null, 
    rootMargin: '-20% 0px -65% 0px', 
    threshold: 0 
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${id}`) {
                    link.classList.add('aktivni');
                } else {
                    link.classList.remove('aktivni');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(sec => observer.observe(sec));

// Lightbox modal se správou položek pro listování klávesami
const lightbox = document.getElementById('lightbox');
const mediaContainer = document.getElementById('lightbox-media-container');

let activeGalleryItems = [];
let currentItemIndex = -1;

function showLightboxItem(item) {
    mediaContainer.innerHTML = '';
    const img = item.querySelector('img');
    const video = item.querySelector('video source');

    if (img) {
        const newImg = document.createElement('img');
        newImg.src = img.currentSrc || img.src;
        newImg.alt = img.alt || '';
        newImg.className = 'lightbox-content';
        mediaContainer.appendChild(newImg);
    } else if (video) {
        const newVideo = document.createElement('video');
        newVideo.src = video.src;
        newVideo.className = 'lightbox-content';
        newVideo.controls = true;
        newVideo.autoplay = true;
        mediaContainer.appendChild(newVideo);
    }
}

function openLightbox(element, type) {
    const container = element.closest('.gallery-container') || element.parentElement;
    activeGalleryItems = Array.from(container.querySelectorAll('.gallery-item'));
    currentItemIndex = activeGalleryItems.indexOf(element);

    showLightboxItem(element);

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightboxModal() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
    mediaContainer.innerHTML = '';
    activeGalleryItems = [];
    currentItemIndex = -1;
}

function closeLightbox(event) {
    if (event.target === lightbox || event.target.className === 'close-btn') {
        closeLightboxModal();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (lightbox.classList.contains('active')) {
            closeLightboxModal();
        } else if (navMenu.classList.contains('active')) {
            toggleMobileMenu(false);
        }
        return;
    }

    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'ArrowRight') {
        if (activeGalleryItems.length > 1) {
            currentItemIndex = (currentItemIndex + 1) % activeGalleryItems.length;
            showLightboxItem(activeGalleryItems[currentItemIndex]);
        }
    } else if (e.key === 'ArrowLeft') {
        if (activeGalleryItems.length > 1) {
            currentItemIndex = (currentItemIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
            showLightboxItem(activeGalleryItems[currentItemIndex]);
        }
    }
});

const lazyVideos = document.querySelectorAll('.lazy-video');
if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.play().catch(e => e);
            } else {
                entry.target.pause();
            }
        });
    });
    lazyVideos.forEach(video => {
        videoObserver.observe(video);
    });
} else {
    lazyVideos.forEach(video => video.setAttribute('autoplay', ''));
}

const translations = {
    "cs": {
        "nav-uvod": "Úvod",
        "nav-omne": "O mně",
        "nav-zkusenosti": "Zkušenosti",
        "nav-3d": "3D Modely",
        "nav-plakaty": "Plakáty",
        "nav-mockupy": "Mockupy",
        "nav-fotografie": "Fotografie",
        "nav-obaly": "Obaly",
        "nav-ilustrace": "Ilustrace",
        "nav-ui": "UI/UX",
        "nav-kontakt": "Kontakt",
        "omne-nadpis": "O mně",
        "omne-p1": "Jsem designér se zaměřením na UX/UI design a digitální komunikaci. Ve své práci kombinuji kreativitu s analytickým přístupem – navrhuji rozhraní, která jsou nejen vizuálně podmanivá, ale především bezchybně funkční a uživatelsky přívětivá.",
        "omne-p2": "K projektům přistupuji systematicky. Od počátečního uživatelského výzkumu a wireframingu, přes tvorbu konzistentních design systémů, až po iterace a úzkou spolupráci s vývojáři. K dosažení dokonalosti využívám nástroje jako Figma či Photoshop, s jejichž pomocí přetvářím reálné problémy v elegantní digitální řešení. Rád však svou tvorbu obohacuji i o 3D modelování či klasický grafický design.",
        "nadpis-3d": "3D Modely",
        "nadpis-plakaty": "Plakáty",
        "nadpis-mockupy": "Mockupy",
        "nadpis-fotografie": "Fotografie",
        "nadpis-obaly": "Obaly hudebních alb",
        "nadpis-ilustrace": "Ilustrace & Magazín",
        "nadpis-ui": "Ukázka UI/UX",
        "nadpis-manual": "Logomanuál",
        "manual-p": "Kliknutím na náhled níže otevřete kompletní specifikaci vizuální identity v PDF formátu.",
        "manual-btn": "Otevřít PDF",
        "nadpis-kontakt": "Kontakt",
        "form-jmeno": "Vaše jméno",
        "form-email": "Váš email",
        "form-zprava": "Vaše zpráva",
        "form-btn": "Odeslat zprávu",
        "form-odesilam": "Odesílám...",
        "form-chyba": "Omlouvám se, zprávu se nepodařilo odeslat. Zkuste to prosím později.",
        "form-uspech": "Děkuji vám. Vaše zpráva byla úspěšně odeslána. Brzy se vám ozvu.",
        "footer-text": "© 2026 Jáchym Vondráček. Všechna práva vyhrazena.",
        "nadpis-zkusenosti": "Zkušenosti a Vzdělání",
        "exp1-date": "2023 - Současnost",
        "exp1-title": "Grafický Designer",
        "exp1-company": "Golden Support",
        "exp1-desc": "Návrh a tvorba uživatelských rozhraní, vizuálních systémů a kreativních konceptů s důrazem na funkčnost a uživatelský prožitek.",
        "exp2-date": "2023 - 2026",
        "exp2-title": "Bakalářské studium (Bc.)",
        "exp2-company": "Univerzita Pardubice",
        "exp2-desc": "Studijní program Digitální podnikání. Propojení informačních technologií s moderním byznysem a managementem.",
        "exp3-date": "2021 - 2022",
        "exp3-title": "Specialista marketingu",
        "exp3-company": "NEY spořitelní družstvo",
        "exp3-desc": "Správa webu, tvorba obsahu a asistence při aplikaci dlouhodobého marketingového plánu.",
        "exp4-date": "2018 - 2022",
        "exp4-title": "Informační technologie",
        "exp4-company": "DELTA - Střední škola informatiky a ekonomie",
        "exp4-desc": "Středoškolské studium se zaměřením na IT, programování a databázové systémy.",
        "nadpis-certifikaty": "Certifikace a Ocenění",
        "cert1-title": "EF SET English Certificate (C2 Proficient)",
        "cert1-org": "EF SET",
        "cert2-title": "Základy digitálního marketingu",
        "cert2-org": "Google Digital Garage",
        "cert3-title": "Elements of AI",
        "cert3-org": "University of Helsinki",
        "cert4-title": "CCNA: Switching, Routing & Wireless",
        "cert4-org": "Cisco",
        "cert5-title": "Database Foundations",
        "cert5-org": "Oracle",
        "cert6-title": "European Computer Driving Licence",
        "cert6-org": "ECDL Czech Republic",
        "nav-manual": "Logomanuál",
        "nav-certifikaty": "Certifikáty",
        "cert7-title": "CCNA Routing and Switching: Introduction to Networks",
        "cert7-org": "Cisco Networking Academy",
        "cert8-title": "Seyfor MoneyS3 certifikát",
        "cert8-org": "Seyfor",
        "cert9-title": "Partner: NDG Linux Essentials",
        "cert9-org": "Cisco",
        "nav-loga": "Loga",
        "nadpis-loga": "Loga & Vizuální identity",
        "nav-dovednosti-zajmy": "Dovednosti & Zájmy",
        "nadpis-skills": "Dovednosti & Zájmy",
        "skills-design-title": "Design & Prototypování",
        "skills-tech-title": "Technologie & 3D",
        "interests-title": "Osobní zájmy",
        "skill-figma": "Figma",
        "skill-penpot": "Penpot",
        "skill-uiux": "UI/UX Design",
        "skill-design-systems": "Design systémy",
        "skill-wireframing": "Wireframing",
        "skill-photoshop": "Adobe Photoshop",
        "skill-illustrator": "Adobe Illustrator",
        "skill-vector": "Vektorová grafika",
        "skill-blender": "Blender 3D",
        "skill-html-css": "HTML5 & CSS3",
        "skill-javascript": "JavaScript",
        "skill-python": "Python",
        "skill-git": "Git",
        "skill-linux": "Linux",
        "interest-3d": "3D Modelování",
        "interest-gamedev": "Herní vývoj",
        "interest-photo": "Fotografie",
        "interest-fitness": "Silový trénink",
        "interest-cycling": "Cyklistika",
        "interest-audio": "Audiotechnika",
        "interest-gaming": "Videohry",
        "meta-obor": "UI/UX & Grafický Designér",
        "meta-vek": "24 let",
        "meta-zkusenosti": "4+ roky praxe",
        "exp-free-date": "2024 - Současnost",
        "exp-free-title": "Freelance Designer",
        "exp-free-company": "Na volné noze",
        "exp-free-desc": "Zakázkový návrh digitálních produktů, uživatelských rozhraní, vizuálních identit a 3D grafiky pro přímé klienty.",
    },
    "en": {
        "nav-uvod": "Home",
        "nav-omne": "About",
        "nav-zkusenosti": "Experience",
        "nav-3d": "3D Models",
        "nav-plakaty": "Posters",
        "nav-mockupy": "Mockups",
        "nav-fotografie": "Photography",
        "nav-obaly": "Album Covers",
        "nav-ilustrace": "Illustration & Magazine",
        "nav-ui": "UI/UX",
        "nav-kontakt": "Contact",
        "omne-nadpis": "About Me",
        "omne-p1": "I am a designer focusing on UX/UI design and digital communication. In my work, I combine creativity with an analytical approach—designing interfaces that are not only visually captivating but, above all, flawlessly functional and user-friendly.",
        "omne-p2": "I approach projects systematically. From initial user research and wireframing, through the creation of consistent design systems, to iterations and close collaboration with developers. To achieve perfection, I utilize tools like Figma and Photoshop, transforming real-world problems into elegant digital solutions. However, I also enjoy enriching my work with 3D modeling and classic graphic design.",
        "nadpis-3d": "3D Models",
        "nadpis-plakaty": "Posters",
        "nadpis-mockupy": "Mockups",
        "nadpis-fotografie": "Photography",
        "nadpis-obaly": "Album Covers",
        "nadpis-ilustrace": "Illustration & Magazine",
        "nadpis-ui": "UI/UX Showcase",
        "nadpis-manual": "Brand Manual",
        "manual-p": "Click the preview below to open the complete visual identity specification in PDF format.",
        "manual-btn": "Open PDF",
        "nadpis-kontakt": "Contact",
        "form-jmeno": "Your Name",
        "form-email": "Your Email",
        "form-zprava": "Your Message",
        "form-btn": "Send Message",
        "form-odesilam": "Sending...",
        "form-chyba": "Failed to send message. Please try again later.",
        "form-uspech": "Thank you. Your message has been successfully sent. I will get back to you soon.",
        "footer-text": "© 2026 Jáchym Vondráček. All rights reserved.",
        "nadpis-zkusenosti": "Experience & Education",
        "exp1-date": "2023 - Present",
        "exp1-title": "Graphic Designer",
        "exp1-company": "Golden Support",
        "exp1-desc": "Design and creation of user interfaces, visual systems, and creative concepts with a focus on functionality and user experience.",
        "exp2-date": "2023 - 2026",
        "exp2-title": "Bachelor's Degree (Bc.)",
        "exp2-company": "University of Pardubice",
        "exp2-desc": "Digital Business study program. Connecting information technologies with modern business and management.",
        "exp3-date": "2021 - 2022",
        "exp3-title": "Marketing Specialist",
        "exp3-company": "NEY savings cooperative",
        "exp3-desc": "Website management, content creation, and assistance with the implementation of a long-term marketing plan.",
        "exp4-date": "2018 - 2022",
        "exp4-title": "Information Technology",
        "exp4-company": "DELTA - High School of Informatics and Economics",
        "exp4-desc": "High school studies focusing on IT, programming, and database systems.",
        "nadpis-certifikaty": "Certifications & Awards",
        "cert1-title": "EF SET English Certificate (C2 Proficient)",
        "cert1-org": "EF SET",
        "cert2-title": "Fundamentals of Digital Marketing",
        "cert2-org": "Google Digital Garage",
        "cert3-title": "Elements of AI",
        "cert3-org": "University of Helsinki",
        "cert4-title": "CCNA: Switching, Routing & Wireless",
        "cert4-org": "Cisco",
        "cert5-title": "Database Foundations",
        "cert5-org": "Oracle",
        "cert6-title": "European Computer Driving Licence",
        "cert6-org": "ECDL Czech Republic",
        "nav-manual": "Brand Manual",
        "nav-certifikaty": "Certificates",
        "cert7-title": "CCNA Routing and Switching: Introduction to Networks",
        "cert7-org": "Cisco Networking Academy",
        "cert8-title": "Seyfor MoneyS3 Certificate",
        "cert8-org": "Seyfor",
        "cert9-title": "Partner: NDG Linux Essentials",
        "cert9-org": "Cisco",
        "nav-loga": "Logos",
        "nadpis-loga": "Logos & Visual Identities",
        "nav-dovednosti-zajmy": "Skills & Interests",
        "nadpis-skills": "Skills & Interests",
        "skills-design-title": "Design & Prototyping",
        "skills-tech-title": "Technology & 3D",
        "interests-title": "Personal Interests",
        "skill-figma": "Figma",
        "skill-penpot": "Penpot",
        "skill-uiux": "UI/UX Design",
        "skill-design-systems": "Design Systems",
        "skill-wireframing": "Wireframing",
        "skill-photoshop": "Adobe Photoshop",
        "skill-illustrator": "Adobe Illustrator",
        "skill-vector": "Vector Graphics",
        "skill-blender": "Blender 3D",
        "skill-html-css": "HTML5 & CSS3",
        "skill-javascript": "JavaScript",
        "skill-python": "Python",
        "skill-git": "Git",
        "skill-linux": "Linux",
        "interest-3d": "3D Modeling",
        "interest-gamedev": "Game Development",
        "interest-photo": "Photography",
        "interest-fitness": "Strength Training",
        "interest-cycling": "Cycling",
        "interest-audio": "Audio Equipment",
        "interest-gaming": "Video Games",
        "meta-obor": "UI/UX & Graphic Designer",
        "meta-vek": "24 y/o",
        "meta-zkusenosti": "4+ years of exp.",
        "exp-free-date": "2024 - Present",
        "exp-free-title": "Freelance Designer",
        "exp-free-company": "Self-employed",
        "exp-free-desc": "Custom design of digital products, user interfaces, visual brand identities, and 3D graphics for direct clients.",
    }
};

let currentLang = localStorage.getItem("preferredLanguage");

if (!currentLang) {
    const userLang = navigator.language || navigator.userLanguage;
    if (userLang.toLowerCase().startsWith("cs") || userLang.toLowerCase().startsWith("sk")) {
        currentLang = "cs";
    } else {
        currentLang = "en";
    }
}

function applyLanguage(lang) {
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    const toggleBtn = document.getElementById("language-toggle");
    if (toggleBtn) {
        toggleBtn.textContent = lang === "cs" ? "EN" : "CS";
    }
}

// Správa motivu a synchronizace barvy stavového řádku prohlížeče
const themeMediaQuery = window.matchMedia("(prefers-color-scheme: light)");
let savedTheme = localStorage.getItem("preferredTheme");
let currentTheme = savedTheme || (themeMediaQuery.matches ? "light" : "dark");

function applyTheme(theme) {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (theme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
        if (metaTheme) metaTheme.setAttribute("content", "#f7f8fa");
    } else {
        document.documentElement.removeAttribute("data-theme");
        if (metaTheme) metaTheme.setAttribute("content", "#121212");
    }
}

applyTheme(currentTheme);

themeMediaQuery.addEventListener("change", (e) => {
    if (!localStorage.getItem("preferredTheme")) {
        currentTheme = e.matches ? "light" : "dark";
        applyTheme(currentTheme);
    }
});

// Zpracování kontaktního formuláře s indikací odesílání
const kontaktForm = document.getElementById('kontakt-formular');
const zpravaUspech = document.getElementById('zprava-uspech');

if (kontaktForm) {
    kontaktForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = kontaktForm.querySelector('button[type="submit"]');
        const puvodniText = submitBtn.textContent;
        const textOdesilam = translations[currentLang]?.["form-odesilam"] || "Odesílám...";
        const textChyba = translations[currentLang]?.["form-chyba"] || "Došlo k chybě při odesílání.";

        submitBtn.disabled = true;
        submitBtn.textContent = textOdesilam;

        const formData = new FormData(kontaktForm);

        fetch(kontaktForm.action, {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                zpravaUspech.classList.add('zobrazit');
                kontaktForm.reset();
                setTimeout(() => zpravaUspech.classList.remove('zobrazit'), 5000);
            } else {
                alert(textChyba);
            }
        }).catch(error => {
            console.error(error);
            alert(textChyba);
        }).finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = puvodniText;
        });
    });
}

// Fade-in efekt načítání snímků galerie
const lazyGalleryImages = document.querySelectorAll('.gallery-item img');

lazyGalleryImages.forEach(img => {
    if (img.complete) {
        img.classList.add('nacteno');
    } else {
        img.addEventListener('load', () => img.classList.add('nacteno'));
        img.addEventListener('error', () => img.classList.add('nacteno'));
    }
});

document.addEventListener("DOMContentLoaded", () => {
    applyLanguage(currentLang);

    const langToggleBtn = document.getElementById("language-toggle");
    if (langToggleBtn) {
        langToggleBtn.addEventListener("click", () => {
            currentLang = currentLang === "cs" ? "en" : "cs";
            localStorage.setItem("preferredLanguage", currentLang);
            applyLanguage(currentLang);

            if (navMenu && navMenu.classList.contains('active')) {
                toggleMobileMenu(false);
            }
        });
    }

    const themeToggleBtn = document.getElementById("theme-toggle");
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            currentTheme = currentTheme === "light" ? "dark" : "light";
            localStorage.setItem("preferredTheme", currentTheme);
            applyTheme(currentTheme);
        });
    }
});

const backToTopBtn = document.getElementById("back-to-top");

if (backToTopBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add("zobrazit");
        } else {
            backToTopBtn.classList.remove("zobrazit");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}