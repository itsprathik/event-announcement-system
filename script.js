// Global variables
let events = [];

// DOM elements
const eventsContainer = document.getElementById('events-container');
const eventsSection = document.getElementById('events-section');
const subscribeSection = document.getElementById('subscribe-section');
const createEventSection = document.getElementById('create-event-section');
const subscribeForm = document.getElementById('subscribe-form');
const createEventForm = document.getElementById('create-event-form');
const subscribeMessage = document.getElementById('subscribe-message');
const createEventMessage = document.getElementById('create-event-message');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Subscribe form submission
    subscribeForm.addEventListener('submit', handleSubscribe);
    
    // Create event form submission
    createEventForm.addEventListener('submit', handleCreateEvent);
}

// Load events from API
async function loadEvents() {
    try {
        const response = await fetch('https://fi57ebq7xf.execute-api.ap-south-1.amazonaws.com/prod/get-events');
        if (!response.ok) {
            throw new Error('Failed to load events from API');
        }
        const data = await response.json();
        events = data.events || data || [];
        displayEvents();
    } catch (error) {
        console.error('Error loading events from API:', error);
        // Fallback to sample events if API fails
        events = getSampleEvents();
        displayEvents();
    }
}

// Display events in the container
function displayEvents() {
    if (!events || events.length === 0) {
        eventsContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-calendar-times text-4xl text-gray-400 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">No Events Available</h3>
                <p class="text-gray-500">Check back later for upcoming events!</p>
            </div>
        `;
        return;
    }

    eventsContainer.innerHTML = events.map(event => `
        <div class="bg-white rounded-lg shadow-lg p-6 card-hover">
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${event.title}</h3>
                    <p class="text-gray-600 leading-relaxed">${event.description}</p>
                </div>
                <div class="ml-4">
                    <i class="fas fa-calendar-day text-blue-500 text-2xl"></i>
                </div>
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                <span class="text-sm text-gray-500">
                    <i class="fas fa-clock mr-1"></i>
                    ${event.date || event.createdAt ? new Date(event.createdAt).toLocaleDateString() : 'TBD'}
                </span>
                <button class="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors">
                    Learn More
                </button>
            </div>
        </div>
    `).join('');
}

// Handle subscribe form submission
async function handleSubscribe(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    
    try {
        const response = await fetch('https://fi57ebq7xf.execute-api.ap-south-1.amazonaws.com/prod/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            const data = await response.json();
            showMessage(subscribeMessage, data.message || 'Successfully subscribed! You will receive updates about new events.', 'success');
            subscribeForm.reset();
        } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Subscription failed');
        }
    } catch (error) {
        console.error('Error subscribing:', error);
        showMessage(subscribeMessage, error.message || 'Subscription failed. Please try again later.', 'error');
    }
}

// Handle create event form submission
async function handleCreateEvent(event) {
    event.preventDefault();
    
    const title = document.getElementById('event-title').value;
    const description = document.getElementById('event-description').value;
    
    try {
        const response = await fetch('https://fi57ebq7xf.execute-api.ap-south-1.amazonaws.com/prod/create-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description })
        });

        if (response.ok) {
            const data = await response.json();
            showMessage(createEventMessage, data.message || 'Event created successfully!', 'success');
            createEventForm.reset();
            // Reload events to show the new one
            loadEvents();
        } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Event creation failed');
        }
    } catch (error) {
        console.error('Error creating event:', error);
        showMessage(createEventMessage, error.message || 'Failed to create event. Please try again later.', 'error');
    }
}

// Show message with appropriate styling
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `mt-4 text-center p-3 rounded-lg ${
        type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
    }`;
    element.classList.remove('hidden');
    
    // Hide message after 5 seconds
    setTimeout(() => {
        element.classList.add('hidden');
    }, 5000);
}

// Navigation functions
function showEvents() {
    eventsSection.classList.remove('hidden');
    subscribeSection.classList.add('hidden');
    createEventSection.classList.add('hidden');
}

function showSubscribe() {
    eventsSection.classList.add('hidden');
    subscribeSection.classList.remove('hidden');
    createEventSection.classList.add('hidden');
}

function showCreateEvent() {
    eventsSection.classList.add('hidden');
    subscribeSection.classList.add('hidden');
    createEventSection.classList.remove('hidden');
}

// Sample events for fallback
function getSampleEvents() {
    return [
        {
            title: "Tech Conference 2024",
            description: "Join us for the biggest tech conference of the year featuring keynote speakers, workshops, and networking opportunities.",
            date: "March 15, 2024"
        },
        {
            title: "Community Meetup",
            description: "Monthly community meetup where developers share their latest projects and discuss industry trends.",
            date: "March 22, 2024"
        },
        {
            title: "Workshop: Modern Web Development",
            description: "Learn the latest web development techniques including React, Node.js, and modern CSS frameworks.",
            date: "April 5, 2024"
        },
        {
            title: "Hackathon",
            description: "24-hour coding challenge where teams compete to build innovative solutions to real-world problems.",
            date: "April 12-13, 2024"
        },
        {
            title: "Career Fair",
            description: "Connect with top tech companies and find your next career opportunity.",
            date: "April 20, 2024"
        },
        {
            title: "Open Source Day",
            description: "Contribute to open source projects and learn from experienced maintainers.",
            date: "May 1, 2024"
        }
    ];
} 