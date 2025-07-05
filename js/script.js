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
    const nav = document.querySelector('header nav'); // Référence correcte à la balise nav

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        // Si le menu mobile s'ouvre, assurez-vous que la modale de connexion est fermée
        if (nav.classList.contains('active') && loginModal.style.display === 'flex') {
            loginModal.style.display = 'none';
        }
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
    // Vérifie si le bouton actif existe avant de simuler le clic
    const initialTabButton = document.querySelector('.tab-button.active');
    if (initialTabButton) {
        initialTabButton.click();
    }


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
        { date: '2025-07-25', title: "C'est mon anniversaire", description: 'Bon anniversaire Joseph Marie Betyna que Dieu te garde.' }
    ];

    function renderCalendar() {
        if (!calendarGrid) return; // S'assurer que l'élément existe

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
            <p><a href="#contact" class="btn btn-small">Contactez-nous</a></p>
        `;
        eventDetails.style.display = 'block';
        eventDetails.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); // Scroll vers les détails
    }

    if (calendarGrid) { // Vérifie si l'élément du calendrier existe
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
    }


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
        if (!newsGrid) return; // S'assurer que l'élément existe

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

    // Fonction pour détecter la section visible et activer son lien
    const navLinks = document.querySelectorAll("nav ul li a");

    function activateNavLink() {
        let scrollPos = window.scrollY + 100; // +100 pour compenser le header

        sections.forEach(section => {
            if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${section.id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", activateNavLink);
    activateNavLink(); // pour initialiser au chargement

    // Active aussi le lien au clic
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            // Ne pas désactiver l'icône de connexion si elle est active
            navLinks.forEach(l => {
                if (!l.classList.contains('login-icon')) { // S'assure de ne pas toucher à l'icône
                    l.classList.remove("active");
                }
            });
            // Pour le lien cliqué, si ce n'est pas l'icône, ajoute 'active'
            if (!link.classList.contains('login-icon')) {
                 link.classList.add("active");
            }

            // Fermer le menu mobile après un clic sur un lien de navigation
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });



    










    // --- NOUVELLE PARTIE : Gestion de la fenêtre modale de connexion ---
    const loginModal = document.getElementById('loginModal');
    const openLoginModalBtn = document.getElementById('openLoginModal');
    const closeButton = document.querySelector('.modal .close-button'); // Plus spécifique pour éviter les conflits
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const signupLink = document.getElementById('signupLink');

    if (openLoginModalBtn && loginModal && closeButton && loginForm) {
        // Quand l'utilisateur clique sur l'icône de connexion, ouvrir la modale
        openLoginModalBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Empêche le lien de naviguer
            loginModal.style.display = 'flex'; // Utilise flex pour centrer le contenu
            // Assurez-vous que le menu mobile est fermé si la modale s'ouvre
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });

        // Quand l'utilisateur clique sur le bouton de fermeture (x), fermer la modale
        closeButton.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });

        // Quand l'utilisateur clique n'importe où en dehors de la modale, la fermer
        window.addEventListener('click', function(event) {
            if (event.target == loginModal) {
                loginModal.style.display = 'none';
            }
        });

        // Gérer la soumission du formulaire de connexion
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Empêche le rechargement de la page
            const emailOrPhone = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // --- INTÉGRATION FIREBASE : C'EST ICI QUE VOUS METTREZ VOTRE LOGIQUE D'AUTHENTIFICATION ---
            console.log("Tentative de connexion avec :");
            console.log("Email/Téléphone:", emailOrPhone);
            console.log("Mot de passe:", password);

            // Exemple de placeholder pour l'authentification Firebase (décommentez et remplacez par votre code Firebase)
            /*
            firebase.auth().signInWithEmailAndPassword(emailOrPhone, password)
                .then((userCredential) => {
                    // Connexion réussie
                    const user = userCredential.user;
                    console.log("Connecté avec succès:", user);
                    alert("Connexion réussie ! Bienvenue " + (user.email || user.phoneNumber) + "!");
                    loginModal.style.display = 'none'; // Fermer la modale
                    // Ici, vous pourriez rediriger l'utilisateur ou mettre à jour l'interface (ex: afficher un bouton de déconnexion)
                    // Pour la gestion des rôles (admin vs client), vous devrez soit :
                    // 1. Utiliser des revendications personnalisées (custom claims) sur Firebase Auth.
                    // 2. Avoir une collection 'users' dans Firestore qui stocke le rôle de chaque UID d'utilisateur.
                    // Ensuite, rediriger en fonction du rôle.
                    // Exemple de redirection (conceptuel):
                    // if (user.isAdmin) {
                    //    window.location.href = 'espace-manager.html';
                    // } else {
                    //    window.location.href = 'tableau-de-bord-client.html';
                    // }
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Erreur de connexion:", errorCode, errorMessage);
                    alert("Erreur de connexion: " + errorMessage); // Afficher l'erreur à l'utilisateur
                });
            */
            // Pour le moment, une alerte simple si Firebase n'est pas encore intégré
            alert("Fonctionnalité de connexion en cours de développement. (Intégration Firebase)");
            loginModal.style.display = 'none'; // Fermer la modale même si c'est juste un placeholder
        });

        // Gérer le clic sur "Mot de passe oublié ?"
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', function(event) {
                event.preventDefault();
                // --- INTÉGRATION FIREBASE : LOGIQUE DE RÉINITIALISATION DE MOT DE PASSE ---
                const emailToReset = prompt("Veuillez entrer votre email pour réinitialiser le mot de passe :");
                if (emailToReset) {
                    /*
                    firebase.auth().sendPasswordResetEmail(emailToReset)
                        .then(() => {
                            alert("Un email de réinitialisation de mot de passe a été envoyé à " + emailToReset);
                        })
                        .catch((error) => {
                            console.error("Erreur d'envoi de réinitialisation:", error);
                            alert("Erreur lors de l'envoi de l'email de réinitialisation : " + error.message);
                        });
                    */
                    alert("Fonctionnalité 'Mot de passe oublié' en cours de développement. (Intégration Firebase)");
                }
            });
        }

        // Gérer le clic sur "S'inscrire"
        if (signupLink) {
            signupLink.addEventListener('click', function(event) {
                event.preventDefault();
                // --- INTÉGRATION FIREBASE : LOGIQUE D'INSCRIPTION ---
                alert("Redirection vers la page d'inscription ou affichage du formulaire d'inscription. (Intégration Firebase)");
                // Ici, vous pouvez soit :
                // 1. Rediriger vers une page d'inscription dédiée : window.location.href = 'inscription.html';
                // 2. Changer le contenu de la modale pour un formulaire d'inscription.
                // 3. Demander directement email/mdp ici et appeler firebase.auth().createUserWithEmailAndPassword()
                /*
                const newEmail = prompt("Entrez votre email pour l'inscription :");
                const newPassword = prompt("Choisissez un mot de passe (min. 6 caractères) :");
                if (newEmail && newPassword) {
                    firebase.auth().createUserWithEmailAndPassword(newEmail, newPassword)
                        .then((userCredential) => {
                            console.log("Inscription réussie:", userCredential.user);
                            alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
                            // Si nécessaire, ajouter des infos supplémentaires à Firestore pour le profil utilisateur
                        })
                        .catch((error) => {
                            console.error("Erreur d'inscription:", error);
                            alert("Erreur lors de l'inscription : " + error.message);
                        });
                }
                */
            });
        }
    }
});


// Fonction pour détecter la section visible et activer son lien (déplacé hors du DOMContentLoaded principal pour éviter les duplicatas si vous avez d'autres scripts)
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("nav ul li a");

    function activateNavLink() {
        let scrollPos = window.scrollY + 100; // +100 pour compenser le header

        sections.forEach(section => {
            if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                navLinks.forEach(link => {
                    // S'assure de ne pas désactiver l'icône de connexion si elle est active
                    if (!link.classList.contains('login-icon')) {
                        link.classList.remove("active");
                    }
                    if (link.getAttribute("href") === `#${section.id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", activateNavLink);
    activateNavLink(); // pour initialiser au chargement

    // Active aussi le lien au clic
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.forEach(l => {
                if (!l.classList.contains('login-icon')) { // S'assure de ne pas toucher à l'icône
                    l.classList.remove("active");
                }
            });
            // Pour le lien cliqué, si ce n'est pas l'icône, ajoute 'active'
            if (!link.classList.contains('login-icon')) {
                 link.classList.add("active");
            }
             // Fermer le menu mobile après un clic sur un lien de navigation
            const nav = document.querySelector('header nav');
            const menuToggle = document.querySelector('.menu-toggle');
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });
});