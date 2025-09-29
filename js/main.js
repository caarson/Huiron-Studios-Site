// Main JavaScript for Huiron Studios Website

// Game configuration with universe ID
const gameConfig = {
    "games": [
        {
            "name": "Papap Dol Game [UPDATE]",
            "universeId": 7825866998,
            "image": "https://i.ibb.co/pj7QS979/noFilter.webp",
            "url": "https://www.roblox.com/games/112018694278029/Papap-Dol-Game-UPDATE"
        },
        {
            "name": "100 Player Troll Tower",
            "universeId": 7841567199,
            "image": "https://i.ibb.co/mrrHHPHJ/noFilter.webp",
            "url": "https://www.roblox.com/games/127123367172919/100-Player-Troll-Tower"
        },
        {
            "name": "Pranking Tower",
            "universeId": 7688903077,
            "image": "https://i.ibb.co/Zp8YXJG2/noFilter.webp",
            "url": "https://www.roblox.com/games/78579013365632/Pranking-Tower"
        },
        {
            "name": "Escape Creepy Teacher OBBY",
            "universeId": 6683527149,
            "image": "https://i.ibb.co/1cb0G3N/noFilter.webp",
            "url": "https://www.roblox.com/games/98955567405284/Escape-Creepy-Teacher-OBBY"
        },
        {
            "name": "Troll Others Tower",
            "universeId": 7567817880,
            "image": "https://i.ibb.co/rKfB4z6N/noFilter.webp",
            "url": "https://www.roblox.com/games/80301995412912/Troll-Others-Tower"
        },
        {
            "name": "[UPD🔥] Steal a Brawler",
            "universeId": 2569475263,
            "image": "https://i.ibb.co/GwdM9Xp/noFilter.webp",
            "url": "https://www.roblox.com/games/6776378574/UPD-Steal-a-Brawler"
        },
        {
            "name": "An Average Tycoon",
            "universeId": 2748312481,
            "image": "https://i.ibb.co/Xf5tXSnD/noFilter.webp",
            "url": "https://www.roblox.com/games/7106657586/An-Average-Tycoon-Patch"
        }
    ]
};

// Function to format numbers with K/M suffixes
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Function to fetch stats from backend API
async function fetchStats() {
    try {
        const universeIds = gameConfig.games.map(game => game.universeId).join(',');
        
        const response = await fetch(`/stats/${universeIds}`);
        
        if (response.ok) {
            const data = await response.json();
            
            // Update overall stats counters
            document.getElementById('visits-counter').textContent = formatNumber(data.allVisits);
            document.getElementById('players-counter').textContent = formatNumber(data.allPlaying);
            document.getElementById('games-counter').textContent = gameConfig.games.length;
            
            // Update individual game stats and regenerate game cards
            updateGameCards(data.games);
            
            console.log('Stats updated successfully!');
        } else {
            throw new Error('Failed to fetch stats from backend');
        }
        
    } catch (error) {
        console.error('Error fetching stats:', error);
        console.log('Using fallback stats...');
        
        // Use fallback data if API fails
        const fallbackData = {
            allVisits: 98200,
            allPlaying: 1256,
            games: gameConfig.games.map((game, index) => ({
                id: game.universeId,
                visits: Math.floor(Math.random() * 20000) + 5000,
                playing: Math.floor(Math.random() * 500) + 50
            }))
        };
        
        document.getElementById('visits-counter').textContent = formatNumber(fallbackData.allVisits);
        document.getElementById('players-counter').textContent = formatNumber(fallbackData.allPlaying);
        document.getElementById('games-counter').textContent = gameConfig.games.length;
        
        updateGameCards(fallbackData.games);
    }
}

// Function to update game cards with real stats
function updateGameCards(gameStats) {
    const gamesContainer = document.querySelector('#games-container');
    if (!gamesContainer) return;
    
    // Clear existing game cards
    gamesContainer.innerHTML = '';
    
    // Create new game cards with real stats
    gameConfig.games.forEach(game => {
        const stats = gameStats.find(stat => stat.id === game.universeId) || { visits: 0, playing: 0 };
        
        // Determine game category for filtering
        let category = 'adventure';
        if (game.name.includes('Tower') || game.name.includes('Troll')) {
            category = 'tower';
        } else if (game.name.includes('Tycoon')) {
            category = 'tycoon';
        }
        
        // Get local image path
        const localImage = getLocalImagePath(game.name);
        const gameImage = localImage || game.image;
        
        const gameCard = document.createElement('div');
        gameCard.className = `group relative bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-3xl p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 game-card`;
        gameCard.setAttribute('data-category', category);
        gameCard.innerHTML = `
            <div class="absolute -top-4 -right-4 w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center opacity-80 group-hover:scale-110 transition-transform overflow-hidden">
                <img src="${gameImage}" alt="${game.name}" class="w-full h-full object-cover">
            </div>
            <div class="mb-4">
                <h3 class="text-xl md:text-2xl font-bold text-white mb-3">${game.name}</h3>
                <div class="w-12 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mb-3"></div>
                <p class="text-gray-300 leading-relaxed text-sm">
                    ${getGameDescription(game.name)}
                </p>
            </div>
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <span class="text-purple-300 font-medium text-sm">Active Players</span>
                    <span class="text-white font-bold">${formatNumber(stats.playing)}+</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-blue-300 font-medium text-sm">Total Visits</span>
                    <span class="text-white font-bold">${formatNumber(stats.visits)}+</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-pink-300 font-medium text-sm">Rating</span>
                    <span class="text-white font-bold">${getGameRating(stats.visits, stats.playing)}</span>
                </div>
            </div>
            <div class="mt-6 pt-6 border-t border-purple-500/30">
                <div class="flex flex-wrap gap-2">
                    ${getGameTags(game.name)}
                </div>
                <div class="mt-4">
                    <a href="${game.url}" 
                       target="_blank" 
                       class="inline-flex items-center justify-center w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg hover:shadow-xl group">
                        <i class="fas fa-play mr-2"></i>Play Now
                        <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                </div>
            </div>
        `;
        
        gamesContainer.appendChild(gameCard);
    });

    // Setup filter functionality
    setupGameFilters();
}

// Helper function to get local image path
function getLocalImagePath(gameName) {
    const imageMap = {
        'Papap Dol Game [UPDATE]': 'imgs/games/Papap Dol Game [UPDATE].webp',
        '100 Player Troll Tower': 'imgs/games/100 Player Troll Tower.webp',
        'Pranking Tower': 'imgs/games/Pranking Tower.webp',
        'Escape Creepy Teacher OBBY': 'imgs/games/Escape Creepy Teacher OBBY.webp',
        'Troll Others Tower': 'imgs/games/Troll Others Tower.webp',
        '[UPD🔥] Steal a Brawler': 'imgs/games/[UPD🔥] Steal a Brawler.webp',
        'An Average Tycoon': 'imgs/games/An Average Tycoon.webp'
    };
    return imageMap[gameName] || null;
}

// Helper function to get game description
function getGameDescription(gameName) {
    const descriptions = {
        'Papap Dol Game [UPDATE]': 'Drive big trucks, deliver goods, and vibe to the music with friends in this immersive trucking experience.',
        '100 Player Troll Tower': 'Join hundreds of players in this chaotic troll tower. Outsmart, climb, and survive in the ultimate test of skill.',
        'Pranking Tower': 'Climb, prank, and outsmart your friends in this chaotic troll tower packed with tricks and surprises.',
        'Escape Creepy Teacher OBBY': 'Can you outsmart the creepy teacher and escape her traps? A fun and spooky obby challenge awaits!',
        'Troll Others Tower': 'Climb higher while trolling others along the way. Outsmart, prank, and survive in this chaotic tower adventure.',
        '[UPD🔥] Steal a Brawler': 'Assemble your squad of powerful Brawlers and steal from other players while protecting your own!',
        'An Average Tycoon': 'The world is in ruin. You and few other survivors have left to an island to escape the ongoing calamity.'
    };
    return descriptions[gameName] || 'Experience this incredible Roblox game created by Huiron Studios.';
}

// Helper function to get game rating based on stats
function getGameRating(visits, playing) {
    const popularity = (playing / Math.max(visits, 1)) * 1000;
    if (popularity > 50) return '★★★★★';
    if (popularity > 30) return '★★★★☆';
    if (popularity > 15) return '★★★☆☆';
    return '★★☆☆☆';
}

// Helper function to get game tags
function getGameTags(gameName) {
    const tags = {
        'Papap Dol Game [UPDATE]': ['Driving', 'Simulation', 'Multiplayer'],
        '100 Player Troll Tower': ['Tower', 'Chaos', 'Multiplayer', 'Strategy'],
        'Pranking Tower': ['Tower', 'Pranks', 'Multiplayer', 'Fun'],
        'Escape Creepy Teacher OBBY': ['Obby', 'Horror', 'Puzzles', 'Adventure'],
        'Troll Others Tower': ['Tower', 'Trolling', 'Multiplayer', 'Chaos'],
        '[UPD🔥] Steal a Brawler': ['Combat', 'Strategy', 'Multiplayer', 'Brawlers'],
        'An Average Tycoon': ['Tycoon', 'Survival', 'Building', 'Economy']
    };
    
    const gameTags = tags[gameName] || ['Roblox', 'Game', 'Fun'];
    return gameTags.map(tag => 
        `<span class="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">${tag}</span>`
    ).join('');
}

// Setup game filter functionality
function setupGameFilters() {
    const filterButtons = document.querySelectorAll('.game-filter-btn');
    const gameCards = document.querySelectorAll('.game-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-gradient-to-r', 'from-purple-600', 'to-pink-600', 'text-white');
                btn.classList.add('bg-gray-700/60', 'text-gray-300');
            });
            this.classList.add('active', 'bg-gradient-to-r', 'from-purple-600', 'to-pink-600', 'text-white');
            this.classList.remove('bg-gray-700/60', 'text-gray-300');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter game cards
            gameCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('max-h-0');
            mobileMenu.classList.toggle('max-h-64');
            mobileMenu.classList.toggle('py-4');
        });
        
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('max-h-64');
                mobileMenu.classList.add('max-h-0');
            });
        });
    }
}

// Create particle background animation
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        const animationDuration = Math.random() * 10 + 10;
        particle.style.animation = `float ${animationDuration}s infinite ease-in-out`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particlesContainer.appendChild(particle);
    }
}

// Page navigation functionality
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`${pageId}-page`).classList.add('active');
    // Toggle only the hero & landing overview sections (marked home-only)
    document.querySelectorAll('.home-only').forEach(sec => {
        if (pageId === 'home') {
            sec.classList.remove('hidden');
        } else {
            sec.classList.add('hidden');
        }
    });
    window.scrollTo({top: 0, behavior: 'smooth'});
    
    // Update URL hash for better navigation
    window.location.hash = pageId;
}

// Setup navigation links
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            showPage(pageId);
        });
    });
}

// Handle page load based on URL hash
function handleInitialPageLoad() {
    const hash = window.location.hash.substring(1);
    const allowed = ['home', 'games', 'groups', 'about'];
    if (hash && allowed.includes(hash)) {
        showPage(hash);
    } else {
        showPage('home');
    }
}

// Scroll animation functionality
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Loading screen functionality
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        // Wait for everything to load
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    // Trigger blur fade-in transitions for all content
                    document.body.classList.add('loading-complete');
                    const mainContent = document.querySelector('.main-content');
                    if (mainContent) {
                        mainContent.classList.add('fade-in');
                    }
                    // Trigger fade-in for all sections with section-fade-in class
                    const sections = document.querySelectorAll('.section-fade-in');
                    sections.forEach((section, index) => {
                        setTimeout(() => {
                            section.classList.add('visible');
                        }, index * 200); // Stagger the animations
                    });
                }, 1000);
            }, 1000); // Minimum 1 second loading time
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupMobileMenu();
    createParticles();
    setupNavigation();
    handleInitialPageLoad();
    fetchStats();
    setupScrollAnimations();
    hideLoadingScreen();
    
    // Refresh stats every 30 seconds
    setInterval(fetchStats, 30000);
});

// Export functions for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        gameConfig,
        formatNumber,
        fetchStats,
        updateGameCards,
        setupMobileMenu,
        createParticles,
        showPage,
        setupNavigation,
        handleInitialPageLoad
    };
}
