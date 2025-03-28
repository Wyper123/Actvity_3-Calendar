document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = null;
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
    
    generateCalendar(currentMonth, currentYear);
    
    document.getElementById('prev-month').addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    document.getElementById('cancel-event').addEventListener('click', closeEventForm);
    document.getElementById('save-event').addEventListener('click', saveEvent);
    document.getElementById('overlay').addEventListener('click', closeEventForm);
    
    function generateCalendar(month, year) {
        const calendarBody = document.getElementById('calendar-body');
        const monthYearDisplay = document.getElementById('current-month-year');
        
        calendarBody.innerHTML = '';
        
        const monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"];
        monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const today = new Date();
        const isCurrentMonth = (month === today.getMonth() && year === today.getFullYear());
        
        let date = 1;
        
        for (let i = 0; i < 6; i++) {
            if (date > daysInMonth) break;
            
            const row = document.createElement('tr');
            
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                
                if ((i === 0 && j < firstDay) || date > daysInMonth) {
                    cell.className = 'calendar-day empty-day';
                } else {
                    const fullDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
                    cell.className = 'calendar-day';
                    cell.innerHTML = `<div class="date-number">${date}</div>`;
                    
                    if (events[fullDate]) {
                        const eventsContainer = document.createElement('div');
                        eventsContainer.className = 'events-container';
                        events[fullDate].forEach(event => {
                            const eventElement = document.createElement('div');
                            eventElement.className = 'event-item';
                            eventElement.textContent = event;
                            eventsContainer.appendChild(eventElement);
                        });
                        cell.appendChild(eventsContainer);
                    }
                    
                    if (isCurrentMonth && date === today.getDate()) {
                        cell.classList.add('today');
                    }
                    
                    cell.addEventListener('click', function() {
                        selectedDate = fullDate;
                        openEventForm(fullDate);
                    });
                    
                    date++;
                }
                
                row.appendChild(cell);
            }
            
            calendarBody.appendChild(row);
        }
    }
    
    function openEventForm(date) {
        const form = document.getElementById('event-form');
        const overlay = document.getElementById('overlay');
        const dateInput = document.getElementById('event-date');
        
        const dateObj = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateInput.value = dateObj.toLocaleDateString('en-US', options);
        
        document.getElementById('event-title').value = '';
        
        form.style.display = 'block';
        overlay.style.display = 'block';
    }
    
    function closeEventForm() {
        document.getElementById('event-form').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }
    
    function saveEvent() {
        const eventTitle = document.getElementById('event-title').value.trim();
        
        if (eventTitle) {
            if (!events[selectedDate]) {
                events[selectedDate] = [];
            }
            events[selectedDate].push(eventTitle);
            
            localStorage.setItem('calendarEvents', JSON.stringify(events));
            
            generateCalendar(currentMonth, currentYear);
            
            closeEventForm();
        } else {
            alert('Please enter an event title');
        }
    }
});