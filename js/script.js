document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Gestion du menu hamburger
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('header nav');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Fermer le menu si on clique en dehors (pour mobile)
    document.addEventListener('click', (event) => {
        if (!nav.contains(event.target) && !menuToggle.contains(event.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

    // Comportement de la barre de navigation au scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) { // Après 80px de scroll
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Gestion des onglets "À Propos"
    window.openTab = (evt, tabName) => {
        let i, tabcontent, tabbuttons;
        tabcontent = document.getElementsByClassName("tab-content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
            tabcontent[i].classList.remove('active'); // Supprime la classe active
        }
        tabbuttons = document.getElementsByClassName("tab-button");
        for (i = 0; i < tabbuttons.length; i++) {
            tabbuttons[i].classList.remove("active");
        }
        document.getElementById(tabName).style.display = "block";
        document.getElementById(tabName).classList.add('active'); // Ajoute la classe active
        evt.currentTarget.classList.add("active");
    }

    // Ouvrir l'onglet "Historique" par défaut au chargement
    document.querySelector('.tab-button.active').click();


    // Gestion des événements du calendrier (comme précédemment)
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const eventDetails = document.getElementById('eventDetails');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    // Données d'événements factices (à remplacer par Firebase)
    const mockEvents = [
        { date: '2025-07-15', title: 'Assemblée Générale Annuelle', description: 'Rencontre de tous les membres pour discuter des orientations futures et de nos projets.' },
        { date: '2025-07-22', title: 'Atelier de Prière Intense', description: 'Une soirée dédiée à l\'intercession et à la prière profonde pour la communauté.' },
        { date: '2025-08-05', title: 'Conférence Prophétique Internationale', description: 'Conférence avec des orateurs invités du monde entier sur le ministère prophétique.' },
        { date: '2025-08-18', title: 'Service Spécial de Guérison', description: 'Un culte axé sur la manifestation de la guérison divine.' },
        { date: '2025-07-25', title: 'C\'est mon anniversaire', description: 'Bon anniversaire Joseph Marie Betyna que Dieu te garde.' }

    ];

    function renderCalendar() {
        calendarGrid.innerHTML = '';
        eventDetails.style.display = 'none'; // Cacher les détails à chaque nouveau rendu

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const startDay = firstDayOfMonth.getDay(); // 0 pour Dimanche, 1 pour Lundi

        currentMonthYear.textContent = new Date(currentYear, currentMonth).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

        // Ajouter les noms des jours
        const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        dayNames.forEach(day => {
            const dayNameDiv = document.createElement('div');
            dayNameDiv.classList.add('day-name');
            dayNameDiv.textContent = day;
            calendarGrid.appendChild(dayNameDiv);
        });

        // Ajouter les jours vides avant le 1er du mois
        for (let i = 0; i < startDay; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('empty-day');
            calendarGrid.appendChild(emptyDiv);
        }

        // Ajouter les jours du mois
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;
            
            const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            // Vérifier si c'est le jour actuel
            const today = new Date();
            if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                dayDiv.classList.add('current-day');
            }

            // Vérifier si un événement existe pour ce jour
            const eventForDay = mockEvents.find(event => event.date === fullDate);
            if (eventForDay) {
                dayDiv.classList.add('has-event');
                dayDiv.dataset.eventTitle = eventForDay.title;
                dayDiv.dataset.eventDescription = eventForDay.description;
                dayDiv.addEventListener('click', () => showEventDetails(eventForDay));
            }

            calendarGrid.appendChild(dayDiv);
        }
    }

    function showEventDetails(event) {
        eventDetails.innerHTML = `
            <h4>${event.title}</h4>
            <p><strong>Date :</strong> ${new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p>${event.description}</p>
            <p><a href="#contact" class="btn btn-small">Inscrivez-vous / Contactez-nous</a></p>
        `;
        eventDetails.style.display = 'block';
        eventDetails.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); // Scroll vers les détails
    }

    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    renderCalendar(); // Initialisation du calendrier au chargement


    // --- Nouvelle fonction pour charger les actualités ---
    const newsGrid = document.querySelector('.news-grid');

    // Données d'actualités factices (à remplacer par Firebase)
    const mockNews = [
        {
            title: "Lancement du nouveau programme d'édification",
            date: "2025-06-28",
            shortDescription: "Découvrez notre nouveau programme intensif pour l'édification spirituelle et la croissance personnelle.",
            link: "#" // Lien vers une page détaillée de l'actualité
        },
        {
            title: "Témoignage inspirant : Une vie transformée",
            date: "2025-06-20",
            shortDescription: "Le récit poignant de [Nom du membre] et comment la Garnison a impacté sa marche avec Christ.",
            link: "#"
        },
        {
            title: "Expansion internationale : Nouvelle antenne à [Ville, Pays]",
            date: "2025-06-15",
            shortDescription: "La Garnison des Prophètes continue de s'étendre, avec l'ouverture d'une nouvelle antenne pour toucher plus d'âmes.",
            link: "#"
        },
        {
            title: "Retraite de Jeûne et Prière : Un temps de rafraîchissement",
            date: "2025-06-08",
            shortDescription: "Retour sur notre dernière retraite, un moment béni de communion et de renouvellement spirituel.",
            link: "#"
        },
        {
            title: "Message du Prophète Djo Grace : 'La saison de la moisson'",
            date: "2025-06-01",
            shortDescription: "Lisez le dernier message puissant de notre visionnaire sur les temps de bénédiction et de récolte à venir.",
            link: "#"
        }
    ];

    function loadNews() {
        newsGrid.innerHTML = ''; // Efface les actualités existantes
        // Trier les actualités par date, du plus récent au plus ancien
        const sortedNews = [...mockNews].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedNews.forEach((news, index) => {
            const newsItemDiv = document.createElement('article');
            newsItemDiv.classList.add('news-item');
            // Ajoutez une animation de délai pour faire apparaître les articles un par un
            newsItemDiv.style.animation = `fadeInSlideUp 0.8s ease-out forwards ${0.1 * index}s`;

            newsItemDiv.innerHTML = `
                <h3>${news.title}</h3>
                <p>Date : ${new Date(news.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p>${news.shortDescription}</p>
                <a href="${news.link || '#'}" class="read-more-link">Lire la suite</a>
            `;
            newsGrid.appendChild(newsItemDiv);
        });
    }

    // Appeler la fonction de chargement des actualités au démarrage
    loadNews();


    // Observer pour les animations de section au scroll
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // La section est visible à 20%
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionnel: arrêter d'observer une fois visible si l'animation ne doit jouer qu'une fois
                // observer.unobserve(entry.target);
            } else {
                // Optionnel: enlever la classe si on veut que l'animation se rejoue en scrollant de haut en bas
                // entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

});