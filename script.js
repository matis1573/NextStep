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

                    if (studentModal) {
                        studentModal.style.display = 'flex';
                        setTimeout(() => studentModal.classList.add('active'), 10);

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

                                // Initial State: Blurred with Popup
                                mapContainer.classList.add('map-blur');
                                if (locationOverlay) locationOverlay.classList.remove('hidden');

                                // Lock Drop Zone until location is handled
                                if (dropZone) {
                                    dropZone.style.pointerEvents = 'none';
                                    dropZone.style.opacity = '0.3';
                                    dropZone.classList.add('locked'); // Optional CSS hook
                                }

                                // Handle Location Permission
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

                                                    window.studentDemoMap.flyTo({
                                                        center: [longitude, latitude],
                                                        zoom: 12,
                                                        speed: 1.5,
                                                        curve: 1.42
                                                    });
                                                    // Unlock interface
                                                    mapContainer.classList.remove('map-blur');
                                                    if (locationOverlay) locationOverlay.classList.add('hidden');
                                                    unlockDropZone();
                                                    showNotification('Position mise à jour avec succès.');
                                                },
                                                (error) => {
                                                    // Handle error but unlock anyway
                                                    console.warn("Geolocation error:", error);
                                                    mapContainer.classList.remove('map-blur');
                                                    if (locationOverlay) locationOverlay.classList.add('hidden');
                                                    unlockDropZone();
                                                }
                                            );
                                        } else {
                                            mapContainer.classList.remove('map-blur');
                                            if (locationOverlay) locationOverlay.classList.add('hidden');
                                            unlockDropZone();
                                        }
                                    };
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

    function handleCVUpload(file) {
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
                <span style="color: white; font-size: 0.9rem; font-weight: 500;">Analyse de ${file.name}...</span>
            </div>
        `;

        // Simulate AI Processing
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
                // Re-bind click listener since innerHTML was replaced
                dropZone.querySelector('.pdf-drop-zone') || document.getElementById('drop-zone').addEventListener('click', () => document.getElementById('cv-upload').click());
            });

            // Start scanning effect on the map (visual flair)
            const mapOverlay = document.getElementById('map-scan-overlay');
            if (mapOverlay) {
                mapOverlay.classList.remove('hidden');
                setTimeout(() => {
                    mapOverlay.classList.add('hidden');
                    // Show results after map scan
                    displayMockResults();
                    // Refocus and draw connections if location exists
                    if (window.userLocation) {
                        updateMapWithResults(window.userLocation);
                    } else {
                        updateMapWithResults();
                    }
                }, 4500);
            }
        }, 2500);
    }

    function displayMockResults() {
        const resultsContainer = document.getElementById('cv-results-container');
        if (!resultsContainer) return;

        // Show container with animation
        resultsContainer.classList.remove('hidden');
        setTimeout(() => {
            resultsContainer.classList.add('visible');
        }, 100);

        // Source of truth for enriched data
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

        window.renderOffers = function (offers) {
            const offersList = document.getElementById('offers-list');
            if (!offersList) return;
            offersList.innerHTML = '';
            offers.forEach((offer, index) => {
                const item = document.createElement('div');
                item.className = 'offer-item';

                const statusColor = offer.isOpen ? '#4ade80' : '#f87171';
                const statusText = offer.isOpen ? 'Ouvert' : 'Fermé';

                item.innerHTML = `
                    <div class="offer-avatar" style="background-image: url('${offer.img}')"></div>
                    <div class="offer-details">
                        <span class="offer-company">${offer.company}</span>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="offer-role">${offer.role}</span>
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
                        document.getElementById('detail-logo').style.backgroundImage = `url('${offer.img}')`;
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

        function initCustomDropdowns() {
            const dropdowns = document.querySelectorAll('.custom-dropdown');

            dropdowns.forEach(dropdown => {
                const trigger = dropdown.querySelector('.dropdown-trigger');
                const label = trigger.querySelector('.trigger-label');
                const options = dropdown.querySelectorAll('.option');

                // Toggle visibility
                trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Close others
                    dropdowns.forEach(d => { if (d !== dropdown) d.classList.remove('active'); });
                    dropdown.classList.toggle('active');
                });

                // Handle option selection
                options.forEach(option => {
                    option.addEventListener('click', (e) => {
                        e.stopPropagation();
                        options.forEach(opt => opt.classList.remove('selected'));
                        option.classList.add('selected');

                        label.textContent = option.textContent;
                        dropdown.classList.remove('active');

                        applyFilters();
                    });
                });
            });

            // Close when clicking elsewhere
            window.addEventListener('click', () => {
                dropdowns.forEach(d => d.classList.remove('active'));
            });
        }

        // Initialize custom UI
        initCustomDropdowns();

        // Initial apply
        applyFilters();

        // Tab Switching Logic
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

        // Close Detail Popup Logic
        const closeDetail = document.getElementById('close-company-detail');
        if (closeDetail) {
            closeDetail.addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('company-detail-popup').classList.add('hidden');
            });
        }

        // Also close on background click
        const detailPopupOverlay = document.getElementById('company-detail-popup');
        if (detailPopupOverlay) {
            detailPopupOverlay.addEventListener('click', (e) => {
                if (e.target === detailPopupOverlay) {
                    detailPopupOverlay.classList.add('hidden');
                }
            });
        }

        // Optional: Hide the drop zone to focus on results
        if (dropZone) dropZone.style.display = 'none';

        // Show Success Notification
        showNotification('3 opportunités trouvées à Marseille.');

        // Update map with results & Zoom to Marseille
        updateMapWithResults();

        // Update reset logic to handle results
        const resetBtn = document.getElementById('reset-upload');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                resultsContainer.classList.remove('visible');
                setTimeout(() => {
                    resultsContainer.classList.add('hidden');
                }, 600);
                dropZone.style.display = 'flex';
                // Reset map zoom
                if (window.studentDemoMap) {
                    window.studentDemoMap.flyTo({ center: [2.2137, 46.2276], zoom: 5.5, duration: 2000 });
                }
            });
        }
    }

    function showNotification(message) {
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
        if (!window.studentDemoMap) return;

        // Clean up previous layers/sources
        const cleanup = (id) => {
            if (window.studentDemoMap.getLayer(id)) window.studentDemoMap.removeLayer(id);
            if (window.studentDemoMap.getSource(id)) window.studentDemoMap.removeSource(id);
        };
        ['student-offers-layer', 'student-lines-layer', 'student-user-point'].forEach(cleanup);
        ['student-offers-source', 'student-lines', 'student-user-source'].forEach(cleanup);

        const currentOffers = window.studentDemoOffers;

        // Zoom to either user or Marseille
        const marseilleCoords = [5.3698, 43.2965];
        const centerCoords = userPos ? userPos : marseilleCoords;

        window.studentDemoMap.flyTo({
            center: centerCoords,
            zoom: 11,
            essential: true,
            duration: 3500
        });

        // Add Offers Source
        window.studentDemoMap.addSource('student-offers-source', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': currentOffers.map((loc, i) => ({
                    'type': 'Feature',
                    'geometry': { 'type': 'Point', 'coordinates': loc.coords },
                    'properties': { 'id': i, 'name': loc.name, 'role': loc.role }
                }))
            }
        });

        // Layer: Company Points (White circles)
        window.studentDemoMap.addLayer({
            'id': 'student-offers-layer',
            'type': 'circle',
            'source': 'student-offers-source',
            'paint': {
                'circle-radius': 6,
                'circle-color': '#ffffff',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#000000',
                'circle-opacity': 1,
                'circle-stroke-opacity': 0.5
            }
        });

        if (userPos) {
            window.studentDemoMap.addSource('student-user-source', {
                'type': 'geojson',
                'data': { 'type': 'Feature', 'geometry': { 'type': 'Point', 'coordinates': userPos } }
            });

            window.studentDemoMap.addSource('student-lines', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': currentOffers.map(loc => ({
                        'type': 'Feature',
                        'geometry': { 'type': 'LineString', 'coordinates': [userPos, loc.coords] }
                    }))
                }
            });

            window.studentDemoMap.addLayer({
                'id': 'student-lines-layer',
                'type': 'line',
                'source': 'student-lines',
                'layout': { 'line-join': 'round', 'line-cap': 'round' },
                'paint': {
                    'line-color': '#ffffff',
                    'line-width': 2,
                    'line-dasharray': [3, 4],
                    'line-opacity': 0.4
                }
            });

            window.studentDemoMap.addLayer({
                'id': 'student-user-point',
                'type': 'circle',
                'source': 'student-user-source',
                'paint': {
                    'circle-radius': 8,
                    'circle-color': '#ffffff',
                    'circle-stroke-width': 3,
                    'circle-stroke-color': 'rgba(255, 255, 255, 0.3)'
                }
            });
        }

        window.studentDemoMap.on('click', 'student-offers-layer', (e) => {
            const props = e.features[0].properties;
            new maplibregl.Popup({ offset: 10, className: 'premium-popup' })
                .setLngLat(e.lngLat)
                .setHTML(`
                    <div style="padding: 10px; min-width: 150px;">
                        <strong style="color: white; font-size: 14px;">${props.name}</strong>
                        <div style="color: rgba(255,255,255,0.6); font-size: 11px; margin-top: 4px;">${props.role}</div>
                        <div style="margin-top: 10px; color: #ffffff; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Postuler via IA</div>
                    </div>
                `)
                .addTo(window.studentDemoMap);
        });

        window.studentDemoMap.on('mouseenter', 'student-offers-layer', () => window.studentDemoMap.getCanvas().style.cursor = 'pointer');
        window.studentDemoMap.on('mouseleave', 'student-offers-layer', () => window.studentDemoMap.getCanvas().style.cursor = '');
    }

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
    // Student AI Assistant Logic
    const studentAiTrigger = document.getElementById('student-ai-trigger');
    const studentAiModal = document.getElementById('student-ai-modal');
    const closeStudentAi = document.getElementById('close-student-ai');
    const studentAiInput = document.getElementById('student-ai-input');
    const studentAiBackdrop = document.getElementById('student-ai-backdrop');
    const sendStudentAi = document.getElementById('send-student-ai');
    const studentAiBody = document.getElementById('student-ai-body');
    const studentMapContainer = document.getElementById('student-demo-map');

    if (studentAiTrigger && studentAiModal) {
        studentAiTrigger.addEventListener('click', () => {
            studentAiModal.classList.remove('hidden');
            studentMapContainer.classList.add('map-blur');
            setTimeout(() => {
                const card = studentAiModal.querySelector('.ai-chat-card-inner');
                if (card) {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }
            }, 50);
        });
    }

    if (closeStudentAi && studentAiModal) {
        closeStudentAi.addEventListener('click', () => {
            const card = studentAiModal.querySelector('.ai-chat-card-inner');
            if (card) {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
            }
            setTimeout(() => {
                studentAiModal.classList.add('hidden');
                studentMapContainer.classList.remove('map-blur');
            }, 400);
        });
    }

    // Input Synchronization for Highlighting
    if (studentAiInput && studentAiBackdrop) {
        studentAiInput.addEventListener('input', () => {
            const text = studentAiInput.value;
            const offers = window.studentDemoOffers || [];

            // Mirror text with highlights
            const highlighted = text.replace(/@([A-Za-z0-9\(\)]+)/g, (match, name) => {
                const cleanName = name.toLowerCase();
                const exists = offers.some(o => {
                    const words = o.name.toLowerCase().split(' ');
                    return words.some(w => w.startsWith(cleanName) || cleanName.startsWith(w));
                });
                const color = exists ? '#3b82f6' : 'white';
                return `<span style="color: ${color}; font-weight: 700;">@${name}</span>`;
            });

            // Replace trailing space for alignment
            studentAiBackdrop.innerHTML = highlighted.replace(/\s$/g, '&nbsp;') + (text.endsWith(' ') ? '' : '');

            // Change input color to transparent to show backdrop, but keep caret
            studentAiInput.style.color = 'transparent';
            studentAiBackdrop.style.color = 'white';
        });

        // Sync scroll if needed (though single line)
        studentAiInput.addEventListener('scroll', () => {
            studentAiBackdrop.scrollLeft = studentAiInput.scrollLeft;
        });
    }

    function addStudentChatMessage(text, isUser = false) {
        const msg = document.createElement('div');
        msg.className = isUser ? 'user-msg' : 'bot-msg';
        msg.style.cssText = isUser
            ? 'background: white; color: black; padding: 12px 16px; border-radius: 12px 12px 0 12px; align-self: flex-end; max-width: 85%; font-size: 14px; line-height: 1.5; box-shadow: 0 4px 15px rgba(255,255,255,0.1);'
            : 'background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 12px 12px 12px 0; color: white; align-self: flex-start; max-width: 85%; font-size: 14px; line-height: 1.5;';

        // Revised Regex: captures everything after @ until a space or punctuation
        const mentionRegex = /@([A-Za-z0-9\(\)]+)/g;

        if (text.includes('@')) {
            const offers = window.studentDemoOffers || [];
            msg.innerHTML = text.replace(mentionRegex, (match, name) => {
                const cleanName = name.toLowerCase();
                // Check if the captured "word" is part of any known company name
                const exists = offers.some(o => {
                    const companyWords = o.name.toLowerCase().split(' ');
                    return companyWords.some(word => word.startsWith(cleanName) || cleanName.startsWith(word));
                });

                const color = exists ? '#3b82f6' : '#ffffff';
                return `<span style="color: ${color}; font-weight: 700;">@${name}</span>`;
            });
        } else {
            msg.textContent = text;
        }

        studentAiBody.appendChild(msg);
        studentAiBody.scrollTop = studentAiBody.scrollHeight;
    }

    if (sendStudentAi && studentAiInput) {
        const handleSend = () => {
            const text = studentAiInput.value.trim();
            if (!text) return;

            addStudentChatMessage(text, true);
            studentAiInput.value = '';
            if (studentAiBackdrop) studentAiBackdrop.innerHTML = '';
            studentAiInput.style.color = 'white'; // Reset to white when empty

            setTimeout(() => {
                let response = "Je suis ton assistant NextStep. Je peux t'aider à trouver une alternance ou à utiliser le Pathfinder. Que souhaites-tu savoir ?";
                const lower = text.toLowerCase();

                // Detect company mention (stop at space)
                const mentionMatch = text.match(/@([A-Za-z0-9\(\)]+)/);
                if (mentionMatch) {
                    const mentionName = mentionMatch[1].toLowerCase();
                    const companyObj = (window.studentDemoOffers || []).find(o => {
                        const companyWords = o.name.toLowerCase().split(' ');
                        return companyWords.some(word => word.startsWith(mentionName) || mentionName.startsWith(word));
                    });

                    if (companyObj) {
                        response = `Ah, l'entreprise **${companyObj.name}** ! Actuellement, leur département ${companyObj.role} est très actif. Leurs bureaux sont ouverts du lundi au vendredi, de 9h à 18h. Ils privilégient les candidatures via notre plateforme IA Pathfinder !`;
                    } else {
                        response = `Je ne trouve pas d'entreprise correspondant à "**${mentionMatch[1]}**" sur notre carte pour le moment, mais je peux scanner la zone avec le Pathfinder si tu veux !`;
                    }
                } else if (lower.includes('pathfinder') || lower.includes('rayon') || lower.includes('scan')) {
                    response = "Le Pathfinder est notre outil exclusif qui scanne les entreprises autour de toi. Tu peux l'activer via l'icône de boussole en haut à droite !";
                } else if (lower.includes('cv') || lower.includes('analyse')) {
                    response = "Dépose ton CV dans le panneau de gauche pour que je puisse analyser ton profil et te proposer les meilleures offres sur cette carte.";
                } else if (lower.includes('bonjour') || lower.includes('salut')) {
                    response = "Bonjour ! Prêt à trouver ton alternance idéale ? Dis-moi quel domaine t'intéresse ou mentionne une entreprise avec @ !";
                }

                addStudentChatMessage(response, false);
            }, 1000);
        };

        sendStudentAi.onclick = handleSend;
        studentAiInput.onkeypress = (e) => {
            if (e.key === 'Enter') handleSend();
        };
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
    // Listeners for input removed since input is gone
});
