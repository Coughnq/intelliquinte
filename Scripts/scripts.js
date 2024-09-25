console.log('Scripts file loaded');

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQHiu-stUoxVEaZVaB77vxEzu9krwV6jq5CIGqeXT0gEeulfUyEJm57sWEah7owAVo/exec';

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

// Add this function to initialize the carousel
function initializeCarousel() {
    console.log('Initializing carousel');
    if (typeof $ === 'undefined') {
        console.error('jQuery is not loaded');
        return;
    }
    if (typeof $.fn.slick === 'undefined') {
        console.error('Slick carousel library is not loaded');
        return;
    }
    const $carousel = $('.carousel');
    if ($carousel.length === 0) {
        console.error('Carousel element not found');
        return;
    }
    $carousel.slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        prevArrow: '.carousel-prev',
        nextArrow: '.carousel-next'
    });
    console.log('Carousel initialized successfully');
}

// Add this function to handle carousel navigation buttons
function initializeCarouselButtons() {
    console.log('Initializing carousel buttons');
    const $prevButton = $('.carousel-prev');
    const $nextButton = $('.carousel-next');
    const $carousel = $('.carousel');

    if ($prevButton.length === 0 || $nextButton.length === 0) {
        console.error('Carousel buttons not found');
        return;
    }

    if (!$carousel.hasClass('slick-initialized')) {
        console.error('Carousel is not initialized');
        return;
    }

    $prevButton.on('click', function() {
        $carousel.slick('slickPrev');
    });
    $nextButton.on('click', function() {
        $carousel.slick('slickNext');
    });
    console.log('Carousel buttons initialized successfully');
}

// Add the info button functionality
function initializeInfoButton() {
    console.log('Initializing info button');
    const infoButton = document.getElementById('infoButton');
    const infoModal = document.getElementById('infoModal');
    const closeButton = infoModal.querySelector('.close');
    
    if (!infoButton || !infoModal) {
        console.error('Info button or modal not found');
        return;
    }
    
    infoButton.addEventListener('click', function() {
        infoModal.style.display = 'block';
    });
    
    closeButton.addEventListener('click', function() {
        infoModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target == infoModal) {
            infoModal.style.display = 'none';
        }
    });
    
    console.log('Info button initialized successfully');
}

// Modify the DOMContentLoaded event listener to include these new functions
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    initializeSessionData();
    initializeSubscribe();
    initializeInfoButton();
    initializeCarousel();

    // Send analytics data when the user leaves the page
    window.addEventListener('beforeunload', function() {
        sendAnalytics();
    });
});

console.log('All functions defined in scripts.js');

window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', message, 'at', source, 'line', lineno, 'column', colno, 'Error object:', error);
};
