console.log('Scripts file loaded');

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw6SCOYFAkQJwJ1Gl6009kKrD2Z5RmAUpUV3r97HeUcaI5O5-2qgdg-pnfjUFJZbzex/exec';

let sessionData = {
    id: null,
    startTime: null,
    endTime: null,
    duration: 0,
    maxScroll: 0,
    clicks: 0,
    device: null,
    country: null,
    state: null,
    timezone: null
};

function initializeSessionData() {
    console.log('Initializing session data');
    sessionData.id = generateUUID();
    sessionData.startTime = new Date().toISOString();
    sessionData.device = navigator.userAgent;
    sessionData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log('Session data initialized:', sessionData);
}

function sendAnalytics() {
    console.log('Sending analytics');
    updateSessionData();
    const url = new URL(GOOGLE_APPS_SCRIPT_URL);
    Object.keys(sessionData).forEach(key => 
        url.searchParams.append(key, sessionData[key])
    );
    const img = new Image();
    img.src = url.toString();
    img.style.display = 'none';
    document.body.appendChild(img);
    setTimeout(() => document.body.removeChild(img), 1000);
    localStorage.removeItem('sessionData');
    console.log('Analytics sent and session data cleared');
}

function sendSubscribe(email, currentPage) {
    console.log('Sending subscribe data');
    const data = { email, currentPage, type: 'subscribe' };
    const url = new URL(GOOGLE_APPS_SCRIPT_URL);
    Object.keys(data).forEach(key => url.searchParams.append(key, data[key]));
    const img = new Image();
    img.onload = () => console.log('Subscribe data sent successfully');
    img.onerror = () => console.error('Error sending subscribe data');
    img.src = url.toString();
    img.style.display = 'none';
    document.body.appendChild(img);
    setTimeout(() => document.body.removeChild(img), 1000);
}

function updateSessionData() {
    sessionData.endTime = new Date().toISOString();
    sessionData.duration = (new Date(sessionData.endTime) - new Date(sessionData.startTime)) / 1000;
    sessionData.maxScroll = Math.max(sessionData.maxScroll, getScrollPercentage());
}

function getScrollPercentage() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return Math.round((scrollTop / scrollHeight) * 100);
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Initialize click counter
document.addEventListener('click', function() {
    sessionData.clicks++;
});

// Handle subscribe form and button
function initializeSubscribe() {
    console.log('Initializing subscribe functionality');
    const subscribeButton = document.getElementById('subscribeButton');
    const subscribeForm = document.getElementById('subscribeForm');

    console.log('Subscribe button:', subscribeButton);
    console.log('Subscribe form:', subscribeForm);

    if (subscribeButton && subscribeForm) {
        console.log('Both subscribe button and form found');
        subscribeButton.addEventListener('click', function() {
            console.log('Subscribe button clicked');
            subscribeForm.style.display = 'block';
            subscribeButton.style.display = 'none';
        });

        subscribeForm.addEventListener('submit', function(e) {
            console.log('Form submitted');
            e.preventDefault();
            const emailInput = subscribeForm.querySelector('input[type="email"]');
            console.log('Email input:', emailInput);
            if (emailInput) {
                const email = emailInput.value;
                const currentPage = window.location.pathname;
                sendSubscribe(email, currentPage);
                emailInput.value = '';
                alert('Thank you for subscribing!');
                subscribeForm.style.display = 'none';
                subscribeButton.style.display = 'block';
            } else {
                console.error('Email input not found in subscribe form');
            }
        });
    } else {
        console.error('Subscribe button or form not found. Button:', subscribeButton, 'Form:', subscribeForm);
    }
}

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    initializeSessionData();
    initializeSubscribe();

    // Send analytics data when the user leaves the page
    window.addEventListener('beforeunload', function() {
        sendAnalytics();
    });
});

console.log('All functions defined in scripts.js');
