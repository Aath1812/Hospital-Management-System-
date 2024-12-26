function formatDate(date) {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().split('T')[0];  
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getMonthName(date) {
    return date.toLocaleString('default', { month: 'long' });
}

function getWeekdays() {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

class AppointmentManager {
    constructor() {
        this.appointments = JSON.parse(localStorage.getItem('appointments')) || {};
    }

    addAppointment(date, description) {
        if (!this.appointments[date]) this.appointments[date] = [];
        this.appointments[date].push({ id: Date.now(), description, completed: false });
        this.save();
    }

    save() {
        localStorage.setItem('appointments', JSON.stringify(this.appointments));
        alert("Your appointment has been booked");
    }
}

class Calendar {
    constructor(date = new Date()) {
        this.currentDate = date;
        this.selectedDate = null;
    }

    generateWeekdaysHTML() {
        return getWeekdays().map((day) => `<div class="weekday">${day}</div>`).join('');
    }

    generateCalendarHTML() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const today = new Date();

        let calendarHTML = this.generateWeekdaysHTML();

        for (let i = 0; i < firstDay; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const formattedDate = formatDate(date);
            const isPastDate = date < today.setHours(0, 0, 0, 0);
            const isSelected = formattedDate === this.selectedDate ? 'selected' : '';
            const disabledClass = isPastDate ? 'disabled' : '';

            calendarHTML += `
                <div class="calendar-day ${isSelected} ${disabledClass}" data-date="${formattedDate}">
                    ${day}
                </div>
            `;
        }

        const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
        for (let i = firstDay + daysInMonth; i < totalCells; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }

        return calendarHTML;
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.updateCalendar();
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.updateCalendar();
    }

    updateCalendar() {
        const monthYear = document.querySelector('.month-year');
        monthYear.textContent = `${getMonthName(this.currentDate)} ${this.currentDate.getFullYear()}`;

        const calendarGrid = document.querySelector('.calendar-grid');
        calendarGrid.innerHTML = this.generateCalendarHTML();

        const today = new Date();
        const prevButton = document.querySelector('.prev-month');
        if (
            this.currentDate.getFullYear() === today.getFullYear() &&
            this.currentDate.getMonth() === today.getMonth()
        ) {
            prevButton.disabled = true; 
        } else {
            prevButton.disabled = false; 
        }
    }

    setSelectedDate(date) {
        this.selectedDate = date;
        this.updateCalendar();
    }
}

const calendar = new Calendar();
const appointmentManager = new AppointmentManager();

calendar.updateCalendar();

document.querySelector('.prev-month').addEventListener('click', () => calendar.previousMonth());
document.querySelector('.next-month').addEventListener('click', () => calendar.nextMonth());

document.querySelector('.calendar-grid').addEventListener('click', (e) => {
    const dayElement = e.target.closest('.calendar-day');
    if (dayElement && !dayElement.classList.contains('empty') && !dayElement.classList.contains('disabled')) {
        const date = dayElement.dataset.date;
        calendar.setSelectedDate(date);
        document.getElementById('appointment-date').value = date; 
    }
});

document.querySelector('.save-button').addEventListener('click', () => {
    const dateInput = document.getElementById('appointment-date');
    const descriptionInput = document.getElementById('appointment-description');
    if (dateInput.value && descriptionInput.value) {
        appointmentManager.addAppointment(dateInput.value, descriptionInput.value);
        descriptionInput.value = '';
    }
});
document.getElementById('appointment-date').value = formatDate(new Date());
