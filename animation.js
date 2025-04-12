// Animation logic for Timer and Stopwatch
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations for both timer and stopwatch
    initializeAnimation('timer');
    initializeAnimation('stopwatch');
    
    // Listen for theme changes to update animation colors
    const htmlElement = document.documentElement;
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                // Theme has changed, update animation elements if needed
                updateAnimationForTheme();
            }
        });
    });
    
    observer.observe(htmlElement, { attributes: true });
    
    function updateAnimationForTheme() {
        // This function can be used to make specific theme-based adjustments
        // to animation elements if needed beyond CSS variables
        const currentTheme = document.documentElement.getAttribute('data-theme');
        console.log(`Theme changed to: ${currentTheme}`);
        
        // Example: You could adjust animation speeds or behaviors based on theme
        // For now, CSS variables handle most of the theming automatically
    }
    
    function initializeAnimation(type) {
        // Create dots around the frame
        const dotsContainer = document.getElementById(`${type}-dots`);
        const dotsCount = 16; // 4 dots on each side
        const dots = [];
        
        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            
            // Calculate position
            if (i < 4) { // Top
                dot.style.top = '0';
                dot.style.left = `${(i + 1) * 40}px`;
            } else if (i < 8) { // Right
                dot.style.right = '0';
                dot.style.top = `${(i - 3) * 40}px`;
            } else if (i < 12) { // Bottom
                dot.style.bottom = '0';
                dot.style.right = `${(i - 7) * 40}px`;
            } else { // Left
                dot.style.left = '0';
                dot.style.bottom = `${(i - 11) * 40}px`;
            }
            
            dotsContainer.appendChild(dot);
            dots.push(dot);
            
            // Add pulse animation with delay
            setTimeout(() => {
                dot.classList.add('pulse');
            }, i * 200);
        }
        
        // Line animation setup
        const linesContainer = document.getElementById(`${type}-lines-container`);
        const lineCount = 7; // Number of diagonal lines
        const lines = [];
        const nodes = [];
        
        // Create lines and nodes
        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement('div');
            line.className = 'line';
            line.style.width = '240px'; // Longer than the container to allow diagonal
            line.style.left = '0';
            line.style.top = `${30 + i * 20}px`;
            line.style.transform = 'rotate(45deg)';
            linesContainer.appendChild(line);
            lines.push(line);
            
            // Add glow effect with delay
            setTimeout(() => {
                line.classList.add('glow');
            }, i * 300);
            
            const node = document.createElement('div');
            node.className = 'node';
            node.style.left = '0';
            node.style.top = `${30 + i * 20}px`;
            linesContainer.appendChild(node);
            nodes.push(node);
        }
        
        // Store animation elements in global scope for access from timer/stopwatch functions
        window[`${type}AnimationElements`] = {
            dots,
            lines,
            nodes,
            animate: function(elapsed, isRunning) {
                if (!isRunning) return;
                
                // Animate nodes
                for (let i = 0; i < lineCount; i++) {
                    // Calculate position based on time
                    const speed = 1 + (i * 0.15); // Varied speeds for each node
                    const progress = (elapsed / (120 / speed) + i * 20) % 280;
                    const xPos = progress;
                    const yPos = 30 + i * 20;
                    
                    nodes[i].style.left = `${xPos}px`;
                    nodes[i].style.top = `${yPos}px`;
                    
                    // Add active class when node is at certain positions
                    if (progress > 40 && progress < 160) {
                        nodes[i].classList.add('active');
                    } else {
                        nodes[i].classList.remove('active');
                    }
                }
                
                // Animate dots sequence
                const dotCycleTime = 4000; // Cycle time in ms
                const activeDotIndex = Math.floor((elapsed % dotCycleTime) / (dotCycleTime / dotsCount));
                
                dots.forEach((dot, index) => {
                    // Create a wave effect
                    const distance = (index - activeDotIndex + dotsCount) % dotsCount;
                    const scale = distance <= 3 ? 1 + (3 - distance) * 0.5 : 1;
                    dot.style.transform = `scale(${scale})`;
                    
                    const opacity = distance <= 3 ? 0.7 + (3 - distance) * 0.1 : 0.7;
                    dot.style.opacity = opacity;
                });
            },
            pauseAnimation: function() {
                dots.forEach(dot => {
                    dot.style.animationPlayState = 'paused';
                });
                lines.forEach(line => {
                    line.style.animationPlayState = 'paused';
                });
                
                const bgGlow = document.querySelector(`#${type} .animation-container .background-glow`);
                if (bgGlow) {
                    bgGlow.style.animationPlayState = 'paused';
                }
            },
            resumeAnimation: function() {
                dots.forEach(dot => {
                    dot.style.animationPlayState = 'running';
                });
                lines.forEach(line => {
                    line.style.animationPlayState = 'running';
                });
                
                const bgGlow = document.querySelector(`#${type} .animation-container .background-glow`);
                if (bgGlow) {
                    bgGlow.style.animationPlayState = 'running';
                }
            }
        };
    }
});
