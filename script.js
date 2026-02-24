// ===== INTERVIEW MASTER PRO - ADVANCED FUNCTIONALITY =====

// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Initialize Particles
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#6366f1'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: false
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#6366f1',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 1
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// ===== STATE MANAGEMENT =====
let currentView = 'dashboard';
let currentTopic = null;
let currentCompany = null;
let currentQuestion = null;
let user = {
    name: 'Alex Chen',
    email: 'alex@example.com',
    streak: 21,
    points: 2450,
    level: 12
};

// ===== DOM ELEMENTS =====
const app = document.getElementById('app');
const loading = document.getElementById('loading');
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const globalSearch = document.getElementById('globalSearch');
const notificationMenu = document.getElementById('notificationMenu');
const userMenu = document.getElementById('userMenu');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        loading.style.display = 'none';
        app.style.display = 'grid';
        
        // Initialize charts
        initMasteryChart();
        
        // Load initial data
        loadQuestions();
        
        // Show welcome notification
        showNotification('Welcome back, Alex! Ready to continue your streak?', 'success');
    }, 2000);
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize tooltips
    initTooltips();
    
    // Check for achievements
    checkAchievements();
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Navigation items
    document.querySelectorAll('.nav-item[data-view]').forEach(item => {
        item.addEventListener('click', (e) => {
            const view = e.currentTarget.dataset.view;
            switchView(view);
            
            // Update active state
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });
    
    // Topic navigation
    document.querySelectorAll('.nav-item[data-topic]').forEach(item => {
        item.addEventListener('click', (e) => {
            const topic = e.currentTarget.dataset.topic;
            loadTopic(topic);
        });
    });
    
    // Company tags
    document.querySelectorAll('.company-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            const company = e.currentTarget.dataset.company;
            loadCompanyQuestions(company);
        });
    });
    
    // Menu toggle for mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
    
    // Global search
    if (globalSearch) {
        let searchTimeout;
        globalSearch.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchQuestions(e.target.value);
            }, 500);
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            globalSearch.focus();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// ===== VIEW MANAGEMENT =====
function switchView(view) {
    currentView = view;
    
    // Hide all views
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active');
    });
    
    // Show selected view
    const targetView = document.getElementById(`${view}-view`);
    if (targetView) {
        targetView.classList.add('active');
        
        // Scroll to top
        document.querySelector('.main-content').scrollTop = 0;
    }
    
    // Update breadcrumb
    updateBreadcrumb(view);
    
    // Load view-specific data
    switch(view) {
        case 'dashboard':
            updateDashboardStats();
            break;
        case 'practice':
            loadQuestions();
            break;
        case 'interviews':
            loadMockInterviews();
            break;
    }
}

function updateBreadcrumb(view) {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) return;
    
    const titles = {
        dashboard: 'Dashboard',
        practice: 'Practice',
        interviews: 'Mock Interviews',
        achievements: 'Achievements'
    };
    
    breadcrumb.innerHTML = `
        <span class="breadcrumb-item">Home</span>
        <i class="fas fa-chevron-right"></i>
        <span class="breadcrumb-item active">${titles[view] || view}</span>
    `;
}

// ===== MASTERY CHART =====
let masteryChart = null;

function initMasteryChart() {
    const ctx = document.getElementById('masteryChart').getContext('2d');
    
    masteryChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Python', 'JavaScript', 'Java', 'SQL', 'Algorithms', 'System Design'],
            datasets: [{
                label: 'Your Mastery',
                data: [75, 90, 60, 45, 35, 25],
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: '#6366f1',
                borderWidth: 2,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#6366f1'
            }, {
                label: 'Target',
                data: [80, 85, 70, 60, 50, 40],
                backgroundColor: 'rgba(236, 72, 153, 0.2)',
                borderColor: '#ec4899',
                borderWidth: 2,
                borderDash: [5, 5],
                pointBackgroundColor: 'transparent',
                pointBorderColor: 'transparent'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                        color: '#fff'
                    },
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        backdropColor: 'transparent',
                        color: '#fff'
                    }
                }
            }
        }
    });
}

function updateMasteryChart(topic, value) {
    if (!masteryChart) return;
    
    const index = masteryChart.data.labels.indexOf(topic);
    if (index !== -1) {
        masteryChart.data.datasets[0].data[index] = value;
        masteryChart.update();
    }
}

// ===== QUESTIONS MANAGEMENT =====
const questions = [
    {
        id: 1,
        title: "LRU Cache Implementation",
        topic: "python",
        difficulty: "hard",
        description: "Design and implement an LRU (Least Recently Used) cache...",
        solution: "class LRUCache:\n    def __init__(self, capacity):\n        self.cache = {}\n        self.capacity = capacity\n        ...",
        companies: ['google', 'amazon', 'meta'],
        attempts: 12500,
        successRate: 78,
        avgTime: 45
    },
    {
        id: 2,
        title: "Merge K Sorted Lists",
        topic: "algorithms",
        difficulty: "hard",
        description: "Merge k sorted linked lists and return it as one sorted list...",
        solution: "def mergeKLists(lists):\n    import heapq\n    heap = []\n    ...",
        companies: ['amazon', 'microsoft'],
        attempts: 8900,
        successRate: 65,
        avgTime: 50
    },
    {
        id: 3,
        title: "Design Twitter Feed",
        topic: "system-design",
        difficulty: "advanced",
        description: "Design Twitter's news feed system...",
        solution: "System design solution with microservices...",
        companies: ['meta', 'twitter'],
        attempts: 3400,
        successRate: 45,
        avgTime: 75
    }
];

function loadQuestions() {
    const grid = document.getElementById('questionsGrid');
    if (!grid) return;
    
    grid.innerHTML = questions.map(q => `
        <div class="topic-card glass" onclick="loadQuestion(${q.id})">
            <div class="topic-header">
                <span class="difficulty-badge ${q.difficulty}">${q.difficulty}</span>
                <span class="question-points">${q.avgTime} min</span>
            </div>
            <h3>${q.title}</h3>
            <p>${q.description.substring(0, 100)}...</p>
            <div class="question-meta">
                <span><i class="fas fa-users"></i> ${(q.attempts/1000).toFixed(1)}k attempts</span>
                <span><i class="fas fa-check-circle"></i> ${q.successRate}%</span>
            </div>
            <div class="company-tags-mini">
                ${q.companies.map(c => `<span class="company-mini"><i class="fab fa-${c}"></i></span>`).join('')}
            </div>
        </div>
    `).join('');
}

function loadTopic(topic) {
    currentTopic = topic;
    
    // Filter questions by topic
    const filteredQuestions = questions.filter(q => q.topic === topic);
    
    // Switch to practice view
    switchView('practice');
    
    // Update questions grid
    const grid = document.getElementById('questionsGrid');
    if (grid) {
        grid.innerHTML = filteredQuestions.map(q => `
            <div class="topic-card glass" onclick="loadQuestion(${q.id})">
                <h3>${q.title}</h3>
                <p>${q.description.substring(0, 100)}...</p>
            </div>
        `).join('');
    }
    
    // Show topic header
    showNotification(`Loaded ${filteredQuestions.length} ${topic} questions`, 'info');
}

function loadCompanyQuestions(company) {
    currentCompany = company;
    
    // Filter questions by company
    const filteredQuestions = questions.filter(q => q.companies.includes(company));
    
    // Switch to practice view
    switchView('practice');
    
    // Update questions grid
    const grid = document.getElementById('questionsGrid');
    if (grid) {
        grid.innerHTML = filteredQuestions.map(q => `
            <div class="topic-card glass" onclick="loadQuestion(${q.id})">
                <h3>${q.title}</h3>
                <p>${q.description.substring(0, 100)}...</p>
                <div class="company-badge">
                    <i class="fab fa-${company}"></i> ${company}
                </div>
            </div>
        `).join('');
    }
}

function loadQuestion(questionId) {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    currentQuestion = question;
    
    // Switch to question detail view
    switchView('question');
    
    // Update question details
    document.getElementById('detailQuestionTitle').textContent = question.title;
    document.getElementById('detailDifficulty').textContent = question.difficulty;
    document.getElementById('detailDifficulty').className = `difficulty-badge ${question.difficulty}`;
    document.getElementById('detailTopic').textContent = question.topic;
    
    // Update stats
    document.querySelector('.meta-stat:nth-child(1) span').textContent = `${(question.attempts/1000).toFixed(1)}k attempts`;
    document.querySelector('.meta-stat:nth-child(2) span').textContent = `${question.successRate}% success rate`;
    document.querySelector('.meta-stat:nth-child(3) span').textContent = `${question.avgTime} min avg time`;
    
    // Update company mentions
    const companyIcons = document.querySelector('.company-icons');
    companyIcons.innerHTML = question.companies.map(c => 
        `<span class="company-icon"><i class="fab fa-${c}"></i> ${c}</span>`
    ).join('');
}

function searchQuestions(query) {
    if (!query) {
        loadQuestions();
        return;
    }
    
    const filtered = questions.filter(q => 
        q.title.toLowerCase().includes(query.toLowerCase()) ||
        q.description.toLowerCase().includes(query.toLowerCase()) ||
        q.topic.toLowerCase().includes(query.toLowerCase())
    );
    
    const grid = document.getElementById('questionsGrid');
    if (grid) {
        if (filtered.length === 0) {
            grid.innerHTML = '<div class="no-results">No questions found</div>';
        } else {
            grid.innerHTML = filtered.map(q => `
                <div class="topic-card glass" onclick="loadQuestion(${q.id})">
                    <h3>${q.title}</h3>
                    <p>${q.description.substring(0, 100)}...</p>
                </div>
            `).join('');
        }
    }
}

function applyFilters() {
    const topic = document.getElementById('topicFilter').value;
    const difficulty = document.getElementById('difficultyFilter').value;
    const status = document.getElementById('statusFilter').value;
    
    let filtered = [...questions];
    
    if (topic !== 'all') {
        filtered = filtered.filter(q => q.topic === topic);
    }
    
    if (difficulty !== 'all') {
        filtered = filtered.filter(q => q.difficulty === difficulty);
    }
    
    // Update grid
    const grid = document.getElementById('questionsGrid');
    if (grid) {
        grid.innerHTML = filtered.map(q => `
            <div class="topic-card glass" onclick="loadQuestion(${q.id})">
                <h3>${q.title}</h3>
                <p>${q.description.substring(0, 100)}...</p>
            </div>
        `).join('');
    }
    
    showNotification(`Showing ${filtered.length} questions`, 'info');
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function toggleNotifications() {
    notificationMenu.classList.toggle('show');
}

function markAllRead() {
    document.querySelectorAll('.notification-item').forEach(item => {
        item.classList.remove('unread');
    });
    document.querySelector('.notification-badge').style.display = 'none';
}

// ===== USER MENU =====
function toggleUserMenu() {
    userMenu.classList.toggle('show');
}

function toggleUserDropdown() {
    // Implement user dropdown
}

function toggleProfileMenu() {
    // Implement profile menu
}

// ===== THEME TOGGLE =====
function toggleTheme() {
    document.body.classList.toggle('dark');
    const icon = document.querySelector('.theme-toggle i');
    icon.className = document.body.classList.contains('dark') ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== CODE PLAYGROUND =====
let codeEditor = null;

function startCoding() {
    const modal = document.getElementById('codeModal');
    modal.classList.add('active');
    
    // Initialize code editor if not already
    if (!codeEditor) {
        const textarea = document.getElementById('codeEditor');
        codeEditor = CodeMirror.fromTextArea(textarea, {
            mode: 'python',
            theme: 'dracula',
            lineNumbers: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            indentUnit: 4,
            tabSize: 4,
            lineWrapping: true
        });
    }
    
    // Load starter code based on current question
    if (currentQuestion) {
        // Set appropriate starter code
    }
}

function runCode() {
    const results = document.getElementById('resultsConsole');
    results.innerHTML = '<div class="result-line">Running tests...</div>';
    
    // Simulate code execution
    setTimeout(() => {
        const passed = Math.random() > 0.3;
        if (passed) {
            results.innerHTML = `
                <div class="result-line success">✓ All test cases passed!</div>
                <div class="result-line">Runtime: 124 ms</div>
                <div class="result-line">Memory: 42.3 MB</div>
            `;
        } else {
            results.innerHTML = `
                <div class="result-line error">✗ Test case 2 failed</div>
                <div class="result-line">Input: [3,2,4], target=6</div>
                <div class="result-line">Expected: [1,2]</div>
                <div class="result-line">Got: [0,1]</div>
            `;
        }
    }, 1500);
}

function submitCode() {
    runCode();
    
    // Show achievement if first submission
    setTimeout(() => {
        showAchievement('First Submission', 'You submitted your first solution!');
    }, 2000);
}

function clearResults() {
    document.getElementById('resultsConsole').innerHTML = '<div class="result-line">Ready to run your code...</div>';
}

// ===== ACHIEVEMENTS =====
function checkAchievements() {
    // Check for various achievements
    const achievements = [
        { id: 'first_question', name: 'First Step', desc: 'Solved your first question', unlocked: true },
        { id: 'seven_day', name: 'Week Warrior', desc: '7-day streak', unlocked: true },
        { id: 'thirty_day', name: 'Monthly Master', desc: '30-day streak', unlocked: false }
    ];
    
    const unlocked = achievements.find(a => a.unlocked);
    if (unlocked) {
        showAchievement(unlocked.name, unlocked.desc);
    }
}

function showAchievement(name, desc) {
    const modal = document.getElementById('achievementModal');
    document.querySelector('.achievement-name').textContent = name;
    document.querySelector('.achievement-desc').textContent = desc;
    modal.classList.add('active');
    
    // Play sound (if enabled)
    // playSound('achievement.mp3');
}

// ===== MOCK INTERVIEWS =====
function loadMockInterviews() {
    // Load mock interview data
    showNotification('Mock interviews feature coming soon!', 'info');
}

// ===== DASHBOARD UPDATES =====
function updateDashboardStats() {
    // Update stats with real data
    document.querySelectorAll('.stat-number')[0].textContent = '156';
    document.querySelectorAll('.stat-number')[1].textContent = '87%';
    document.querySelectorAll('.stat-number')[2].textContent = '124h';
    document.querySelectorAll('.stat-number')[3].textContent = '21';
}

// ===== MODAL MANAGEMENT =====
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

function backToPractice() {
    switchView('practice');
}

function saveQuestion() {
    showNotification('Question saved to your list!', 'success');
}

function showHints() {
    // Show next hint
    const hintItems = document.querySelectorAll('.hint-item');
    for (let item of hintItems) {
        if (item.style.display !== 'none') {
            item.style.display = 'none';
            break;
        }
    }
}

function switchQuestionTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show selected tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}-tab`).classList.add('active');
}

function showSolutionLang(lang) {
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load solution for selected language
    const solutionCode = document.querySelector('.solution-code pre code');
    if (solutionCode) {
        // Update code based on language
        solutionCode.textContent = getSolutionForLang(lang);
        Prism.highlightElement(solutionCode);
    }
}

function getSolutionForLang(lang) {
    const solutions = {
        python: `def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`,
        javascript: `function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}`,
        java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[] {};\n    }\n}`
    };
    
    return solutions[lang] || solutions.python;
}

// ===== TOOLTIPS =====
function initTooltips() {
    // Initialize tooltips for all elements with data-tooltip
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(el => {
        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.dataset.tooltip;
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    tooltip.style.left = rect.left + (rect.width - tooltip.offsetWidth) / 2 + 'px';
    
    e.target.tooltip = tooltip;
}

function hideTooltip(e) {
    if (e.target.tooltip) {
        e.target.tooltip.remove();
        delete e.target.tooltip;
    }
}

// ===== EXPORT FUNCTIONS =====
function exportProducts() {
    // Implement export functionality
    showNotification('Exporting data...', 'info');
}

// ===== SHARE RESULTS =====
function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: 'My Interview Prep Progress',
            text: `I've solved 156 questions with 87% accuracy on InterviewMaster!`,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback
        navigator.clipboard.writeText('Check out my progress on InterviewMaster!');
        showNotification('Link copied to clipboard!', 'success');
    }
}

function retryQuiz() {
    // Reset quiz and start over
    showNotification('Starting over...', 'info');
    setTimeout(() => {
        // Reset logic
    }, 1000);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Alt + D for dashboard
    if (e.altKey && e.key === 'd') {
        e.preventDefault();
        switchView('dashboard');
    }
    
    // Alt + P for practice
    if (e.altKey && e.key === 'p') {
        e.preventDefault();
        switchView('practice');
    }
    
    // Alt + I for interviews
    if (e.altKey && e.key === 'i') {
        e.preventDefault();
        switchView('interviews');
    }
});

// ===== MAKE FUNCTIONS GLOBALLY AVAILABLE =====
window.switchView = switchView;
window.loadTopic = loadTopic;
window.loadQuestion = loadQuestion;
window.startCoding = startCoding;
window.runCode = runCode;
window.submitCode = submitCode;
window.clearResults = clearResults;
window.closeModal = closeModal;
window.toggleTheme = toggleTheme;
window.toggleNotifications = toggleNotifications;
window.markAllRead = markAllRead;
window.toggleUserMenu = toggleUserMenu;
window.applyFilters = applyFilters;
window.backToPractice = backToPractice;
window.saveQuestion = saveQuestion;
window.showHints = showHints;
window.switchQuestionTab = switchQuestionTab;
window.showSolutionLang = showSolutionLang;
window.shareResults = shareResults;
window.retryQuiz = retryQuiz;
window.exportProducts = exportProducts;