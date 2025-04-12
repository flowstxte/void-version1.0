// --- DOM Element Selection ---
const tabs = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const container = document.querySelector('.container'); // For stopwatch pause style

// Timer Elements
const timerDisplayMinutes = document.getElementById('timer-minutes');
const timerDisplaySeconds = document.getElementById('timer-seconds');
const timerDisplayMilliseconds = document.getElementById('timer-milliseconds');
const timerPresets = document.querySelectorAll('.preset-button');
const timerStartBtn = document.getElementById('timer-start');
const timerPauseBtn = document.getElementById('timer-pause');
const timerResumeBtn = document.getElementById('timer-resume');
const timerResetBtn = document.getElementById('timer-reset');
const customMinutesInput = document.getElementById('custom-minutes'); // Added
const customSecondsInput = document.getElementById('custom-seconds'); // Added
const setCustomTimerBtn = document.getElementById('set-custom-timer'); // Added

// Stopwatch Elements
const stopwatchDisplayMinutes = document.getElementById('stopwatch-minutes');
const stopwatchDisplaySeconds = document.getElementById('stopwatch-seconds');
const stopwatchDisplayMilliseconds = document.getElementById('stopwatch-milliseconds');
const stopwatchStartBtn = document.getElementById('stopwatch-start');
const stopwatchPauseBtn = document.getElementById('stopwatch-pause');
const stopwatchResumeBtn = document.getElementById('stopwatch-resume');
const stopwatchLapBtn = document.getElementById('stopwatch-lap'); // Added Lap Button
const stopwatchResetBtn = document.getElementById('stopwatch-reset');
const lapsList = document.getElementById('laps-list'); // Added Laps List UL

// --- State Variables ---
let timerInterval;
let stopwatchInterval;
let timerRemainingTime = 0; // in milliseconds
let timerStartTime = 0;
let timerPausedTime = 0;
let isTimerRunning = false;
let isTimerPaused = false;

let stopwatchStartTime = 0;
let stopwatchElapsedTime = 0; // in milliseconds
let stopwatchPausedTime = 0;
let isStopwatchRunning = false;
let isStopwatchPaused = false;
let lapCounter = 0; // Added lap counter
let lastLapTime = 0; // Added to calculate individual lap times

// --- Helper Functions ---
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = milliseconds % 1000;
    return {
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
        milliseconds: String(ms).padStart(3, '0')
    };
}

function updateTimerDisplay(ms) {
    const time = formatTime(ms);
    timerDisplayMinutes.textContent = time.minutes;

    // Add ticking class briefly for animation
    if (timerDisplaySeconds.textContent !== time.seconds) {
        timerDisplaySeconds.classList.add('ticking');
        setTimeout(() => timerDisplaySeconds.classList.remove('ticking'), 100); // Remove after animation duration
    }
     if (timerDisplayMilliseconds.textContent !== time.milliseconds) {
        timerDisplayMilliseconds.classList.add('ticking');
        setTimeout(() => timerDisplayMilliseconds.classList.remove('ticking'), 100);
    }

    // Ensure display elements exist before accessing textContent
    if(timerDisplaySeconds) timerDisplaySeconds.textContent = time.seconds;
    if(timerDisplayMilliseconds) timerDisplayMilliseconds.textContent = time.milliseconds;
}

function updateStopwatchDisplay(ms) {
    const time = formatTime(ms);
    stopwatchDisplayMinutes.textContent = time.minutes;

    // Add ticking class briefly for animation
    if (stopwatchDisplaySeconds.textContent !== time.seconds) {
        stopwatchDisplaySeconds.classList.add('ticking');
        setTimeout(() => stopwatchDisplaySeconds.classList.remove('ticking'), 100);
    }
     if (stopwatchDisplayMilliseconds.textContent !== time.milliseconds) {
        stopwatchDisplayMilliseconds.classList.add('ticking');
        setTimeout(() => stopwatchDisplayMilliseconds.classList.remove('ticking'), 100);
    }

    // Ensure display elements exist
    if(stopwatchDisplaySeconds) stopwatchDisplaySeconds.textContent = time.seconds;
    if(stopwatchDisplayMilliseconds) stopwatchDisplayMilliseconds.textContent = time.milliseconds;
}

// --- Tab Switching Logic ---
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Deactivate all tabs and content
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Activate clicked tab and corresponding content
        tab.classList.add('active');
        const targetTab = tab.getAttribute('data-tab');
        document.getElementById(targetTab).classList.add('active');
    });
});

// --- Stopwatch Logic ---
function startStopwatch() {
    if (!isStopwatchRunning) {
        stopwatchStartTime = Date.now() - stopwatchElapsedTime; // Adjust start time if resuming
        stopwatchInterval = setInterval(() => {
            stopwatchElapsedTime = Date.now() - stopwatchStartTime;
            updateStopwatchDisplay(stopwatchElapsedTime);
            
            // Update animation
            if (window.stopwatchAnimationElements) {
                window.stopwatchAnimationElements.animate(stopwatchElapsedTime, true);
            }
        }, 10); // Update every 10ms for smoother milliseconds
        isStopwatchRunning = true;
        isStopwatchPaused = false;
        stopwatchStartBtn.style.display = 'none';
        stopwatchPauseBtn.style.display = 'inline-block';
        stopwatchResumeBtn.style.display = 'none';
        stopwatchLapBtn.style.display = 'inline-block'; // Show Lap button
        document.body.classList.remove('stopwatch-paused'); // Remove paused style
        lastLapTime = 0; // Reset last lap time on new start
        
        // Resume animation
        if (window.stopwatchAnimationElements) {
            window.stopwatchAnimationElements.resumeAnimation();
        }
    }
}

function pauseStopwatch() {
    if (isStopwatchRunning && !isStopwatchPaused) {
        clearInterval(stopwatchInterval);
        isStopwatchPaused = true;
        stopwatchPausedTime = Date.now(); // Record when paused
        stopwatchPauseBtn.style.display = 'none';
        stopwatchResumeBtn.style.display = 'inline-block';
        stopwatchLapBtn.style.display = 'none'; // Hide Lap button when paused
        document.body.classList.add('stopwatch-paused'); // Add paused style
        
        // Pause animation
        if (window.stopwatchAnimationElements) {
            window.stopwatchAnimationElements.pauseAnimation();
        }
    }
}

function resumeStopwatch() {
    if (isStopwatchPaused) {
        // Adjust start time to account for the paused duration
        const pauseDuration = Date.now() - stopwatchPausedTime;
        stopwatchStartTime += pauseDuration;

        stopwatchInterval = setInterval(() => {
            stopwatchElapsedTime = Date.now() - stopwatchStartTime;
            updateStopwatchDisplay(stopwatchElapsedTime);
            
            // Update animation
            if (window.stopwatchAnimationElements) {
                window.stopwatchAnimationElements.animate(stopwatchElapsedTime, true);
            }
        }, 10);
        isStopwatchPaused = false;
        stopwatchPauseBtn.style.display = 'inline-block';
        stopwatchResumeBtn.style.display = 'none';
        stopwatchLapBtn.style.display = 'inline-block'; // Show Lap button on resume
        document.body.classList.remove('stopwatch-paused'); // Remove paused style
        
        // Resume animation
        if (window.stopwatchAnimationElements) {
            window.stopwatchAnimationElements.resumeAnimation();
        }
    }
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    isStopwatchRunning = false;
    isStopwatchPaused = false;
    stopwatchElapsedTime = 0;
    updateStopwatchDisplay(0);
    stopwatchStartBtn.style.display = 'inline-block';
    stopwatchPauseBtn.style.display = 'none';
    stopwatchResumeBtn.style.display = 'none';
    stopwatchLapBtn.style.display = 'none'; // Hide Lap button on reset
    document.body.classList.remove('stopwatch-paused'); // Ensure paused style is removed
    lapsList.innerHTML = ''; // Clear laps display
    lapCounter = 0; // Reset lap counter
    lastLapTime = 0; // Reset last lap time
    
    // Reset animation
    if (window.stopwatchAnimationElements) {
        window.stopwatchAnimationElements.resumeAnimation();
    }
}

function recordLap() {
    if (!isStopwatchRunning || isStopwatchPaused) return; // Can only lap while running

    lapCounter++;
    const currentTotalTime = stopwatchElapsedTime;
    const lapTime = currentTotalTime - lastLapTime; // Time for this specific lap
    lastLapTime = currentTotalTime; // Update last lap time for next calculation

    const formattedTotalTime = formatTime(currentTotalTime);
    const formattedLapTime = formatTime(lapTime);

    const li = document.createElement('li');
    li.innerHTML = `
        <span class="lap-number">Lap ${lapCounter}</span>
        <span class="lap-time">${formattedLapTime.minutes}:${formattedLapTime.seconds}.${formattedLapTime.milliseconds}</span>
        <span class="lap-total-time">(Total: ${formattedTotalTime.minutes}:${formattedTotalTime.seconds}.${formattedTotalTime.milliseconds})</span>
    `; // Added total time for context
    // Add styling for the total time span (optional but nice)
    const totalTimeSpan = li.querySelector('.lap-total-time');
    if (totalTimeSpan) {
        totalTimeSpan.style.fontSize = '0.8em';
        totalTimeSpan.style.color = '#999';
        totalTimeSpan.style.marginLeft = '10px';
    }

    lapsList.prepend(li); // Add new lap to the top
    lapsList.scrollTop = 0; // Scroll to top to show the latest lap
}


// --- Timer Logic ---
function setTimer(durationSeconds) {
    resetTimer(); // Reset any existing timer first
    timerRemainingTime = durationSeconds * 1000;
    updateTimerDisplay(timerRemainingTime);
    // Flash display briefly to indicate time set
    flashElement(document.querySelector('.timer-display'));
}

function startTimer() {
    if (!isTimerRunning && timerRemainingTime > 0) {
        timerStartTime = Date.now(); // Record the absolute start time
        timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - timerStartTime;
            const newRemainingTime = timerRemainingTime - elapsedTime;

            if (newRemainingTime <= 0) {
                clearInterval(timerInterval);
                updateTimerDisplay(0);
                isTimerRunning = false;
                handleTimerCompletion(); // Call completion handler
                resetTimerControls(); // Go back to initial state
            } else {
                updateTimerDisplay(newRemainingTime);
                // Update animation
                if (window.timerAnimationElements) {
                    window.timerAnimationElements.animate(elapsedTime, true);
                }
            }
        }, 10); // Update frequently
        isTimerRunning = true;
        isTimerPaused = false;
        timerStartBtn.style.display = 'none';
        timerPauseBtn.style.display = 'inline-block';
        timerResumeBtn.style.display = 'none';
        disablePresets(true);
        
        // Resume animation
        if (window.timerAnimationElements) {
            window.timerAnimationElements.resumeAnimation();
        }
    }
}

function pauseTimer() {
    if (isTimerRunning && !isTimerPaused) {
        clearInterval(timerInterval);
        isTimerPaused = true;
        // Calculate remaining time accurately when paused
        const elapsedTimeSinceStart = Date.now() - timerStartTime;
        timerRemainingTime = timerRemainingTime - elapsedTimeSinceStart;
        timerPausedTime = Date.now(); // Store pause time for resume calculation

        timerPauseBtn.style.display = 'none';
        timerResumeBtn.style.display = 'inline-block';
        
        // Add paused style to body - similar to stopwatch
        document.body.classList.add('timer-paused');
        
        // Pause animation
        if (window.timerAnimationElements) {
            window.timerAnimationElements.pauseAnimation();
        }
    }
}

function resumeTimer() {
    if (isTimerPaused) {
        isTimerPaused = false;
        timerStartTime = Date.now(); // Reset start time for the current interval

        timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - timerStartTime;
            const newRemainingTime = timerRemainingTime - elapsedTime;

            if (newRemainingTime <= 0) {
                clearInterval(timerInterval);
                updateTimerDisplay(0);
                isTimerRunning = false;
                handleTimerCompletion(); // Call completion handler
                resetTimerControls();
            } else {
                updateTimerDisplay(newRemainingTime);
                // Update animation
                if (window.timerAnimationElements) {
                    window.timerAnimationElements.animate(elapsedTime, true);
                }
            }
        }, 10);
        timerPauseBtn.style.display = 'inline-block';
        timerResumeBtn.style.display = 'none';
        
        // Remove paused style from body
        document.body.classList.remove('timer-paused');
        
        // Resume animation
        if (window.timerAnimationElements) {
            window.timerAnimationElements.resumeAnimation();
        }
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    isTimerPaused = false;
    timerRemainingTime = 0;
    updateTimerDisplay(0);
    resetTimerControls();
    disablePresets(false);
    
    // Remove paused style from body
    document.body.classList.remove('timer-paused');
    
    // Reset animation
    if (window.timerAnimationElements) {
        window.timerAnimationElements.resumeAnimation();
    }
}

function resetTimerControls() {
    timerStartBtn.style.display = 'inline-block';
    timerPauseBtn.style.display = 'none';
    timerResumeBtn.style.display = 'none';
}

function disablePresets(disabled) {
    timerPresets.forEach(button => button.disabled = disabled);
    // Also disable custom timer input when running
    customMinutesInput.disabled = disabled;
    customSecondsInput.disabled = disabled;
    setCustomTimerBtn.disabled = disabled;
}

// --- Visual Effects ---
function flashElement(element) {
    if (!element) return;
    element.classList.add('flash');
    setTimeout(() => element.classList.remove('flash'), 500); // Match animation duration
}

function handleTimerCompletion() {
    console.log("Timer finished!"); // Keep console log
    flashElement(document.querySelector('.timer-display'));
    
    // Add visual effect to animation
    if (window.timerAnimationElements) {
        // Flash animation elements
        const frame = document.querySelector('#timer .frame');
        frame.classList.add('flash');
        setTimeout(() => frame.classList.remove('flash'), 500);
        
        // Make all nodes active for a moment
        if (window.timerAnimationElements.nodes) {
            window.timerAnimationElements.nodes.forEach(node => {
                node.classList.add('active');
                setTimeout(() => node.classList.remove('active'), 1000);
            });
        }
    }
    
}

// --- Event Listeners ---



// Stopwatch Buttons
stopwatchStartBtn.addEventListener('click', startStopwatch);
stopwatchPauseBtn.addEventListener('click', pauseStopwatch);
stopwatchResumeBtn.addEventListener('click', resumeStopwatch);
stopwatchLapBtn.addEventListener('click', recordLap); // Added Lap listener
stopwatchResetBtn.addEventListener('click', resetStopwatch);

// Timer Buttons
timerPresets.forEach(button => {
    button.addEventListener('click', () => {
        const time = parseInt(button.getAttribute('data-time'), 10);
        setTimer(time);
    });
});
timerStartBtn.addEventListener('click', startTimer);
timerPauseBtn.addEventListener('click', pauseTimer);
timerResumeBtn.addEventListener('click', resumeTimer);
timerResetBtn.addEventListener('click', resetTimer);
setCustomTimerBtn.addEventListener('click', () => { // Added listener for custom timer
    const minutes = parseInt(customMinutesInput.value, 10) || 0;
    const seconds = parseInt(customSecondsInput.value, 10) || 0;

    if (minutes >= 0 && seconds >= 0 && seconds < 60) {
        const totalSeconds = (minutes * 60) + seconds;
        if (totalSeconds > 0) {
            setTimer(totalSeconds);
            // Optionally clear inputs after setting
            // customMinutesInput.value = '';
            // customSecondsInput.value = '';
        } else {
            alert("Please enter a valid time greater than 0 seconds.");
        }
    } else {
        // Flash display on error? Maybe too much.
        alert("Please enter valid minutes (0+) and seconds (0-59).");
    }
});

// --- Initial Setup ---
updateTimerDisplay(0);
updateStopwatchDisplay(0);
document.getElementById('timer').classList.add('active'); // Show timer by default
tabs[0].classList.add('active'); // Highlight timer tab by default