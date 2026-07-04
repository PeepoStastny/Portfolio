const hamburger = document.getElementById('hamburger-menu');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-odkazy a');

hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

const sections = document.querySelectorAll('header, section');
const observerOptions = { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.remove('aktivni');
                const href = link.getAttribute('href');
                if (href && href.startsWith('#') && href.substring(1) === entry.target.id) {
                    link.classList.add('aktivni');
                }
            });
        }
    });
}, observerOptions);
sections.forEach(sec => observer.observe(sec));

const kontaktForm = document.getElementById('kontakt-formular');
const zpravaUspech = document.getElementById('zprava-uspech');

if (kontaktForm) {
    kontaktForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(kontaktForm);

        fetch(kontaktForm.action, {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                zpravaUspech.classList.add('zobrazit');
                kontaktForm.reset();
                setTimeout(() => zpravaUspech.classList.remove('zobrazit'), 5000);
            }
        }).catch(error => console.error(error));
    });
}

const lightbox = document.getElementById('lightbox');
const mediaContainer = document.getElementById('lightbox-media-container');

function openLightbox(element, type) {
    mediaContainer.innerHTML = '';
    if (type === 'image') {
        const imgSource = element.querySelector('img').src;
        const newImg = document.createElement('img');
        newImg.src = imgSource;
        newImg.className = 'lightbox-content';
        mediaContainer.appendChild(newImg);
    }
    else if (type === 'video') {
        const videoSource = element.querySelector('source').src;
        const newVideo = document.createElement('video');
        newVideo.src = videoSource;
        newVideo.className = 'lightbox-content';
        newVideo.controls = true;
        newVideo.autoplay = true;
        mediaContainer.appendChild(newVideo);
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
    if (event.target === lightbox || event.target.className === 'close-btn') {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        mediaContainer.innerHTML = '';
    }
}

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
        "form-uspech": "Děkuji vám. Vaše zpráva byla úspěšně odeslána. Brzy se vám ozvu.",
        "footer-text": "© 2026 Jáchym Vondráček. Všechna práva vyhrazena.",
        "nadpis-zkusenosti": "Zkušenosti a Vzdělání",
        "exp1-date": "2023 - Současnost",
        "exp1-title": "UI/UX Designer",
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
        "nav-certifikaty": "Certifikáty"
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
        "form-uspech": "Thank you. Your message has been successfully sent. I will get back to you soon.",
        "footer-text": "© 2026 Jáchym Vondráček. All rights reserved.",
        "nadpis-zkusenosti": "Experience & Education",
        "exp1-date": "2023 - Present",
        "exp1-title": "UI/UX Designer",
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
        "nav-certifikaty": "Certificates"
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

document.addEventListener("DOMContentLoaded", () => {
    applyLanguage(currentLang);

    const toggleBtn = document.getElementById("language-toggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            currentLang = currentLang === "cs" ? "en" : "cs";
            localStorage.setItem("preferredLanguage", currentLang);
            applyLanguage(currentLang);

            if (navMenu && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
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