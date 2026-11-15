var eventsData = [
    {
        id: 1,
        title: "Tech Hackathon 2026",
        category: "Competition",
        date: "20 Nov 2026, 09:00 AM",
        venue: "Computer Center Lab 1",
        eligibility: "All CS/IT Students",
        description: "24-hour coding hackathon to solve real-world campus problems.",
        totalSeats: 30,
        availableSeats: 3
    },
    {
        id: 2,
        title: "Web Development Workshop",
        category: "Workshop",
        date: "24 Nov 2026, 11:00 AM",
        venue: "Seminar Hall B",
        eligibility: "1st & 2nd Year Students",
        description: "Hands-on session on HTML, CSS, and JavaScript fundamentals.",
        totalSeats: 50,
        availableSeats: 12
    },
    {
        id: 3,
        title: "Annual Cultural Fest",
        category: "Fest",
        date: "02 Dec 2026, 04:00 PM",
        venue: "Open Air Amphitheatre",
        eligibility: "Open to All Departments",
        description: "Music, dance, drama, and talent showcase.",
        totalSeats: 100,
        availableSeats: 0
    }
];

var registeredStudents = [];

function showPage(pageId) {
    var pages = document.getElementsByClassName('page-section');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('active-page');
    }
    document.getElementById(pageId).classList.add('active-page');

    var navLinks = document.querySelectorAll('nav ul li a');
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove('active');
    }
    var activeLink = document.getElementById('nav-' + pageId);
    if (activeLink) activeLink.classList.add('active');

    window.scrollTo(0, 0);
}

function renderEvents() {
    var container = document.getElementById('events-list-container');
    var dropdown = document.getElementById('reg-event-select');
    
    container.innerHTML = "";
    dropdown.innerHTML = '<option value="" disabled selected>-- Choose an Available Event --</option>';

    for (var i = 0; i < eventsData.length; i++) {
        var ev = eventsData[i];
        var isFull = ev.availableSeats <= 0;

        var cardHTML = `
            <div class="event-card">
                <div>
                    <span class="badge">${ev.category}</span>
                    <h3>${ev.title}</h3>
                    <p><strong>📅 Schedule:</strong> ${ev.date}</p>
                    <p><strong>📍 Venue:</strong> ${ev.venue}</p>
                    <p><strong>🎓 Eligibility:</strong> ${ev.eligibility}</p>
                    <p style="margin-top:8px;">${ev.description}</p>
                </div>
                <div>
                    <div class="seat-box ${isFull ? 'seats-full' : 'seats-open'}">
                        ${isFull ? '❌ Registration Closed (0 Seats Left)' : '🟢 Live Seats Available: ' + ev.availableSeats + ' / ' + ev.totalSeats}
                    </div>
                    <button class="reg-btn" ${isFull ? 'disabled' : ''} onclick="goToRegister(${ev.id})">
                        ${isFull ? 'Seats Full' : 'Register Now'}
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;

        if (!isFull) {
            dropdown.innerHTML += `<option value="${ev.id}">${ev.title} (${ev.availableSeats} seats left)</option>`;
        }
    }
}

function goToRegister(eventId) {
    showPage('register');
    document.getElementById('reg-event-select').value = eventId;
}

function registerStudent(event) {
    event.preventDefault();

    var eventId = parseInt(document.getElementById('reg-event-select').value);
    var name = document.getElementById('reg-name').value;
    var roll = document.getElementById('reg-roll').value;
    var dept = document.getElementById('reg-dept').value;

    var selectedEvent = null;
    for (var i = 0; i < eventsData.length; i++) {
        if (eventsData[i].id === eventId) {
            selectedEvent = eventsData[i];
            break;
        }
    }

    if (!selectedEvent || selectedEvent.availableSeats <= 0) {
        alert("Sorry! Seats are full for this event.");
        renderEvents();
        return;
    }

    selectedEvent.availableSeats -= 1;
    var regId = "EVT-" + Math.floor(100000 + Math.random() * 900000);

    registeredStudents.push({
        regId: regId,
        name: name,
        roll: roll,
        dept: dept,
        eventTitle: selectedEvent.title
    });

    document.getElementById('notification-bar').innerText = 
        "🔔 Latest Update: " + name + " just registered for " + selectedEvent.title + "! (" + selectedEvent.availableSeats + " seats left)";

    document.getElementById('slip-id').innerText = regId;
    document.getElementById('slip-event').innerText = selectedEvent.title;
    document.getElementById('slip-venue').innerText = selectedEvent.date + " | " + selectedEvent.venue;
    document.getElementById('slip-name').innerText = name;
    document.getElementById('slip-roll').innerText = roll;
    document.getElementById('slip-dept').innerText = dept;

    document.getElementById('no-slip-msg').style.display = "none";
    document.getElementById('printable-slip').style.display = "block";

    document.getElementById('registrationForm').reset();
    renderEvents();
    renderAdminTable();

    alert("Registration Successful! Your Confirmation Slip is ready.");
    showPage('slip');
}

function createNewEvent(event) {
    event.preventDefault();

    var title = document.getElementById('ev-title').value;
    var category = document.getElementById('ev-category').value;
    var date = document.getElementById('ev-date').value;
    var venue = document.getElementById('ev-venue').value;
    var seats = parseInt(document.getElementById('ev-seats').value);
    var eligibility = document.getElementById('ev-eligibility').value;
    var desc = document.getElementById('ev-desc').value;

    var newEvent = {
        id: eventsData.length + 1,
        title: title,
        category: category,
        date: date,
        venue: venue,
        eligibility: eligibility,
        description: desc,
        totalSeats: seats,
        availableSeats: seats
    };

    eventsData.push(newEvent);
    renderEvents();

    document.getElementById('notification-bar').innerText = 
        "📢 New Event Added: " + title + " (" + seats + " seats available). Register now!";

    document.getElementById('createEventForm').reset();
    alert("New Event '" + title + "' published successfully!");
    showPage('events');
}

function renderAdminTable() {
    var tbody = document.getElementById('admin-student-table');
    tbody.innerHTML = "";

    if (registeredStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #64748b;">No registrations recorded yet.</td></tr>';
        return;
    }

    for (var i = 0; i < registeredStudents.length; i++) {
        var st = registeredStudents.[i]; // safe check
        var st = registeredStudents[i];
        tbody.innerHTML += `
            <tr>
                <td><strong>${st.regId}</strong></td>
                <td>${st.name}</td>
                <td>${st.roll}</td>
                <td>${st.dept}</td>
                <td>${st.eventTitle}</td>
            </tr>
        `;
    }
}

function toggleDetails() {
    var infoBox = document.getElementById("extra-info");
    var btn = document.getElementById("toggleBtn");
    if (infoBox.style.display === "none" || infoBox.style.display === "") {
        infoBox.style.display = "block";
        btn.innerText = "Show Less";
    } else {
        infoBox.style.display = "none";
        btn.innerText = "Show More Details";
    }
}

function handleContactSubmit(event) {
    event.preventDefault();
    var name = document.getElementById("cName").value;
    var successBox = document.getElementById("success-msg");
    successBox.style.display = "block";
    successBox.innerHTML = "✅ Thank you, <strong>" + name + "</strong>! Your message has been sent successfully. We will get back to you soon.";
    document.getElementById("contactForm").reset();
    setTimeout(function() {
        successBox.style.display = "none";
    }, 4000);
}

renderEvents();