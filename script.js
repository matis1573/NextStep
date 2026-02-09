document.addEventListener('DOMContentLoaded', () => {
    // Page Transition Logic
    const pageLoader = document.getElementById('page-loader');
    if (pageLoader) {
        // Fade out on load
        setTimeout(() => {
            pageLoader.classList.remove('visible');
        }, 100);
    }

    function navigateTo(url) {
        if (pageLoader) {
            pageLoader.classList.add('visible');
            setTimeout(() => {
                window.location.href = url;
            }, 800); // Match CSS transition duration
        } else {
            window.location.href = url;
        }
    }

    // Lenis Smooth Scroll - Only on Landing Page
    const isDashboard = document.getElementById('student-dashboard');
    let lenis = null;

    if (!isDashboard) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        // Force scroll to top on load
        window.scrollTo(0, 0);
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        lenis.scrollTo(0, { immediate: true });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }

    // Integrate with internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            if (lenis) lenis.scrollTo(this.getAttribute('href'));
        });
    });

    // Scroll Reveal Observer
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target); // Animate only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const cursorGlow = document.querySelector('.cursor-glow');

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // Position update only (no scale)
        cursor.style.transform = `translate(${x}px, ${y}px)`;
        cursorGlow.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
    }, { capture: true });

    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicking');
    });

    // Cursor Label Logic for Buttons and Special Cards
    const interactiveElements = document.querySelectorAll('.actions .btn, .feature-card.full-width');
    const cursorLabel = document.querySelector('.cursor-label');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('with-label');

            // Set Label Text
            if (el.classList.contains('full-width')) {
                cursorLabel.textContent = 'Explorer';
                cursorLabel.style.background = 'rgba(255, 255, 255, 0.2)';
                cursorLabel.style.backdropFilter = 'blur(10px)';
            } else {
                cursorLabel.textContent = 'Click !';
                // Dynamic Color
                if (el.id === 'btn-recruiter') {
                    cursorLabel.style.background = '#3b82f6';
                } else if (el.id === 'btn-student') {
                    cursorLabel.style.background = '#8b5cf6';
                } else if (el.id === 'btn-demo') {
                    cursorLabel.style.background = '#10b981';
                }
            }
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('with-label');
        });
    });

    // Main Action Buttons Redirection
    const btnRecruiter = document.getElementById('btn-recruiter');
    const btnStudent = document.getElementById('btn-student');

    if (btnRecruiter) {
        btnRecruiter.addEventListener('click', () => {
            navigateTo('dashboard.html');
        });
    }

    if (btnStudent) {
        btnStudent.addEventListener('click', () => {
            navigateTo('dashboard.html');
        });
    }

    // Intersection Observer for Side Nav Dots
    const sections = document.querySelectorAll('header[id], section[id], section#map-section');
    const sideDots = document.querySelectorAll('.side-dot');
    const mapContainer = document.querySelector('.map-container');

    // Stats Counter Animation
    const statValue = document.querySelector('.stat-value');
    let hasAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated && statValue) {
                hasAnimated = true;
                const target = parseInt(statValue.getAttribute('data-target'));
                const duration = 3500; // 3.5 seconds
                const start = 0;
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out quart
                    const ease = 1 - Math.pow(1 - progress, 4);

                    const current = Math.floor(ease * (target - start) + start);
                    statValue.textContent = current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        statValue.textContent = target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                    }
                }

                requestAnimationFrame(update);
            }
        });
    }, { threshold: 0.5 });

    if (statValue) {
        statsObserver.observe(statValue);
    }

    const observerOptions = {
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                if (id) {
                    sideDots.forEach(dot => {
                        dot.classList.toggle('active', dot.getAttribute('href') === `#${id}`);
                    });
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Initialize MapLibre GL Map
    if (document.getElementById('map')) {
        const userCoords = [5.3864, 43.3134]; // Rue Loubon, 3e Arrondissement, Marseille

        const map = new maplibregl.Map({
            container: 'map',
            style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
            center: [5.3800, 43.3000], // Re-centered on Marseille
            zoom: 12.5, // Zoomed in on the city
            pitch: 45,
            attributionControl: false
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');
        const fsControl = new maplibregl.FullscreenControl();
        map.addControl(fsControl, 'bottom-right');

        // Fix Custom Cursor Z-Index in Fullscreen
        const mapContainer = map.getContainer();
        const cursorEl = document.querySelector('.custom-cursor');
        const cursorGlowEl = document.querySelector('.cursor-glow');

        mapContainer.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement === mapContainer) {
                // Moved into map for fullscreen visibility
                mapContainer.appendChild(cursorGlowEl);
                mapContainer.appendChild(cursorEl);
                cursorEl.style.zIndex = '99999';
                cursorGlowEl.style.zIndex = '99990';
            } else {
                // Move back to body
                document.body.appendChild(cursorGlowEl);
                document.body.appendChild(cursorEl);
            }
        });

        // Add User Marker
        const userEl = document.createElement('div');
        userEl.className = 'marker user-marker';
        new maplibregl.Marker({
            element: userEl,
            rotationAlignment: 'map',
            pitchAlignment: 'map'
        })
            .setLngLat(userCoords)
            .addTo(map);

        // Add "Vous" Label
        new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            anchor: 'bottom',
            offset: 12,
            className: 'user-label-popup'
        })
            .setLngLat(userCoords)
            .setHTML('VOUS')
            .addTo(map);

        // Real-world coordinates (Marseille Only)
        // Added Images and Descriptions
        const companies = [
            {
                name: "CMA CGM (Digital Factory)",
                coords: [5.3665, 43.3155],
                offer: "Alternance Data Scientist",
                desc: "Leader mondial du transport maritime, notre Digital Factory invente la logistique de demain.",
                image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
            },
            {
                name: "Wiko",
                coords: [5.3910, 43.2663],
                offer: "Stage Assistant Marketing Digital",
                desc: "La marque de mobile marseillaise qui démocratise la technologie pour tous.",
                image: "https://images.unsplash.com/photo-1512428559087-560fa0db7f59?auto=format&fit=crop&w=600&q=80"
            },
            {
                name: "Jaguar Network (Free Pro)",
                coords: [5.3455, 43.3630],
                offer: "Alternance Ingénieur Cloud",
                desc: "Expert souverain du Cloud et des Télécoms pour les entreprises.",
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80"
            },
            {
                name: "Sopra Steria",
                coords: [5.3877, 43.2778],
                offer: "Alternance Consultant ERP",
                desc: "Leader européen de la transformation numérique, du conseil et de l'édition.",
                image: "https://images.unsplash.com/photo-1504384308090-c54be3853247?auto=format&fit=crop&w=600&q=80"
            },
            {
                name: "Capgemini",
                coords: [5.3856, 43.2799],
                offer: "Alternance Développeur Java",
                desc: "Partenaire de la transformation business et technologique des plus grandes organisations.",
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
            },
            {
                name: "CEGID",
                coords: [5.3670, 43.3079],
                offer: "Alternance Product Owner",
                desc: "Solutions de gestion cloud pour les professionnels de la finance et des RH.",
                image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80"
            },
            {
                name: "Enovacom",
                coords: [5.3888, 43.2754],
                offer: "Stage Ingénieur Santé",
                desc: "L'expert de l'interopérabilité et de la sécurité des données de santé.",
                image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80"
            },
            {
                name: "Oxatis",
                coords: [5.3660, 43.3250],
                offer: "Alternance Développeur Front",
                desc: "Solution E-commerce complète pour la réussite des PME en ligne.",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
            },
            {
                name: "Digitick (See Tickets)",
                coords: [5.3667, 43.3040],
                offer: "Alternance DevOps",
                desc: "Pionnier de la billetterie électronique et acteur majeur de l'événementiel.",
                image: "https://images.unsplash.com/photo-1514525253440-b393452e3720?auto=format&fit=crop&w=600&q=80"
            },
            {
                name: "DualSun",
                coords: [5.3750, 43.2980],
                offer: "Stage R&D Solaire",
                desc: "Le panneau solaire 2-en-1 qui produit à la fois électricité et eau chaude.",
                image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80"
            },
            {
                name: "CrossBorder Solutions",
                coords: [5.3680, 43.3100],
                offer: "Alternance Business Analyst",
                desc: "Leader mondial des solutions tech pour la fiscalité des prix de transfert.",
                image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
            }
        ];

        // Haversine function for distance
        function calculateDistance(coords1, coords2) {
            const R = 6371e3; // Earth radius in meters
            const lat1 = coords1[1] * Math.PI / 180;
            const lat2 = coords2[1] * Math.PI / 180;
            const deltaLat = (coords2[1] - coords1[1]) * Math.PI / 180;
            const deltaLng = (coords2[0] - coords1[0]) * Math.PI / 180;

            const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return R * c; // in meters
        }

        // Transport Logic removed.

        function calculateTravelTime(distanceMeters, mode) {
            // Function kept as helper but unused for now
            const speeds = {
                'walk': 4.5, // 4.5 km/h
                'bike': 15,  // 15 km/h
                'car': 35,   // 35 km/h avg
                'bus': 20    // 20 km/h avg
            };
            const hours = (distanceMeters / 1000) / (speeds[mode] || speeds['walk']);
            const minutes = Math.round(hours * 60);
            return minutes < 1 ? "< 1 min" : `${minutes} min`;
        }

        let transportMarkers = [];
        function updateAllDistanceLabels(map) {
            transportMarkers.forEach(m => m.remove());
            transportMarkers = [];
            // Labels disabled
        }

        // map.addControl(new TransportControl(), 'top-left'); -> REMOVED
        // --- End Transport Logic ---

        map.on('load', () => {
            // Function to fetch France Travail Data
            const fetchFranceTravailOffers = async () => {
                const apiKey = 'YOUR_FRANCE_TRAVAIL_API_KEY';
                try {
                    const response = await fetch('https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search?commune=13055&range=0-14', {
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const apiCompanies = data.resultats.map((offer, index) => {
                            // Randomize coordinate slightly around Marseille center to prevent overlap if exact coords missing
                            // Or use offer.lieuTravail.latitude if available, otherwise random around 43.3, 5.4
                            const lat = offer.lieuTravail.latitude || 43.2965 + (Math.random() - 0.5) * 0.1;
                            const lng = offer.lieuTravail.longitude || 5.3698 + (Math.random() - 0.5) * 0.1;

                            return {
                                name: offer.entreprise.nom || "Recruteur Confidentiel",
                                coords: [lng, lat], // GeoJSON is Lng, Lat
                                offer: offer.intitule,
                                desc: offer.description ? offer.description.substring(0, 100) + '...' : "Aucune description disponible.",
                                image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" // Placeholder
                            };
                        });

                        // Update Map Data
                        updateMapData(apiCompanies);
                        console.log("France Travail API: Offers loaded", apiCompanies.length);
                    } else {
                        console.warn("France Travail API: Failed to fetch", response.status);
                    }
                } catch (e) {
                    console.error("France Travail API: Error", e);
                }
            };

            // Helper to update sources
            const updateMapData = (newData) => {
                // Update Points
                const features = [
                    {
                        'type': 'Feature',
                        'geometry': { 'type': 'Point', 'coordinates': userCoords },
                        'properties': { 'type': 'user' }
                    },
                    ...newData.map((c, i) => ({
                        'type': 'Feature',
                        'geometry': { 'type': 'Point', 'coordinates': c.coords },
                        'properties': {
                            'type': 'company',
                            'id': i,
                            'name': c.name,
                            'offer': c.offer,
                            'desc': c.desc,
                            'image': c.image
                        }
                    }))
                ];
                map.getSource('points').setData({
                    'type': 'FeatureCollection',
                    'features': features
                });

                // Update Lines (Top 3)
                const companiesWithDist = newData.map((c, i) => ({
                    id: i,
                    coords: c.coords,
                    dist: calculateDistance(userCoords, c.coords)
                }));
                companiesWithDist.sort((a, b) => a.dist - b.dist);
                const top3 = companiesWithDist.slice(0, 3);

                map.getSource('lines').setData({
                    'type': 'FeatureCollection',
                    'features': top3.map(c => ({
                        'type': 'Feature',
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': [userCoords, c.coords]
                        },
                        'properties': { 'id': c.id }
                    }))
                });
            };

            // Add Source for all points (User + Companies)
            map.addSource('points', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'geometry': { 'type': 'Point', 'coordinates': userCoords },
                            'properties': { 'type': 'user' }
                        },
                        ...companies.map((c, i) => ({
                            'type': 'Feature',
                            'geometry': { 'type': 'Point', 'coordinates': c.coords },
                            'properties': {
                                'type': 'company',
                                'id': i,
                                'name': c.name,
                                'offer': c.offer,
                                'desc': c.desc,
                                'image': c.image
                            }
                        }))
                    ]
                }
            });

            // Logic to find Top 3 Closest Companies for Lines
            const companiesWithDist = companies.map((c, i) => ({
                id: i,
                coords: c.coords,
                dist: calculateDistance(userCoords, c.coords)
            }));
            companiesWithDist.sort((a, b) => a.dist - b.dist);
            const top3 = companiesWithDist.slice(0, 3);

            // Add Source for Connection Lines (Only Top 3)
            map.addSource('lines', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': top3.map(c => ({
                        'type': 'Feature',
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': [userCoords, c.coords]
                        },
                        'properties': { 'id': c.id }
                    }))
                }
            });

            // 1. Draw Connection Lines (Thinner, fade on zoom)
            map.addLayer({
                'id': 'connection-lines-layer',
                'type': 'line',
                'source': 'lines',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#ffffff',
                    'line-width': 3.5,
                    'line-dasharray': [4, 6],
                    'line-opacity': ['interpolate', ['linear'], ['zoom'], 9, 0, 13, 0.8]
                }
            });

            // 2. Draw Company Points (White dots)
            map.addLayer({
                'id': 'company-points-layer',
                'type': 'circle',
                'source': 'points',
                'filter': ['==', 'type', 'company'],
                'paint': {
                    'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 3, 15, 6],
                    'circle-color': '#ffffff',
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#000000',
                    'circle-opacity': ['interpolate', ['linear'], ['zoom'], 11, 0, 13, 1],
                    'circle-stroke-opacity': ['interpolate', ['linear'], ['zoom'], 11, 0, 13, 1]
                }
            });

            // 3. Draw User Point (White center)
            map.addLayer({
                'id': 'user-point-layer',
                'type': 'circle',
                'source': 'points',
                'filter': ['==', 'type', 'user'],
                'paint': {
                    'circle-radius': 8,
                    'circle-color': '#ffffff',
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
                    'circle-stroke-opacity': 0.3
                }
            });

            // No distance labels are added
            // updateAllDistanceLabels(map); -> Functions removed

            // Zoom listener (for labels) -> Logic removed as labels are gone
            /* 
            map.on('zoom', () => {
                const zoom = map.getZoom();
                // Target only labels inside THIS map
                const labels = map.getContainer().querySelectorAll('.distance-label');
                labels.forEach(el => {
                    // Fade out below 12.5, and scale down
                    const opacity = Math.max(0, Math.min(1, (zoom - 12) / 0.5));
                    const scale = Math.max(0.6, Math.min(1, zoom / 15));
                    el.style.opacity = opacity;
                    el.style.transform = `translate(-50%, -50%) scale(${scale})`;
                    el.style.display = opacity === 0 ? 'none' : 'flex';
                });
            });
            */

            // Handle Clicks for Popups on the layer
            map.on('click', 'company-points-layer', (e) => {
                const props = e.features[0].properties;

                // Using a slightly larger popup for the banner
                new maplibregl.Popup({ offset: 10, className: 'premium-popup', maxWidth: '300px' })
                    .setLngLat(e.lngLat)
                    .setHTML(`
                        <div class="popup-banner" style="background-image: url('${props.image}');"></div>
                        <div class="popup-content">
                            <h3>${props.name}</h3>
                            <p class="offer-tag">${props.offer}</p>
                            <p class="company-desc">${props.desc}</p>
                            <button class="btn-nav" style="margin-top: 10px; cursor: pointer; width: 100%;">Postuler</button>
                        </div>
                    `)
                    .addTo(map);
            });

            map.on('mouseenter', 'company-points-layer', () => map.getCanvas().style.cursor = 'crosshair');
            map.on('mouseleave', 'company-points-layer', () => map.getCanvas().style.cursor = 'none');

            // Execute API Fetch
            fetchFranceTravailOffers();
        });

        window.addEventListener('resize', () => map.resize());

        // Custom Drag-to-Search Feature
        class DragSearchControl {
            constructor() {
                this.fictiveNames = ["Lumina Tech", "Horizon Soft", "Cité Digitale", "Innova Lab", "Marseille Alternance", "Sud Développement", "Pôle Web 13"];
                this.fictiveOffers = ["Alternance Dev Mobile", "Alternance Chef de Projet", "Stage Web Design", "Contrat Pro Data", "Alternance CyberSec"];
            }

            onAdd(map) {
                this._map = map;
                this._container = document.createElement('div');
                this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';

                const button = document.createElement('button');
                button.className = 'maplibregl-ctrl-drag';
                button.type = 'button';
                button.title = 'Rechercher ici';
                button.onclick = () => this.toggleSearchMarker();

                this._container.appendChild(button);

                // Create Scan Button in a container on the map
                this.scanBtnContainer = document.createElement('div');
                this.scanBtnContainer.className = 'scan-btn-container';
                this.scanBtn = document.createElement('button');
                this.scanBtn.className = 'scan-btn';
                this.scanBtn.textContent = 'Scan Area';
                this.scanBtn.onclick = () => this.performScan();
                this.scanBtnContainer.appendChild(this.scanBtn);
                map.getContainer().appendChild(this.scanBtnContainer);

                return this._container;
            }

            onRemove() {
                if (this._container.parentNode) this._container.parentNode.removeChild(this._container);
                if (this.scanBtnContainer.parentNode) this.scanBtnContainer.parentNode.removeChild(this.scanBtnContainer);
                this._map = undefined;
            }

            toggleSearchMarker() {
                if (this.marker) {
                    this.marker.remove();
                    this.marker = null;
                    if (this._map.getLayer('search-radius')) {
                        this._map.removeLayer('search-radius');
                        this._map.removeLayer('search-radius-outline');
                        this._map.removeSource('search-radius');
                    }
                    this.scanBtn.classList.remove('active');
                    this.updateHighlights(null);
                    return;
                }

                const center = this._map.getCenter();
                const el = document.createElement('div');
                el.className = 'drag-marker';

                this.marker = new maplibregl.Marker({
                    element: el,
                    draggable: true,
                    offset: [0, -16] // Align tip of 32px pin
                })
                    .setLngLat(center)
                    .addTo(this._map);

                this.scanBtn.classList.add('active');
                this.marker.on('drag', () => this.updateSearch());
                this.updateSearch();
            }

            updateSearch() {
                const lngLat = this.marker.getLngLat();
                const radius = 500; // 500 meters

                const circleData = this.createGeoJSONCircle([lngLat.lng, lngLat.lat], radius / 1000);

                if (this._map.getSource('search-radius')) {
                    this._map.getSource('search-radius').setData(circleData);
                } else {
                    this._map.addSource('search-radius', {
                        'type': 'geojson',
                        'data': circleData
                    });

                    this._map.addLayer({
                        'id': 'search-radius',
                        'type': 'fill',
                        'source': 'search-radius',
                        'paint': {
                            'fill-color': '#FFFFFF',
                            'fill-opacity': 0.1
                        }
                    }, 'company-points-layer');

                    this._map.addLayer({
                        'id': 'search-radius-outline',
                        'type': 'line',
                        'source': 'search-radius',
                        'paint': {
                            'line-color': '#FFFFFF',
                            'line-width': 1.5,
                            'line-opacity': 0.5
                        }
                    }, 'company-points-layer');
                }
                this.updateHighlights(lngLat, radius);
            }

            performScan() {
                if (this.isScanning) return;
                this.isScanning = true;
                this.scanBtn.textContent = 'Scanning...';

                const center = this.marker.getLngLat();
                const maxRadius = 500; // 500 meters
                const duration = 2000; // 2 seconds for a deeper undulation
                const startTime = Date.now();

                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = elapsed / duration;

                    if (progress <= 1) {
                        // Better Undulation: Radius expands + Opacity fades out
                        const currentRadius = maxRadius * progress;
                        const opacity = Math.sin(progress * Math.PI) * 0.3; // Peaks in the middle

                        const circleData = this.createGeoJSONCircle([center.lng, center.lat], currentRadius / 1000);

                        if (this._map.getSource('search-radius')) {
                            this._map.getSource('search-radius').setData(circleData);
                            this._map.setPaintProperty('search-radius', 'fill-opacity', opacity);
                            this._map.setPaintProperty('search-radius-outline', 'line-opacity', opacity * 2);
                        }

                        requestAnimationFrame(animate);
                    } else {
                        // Final state: Reset to static 500m circle
                        const finalCircle = this.createGeoJSONCircle([center.lng, center.lat], maxRadius / 1000);
                        this._map.getSource('search-radius').setData(finalCircle);
                        this._map.setPaintProperty('search-radius', 'fill-opacity', 0.1);
                        this._map.setPaintProperty('search-radius-outline', 'line-opacity', 0.5);
                        this.finishScan(center);
                    }
                };

                animate();
            }

            finishScan(center) {
                // Generate 2-3 new fictive companies
                const count = 2 + Math.floor(Math.random() * 2);
                for (let i = 0; i < count; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const dist = Math.random() * 0.003; // Inside the radius
                    const newCoords = [
                        center.lng + Math.cos(angle) * dist,
                        center.lat + Math.sin(angle) * dist
                    ];

                    const name = this.fictiveNames[Math.floor(Math.random() * this.fictiveNames.length)];
                    const offer = this.fictiveOffers[Math.floor(Math.random() * this.fictiveOffers.length)];

                    const newCompany = {
                        name: `${name} (Détecté)`,
                        coords: newCoords,
                        offer: offer,
                        isGenerated: true
                    };

                    companies.push(newCompany);
                }
                this.refreshSources();
                updateAllDistanceLabels(this._map);

                this.isScanning = false;
                this.scanBtn.textContent = 'Scan Area';
                this.scanBtn.style.opacity = '1';
            }

            refreshSources() {
                const pointsData = {
                    'type': 'FeatureCollection',
                    'features': [
                        { 'type': 'Feature', 'geometry': { 'type': 'Point', 'coordinates': userCoords }, 'properties': { 'type': 'user' } },
                        ...companies.map((c, i) => ({
                            'type': 'Feature',
                            'geometry': { 'type': 'Point', 'coordinates': c.coords },
                            'properties': { 'type': 'company', 'id': i, 'name': c.name, 'offer': c.offer }
                        }))
                    ]
                };
                this._map.getSource('points').setData(pointsData);

                // Filter Originals vs Generated
                const originalCompanies = companies.map((c, i) => ({ ...c, id: i })).filter(c => !c.isGenerated);
                const generatedCompanies = companies.map((c, i) => ({ ...c, id: i })).filter(c => c.isGenerated);

                // Top 3 closest VALID (Original) companies
                const originalsWithDist = originalCompanies.map(c => ({
                    id: c.id,
                    coords: c.coords,
                    dist: calculateDistance(userCoords, c.coords)
                }));
                originalsWithDist.sort((a, b) => a.dist - b.dist);
                const top3Originals = originalsWithDist.slice(0, 3);

                // Combine: Top 3 Originals + ALL Generated
                const linesToDraw = [
                    ...top3Originals.map(c => ({ coords: c.coords, id: c.id })),
                    ...generatedCompanies.map(c => ({ coords: c.coords, id: c.id }))
                ];

                const linesData = {
                    'type': 'FeatureCollection',
                    'features': linesToDraw.map(c => ({
                        'type': 'Feature',
                        'geometry': { 'type': 'LineString', 'coordinates': [userCoords, c.coords] },
                        'properties': { 'id': c.id }
                    }))
                };
                this._map.getSource('lines').setData(linesData);
            }

            updateHighlights(center, radius) {
                if (!center) return;

                this._map.setPaintProperty('company-points-layer', 'circle-stroke-color', [
                    'case',
                    ['<', ['sqrt', ['+', ['pow', ['-', center.lng, ['slice', ['get', 'coordinates', ['at', ['get', 'id'], ['literal', companies.map(c => c.coords)]]], 0]], 2], ['pow', ['-', center.lat, ['slice', ['get', 'coordinates', ['at', ['get', 'id'], ['literal', companies.map(c => c.coords)]]], 1]], 2]]], 0.005],
                    '#FFFFFF',
                    '#000000'
                ]);
            }

            createGeoJSONCircle(center, radiusInKm, points = 64) {
                const coords = { latitude: center[1], longitude: center[0] };
                const km = radiusInKm;
                const ret = [];
                const distanceX = km / (111.32 * Math.cos(coords.latitude * Math.PI / 180));
                const distanceY = km / 110.57;

                for (let i = 0; i < points; i++) {
                    const theta = (i / points) * (2 * Math.PI);
                    ret.push([coords.longitude + distanceX * Math.cos(theta), coords.latitude + distanceY * Math.sin(theta)]);
                }
                ret.push(ret[0]);
                return { 'type': 'Feature', 'geometry': { 'type': 'Polygon', 'coordinates': [ret] } };
            }
        }

        map.addControl(new DragSearchControl(), 'top-right');
    }

    // Floating Particles (Dust)
    function initParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const size = Math.random() * 3 + 1;
            const left = Math.random() * 100;
            const top = Math.random() * 100; // Random start height
            const duration = Math.random() * 15 + 15;
            const drift = (Math.random() - 0.5) * 200;
            const delay = Math.random() * 5;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.top = `${top}%`; // Set top instead of bottom
            particle.style.bottom = 'auto';
            particle.style.setProperty('--drift', drift);
            particle.style.animation = `float-up ${duration}s linear ${delay}s infinite`;

            container.appendChild(particle);

            if (container.children.length > 100) {
                container.removeChild(container.firstChild);
            }
        }

        for (let i = 0; i < 80; i++) {
            createParticle();
        }
    }

    initParticles();

    // Discord Modal Logic
    const discordCard = document.querySelector('.social-card:nth-child(1)');
    const modal = document.getElementById('discord-modal');
    const closeBtn = document.querySelector('.modal-close');

    if (discordCard && modal) {
        discordCard.style.cursor = 'pointer';
        discordCard.addEventListener('click', () => {
            modal.classList.add('active');
            if (lenis) lenis.stop(); // Stop smooth scroll
        });

        const closeModal = () => {
            modal.classList.remove('active');
            if (lenis) lenis.start(); // Restart smooth scroll
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Demo Mode Logic
    const demoBtn = document.getElementById('btn-demo');
    const demoOverlay = document.getElementById('demo-selection');
    const demoBackBtn = document.getElementById('demo-back');
    const choiceCards = document.querySelectorAll('.choice-card');

    if (demoBtn && demoOverlay) {
        demoBtn.addEventListener('click', () => {
            demoOverlay.classList.add('active');
            // Hide everything else
            document.querySelector('.navbar').style.display = 'none';
            document.querySelector('.side-nav').style.display = 'none';
            document.querySelector('.container').style.display = 'none';
            document.querySelector('footer').style.display = 'none';
            lenis.stop();
        });

        // Click outside options to go back
        demoOverlay.addEventListener('click', (e) => {
            if (e.target === demoOverlay || e.target.classList.contains('demo-content')) {
                demoOverlay.classList.remove('active');
                // Show everything back
                document.querySelector('.navbar').style.display = 'flex';
                document.querySelector('.side-nav').style.display = 'flex';
                document.querySelector('.container').style.display = 'block';
                document.querySelector('footer').style.display = 'block';
                lenis.start();
            }
        });

        // Add cursor interaction for choice cards
        choiceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                cursor.classList.add('with-label');
                cursorLabel.textContent = 'Choisir';
                cursorLabel.style.background = '#ffffff';
                cursorLabel.style.color = '#000000';
            });

            card.addEventListener('mouseleave', () => {
                cursor.classList.remove('with-label');
                // Reset defaults just in case
                cursorLabel.style.color = 'white';
            });

            // Selection logic
            card.addEventListener('click', (e) => {
                e.stopPropagation(); // Urgent: Stop bubbling to overlay close listener
                const choice = card.querySelector('h3').textContent.trim();
                console.log('Selected:', choice);

                if (choice === 'Recruteur') {
                    // Redirect to standalone dashboard page with transition
                    navigateTo('dashboard.html');
                } else if (choice === 'Étudiant') {
                    // 1. Hide the Demo Selection Screen (buttons disappear)
                    if (demoOverlay) {
                        demoOverlay.classList.remove('active');
                        // Force hide to prevent interaction
                        demoOverlay.style.display = 'none';
                    }

                    // 2. Open Student Demo Map
                    const studentModal = document.getElementById('student-demo-modal');
                    const mapContainer = document.getElementById('student-demo-map');
                    const locationOverlay = document.getElementById('location-prompt-overlay');
                    const allowBtn = document.getElementById('btn-allow-location');
                    const dropZone = document.getElementById('drop-zone');

                    if (studentModal) {
                        studentModal.style.display = 'flex';
                        setTimeout(() => {
                            studentModal.classList.add('active');
                        }, 10);

                        // Handle Location Prompt Visibility
                        if (window.userLocation) {
                            if (locationOverlay) locationOverlay.classList.add('hidden');
                            if (mapContainer) mapContainer.classList.remove('map-blur');
                        } else {
                            if (locationOverlay) locationOverlay.classList.remove('hidden');
                            if (mapContainer) mapContainer.classList.add('map-blur');
                        }

                        // Attach Location Permission Listener (Always, to ensure it works if shown)
                        if (allowBtn) {
                            allowBtn.onclick = () => {
                                const unlockDropZone = () => {
                                    if (dropZone) {
                                        dropZone.style.pointerEvents = 'auto';
                                        dropZone.style.opacity = '1';
                                        dropZone.classList.remove('locked');
                                    }
                                };

                                if ("geolocation" in navigator) {
                                    navigator.geolocation.getCurrentPosition(
                                        (position) => {
                                            const { latitude, longitude } = position.coords;
                                            window.userLocation = [longitude, latitude];

                                            if (window.studentDemoMap) {
                                                window.studentDemoMap.flyTo({
                                                    center: [longitude, latitude],
                                                    zoom: 12,
                                                    speed: 1.5,
                                                    curve: 1.42
                                                });
                                            }
                                            // Unlock interface
                                            if (mapContainer) mapContainer.classList.remove('map-blur');
                                            if (locationOverlay) locationOverlay.classList.add('hidden');
                                            unlockDropZone();
                                            showNotification('Position mise à jour avec succès.');
                                            refreshResults();
                                        },
                                        (error) => {
                                            console.warn("Geolocation error:", error);
                                            if (mapContainer) mapContainer.classList.remove('map-blur');
                                            if (locationOverlay) locationOverlay.classList.add('hidden');
                                            unlockDropZone();
                                        }
                                    );
                                } else {
                                    if (mapContainer) mapContainer.classList.remove('map-blur');
                                    if (locationOverlay) locationOverlay.classList.add('hidden');
                                    unlockDropZone();
                                }
                            };
                        }

                        // Initialize map if not done
                        if (!window.studentDemoMap) {
                            setTimeout(() => {
                                window.studentDemoMap = new maplibregl.Map({
                                    container: 'student-demo-map',
                                    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
                                    center: [2.2137, 46.2276], // Default France
                                    zoom: 5.5,
                                    attributionControl: false
                                });
                                window.studentDemoMap.addControl(new maplibregl.NavigationControl(), 'top-right');
                                window.studentDemoMap.addControl(new StudentDragSearchControl(), 'top-right');
                                window.studentDemoMap.addControl(new maplibregl.GeolocateControl({
                                    positionOptions: { enableHighAccuracy: true },
                                    trackUserLocation: true
                                }), 'top-right');

                                // Call refresh once map is initialized to populate data
                                window.studentDemoMap.on('load', () => {
                                    refreshResults();
                                });

                                // Initial Lock Drop Zone until location is handled (if no location yet)
                                if (!window.userLocation && dropZone) {
                                    dropZone.style.pointerEvents = 'none';
                                    dropZone.style.opacity = '0.3';
                                    dropZone.classList.add('locked');
                                }
                            }, 500);
                        }
                    }
                }
            });
        });

        // Close Student Demo Map (Back Arrow)
        const closeStudentDemo = document.getElementById('close-student-demo-arrow');
        const studentModal = document.getElementById('student-demo-modal');
        if (closeStudentDemo && studentModal) {
            console.log('Back arrow listener initializing...');
            closeStudentDemo.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Back arrow clicked!');
                studentModal.classList.remove('active');
                setTimeout(() => {
                    studentModal.style.display = 'none';
                    // Reset scroll for next time
                    const sidebar = document.querySelector('.student-left-sidebar');
                    if (sidebar) sidebar.scrollTop = 0;
                }, 500); // Wait for transition

                // Bring back the selection buttons
                if (demoOverlay) {
                    demoOverlay.style.display = 'flex';
                    // Small delay to allow display:flex to apply
                    setTimeout(() => demoOverlay.classList.add('active'), 10);
                }
            });
        }
    }

    // Auto-initialize dashboard if we are on the dashboard page
    if (document.getElementById('student-dashboard')) {
        initDashboardViews();
    }

    // Dashboard View Switching
    function initDashboardViews() {
        const sidebarItems = document.querySelectorAll('.dashboard-sidebar .nav-item');
        const dashboardSections = document.querySelectorAll('.dashboard-section');

        // Internal view switching for Applications section
        const viewBtns = document.querySelectorAll('#section-applications .view-btn');
        const kanbanView = document.getElementById('kanban-view');
        const mapView = document.getElementById('map-view');
        let dashboardMap = null;

        // Sidebar Navigation
        sidebarItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const sectionKey = item.getAttribute('data-section');

                // If it's a link with an href (like Accueil), use default behavior with transition
                const href = item.getAttribute('href');
                if (href && href !== '#') {
                    e.preventDefault();
                    navigateTo(href);
                    return;
                }

                e.preventDefault();
                if (!sectionKey) return;

                const targetSectionId = `section-${sectionKey}`;

                // Update active sidebar item
                sidebarItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Switch main sections
                dashboardSections.forEach(section => {
                    if (section.id === targetSectionId) {
                        section.style.display = 'block';
                    } else {
                        section.style.display = 'none';
                    }
                });

                // Special case: if switching to applications and map was active, resize it
                if (targetSectionId === 'section-applications' && dashboardMap && mapView.style.display !== 'none') {
                    dashboardMap.resize();
                }
            });
        });

        // Applications Internal View Switcher
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetView = btn.getAttribute('data-view');

                // Update buttons
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Switch internal views
                if (targetView === 'kanban') {
                    kanbanView.style.display = 'flex';
                    mapView.style.display = 'none';
                } else if (targetView === 'map') {
                    kanbanView.style.display = 'none';
                    mapView.style.display = 'flex';

                    // Initialize map if not already done
                    if (!dashboardMap) {
                        dashboardMap = initDashboardMap();
                    } else {
                        // Delay resize slightly to ensure display:flex has taken effect
                        setTimeout(() => dashboardMap.resize(), 10);
                    }
                } else {
                    kanbanView.style.display = 'none';
                    mapView.style.display = 'none';
                }
            });
        });
    }

    // Modal Management for Post Offer
    const openPostModal = document.getElementById('open-post-modal');
    const postOfferModal = document.getElementById('post-offer-modal');
    const closePostModal = document.getElementById('close-post-modal');
    const jobOfferForm = document.getElementById('job-offer-form');

    if (openPostModal && postOfferModal) {
        openPostModal.addEventListener('click', () => {
            postOfferModal.classList.add('active');
        });

        const closeModal = () => {
            postOfferModal.classList.remove('active');
        };

        if (closePostModal) closePostModal.addEventListener('click', closeModal);

        postOfferModal.addEventListener('click', (e) => {
            if (e.target === postOfferModal) closeModal();
        });

        if (jobOfferForm) {
            jobOfferForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Mock submission
                const submitBtn = jobOfferForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;

                submitBtn.disabled = true;
                submitBtn.textContent = 'Publication en cours...';

                setTimeout(() => {
                    submitBtn.textContent = 'Succès !';
                    submitBtn.style.background = '#27ae60';

                    setTimeout(() => {
                        closeModal();
                        // Reset button
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = '';
                        jobOfferForm.reset();
                    }, 1500);
                }, 2000);
            });
        }
    }

    function initDashboardMap() {
        const map = new maplibregl.Map({
            container: 'dashboard-map',
            style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
            center: [5.3698, 43.2965],
            zoom: 13,
            pitch: 0,
            attributionControl: false
        });

        return map;
    }

    // Footer Connection Lines
    function initFooterConnections() {
        const svg = document.getElementById('connection-lines');
        const socialCards = document.querySelectorAll('.social-card');
        const footerBrand = document.querySelector('.footer-brand');

        if (!svg || socialCards.length === 0 || !footerBrand) return;

        function updatePaths() {
            svg.innerHTML = '';
            const svgRect = svg.getBoundingClientRect();
            const brandRect = footerBrand.getBoundingClientRect();

            // Brand Center - Stop at the top edge of the title
            const targetX = brandRect.left + (brandRect.width / 2) - svgRect.left;
            const targetY = brandRect.top - svgRect.top;

            socialCards.forEach((card, index) => {
                const cardRect = card.getBoundingClientRect();

                // Card Center - Slightly inside card bottom
                const startX = cardRect.left + (cardRect.width / 2) - svgRect.left;
                const startY = cardRect.bottom - svgRect.top - 15;

                // Draw a nice curve
                const cp1y = startY + (targetY - startY) * 0.4;
                const cp2y = startY + (targetY - startY) * 0.6;
                const d = `M ${startX} ${startY} C ${startX} ${cp1y}, ${targetX} ${cp2y}, ${targetX} ${targetY}`;

                // Base static path
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", d);
                path.setAttribute("class", "connection-path");
                svg.appendChild(path);

                // Pulsing energy path
                const pulse = document.createElementNS("http://www.w3.org/2000/svg", "path");
                pulse.setAttribute("d", d);
                pulse.setAttribute("class", "pulse-path");
                pulse.style.animationDelay = `${index * 0.6}s`; // Staggered pulses
                svg.appendChild(pulse);
            });
        }

        updatePaths();
        window.addEventListener('resize', updatePaths);
        // Also update after a short delay for scroll reveal layout shifts
        setTimeout(updatePaths, 1000);
    }

    initFooterConnections();

    // Student Demo Profile Dropdown Toggle
    const profileTrigger = document.getElementById('profile-trigger');
    if (profileTrigger) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            profileTrigger.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!profileTrigger.contains(e.target)) {
                profileTrigger.classList.remove('active');
            }
        });
    }

    // Random Profile Generator
    const randomProfileBtn = document.getElementById('random-profile-btn');
    if (randomProfileBtn) {
        const profiles = [
            {
                name: "Lucas Martin",
                role: "Recherche d'alternance",
                location: "Lyon, France",
                school: "Epitech Digital",
                degree: "Master Lead Tech",
                age: "22 ans",
                email: "lucas.m@email.com",
                phone: "+33 6 12 34 56 78",
                github: "github.com/lucas-dev",
                linktree: "linktr.ee/lucas",
                avail: "Septembre 2026",
                color1: "#FF6B00",
                color2: "#ff8e3c",
                bio: "Passionné par le développement web et les nouvelles technologies. Je cherche une alternance pour mettre en pratique mes compétences et évoluer dans une équipe dynamique.",
                skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "Git"],
                languages: [{ name: "Français", level: "Natif" }, { name: "Anglais", level: "C1 (Avancé)" }],
                prefs: { contract: "Alternance / Apprentissage", rhythm: "3 sem / 1 sem", mobility: "Permis B, Véhiculé" },
                experience: [
                    { role: "Développeur Front-end", date: "2024 - 2025", place: "TechAgency • Stage", desc: "Développement d'interfaces React, intégration de maquettes Figma et optimisation des performances." },
                    { role: "Projet Freelance", date: "2023", place: "Client Particulier", desc: "Création d'un site e-commerce complet avec Shopify et personnalisation du thème Liquid." }
                ],
                education: [
                    { role: "Master Lead Tech", date: "2024 - 2026", place: "Epitech Digital" },
                    { role: "Bachelor Chef de Projet", date: "2021 - 2024", place: "ESD Bordeaux" }
                ]
            },
            {
                name: "Sarah Cohen",
                role: "Étudiante Marketing",
                location: "Paris, France",
                school: "HEC Paris",
                degree: "Master Marketing Digital",
                age: "23 ans",
                email: "sarah.cohen@email.com",
                phone: "+33 6 98 76 54 32",
                github: "behance.net/sarah-c",
                linktree: "linkedin.com/in/sarahc",
                avail: "Juillet 2026",
                color1: "#9b59b6",
                color2: "#8e44ad",
                bio: "Créative et analytique, je souhaite rejoindre une équipe marketing ambitieuse. Spécialisée en stratégie digitale et gestion de communauté.",
                skills: ["Stratégie Digitale", "SEO/SEA", "Canva", "Google Analytics", "Copywriting"],
                languages: [{ name: "Français", level: "Natif" }, { name: "Espagnol", level: "B2 (Intermédiaire)" }, { name: "Anglais", level: "C2 (Bilingue)" }],
                prefs: { contract: "Stage (6 mois)", rhythm: "Temps plein", mobility: "Île-de-France" },
                experience: [
                    { role: "Assistante Chef de Produit", date: "2024", place: "L'Oréal • Stage", desc: "Analyse concurrentielle, lancement de campagnes réseaux sociaux et suivi des KPIs." },
                    { role: "Community Manager", date: "2023", place: "Start-up FoodTech", desc: "Gestion des réseaux (Insta/TikTok), création de contenu et interaction avec la communauté." }
                ],
                education: [
                    { role: "Master Marketing Digital", date: "2024 - 2026", place: "HEC Paris" },
                    { role: "Licence Eco-Gestion", date: "2021 - 2024", place: "Université Paris-Dauphine" }
                ]
            },
            {
                name: "Amine Benali",
                role: "Futur Business Developer",
                location: "Marseille, France",
                school: "KEDGE Business School",
                degree: "Master International Business",
                age: "24 ans",
                email: "amine.b@email.com",
                phone: "+33 7 00 11 22 33",
                github: "twitter.com/amine_biz",
                linktree: "amine-portfolio.com",
                avail: "Immédiate",
                color1: "#2ecc71",
                color2: "#27ae60",
                bio: "Orienté résultats et relation client. Mon objectif est de développer le portefeuille clients d'une start-up innovante à l'échelle internationale.",
                skills: ["Négociation", "CRM (Salesforce)", "Prospection", "Anglais des affaires", "Excel"],
                languages: [{ name: "Français", level: "Natif" }, { name: "Arabe", level: "C1 (Courant)" }, { name: "Anglais", level: "B2" }],
                prefs: { contract: "CDI / Alternance", rhythm: "Flexible", mobility: "International" },
                experience: [
                    { role: "Sales Development Rep", date: "2024", place: "Software SAS • Alternance", desc: "Prospection téléphonique et mail, qualification de leads et prise de rendez-vous." },
                    { role: "Vendeur Conseil", date: "2022 - 2023", place: "Fnac", desc: "Conseil client expert, gestion des stocks et atteinte des objectifs de vente mensuels." }
                ],
                education: [
                    { role: "MSc International Business", date: "2024 - 2025", place: "KEDGE Marseille" },
                    { role: "Bachelor Commerce", date: "2021 - 2024", place: "IUT Aix-Marseille" }
                ]
            },
            {
                name: "Emma Dubois",
                role: "Designer UI/UX",
                location: "Nantes, France",
                school: "L'École de Design",
                degree: "Master Design d'Interaction",
                age: "21 ans",
                email: "emma.d@email.com",
                phone: "+33 6 55 44 33 22",
                github: "dribbble.com/emmadesign",
                linktree: "emma-ux.io",
                avail: "Octobre 2026",
                color1: "#e74c3c",
                color2: "#c0392b",
                bio: "L'utilisateur est au centre de mes créations. Je conçois des interfaces intuitives et esthétiques pour mobile et web.",
                skills: ["Figma", "Adobe XD", "Prototypage", "Wireframing", "User Research"],
                languages: [{ name: "Français", level: "Natif" }, { name: "Anglais", level: "C1" }],
                prefs: { contract: "Alternance", rhythm: "4 jours / 1 jour", mobility: "Télétravail partiel" },
                experience: [
                    { role: "UX Designer Junior", date: "2024", place: "Agence Digitale • Stage", desc: "Wireframing, tests utilisateurs et maquettage haute fidélité pour des clients grands comptes." },
                    { role: "Graphiste Freelance", date: "2022 - Présent", place: "Indépendant", desc: "Création d'identités visuelles, logos et supports de communication print/web." }
                ],
                education: [
                    { role: "Master Design Interaction", date: "2024 - 2026", place: "L'École de Design Nantes" },
                    { role: "DN MADE Numérique", date: "2021 - 2024", place: "Lycée Livet" }
                ]
            },
            {
                name: "Thomas Lefebvre",
                role: "Data Scientist Junior",
                location: "Toulouse, France",
                school: "INSA Toulouse",
                degree: "Ingénieur Big Data",
                age: "23 ans",
                email: "thomas.data@email.com",
                phone: "+33 6 22 88 44 66",
                github: "github.com/tom-data",
                linktree: "kaggle.com/tomlef",
                avail: "Janvier 2027",
                color1: "#3498db",
                color2: "#2980b9",
                bio: "Passionné par la donnée et l'IA. Je maîtrise les algorithmes de Machine Learning et la visualisation de données complexes.",
                skills: ["Python", "TensorFlow", "SQL", "Tableau", "Statistiques"],
                languages: [{ name: "Français", level: "Natif" }, { name: "Allemand", level: "B1" }, { name: "Anglais", level: "C1" }],
                prefs: { contract: "Stage fin d'études", rhythm: "Temps plein", mobility: "France entière" },
                experience: [
                    { role: "Data Analyst Stagiaire", date: "2024", place: "Airbus", desc: "Nettoyage de données, création de dashboards PowerBI et analyse prédictive de maintenance." },
                    { role: "Projet de Recherche", date: "2023", place: "Laboratoire CNRS", desc: "Développement d'un modèle de Deep Learning pour la reconnaissance d'images satellites." }
                ],
                education: [
                    { role: "Diplôme d'Ingénieur", date: "2021 - 2026", place: "INSA Toulouse" },
                    { role: "Classes Prépa Intégrées", date: "2019 - 2021", place: "INSA Toulouse" }
                ]
            }
        ];

        randomProfileBtn.addEventListener('click', () => {
            // Pick a random profile
            const randomProfile = profiles[Math.floor(Math.random() * profiles.length)];

            // Update Header
            const profileName = document.querySelector('.profile-name');
            const profileRole = document.querySelector('.profile-role');
            const profileAvatar = document.querySelector('.profile-avatar');

            if (profileName) profileName.textContent = randomProfile.name;
            if (profileRole) profileRole.textContent = randomProfile.role;
            if (profileAvatar) profileAvatar.style.background = `linear-gradient(135deg, ${randomProfile.color1} 0%, ${randomProfile.color2} 100%)`;

            // Update Dropdown Content
            const dropdown = document.querySelector('.profile-dropdown');
            if (dropdown) {
                dropdown.innerHTML = `
                    <div class="dropdown-section">
                        <h4>Informations</h4>
                        <div class="info-item"><i class="fa-solid fa-location-dot"></i> ${randomProfile.location}</div>
                        <div class="info-item"><i class="fa-solid fa-graduation-cap"></i> ${randomProfile.school}</div>
                        <div class="info-item"><i class="fa-solid fa-certificate"></i> ${randomProfile.degree}</div>
                        <div class="info-item"><i class="fa-solid fa-cake-candles"></i> ${randomProfile.age}</div>
                    </div>
                    <div class="dropdown-section">
                        <h4>Contact</h4>
                        <div class="info-item"><i class="fa-solid fa-envelope"></i> ${randomProfile.email}</div>
                        <div class="info-item"><i class="fa-solid fa-phone"></i> ${randomProfile.phone}</div>
                    </div>
                    <div class="dropdown-section">
                        <h4>Réseaux</h4>
                        <div class="info-item link"><i class="fa-brands fa-github"></i> ${randomProfile.github}</div>
                        <div class="info-item link"><i class="fa-solid fa-link"></i> ${randomProfile.linktree}</div>
                    </div>
                    <div class="dropdown-section">
                        <h4>Disponibilité</h4>
                        <div class="info-item highlight"><i class="fa-solid fa-calendar-check"></i> ${randomProfile.avail}</div>
                    </div>
                `;
            }

            // Update Panel Content
            const bioText = document.querySelector('.bio-text');
            const skillsContainer = document.getElementById('skills-container');
            const langsContainer = document.getElementById('languages-container');
            const prefsContainer = document.getElementById('prefs-container');
            const expContainer = document.getElementById('experience-container');
            const eduContainer = document.getElementById('education-container');

            if (bioText) bioText.textContent = randomProfile.bio;

            if (skillsContainer) {
                skillsContainer.innerHTML = randomProfile.skills.map(skill => `<span class="skill-tag-item">${skill}</span>`).join('');
            }

            if (expContainer) {
                expContainer.innerHTML = randomProfile.experience.map(exp => `
                    <div class="timeline-item">
                        <div class="timeline-header">
                            <span class="timeline-role">${exp.role}</span>
                            <span class="timeline-date">${exp.date}</span>
                        </div>
                        <div class="timeline-place">${exp.place}</div>
                        <p class="timeline-desc">${exp.desc}</p>
                    </div>
                `).join('');
            }

            if (eduContainer) {
                eduContainer.innerHTML = randomProfile.education.map(edu => `
                    <div class="timeline-item">
                        <div class="timeline-header">
                            <span class="timeline-role">${edu.role}</span>
                            <span class="timeline-date">${edu.date}</span>
                        </div>
                        <div class="timeline-place">${edu.place}</div>
                    </div>
                `).join('');
            }

            if (langsContainer) {
                langsContainer.innerHTML = randomProfile.languages.map(lang => `
                    <div class="detail-row">
                        <span class="detail-label">${lang.name}</span>
                        <span class="detail-value">${lang.level}</span>
                    </div>
                `).join('');
            }

            if (prefsContainer) {
                prefsContainer.innerHTML = `
                    <div class="detail-row">
                        <span class="detail-label">Contrat</span>
                        <span class="detail-value">${randomProfile.prefs.contract}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Rythme</span>
                        <span class="detail-value">${randomProfile.prefs.rhythm}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Mobilité</span>
                        <span class="detail-value">${randomProfile.prefs.mobility}</span>
                    </div>
                `;
            }

            // Chatbot Welcome Update
            const chatFeed = document.getElementById('chat-feed');
            if (chatFeed) {
                chatFeed.innerHTML = `
                    <div class="chat-message bot">
                        <div class="message-content">
                            Bonjour ! Je suis <span class="profile-obj-name">${randomProfile.name.split(' ')[0]}</span>. Je recherche une alternance. Posez-moi des questions sur mon parcours !
                        </div>
                    </div>
                `;
            }

            // Add a little animation effect
            const profileBlock = document.querySelector('.sidebar-profile');
            if (profileBlock) {
                profileBlock.style.transform = 'scale(0.98)';
                setTimeout(() => profileBlock.style.transform = 'scale(1)', 150);
            }
        });
    }

    // Chatbot Interaction Logic
    const chatInput = document.querySelector('.chat-input-area input');
    const chatSendBtn = document.querySelector('.chat-input-area button');
    const chatFeed = document.getElementById('chat-feed');

    const botResponses = [
        "C'est une excellente question ! Je suis très intéressé par le domaine de la tech.",
        "Mon expérience précédente m'a beaucoup appris sur la gestion de projet.",
        "Je suis disponible pour un entretien dès que possible.",
        "J'adore travailler en équipe et relever de nouveaux défis.",
        "Pouvez-vous m'en dire plus sur les missions du poste ?",
        "Je maîtrise bien ces outils, c'est justement ma spécialité.",
        "C'est noté, cela correspond tout à fait à ce que je recherche."
    ];

    function sendMessage() {
        const text = chatInput.value.trim();
        if (text) {
            // Add User Message
            const userMsg = document.createElement('div');
            userMsg.className = 'chat-message user';
            userMsg.innerHTML = `<div class="message-content">${text}</div>`;
            chatFeed.appendChild(userMsg);

            chatInput.value = '';
            chatFeed.scrollTop = chatFeed.scrollHeight;

            // Show Typing Indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'chat-message bot typing';
            typingIndicator.innerHTML = `
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            `;
            chatFeed.appendChild(typingIndicator);
            chatFeed.scrollTop = chatFeed.scrollHeight;

            // Simulate Bot Response
            setTimeout(() => {
                // Remove typing indicator
                if (typingIndicator.parentNode) {
                    typingIndicator.parentNode.removeChild(typingIndicator);
                }

                const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
                const botMsg = document.createElement('div');
                botMsg.className = 'chat-message bot';
                botMsg.innerHTML = `<div class="message-content">${randomResponse}</div>`;
                chatFeed.appendChild(botMsg);
                chatFeed.scrollTop = chatFeed.scrollHeight;
            }, 1500);
        }
    }

    if (chatSendBtn && chatInput) {
        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // PDF Drop Zone Functionality
    const dropZone = document.getElementById('drop-zone');
    const cvInput = document.getElementById('cv-upload');

    if (dropZone && cvInput) {
        // Trigger file input on click
        dropZone.addEventListener('click', () => cvInput.click());

        // Drag & Drop effects
        ['dragover', 'dragenter'].forEach(event => {
            dropZone.addEventListener(event, (e) => {
                e.preventDefault();
                dropZone.classList.add('drag-active');
            });
        });

        ['dragleave', 'dragend', 'drop'].forEach(event => {
            dropZone.addEventListener(event, () => {
                dropZone.classList.remove('drag-active');
            });
        });

        // Handle Drop
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files.length) handleCVUpload(files[0]);
        });

        // Handle Manual Selection
        cvInput.addEventListener('change', (e) => {
            if (e.target.files.length) handleCVUpload(e.target.files[0]);
        });
    }

    // Initialize Custom Dropdowns (Global)
    function setupAllDropdowns() {
        const dropdowns = document.querySelectorAll('.custom-dropdown');
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.dropdown-trigger');
            const label = trigger.querySelector('.trigger-label');
            const options = dropdown.querySelectorAll('.option');

            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdowns.forEach(d => { if (d !== dropdown) d.classList.remove('active'); });
                dropdown.classList.toggle('active');
            });

            options.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    options.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    label.textContent = option.textContent;
                    dropdown.classList.remove('active');

                    // Conditional Filter Logic for Ecole
                    if (dropdown.id === 'dropdown-search-type') {
                        const schoolTypeFilter = document.getElementById('school-type-selection');
                        const schoolLevelFilter = document.getElementById('school-level-selection');
                        const isEcole = (option.dataset.value === 'ecole');

                        if (schoolTypeFilter) schoolTypeFilter.style.display = isEcole ? 'block' : 'none';
                        if (schoolLevelFilter) schoolLevelFilter.style.display = isEcole ? 'block' : 'none';
                    }

                    // Update results and map if available
                    refreshResults();
                });
            });
        });

        window.addEventListener('click', () => {
            dropdowns.forEach(d => d.classList.remove('active'));
        });
    }
    setupAllDropdowns();

    // AI Configuration - Local Ollama
    console.log("NextStep: Utilisation de l'IA Locale Ollama");

    async function extractTextFromPDF(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + ' ';
            }
            return fullText;
        } catch (e) {
            console.error("PDF Parse Error", e);
            throw new Error("Impossible de lire le PDF");
        }
    }

    // AI CV Analysis Wrapper - REAL OLLAMA INTEGRATION
    async function analyzeCVData(text) {
        console.log("🤖 Analyse du CV avec Ollama...");
        console.log("📄 Texte extrait (premiers 200 caractères):", text.substring(0, 200));

        try {
            const response = await fetch('http://localhost:8000/api/analyze-cv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cv_text: text,
                    model: "llama3.2"
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ Réponse Ollama:", data);

            // Vérifier si on a des données valides
            if (data.name || data.role || data.skills.length > 0) {
                return {
                    name: data.name || "Profil Étudiant",
                    role: data.role || "Alternance",
                    skills: data.skills.length > 0 ? data.skills : ["Compétences techniques"],
                    experience: data.experience || [],
                    education: data.education || [],
                    location: data.location || "France",
                    summary: `${data.role || 'Candidat'} avec ${data.skills.length} compétences identifiées`
                };
            } else {
                console.warn("⚠️ Ollama n'a pas retourné de données structurées, utilisation du fallback");
                throw new Error("Données incomplètes");
            }

        } catch (error) {
            console.error("❌ Erreur lors de l'analyse Ollama:", error);
            console.log("🔄 Utilisation des données de démonstration");

            // Fallback: données de démo
            return {
                name: "Profil Étudiant",
                role: "Développeur Tech",
                skills: ["JavaScript", "React", "Node.js"],
                experience: ["Stage développement web"],
                education: ["Licence Informatique"],
                location: "France",
                summary: "Candidat à l'alternance"
            };
        }
    }



    // Helper pour les notifications (Défini ici pour être sûr qu'il est dispo)
    window.showNotification = function (message) {
        const toast = document.getElementById('toast-container');
        const toastMsg = document.getElementById('toast-message');
        if (toast && toastMsg) {
            toastMsg.textContent = message;
            toast.classList.add('active');
            setTimeout(() => {
                toast.classList.remove('active');
            }, 4000);
        }
    };

    async function handleCVUpload(file) {
        if (file.type !== 'application/pdf') {
            alert('Veuillez déposer un fichier PDF uniquement.');
            return;
        }

        // Visual feedback during "upload"
        const originalContent = dropZone.innerHTML;
        dropZone.style.pointerEvents = 'none';
        dropZone.innerHTML = `
            <div class="analysis-loader" style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                <div class="spinner" style="width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <span style="color: white; font-size: 0.9rem; font-weight: 500;">IA: Analyse de ${file.name}...</span>
                <span id="ai-status" style="color: rgba(255,255,255,0.5); font-size: 0.8rem;">Extraction du texte...</span>
            </div>
        `;

        try {
            // 1. Extract Text
            const text = await extractTextFromPDF(file);
            window.userCVContent = text; // Store globally for Chatbot
            document.getElementById('ai-status').textContent = "Compréhension du profil...";

            // 2. Analyze with Ollama
            const aiData = await analyzeCVData(text);

            // 3. Show results popup
            if (aiData) {
                console.log("AI Data Received:", aiData);
                document.getElementById('ai-status').textContent = "Recherche d'offres France Travail...";

                // Tenter de récupérer les vraies offres via France Travail
                let realOffersFound = false;
                if (typeof fetchRealOffersFromFranceTravail === 'function') {
                    try {
                        realOffersFound = await fetchRealOffersFromFranceTravail(aiData);
                    } catch (ftError) {
                        console.error("Erreur France Travail:", ftError);
                    }
                }

                if (!realOffersFound) {
                    // Fallback sur les données mock si France Travail échoue
                    updateMockDataWithAI(aiData);
                }

                document.getElementById('ai-status').textContent = "Analyse terminée !";

                // Show success popup with results
                showCVAnalysisPopup(aiData, true);
            } else {
                document.getElementById('ai-status').textContent = "Mode Démo (Simulé)...";
                showCVAnalysisPopup(null, false, "Aucune donnée retournée par l'IA");
            }

        } catch (err) {
            console.error("AI Flow Error", err);
            // Show error popup
            showCVAnalysisPopup(null, false, err.message || "Erreur lors de l'analyse du CV");
        }

        // Simulate network delay for effect, then show results
        setTimeout(() => {
            dropZone.innerHTML = `
                <div class="success-upload" style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; animation: reveal 0.5s ease-out;">
                    <div style="width: 48px; height: 48px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem; box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);">
                        <i class="fa-solid fa-check" style="color: white; font-size: 1.2rem;"></i>
                    </div>
                    <span style="color: white; font-size: 0.95rem; font-weight: 600;">CV Analysé avec succès</span>
                    <span style="color: #9ca3af; font-size: 0.8rem;">${file.name}</span>
                    <button class="btn-nav" style="margin-top: 1rem; padding: 6px 16px; font-size: 0.75rem; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: white; border-radius: 4px; cursor: pointer;" id="reset-upload">Changer le fichier</button>
                </div>
            `;

            // Reset button logic
            document.getElementById('reset-upload').addEventListener('click', (e) => {
                e.stopPropagation();
                dropZone.innerHTML = originalContent;
                dropZone.style.pointerEvents = 'auto';
                dropZone.querySelector('.pdf-drop-zone') || document.getElementById('drop-zone').addEventListener('click', () => document.getElementById('cv-upload').click());
            });

            // Start scanning effect
            const mapOverlay = document.getElementById('map-scan-overlay');
            if (mapOverlay) {
                mapOverlay.classList.remove('hidden');
                setTimeout(() => {
                    mapOverlay.classList.add('hidden');
                    displayMockResults();
                    if (window.userLocation) {
                        updateMapWithResults(window.userLocation);
                    } else {
                        updateMapWithResults();
                    }
                }, 3000); // Faster than before
            }
        }, 2000);
    }

    function updateMockDataWithAI(aiData) {
        // Dynamically create "matched" offers based on the AI analysis
        const companies = [
            { name: "Capgemini", type: "ESN" },
            { name: "CMA CGM", type: "Logistique" },
            { name: "Airbus", type: "Aéronautique" },
            { name: "Thales", type: "Défense" }
        ];

        // Ensure we have offers logic access
        if (window.studentOffersData) {
            // Modify the first offer to match the profile perfectly
            window.studentOffersData[0].role = aiData.role || "Alternance Tech";
            window.studentOffersData[0].desc = `Basé sur votre profil (${aiData.summary}), ${companies[1].name} recherche exactement vos compétences : ${aiData.skills.slice(0, 3).join(', ')}.`;
            window.studentOffersData[0].score = 98;
            window.studentOffersData[0].req = `Nous cherchons un profil maitrisant ${aiData.skills[0]} et ${aiData.skills[1]}, passionné par l'innovation.`;

            // Re-render if already visible? No, it will render in displayMockResults
        }
    }

    function displayMockResults() {
        const resultsContainer = document.getElementById('cv-results-container');
        if (!resultsContainer) return;

        // Show container with animation
        resultsContainer.classList.remove('hidden');
        setTimeout(() => {
            resultsContainer.classList.add('visible');
        }, 100);

        // Hide CV tools to focus on results
        if (dropZone) dropZone.style.display = 'none';

        const searchType = document.querySelector('#dropdown-search-type .option.selected')?.dataset.value || 'alternance';
        const isEcole = searchType === 'ecole';

        const searchSelection = document.getElementById('search-type-selection');
        if (searchSelection) searchSelection.style.display = 'none';

        const schoolTypeSel = document.getElementById('school-type-selection');
        const schoolLevelSel = document.getElementById('school-level-selection');

        if (!isEcole) {
            if (schoolTypeSel) schoolTypeSel.style.display = 'none';
            if (schoolLevelSel) schoolLevelSel.style.display = 'none';
        } else {
            // Ensure they are visible if it's school mode
            if (schoolTypeSel) schoolTypeSel.style.display = 'block';
            if (schoolLevelSel) schoolLevelSel.style.display = 'block';
        }

        showNotification('Analyse terminée. Résultats mis à jour.');
        refreshResults();
    }

    function refreshResults() {
        const searchType = document.querySelector('#dropdown-search-type .option.selected')?.dataset.value || 'alternance';
        const resultsContainer = document.getElementById('cv-results-container');
        const dropZone = document.getElementById('drop-zone');

        if (typeof loadDataFromDatabase === 'function') {
            loadDataFromDatabase().then(() => {
                if (typeof window.applyFilters === 'function') window.applyFilters();
                if (typeof updateMapWithResults === 'function' && window.studentDemoMap) updateMapWithResults();
            });
        }

        // Detect if CV was uploaded by checking if dropzone was hidden by displayMockResults
        const isCVUploaded = dropZone && dropZone.style.display === 'none';

        if (isCVUploaded) {
            // Already uploaded, just ensure results are visible and updated
            if (resultsContainer) {
                resultsContainer.classList.remove('hidden');
                resultsContainer.classList.add('visible');
            }
            if (dropZone) dropZone.style.display = 'none';
        } else {
            // No CV uploaded yet, keep results hidden and show dropzone
            if (resultsContainer) {
                resultsContainer.classList.add('hidden');
                resultsContainer.classList.remove('visible');
            }
            if (dropZone) dropZone.style.display = 'flex';
        }
    }

    async function loadDataFromDatabase() {
        const searchType = document.querySelector('#dropdown-search-type .option.selected')?.dataset.value || 'alternance';

        if (searchType === 'ecole') {
            const sector = document.querySelector('#dropdown-school-type .option.selected')?.dataset.value || 'prive';
            const level = document.querySelector('#dropdown-school-level .option.selected')?.dataset.value || 'lycee';

            let filteredSchools = (window.schoolsDatabase || []).filter(s =>
                s.sector === sector && s.level === level
            );

            window.studentOffersData = filteredSchools.map(s => ({
                company: s.name,
                role: s.level === 'lycee' ? 'Lycée' : 'Études Supérieures',
                img: s.level === 'lycee' ?
                    'data:image/png;base64,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' :
                    'data:image/png;base64,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',
                desc: `${s.name} est un établissement ${s.sector} reconnu situé à ${s.address}.`,
                req: `Inscriptions en cours pour le niveau ${s.level.toUpperCase()}. Contactez l'administration pour plus d'infos.`,
                distance: (Math.random() * 5 + 1).toFixed(1) + ' km',
                contract: s.sector === 'prive' ? 'Privé' : 'Public',
                city: 'Marseille',
                isOpen: true,
                score: 95 + Math.floor(Math.random() * 5),
                coords: s.coords
            }));

            window.studentDemoOffers = filteredSchools.map(s => ({
                name: s.name,
                coords: s.coords,
                role: s.level === 'lycee' ? 'Lycée' : 'Fac'
            }));

        } else {
            // Check if we already have AI data loaded (don't overwrite it with generic data)
            // But only if offers correspond to the AI search (we can check a flag or heuristics)
            // For now, if studentOffersData has content and we just did an analysis, skip.
            // Simplified: If this function is called explicitly to "refresh" from zero, we fetch.

            // Real Data Fetch from France Travail via Proxy
            try {
                // Utilisation du Proxy Local pour éviter CORS et utiliser l'Auth automatique
                const response = await fetch('http://localhost:8000/api/proxy/francetravail?motsCles=alternance&latitude=43.2965&longitude=5.3698&distance=20');

                if (response.ok) {
                    const data = await response.json();
                    const results = data.resultats || [];

                    // Si on a déjà des résultats IA (venant de updateMapWithResults), on ne les écrase pas
                    // Sauf si la liste est vide.
                    // Astuce: On vérifie si la descriptions des offres actuelles contient "MATCH" (score) 
                    const currentHasScore = window.studentOffersData && window.studentOffersData.length > 0 && window.studentOffersData[0].score !== undefined;

                    if (currentHasScore) {
                        console.log("🛡️ Données IA détectées, on ne recharge pas les données génériques.");
                        return;
                    }

                    window.studentOffersData = results.map(offer => {
                        // Extraction sécurisée des coordonnées
                        const lieu = offer.lieuTravail || {};
                        const lat = lieu.latitude || 43.2965 + (Math.random() - 0.5) * 0.1;
                        const lng = lieu.longitude || 5.3698 + (Math.random() - 0.5) * 0.1;

                        // Calculate distance if userLocation exists
                        let dist = (Math.random() * 5 + 1).toFixed(1) + ' km';
                        if (window.userLocation) {
                            const d = Math.sqrt(Math.pow(lat - window.userLocation[1], 2) + Math.pow(lng - window.userLocation[0], 2)) * 111;
                            dist = d.toFixed(1) + ' km';
                        }

                        return {
                            company: offer.entreprise ? (offer.entreprise.nom || "Recruteur Confidentiel") : "Recruteur Confidentiel",
                            role: offer.intitule,
                            img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop', // Default business icon
                            desc: offer.description ? (offer.description.substring(0, 150) + '...') : "Aucune description disponible.",
                            req: offer.competences ? offer.competences.map(c => c.libelle).slice(0, 3).join(', ') : "Motivation, Esprit d'équipe, Rigueur",
                            distance: dist,
                            contract: offer.typeContratLibelle || 'Alternance',
                            city: offer.lieuTravail.libelle || 'Marseille',
                            isOpen: true,
                            score: 80 + Math.floor(Math.random() * 20),
                            coords: [lng, lat]
                        };
                    });

                    window.studentDemoOffers = window.studentOffersData.map(o => ({
                        name: o.company,
                        coords: o.coords,
                        role: o.role
                    }));

                    console.log("France Travail API: Dashboard data updated", results.length);
                } else {
                    throw new Error("API Unauthorized or Failed");
                }
            } catch (err) {
                console.warn("Falling back to mock data:", err.message);
                // Default mock jobs
                window.studentOffersData = [
                    {
                        company: 'CMA CGM',
                        role: 'Alternance Data Scientist',
                        img: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
                        desc: "Leader mondial du transport maritime et de la logistique, CMA CGM s'engage dans la digitalisation de la Supply Chain mondiale via l'intelligence artificielle.",
                        req: "Nous recherchons un profils passionné par la Data Science, maîtrisant Python et les frameworks de Deep Learning pour optimiser nos flux logistiques.",
                        distance: '1.2 km',
                        contract: 'Apprentissage',
                        city: 'Marseille (Vieux Port)',
                        isOpen: true,
                        score: 94
                    },
                    {
                        company: 'Airbus',
                        role: 'Développeur Fullstack IA',
                        img: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop',
                        desc: "Airbus est un pionnier de l'aéronautique durable. Notre équipe de recherche à Marignane travaille sur les interfaces cockpit du futur assistées par IA.",
                        req: "Expertise en React.js et Node.js requise. Une connaissance des LLM et de l'intégration d'API d'IA générative est un atout majeur.",
                        distance: '8.4 km',
                        contract: 'Professionnalisation',
                        city: 'Marignane',
                        isOpen: true,
                        score: 88
                    },
                    {
                        company: 'Thales',
                        role: 'Cybersecurity Apprentice',
                        img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop',
                        desc: "Thales propose des solutions de haute technologie qui façonnent le monde de demain. Nous sécurisons les données les plus critiques à l'échelle mondiale.",
                        req: "Curiosité technique, bases solides en réseaux et sécurité informatique. Capacité à analyser des menaces complexes dans un environnement Cloud.",
                        distance: '4.7 km',
                        contract: 'Apprentissage',
                        city: 'Aubagne',
                        isOpen: false,
                        score: 91
                    }
                ];

                window.studentDemoOffers = [
                    { name: 'CMA CGM', coords: [5.3650, 43.3130], role: 'Data Scientist' },
                    { name: 'Airbus Helicopters', coords: [5.2150, 43.4360], role: 'Fullstack IA' },
                    { name: 'Thales DIS', coords: [5.5500, 43.2800], role: 'Cybersecurity' }
                ];
            }
        }

        // Source of truth for enriched data (fallback to default if empty)
        if (window.studentOffersData.length === 0) {
            window.studentOffersData = [{
                company: 'Aucun résultat',
                role: 'Essayez d\'autres filtres',
                img: '',
                desc: 'Aucun établissement ne correspond à votre recherche actuelle.',
                req: '', distance: '', contract: '', city: '', isOpen: false, score: 0
            }];
        }

        // 🎯 ENRICHISSEMENT ROME : Ajouter les codes métiers à toutes les offres
        if (window.enrichOfferWithROME && window.studentOffersData) {
            window.studentOffersData = window.studentOffersData.map(offer => {
                if (offer.company !== 'Aucun résultat') {
                    return window.enrichOfferWithROME(offer);
                }
                return offer;
            });
            console.log("✅ Offres enrichies avec codes ROME:", window.studentOffersData.length);
        }
    }

    window.renderOffers = function (offers) {
        const offersList = document.getElementById('offers-list');
        if (!offersList) return;

        // Force wheel scroll to avoid Lenis capture
        offersList.onwheel = (e) => {
            e.stopPropagation();
        };

        offersList.innerHTML = '';
        offers.forEach((offer, index) => {
            const item = document.createElement('div');
            item.className = 'offer-item';

            const statusColor = offer.isOpen ? '#4ade80' : '#f87171';
            const statusText = offer.isOpen ? 'Ouvert' : 'Fermé';

            const isIcon = offer.img.includes('school_icon') || offer.img.includes('fac_icon') || offer.img.includes('uploaded_media') || offer.img.startsWith('data:image');
            const avatarStyle = isIcon ?
                `background-image: url('${offer.img}'); background-size: 70%; background-repeat: no-repeat; background-position: center; background-color: rgba(255,255,255,0.1);` :
                `background-image: url('${offer.img}'); background-size: cover;`;

            item.innerHTML = `
                    <div class="offer-avatar" style="${avatarStyle}"></div>
                    <div class="offer-details">
                        <span class="offer-company">${offer.company}</span>
                        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                            <span class="offer-role">${offer.role}</span>
                            ${offer.codeROME ? `<span style="font-size: 9px; color: #60a5fa; font-weight: 700; text-transform: uppercase; background: rgba(96, 165, 250, 0.1); padding: 2px 6px; border-radius: 4px; border: 1px solid #60a5fa44;">📋 ROME ${offer.codeROME}</span>` : ''}
                            <span style="font-size: 10px; color: ${statusColor}; font-weight: 600; text-transform: uppercase; background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px; border: 1px solid ${statusColor}44;">
                                ${statusText}
                            </span>
                        </div>
                    </div>
                    <div class="offer-actions" style="display: flex; flex-direction: column; gap: 8px; opacity: 0.3;">
                        <img src="assets/icons/settings_white.png" alt="Settings" style="width: 14px; height: 14px; cursor: pointer;">
                        <img src="assets/icons/pin_white.png" alt="Pin" style="width: 14px; height: 14px; cursor: pointer;">
                    </div>
                `;
            offersList.appendChild(item);

            // Click to open Detail Popup
            item.addEventListener('click', () => {
                const popup = document.getElementById('company-detail-popup');
                if (popup) {
                    const detailLogo = document.getElementById('detail-logo');
                    if (detailLogo) {
                        detailLogo.style.backgroundImage = `url('${offer.img}')`;
                        detailLogo.style.backgroundSize = (offer.img.includes('school_icon') || offer.img.includes('fac_icon') || offer.img.includes('uploaded_media') || offer.img.startsWith('data:image')) ? '50%' : 'cover';
                        detailLogo.style.backgroundRepeat = 'no-repeat';
                        detailLogo.style.backgroundPosition = 'center';
                        detailLogo.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    }
                    document.getElementById('detail-company-name').textContent = offer.company;
                    document.getElementById('detail-role-name').textContent = offer.role;
                    document.getElementById('detail-description').textContent = offer.desc;
                    document.getElementById('detail-requirements').textContent = offer.req;

                    // Add Meta Info
                    document.getElementById('detail-distance').textContent = offer.distance;
                    document.getElementById('detail-contract').textContent = offer.contract;
                    document.getElementById('detail-city').textContent = offer.city;

                    // Reset to first tab (Information)
                    const navItems = document.querySelectorAll('.nav-item');
                    const tabContents = document.querySelector('.detail-body').querySelectorAll('.tab-content');
                    navItems.forEach(n => n.classList.remove('active'));
                    if (navItems[0]) navItems[0].classList.add('active');
                    tabContents.forEach(t => t.classList.add('hidden'));
                    if (tabContents[0]) tabContents[0].classList.remove('hidden');

                    if (window.updateChatbotContext) {
                        window.updateChatbotContext(offer);
                    }
                    popup.classList.remove('hidden');
                }
            });

            // Staggered reveal
            setTimeout(() => {
                item.classList.add('visible');
            }, 400 + (100 * index)); // Start after main container reveal
        });
    };

    window.applyFilters = function () {
        const statusTarget = document.querySelector('#dropdown-status .option.selected') || { dataset: { value: 'all' } };
        const sortTarget = document.querySelector('#dropdown-sort .option.selected') || { dataset: { value: 'desc' } };

        const statusFilter = statusTarget.dataset.value;
        const scoreSort = sortTarget.dataset.value;

        let filtered = [...window.studentOffersData];

        if (statusFilter === 'open') filtered = filtered.filter(o => o.isOpen);
        if (statusFilter === 'closed') filtered = filtered.filter(o => !o.isOpen);

        filtered.sort((a, b) => {
            return scoreSort === 'desc' ? b.score - a.score : a.score - b.score;
        });

        window.renderOffers(filtered);
    };

    window.applyFilters();



    // Tab Switching Logic initialized here
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelector('.detail-body').querySelectorAll('.tab-content');

    navItems.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetTab = btn.getAttribute('data-tab');

            // Update active button
            navItems.forEach(n => n.classList.remove('active'));
            btn.classList.add('active');

            // Update tab content
            tabContents.forEach(tab => {
                tab.classList.add('hidden');
                if (tab.id === `tab-${targetTab}`) {
                    tab.classList.remove('hidden');
                }
            });
        });
    });

    // Close Detail Popup Logic (Delegated for maximum robustness)
    window.addEventListener('click', (e) => {
        if (e.target.id === 'close-company-detail' || e.target.classList.contains('close-detail')) {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('company-detail-popup').classList.add('hidden');
        }
    });

    // Handle 'Postuler' button inside popup
    const detailPopup = document.getElementById('company-detail-popup');
    if (detailPopup) {
        detailPopup.addEventListener('click', (e) => {
            const openChatBtn = e.target.closest('#btn-open-chat');
            if (openChatBtn) {
                e.stopPropagation();
                const company = document.getElementById('detail-company-name').textContent;
                const role = document.getElementById('detail-role-name').textContent;
                const desc = document.getElementById('detail-description').textContent;
                activeOfferCtx = { company, role, desc };

                const chatModal = document.getElementById('ai-chatbot-modal');
                const chatMessages = document.getElementById('chat-messages');

                if (chatModal) {
                    chatMessages.innerHTML = '';
                    addAiChatMessage('assistant', `Bonjour ! Parlons de l'offre chez <strong>${company}</strong>. Comment puis-je vous aider ?`);
                    chatModal.classList.remove('hidden');
                    document.getElementById('chat-input')?.focus();
                }
                return;
            }

            if (e.target.classList.contains('apply-btn')) {
                e.stopPropagation();
                showNotification("Candidature envoyée avec succès !");
                detailPopup.classList.add('hidden');
            } else if (e.target === detailPopup) {
                // Background click
                detailPopup.classList.add('hidden');
            }
        });
    }


    // Update reset logic to handle results
    const resetBtn = document.getElementById('reset-upload');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resultsContainer.classList.remove('visible');
            setTimeout(() => {
                resultsContainer.classList.add('hidden');
            }, 600);
            dropZone.style.display = 'flex';
            const searchSelection = document.getElementById('search-type-selection');
            if (searchSelection) searchSelection.style.display = 'block';

            // Restore school filters if 'ecole' is selected
            const searchTypeOption = document.querySelector('#dropdown-search-type .option.selected');
            const isEcole = searchTypeOption && searchTypeOption.dataset.value === 'ecole';

            const schoolTypeSel = document.getElementById('school-type-selection');
            const schoolLevelSel = document.getElementById('school-level-selection');

            if (isEcole) {
                if (schoolTypeSel) schoolTypeSel.style.display = 'block';
                if (schoolLevelSel) schoolLevelSel.style.display = 'block';
            }
            // Reset map zoom
            if (window.studentDemoMap) {
                window.studentDemoMap.flyTo({ center: [2.2137, 46.2276], zoom: 5.5, duration: 2000 });
            }
        });
    }

    window.showNotification = function (message) {
        const toast = document.getElementById('toast-container');
        const toastMsg = document.getElementById('toast-message');
        if (toast && toastMsg) {
            toastMsg.textContent = message;
            toast.classList.add('active');

            setTimeout(() => {
                toast.classList.remove('active');
            }, 4000);
        }
    }

    // List of student demo offers (Persistent for the session)
    window.studentDemoOffers = [
        { name: 'CMA CGM', coords: [5.3650, 43.3130], role: 'Data Scientist' },
        { name: 'Airbus Helicopters', coords: [5.2150, 43.4360], role: 'Fullstack IA' },
        { name: 'Thales DIS', coords: [5.5500, 43.2800], role: 'Cybersecurity' }
    ];

    function updateMapWithResults(userPos = null) {
        // Fallback: Si userPos n'est pas fourni, on essaie de prendre la position globale connue
        if (!userPos && window.userLocation) {
            userPos = window.userLocation;
        }

        if (!window.studentDemoMap) return;

        // Clean up previous layers/sources
        const cleanup = (id) => {
            if (window.studentDemoMap.getLayer(id)) window.studentDemoMap.removeLayer(id);
            if (window.studentDemoMap.getSource(id)) window.studentDemoMap.removeSource(id);
        };
        ['student-offers-layer', 'student-lines-layer', 'student-user-point'].forEach(cleanup);
        ['student-offers-source', 'student-lines', 'student-user-source'].forEach(cleanup);

        // ONLY proceed if a CV has been uploaded (dropzone is hidden) OR results are visible
        const dropZone = document.getElementById('drop-zone');
        // Check both display style AND class for hidden state, or if we have results
        const hasResults = document.getElementById('cv-results-container')?.classList.contains('visible');
        const isCVUploaded = (dropZone && dropZone.style.display === 'none') || hasResults;

        if (!isCVUploaded) return;

        console.log("📍 Mise à jour de la carte avec les offres IA/France Travail...");
        const currentOffers = window.studentDemoOffers || [];

        // 1. Add Offers Source
        window.studentDemoMap.addSource('student-offers-source', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: currentOffers.map(o => ({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: o.coords },
                    properties: { name: o.name, role: o.role }
                }))
            }
        });

        // 2. Add Offers Layer (Styled for Match)
        window.studentDemoMap.addLayer({
            id: 'student-offers-layer',
            type: 'circle',
            source: 'student-offers-source',
            paint: {
                'circle-radius': 10,
                'circle-color': '#10b981', // Green for "Match"
                'circle-stroke-width': 3,
                'circle-stroke-color': 'rgba(16, 185, 129, 0.4)'
            }
        });

        // 3. Auto-fit bounds to show all offers
        if (currentOffers.length > 0) {
            const bounds = new maplibregl.LngLatBounds();
            currentOffers.forEach(o => bounds.extend(o.coords));
            if (userPos) bounds.extend(userPos);

            window.studentDemoMap.fitBounds(bounds, {
                padding: { top: 100, bottom: 300, left: 50, right: 350 }, // Padding for overlay UI
                maxZoom: 13,
                duration: 2000
            });
        }

        // 4. (Optional) User point and connecting lines
        if (userPos) {
            // Lines
            window.studentDemoMap.addSource('student-lines', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: currentOffers.map(o => ({
                        type: 'Feature',
                        geometry: { type: 'LineString', coordinates: [userPos, o.coords] }
                    }))
                }
            });

            window.studentDemoMap.addLayer({
                id: 'student-lines-layer',
                type: 'line',
                source: 'student-lines',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: {
                    'line-color': '#4f46e5', // Changement en Bleu plus visible
                    'line-width': 3,
                    'line-opacity': 0.8,
                    'line-dasharray': [1, 1] // Pointillés plus serrés
                },
                beforeId: 'student-offers-layer'
            });

            // User Point
            window.studentDemoMap.addSource('student-user-source', {
                type: 'geojson',
                data: { type: 'Feature', geometry: { type: 'Point', coordinates: userPos } }
            });

            window.studentDemoMap.addLayer({
                id: 'student-user-point',
                type: 'circle',
                source: 'student-user-source',
                paint: {
                    'circle-radius': 8,
                    'circle-color': '#4f46e5',
                    'circle-stroke-width': 4,
                    'circle-stroke-color': 'rgba(79, 70, 229, 0.3)'
                }
            });
        }

        // Popup logic
        const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });
        window.studentDemoMap.on('mouseenter', 'student-offers-layer', (e) => {
            window.studentDemoMap.getCanvas().style.cursor = 'pointer';
            const props = e.features[0].properties;
            popup.setLngLat(e.features[0].geometry.coordinates)
                .setHTML(`
                    <div style="padding: 10px; min-width: 150px;">
                        <strong style="color: #333; font-size: 14px;">${props.name}</strong>
                        <div style="color: #666; font-size: 11px; margin-top: 4px;">${props.role}</div>
                        <div style="margin-top: 6px; color: #10b981; font-weight: 700; font-size: 10px;">MATCH 98%</div>
                        <div style="display: flex; gap: 5px; margin-top: 10px;">
                            <div onclick="window.handleApplyFromMap('${props.name}')" style="flex: 1; color: white; background: #6366f1; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 6px; border-radius: 6px; text-align: center; cursor: pointer; transition: background 0.2s;">Analyser IA ✨</div>
                            <div onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${e.features[0].geometry.coordinates[1]},${e.features[0].geometry.coordinates[0]}', '_blank')" style="width: 30px; display: flex; align-items: center; justify-content: center; background: #e5e7eb; border-radius: 6px; cursor: pointer;">
                                📍
                            </div>
                        </div>
                    </div>
                `)
                .addTo(window.studentDemoMap);
        });

        window.studentDemoMap.on('mouseleave', 'student-offers-layer', () => {
            window.studentDemoMap.getCanvas().style.cursor = '';
            popup.remove();
        });

        // window.handleApplyFromMap is processed in ai_match_popup.js
    }

    // Expose functions globally for other scripts
    // ==========================================
    // AI CHATBOT LOGIC (PRO)
    // ==========================================
    // ==========================================
    // AI CHATBOT LOGIC (PRO) - Dynamic & Robust
    // ==========================================
    let activeOfferCtx = null;

    function addAiChatMessage(role, text) {
        const aiChatMessages = document.getElementById('chat-messages');
        if (!aiChatMessages) return;

        const msg = document.createElement('div');
        const isAssistant = role === 'assistant';

        msg.style.alignSelf = isAssistant ? 'flex-start' : 'flex-end';
        msg.style.background = isAssistant ? 'rgba(255,255,255,0.05)' : '#6366f1';
        msg.style.padding = '12px 18px';
        msg.style.borderRadius = '12px';
        if (isAssistant) msg.style.borderBottomLeftRadius = '2px';
        else msg.style.borderBottomRightRadius = '2px';
        msg.style.maxWidth = '85%';
        msg.style.fontSize = '14px';
        msg.style.color = isAssistant ? '#e2e8f0' : 'white';
        msg.style.lineHeight = '1.5';
        msg.style.boxShadow = isAssistant ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)';

        msg.innerHTML = text;
        aiChatMessages.appendChild(msg);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }

    async function sendAiChatMessage() {
        // Dynamic retrieval to avoid stale references
        const aiChatInput = document.getElementById('chat-input');
        const aiChatSendBtn = document.getElementById('chat-send-btn');

        if (!aiChatInput) return;

        const text = aiChatInput.value.trim();
        if (!text) return;

        addAiChatMessage('user', text);
        aiChatInput.value = '';
        aiChatInput.disabled = true;
        if (aiChatSendBtn) aiChatSendBtn.disabled = true;

        const contextPrompt = activeOfferCtx ?
            `[CONTEXTE: L'utilisateur regarde l'offre de ${activeOfferCtx.company} pour le poste de ${activeOfferCtx.role}. Description: ${activeOfferCtx.desc}] ` : "";

        const payload = {
            model: "llama3.2",
            messages: [
                { role: "system", content: "Tu es l'assistant NextStep, un expert en coaching carrière. Aide l'étudiant à comprendre l'offre et donne lui des conseils pour postuler. Sois concis et encourageant." },
                { role: "user", content: contextPrompt + text }
            ],
            temperature: 0.7,
            stream: false
        };

        try {
            const resp = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await resp.json();
            addAiChatMessage('assistant', data.choices[0].message.content);
        } catch (e) {
            console.error(e);
            addAiChatMessage('assistant', "Oups, je n'arrive pas à joindre le cerveau IA. Vérifiez que le backend tourne.");
        } finally {
            if (aiChatInput) {
                aiChatInput.disabled = false;
                aiChatInput.focus();
            }
            if (aiChatSendBtn) aiChatSendBtn.disabled = false;
        }
    }

    // Global Context Updater
    window.updateChatbotContext = function (offer) {
        activeOfferCtx = offer;
        const aiChatMessages = document.getElementById('chat-messages');
        if (aiChatMessages) {
            aiChatMessages.innerHTML = '';
            addAiChatMessage('assistant', `Bonjour ! Parlons de l'offre chez <strong>${offer.company}</strong> pour le poste de <strong>${offer.role}</strong>. <br><br>Comment puis-je vous aider ?`);
            document.getElementById('chat-input')?.focus();
        }
    };

    // Event Delegation for Chat Actions
    document.addEventListener('click', (e) => {
        const sendBtn = e.target.closest('#chat-send-btn');
        if (sendBtn) {
            console.log('Chat Send Clicked');
            sendAiChatMessage();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.target.id === 'chat-input' && e.key === 'Enter' && !e.shiftKey) {
            console.log('Chat Enter Pressed');
            e.preventDefault(); // Stop newline
            e.stopPropagation(); // Stop bubbling
            sendAiChatMessage();
        }
    });

    window.updateMapWithResults = updateMapWithResults;
    window.updateMockDataWithAI = updateMockDataWithAI;
    window.sendAiChatMessage = sendAiChatMessage; // Expose for inline script


    // Drag Search Control for Student Demo
    class StudentDragSearchControl {
        constructor() {
            this.fictiveNames = ["Lumina Tech", "Horizon Soft", "Cité Digitale", "Innova Lab", "Marseille Alternance", "Sud Développement", "Pôle Web 13"];
            this.fictiveOffers = ["Alternance Dev Mobile", "Alternance Chef de Projet", "Stage Web Design", "Contrat Pro Data", "Alternance CyberSec"];
        }

        onAdd(map) {
            this._map = map;
            this._container = document.createElement('div');
            this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';

            const button = document.createElement('button');
            button.className = 'maplibregl-ctrl-drag';
            button.type = 'button';
            button.title = 'Rechercher ici';
            button.onclick = () => this.toggleSearchMarker();

            this._container.appendChild(button);

            this.scanBtnContainer = document.createElement('div');
            this.scanBtnContainer.className = 'scan-btn-container';
            this.scanBtn = document.createElement('button');
            this.scanBtn.className = 'scan-btn';
            this.scanBtn.textContent = 'Scan Area';
            this.scanBtn.onclick = () => this.performScan();
            this.scanBtnContainer.appendChild(this.scanBtn);
            map.getContainer().appendChild(this.scanBtnContainer);

            return this._container;
        }

        onRemove() {
            if (this._container.parentNode) this._container.parentNode.removeChild(this._container);
            if (this.scanBtnContainer.parentNode) this.scanBtnContainer.parentNode.removeChild(this.scanBtnContainer);
            this._map = undefined;
        }

        toggleSearchMarker() {
            if (this.marker) {
                this.marker.remove();
                this.marker = null;
                if (this._map.getLayer('student-search-radius')) {
                    this._map.removeLayer('student-search-radius');
                    this._map.removeLayer('student-search-radius-outline');
                    this._map.removeSource('student-search-radius');
                }
                this.scanBtn.classList.remove('active');
                return;
            }

            const center = this._map.getCenter();
            const el = document.createElement('div');
            el.className = 'drag-marker';

            this.marker = new maplibregl.Marker({
                element: el,
                draggable: true,
                offset: [0, 0]
            })
                .setLngLat(center)
                .addTo(this._map);

            this.scanBtn.classList.add('active');
            this.marker.on('drag', () => this.updateSearch());
            this.updateSearch();
        }

        updateSearch() {
            const lngLat = this.marker.getLngLat();
            const radius = 500;
            const circleData = this.createGeoJSONCircle([lngLat.lng, lngLat.lat], radius / 1000);

            if (this._map.getSource('student-search-radius')) {
                this._map.getSource('student-search-radius').setData(circleData);
            } else {
                this._map.addSource('student-search-radius', { 'type': 'geojson', 'data': circleData });
                this._map.addLayer({
                    'id': 'student-search-radius',
                    'type': 'fill',
                    'source': 'student-search-radius',
                    'paint': { 'fill-color': '#FFFFFF', 'fill-opacity': 0.1 }
                });
                this._map.addLayer({
                    'id': 'student-search-radius-outline',
                    'type': 'line',
                    'source': 'student-search-radius',
                    'paint': { 'line-color': '#FFFFFF', 'line-width': 1.5, 'line-opacity': 0.5 }
                });
            }
        }

        performScan() {
            if (this.isScanning) return;
            this.isScanning = true;
            this.scanBtn.textContent = 'Scanning...';

            const center = this.marker.getLngLat();
            const maxRadius = 500;
            const duration = 2000;
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;

                if (progress <= 1) {
                    const currentRadius = maxRadius * progress;
                    const opacity = Math.sin(progress * Math.PI) * 0.3;
                    const circleData = this.createGeoJSONCircle([center.lng, center.lat], currentRadius / 1000);

                    if (this._map.getSource('student-search-radius')) {
                        this._map.getSource('student-search-radius').setData(circleData);
                        this._map.setPaintProperty('student-search-radius', 'fill-opacity', opacity);
                        this._map.setPaintProperty('student-search-radius-outline', 'line-opacity', opacity * 2);
                    }
                    requestAnimationFrame(animate);
                } else {
                    const finalCircle = this.createGeoJSONCircle([center.lng, center.lat], maxRadius / 1000);
                    if (this._map.getSource('student-search-radius')) {
                        this._map.getSource('student-search-radius').setData(finalCircle);
                        this._map.setPaintProperty('student-search-radius', 'fill-opacity', 0.1);
                        this._map.setPaintProperty('student-search-radius-outline', 'line-opacity', 0.5);
                    }
                    this.finishScan(center);
                }
            };
            animate();
        }

        finishScan(center) {
            const count = 1 + Math.floor(Math.random() * 2);
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * 0.003;
                const newCoords = [center.lng + Math.cos(angle) * dist, center.lat + Math.sin(angle) * dist];
                const name = this.fictiveNames[Math.floor(Math.random() * this.fictiveNames.length)];
                const offer = this.fictiveOffers[Math.floor(Math.random() * this.fictiveOffers.length)];

                const newCompany = {
                    name: `${name} (Détecté)`,
                    coords: newCoords,
                    role: offer
                };
                window.studentDemoOffers.push(newCompany);

                // Sync with sidebar data if active
                if (window.studentOffersData && window.applyFilters) {
                    window.studentOffersData.push({
                        company: newCompany.name,
                        role: newCompany.role,
                        img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop',
                        desc: `Opportunité détectée par l'IA dans votre zone de recherche.`,
                        req: "Matching sémantique en cours...",
                        distance: '< 500m',
                        contract: 'Alternance',
                        city: 'Zone Détectée',
                        isOpen: true,
                        score: 85 + Math.floor(Math.random() * 10)
                    });
                    window.applyFilters();
                }
            }
            updateMapWithResults(window.userLocation);
            showNotification(`${count} opportunités détectées via Pathfinder.`);

            this.isScanning = false;
            this.scanBtn.textContent = 'Scan Area';
        }

        createGeoJSONCircle(center, radiusInKm, points = 64) {
            const coords = { latitude: center[1], longitude: center[0] };
            const ret = [];
            const distanceX = radiusInKm / (111.32 * Math.cos(coords.latitude * Math.PI / 180));
            const distanceY = radiusInKm / 110.57;
            for (let i = 0; i < points; i++) {
                const theta = (i / points) * (2 * Math.PI);
                ret.push([coords.longitude + distanceX * Math.cos(theta), coords.latitude + distanceY * Math.sin(theta)]);
            }
            ret.push(ret[0]);
            return { 'type': 'Feature', 'geometry': { 'type': 'Polygon', 'coordinates': [ret] } };
        }
    }


    // Close Modal via Arrow
    const closeArrow = document.getElementById('close-student-demo-arrow');
    if (closeArrow) {
        closeArrow.addEventListener('click', () => {
            const modal = document.getElementById('student-demo-modal');
            if (modal) modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // AI Assistant Chat Logic (Main Page)

    // Helper to add suggestions
    function addSuggestions(questions) {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'chat-suggestions';

        questions.forEach(q => {
            const chip = document.createElement('div');
            chip.className = 'suggestion-chip';
            chip.textContent = q;
            chip.onclick = () => sendAiMessage(q);
            suggestionsDiv.appendChild(chip);
        });

        aiChatBody.appendChild(suggestionsDiv);
        aiChatBody.scrollTop = aiChatBody.scrollHeight;
    }

    // Initial Suggestions
    let hasInitializedSuggestions = false;

    if (aiOrb && aiPopup) {
        aiOrb.addEventListener('click', () => {
            aiPopup.classList.add('active');
            if (!hasInitializedSuggestions) {
                setTimeout(() => {
                    addSuggestions([
                        '🔎 Trouver une alternance',
                        '📢 Recruter des talents',
                        '🚀 Démo Live',
                        '💡 En savoir plus'
                    ]);
                }, 500);
                hasInitializedSuggestions = true;
            }
        });
    }

    if (closeAiChat && aiPopup) {
        closeAiChat.addEventListener('click', (e) => {
            e.stopPropagation();
            aiPopup.classList.remove('active');
        });
    }

    function sendAiMessage(msgText) {
        if (!msgText) return;

        const text = msgText;
        const lowerText = text.toLowerCase();

        // Clear previous suggestions for a cleaner look
        const oldSuggestions = aiChatBody.querySelectorAll('.chat-suggestions');
        oldSuggestions.forEach(el => el.remove());

        // Display User Message
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user';
        userMsg.textContent = text;
        aiChatBody.appendChild(userMsg);

        aiChatBody.scrollTop = aiChatBody.scrollHeight;

        // Smart Response Logic
        let response = "Désolé, je n'ai pas compris. Voulez-vous revenir au menu ?";
        let nextSuggestions = ['🔙 Menu Principal'];

        // --- BRANCH: ETUDIANT / ALTERNANCE ---
        if (lowerText.includes('trouver une alternance') || lowerText.includes('étudiant')) {
            response = "Excellente initiative ! NextStep utilise une IA pour analyser votre CV et vous placer directement sur notre carte interactive (Pathfinder).";
            nextSuggestions = ['📤 Comment déposer mon CV ?', '🗺️ Voir la carte des offres', '🔙 Menu Principal'];
        }
        else if (lowerText.includes('déposer mon CV') || lowerText.includes('upload')) {
            response = "C'est simple : cliquez sur 'Commencer' ou ouvrez le panneau latéral. Glissez votre PDF, et notre IA extraira vos compétences en 3 secondes.";
            nextSuggestions = ['🚀 Lancer la démo', '🔙 Menu Principal'];
        }
        else if (lowerText.includes('voir la carte') || lowerText.includes('pathfinder')) {
            response = "Le Pathfinder est notre outil unique. Il géolocalise les entreprises qui recrutent AUTOUR de vous. Fini les recherches par ville générique !";
            nextSuggestions = ['🚀 Voir ça en vrai (Démo)', '🔙 Menu Principal'];
        }

        // --- BRANCH: RECRUTEUR ---
        else if (lowerText.includes('recruter') || lowerText.includes('talents')) {
            response = "NextStep permet aux recruteurs de cibler des profils qualifiés grâce au matching sémantique. Publiez une offre, recevez le Top 10 des candidats.";
            nextSuggestions = ['💶 Tarifs & Plans', '✍️ Publier une offre', '🔙 Menu Principal'];
        }
        else if (lowerText.includes('tarifs')) {
            response = "Nous avons une offre 'Pay-per-Match' ou un abonnement illimité pour les grands groupes. Le premier mois est offert pour tester le matching.";
            nextSuggestions = ['📞 Parler à un commercial', '🔙 Menu Principal'];
        }
        else if (lowerText.includes('publier une offre')) {
            response = "L'interface recruteur est en cours de maintenance pour mise à jour. Vous pouvez tester la vue candidat via la démo !";
            nextSuggestions = ['🚀 Voir la démo', '🔙 Menu Principal'];
        }

        // --- BRANCH: DEMO ---
        else if (lowerText.includes('démo') || lowerText.includes('demo')) {
            response = "La démo interactive vous plonge dans l'expérience NextStep. Vous manipulerez la carte et l'assistant IA comme si vous y étiez.";
            nextSuggestions = ['✅ Lancer la démo maintenant', '❓ Qu\'est-ce que je vais voir ?', '🔙 Menu Principal'];
        }
        else if (lowerText.includes('lancer la démo maintenant')) {
            const demoBtn = document.getElementById('btn-demo');
            if (demoBtn) demoBtn.click();
            response = "C'est parti ! Ouverture de l'interface de démonstration...";
            nextSuggestions = [];
        }
        else if (lowerText.includes('vais voir')) {
            response = "Vous verrez le 'Pathfinder' (la carte), le panneau latéral d'analyse IA et pourrez simuler un upload de CV.";
            nextSuggestions = ['✅ Go ! Lancer la démo', '🔙 Menu Principal'];
        }

        // --- BRANCH: INFO / GENERAL ---
        else if (lowerText.includes('savoir plus') || lowerText.includes('propos')) {
            response = "NextStep est la première plateforme de recrutement 'Géo-Sémantique'. Nous utilisons l'IA pour relier les compétences (CV) aux lieux (Carte).";
            nextSuggestions = ['🤖 Comment marche l\'IA ?', '📞 Nous contacter', '🔙 Menu Principal'];
        }
        else if (lowerText.includes('marche l\'ia')) {
            response = "Notre IA 'VectorSearch' lit le contenu des PDF, comprend les synonymes (ex: 'JS' = 'Javascript') et calcule un score de compatibilité avec les offres.";
            nextSuggestions = ['🤓 Impressionnant !', '🔙 Menu Principal'];
        }
        else if (lowerText.includes('contact')) {
            response = "Envoyez-nous un mail à hello@nextstep.ai ou rejoignez notre Discord communautaire.";
            nextSuggestions = ['🔙 Menu Principal'];
        }

        // --- FALLBACK / MENU ---
        else if (lowerText.includes('menu') || lowerText.includes('retour')) {
            response = "Retour au menu principal. Quelle est votre priorité ?";
            nextSuggestions = [
                '🔎 Trouver une alternance',
                '📢 Recruter des talents',
                '🚀 Démo Live',
                '💡 En savoir plus'
            ];
        }

        // Bot typing simulation
        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-message bot';
            botMsg.textContent = response;
            aiChatBody.appendChild(botMsg);

            if (nextSuggestions.length > 0) {
                addSuggestions(nextSuggestions);
            }

            aiChatBody.scrollTop = aiChatBody.scrollHeight;
        }, 600);
    }

    // ========================================
    // CV Analysis Popup Function
    // ========================================

    function showCVAnalysisPopup(data, isSuccess, errorMessage = '') {
        const popupRoot = document.getElementById('cv-analysis-popup');

        if (!popupRoot) {
            console.error("Root #cv-analysis-popup not found");
            return;
        }

        // --- STYLES PREMIUM (Unifié - Bloc Unique) ---
        const premiumStyles = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

                .premium-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.4); /* Fond léger et discret */
                    z-index: 1; 
                }

                .premium-popup-root {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    display: flex; align-items: center; justify-content: center;
                    z-index: 10001;
                    pointer-events: none; /* Permet de cliquer à travers si besoin, mais le container aura pointer-events: auto */
                }

                .premium-popup-container {
                    background: #09090b; /* Noir/Gris très foncé */
                    color: #fff;
                    font-family: 'Outfit', sans-serif;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.9);
                    border-radius: 24px;
                    overflow: hidden;
                    width: 90%; max-width: 550px;
                    pointer-events: auto;
                    animation: popupZoom 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                }

                @keyframes popupZoom {
                    from { transform: scale(0.92); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                .analysis-header {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 35px 35px 15px 35px;
                    background: linear-gradient(to bottom, rgba(255,255,255,0.02), transparent);
                }

                .score-circle {
                    width: 72px; height: 72px;
                    border-radius: 50%;
                    background: conic-gradient(#10b981 var(--score-deg), rgba(255,255,255,0.05) 0deg);
                    display: flex; align-items: center; justify-content: center;
                    position: relative;
                }
                .score-circle::before {
                    content: ''; position: absolute; width: 62px; height: 62px; border-radius: 50%; background: #09090b; /* Match fond */
                }
                .score-value { position: relative; font-size: 24px; font-weight: 800; color: #10b981; }

                .analysis-body { padding: 10px 35px 35px 35px; }
                .candidate-info h3 { margin: 0; font-size: 24px; font-weight: 700; color: white; }
                .candidate-info p { margin: 5px 0 0; color: #94a3b8; font-size: 14px; }

                .coach-review {
                    margin: 25px 0; font-size: 15px; line-height: 1.6; color: #cbd5e1;
                    padding: 15px 20px; background: rgba(16, 185, 129, 0.05);
                    border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.1);
                    font-style: italic;
                }

                .feedback-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 25px; }
                .feedback-col h4 {
                    font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;
                    margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
                }
                .feedback-list li {
                    margin-bottom: 8px; font-size: 13px; color: #e2e8f0;
                    display: flex; align-items: start; gap: 8px; line-height: 1.4;
                }
                
                .btn-premium {
                    background: #10b981; color: white; border: none; width: 100%; padding: 16px;
                    border-radius: 12px; font-weight: 700; font-size: 15px; cursor: pointer; margin-top: 30px;
                    transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .btn-premium:hover { background: #059669; transform: translateY(-1px); }
                
                .skills-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
                .chip {
                    background: rgba(255,255,255,0.06); color: #cbd5e1;
                    padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500;
                }

                .close-icon-btn {
                    position: absolute; top: 20px; right: 20px; width: 32px; height: 32px;
                    border-radius: 50%; background: rgba(255,255,255,0.05); color: #94a3b8;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: all 0.2s; border: none; font-size: 16px;
                }
                .close-icon-btn:hover { background: rgba(255,255,255,0.1); color: white; }
            </style>
        `;

        // Nettoyage radical
        popupRoot.innerHTML = '';
        popupRoot.className = '';

        if (isSuccess && data) {
            const score = data.score || Math.floor(Math.random() * (95 - 75) + 75);
            const scoreDeg = (score / 100) * 360;
            const review = data.review || "Profil solide. Quelques ajustements sur la mise en forme permettraient de mieux valoriser vos acquis.";
            const qualities = (data.qualities && data.qualities.length) ? data.qualities : ["Expérience", "Compétences Tech", "Clarté"];
            const flaws = (data.flaws && data.flaws.length) ? data.flaws : ["Anglais manquant", "Manque de chiffres", "Sobriété"];

            popupRoot.innerHTML = `
                ${premiumStyles}
                <div class="premium-popup-root">
                    <div class="premium-overlay" onclick="document.getElementById('cv-analysis-popup').classList.add('hidden')"></div>
                    
                    <div class="premium-popup-container">
                        <button class="close-icon-btn" onclick="document.getElementById('cv-analysis-popup').classList.add('hidden')">
                            <i class="fa-solid fa-xmark"></i>
                        </button>

                        <div class="analysis-header">
                            <div>
                                <div style="text-transform:uppercase; font-size:10px; letter-spacing:2px; color:#10b981; font-weight:800; margin-bottom:6px;">Diagnostic IA</div>
                                <div class="candidate-info">
                                    <h3>${data.name || 'Candidat'}</h3>
                                    <p>${data.role || 'Poste non identifié'} • ${data.location || 'Localisation inconnue'}</p>
                                </div>
                            </div>
                            <div>
                                <div class="score-circle" style="--score-deg: ${scoreDeg}deg;">
                                    <span class="score-value">${score}</span>
                                </div>
                            </div>
                        </div>

                        <div class="analysis-body">
                            <div class="skills-chips">
                                ${(data.skills || []).slice(0, 5).map(s => `<span class="chip">${s}</span>`).join('')}
                            </div>

                            <div class="coach-review">
                                <i class="fa-solid fa-quote-left" style="color:#10b981; margin-right:8px; opacity:0.6;"></i>
                                ${review}
                            </div>

                            <div class="feedback-grid">
                                <div class="feedback-col">
                                    <h4 style="color:#34d399;"><i class="fa-solid fa-thumbs-up"></i> Points Forts</h4>
                                    <ul class="feedback-list">
                                        ${qualities.slice(0, 3).map(q => `<li><span>${q}</span></li>`).join('')}
                                    </ul>
                                </div>
                                <div class="feedback-col">
                                    <h4 style="color:#f87171;"><i class="fa-solid fa-triangle-exclamation"></i> Vigilance</h4>
                                    <ul class="feedback-list">
                                        ${flaws.slice(0, 3).map(f => `<li><span>${f}</span></li>`).join('')}
                                    </ul>
                                </div>
                            </div>

                            <button class="btn-premium" onclick="document.getElementById('cv-analysis-popup').classList.add('hidden')">
                                Voir les offres correspondantes <i class="fa-solid fa-arrow-right" style="margin-left:8px;"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            popupRoot.innerHTML = `
                ${premiumStyles}
                <div class="premium-popup-root">
                    <div class="premium-overlay" onclick="document.getElementById('cv-analysis-popup').classList.add('hidden')"></div>
                    <div class="premium-popup-container" style="text-align: center; padding: 40px;">
                        <button class="close-icon-btn" onclick="document.getElementById('cv-analysis-popup').classList.add('hidden')"><i class="fa-solid fa-xmark"></i></button>
                        <div style="width: 60px; height: 60px; background: rgba(248, 113, 113, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                            <i class="fa-solid fa-bug" style="color: #f87171; font-size: 24px;"></i>
                        </div>
                        <h3 style="margin: 0 0 10px; font-size: 20px;">Erreur d'analyse</h3>
                        <p style="opacity: 0.7; margin-bottom: 25px; font-size: 14px;">${errorMessage || "Impossible de joindre l'IA."}</p>
                        <button class="btn-premium" style="background: rgba(255,255,255,0.1); margin-top:0;" onclick="document.getElementById('cv-analysis-popup').classList.add('hidden')">Fermer</button>
                    </div>
                </div>
            `;
        }

        popupRoot.classList.remove('hidden');
    }


    // Listeners for input removed since input is gone
});
