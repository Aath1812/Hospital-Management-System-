// Utility Functions
function setupCounter(element) {
    let counter = 0;
    const setCounter = (count) => {
        counter = count;
        element.innerHTML = `count is ${counter}`;
    };
    element.addEventListener('click', () => setCounter(counter + 1));
    setCounter(0);
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
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

// TaskManager Class
class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    }

    addTask(date, description) {
        if (!this.tasks[date]) this.tasks[date] = [];
        this.tasks[date].push({ id: Date.now(), description, completed: false });
        this.save();
    }

    getTasksForDate(date) {
        return this.tasks[date] || [];
    }


    save() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        alert("Your appointment has been booked");
    }
}

// Calendar Class
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

        let calendarHTML = this.generateWeekdaysHTML();

        for (let i = 0; i < firstDay; i++) {
            calendarHTML += '<div class="calendar-day empty">-</div>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = date === this.selectedDate ? 'selected' : '';

            calendarHTML += `
                <div class="calendar-day ${isSelected}" data-date="${date}">
                    ${day}
                    <div class="task-list"></div>
                    <div class="task-indicators"></div>
                </div>
            `;
        }

        const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
        for (let i = firstDay + daysInMonth; i < totalCells; i++) {
            calendarHTML += '<div class="calendar-day empty">-</div>';
        }

        return calendarHTML;
    }

    isCurrentMonth() {
        const today = new Date();
        return (
            this.currentDate.getFullYear() === today.getFullYear() &&
            this.currentDate.getMonth() === today.getMonth()
        );
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

        const prevButton = document.querySelector('.prev-month');
        if (this.isCurrentMonth()) {
            prevButton.disabled = true; // Disable the button if it's the current month
        } else {
            prevButton.disabled = false; // Enable the button otherwise
        }
    }

    setSelectedDate(date) {
        this.selectedDate = date;
        this.updateCalendar();
    }
}

// Global Code
const calendar = new Calendar();
const taskManager = new TaskManager();

calendar.updateCalendar();
document.querySelector('.prev-month').addEventListener('click', () => {
    calendar.previousMonth();
    updateTaskIndicators();
});

document.querySelector('.next-month').addEventListener('click', () => {
    calendar.nextMonth();
    updateTaskIndicators();
});

document.querySelector('.calendar-grid').addEventListener('click', (e) => {
    const dayElement = e.target.closest('.calendar-day');
    if (dayElement && !dayElement.classList.contains('empty')) {
        const date = dayElement.dataset.date;
        calendar.setSelectedDate(date);
        document.getElementById('task-date').value = date;
        updateTaskList(date);
    }
});

document.querySelector('.save-button').addEventListener('click', () => {
    const dateInput = document.getElementById('task-date');
    const descriptionInput = document.getElementById('task-description');
    if (dateInput.value && descriptionInput.value) {
        taskManager.addTask(dateInput.value, descriptionInput.value);
        updateTaskIndicators();
        updateTaskList(dateInput.value);
        descriptionInput.value = '';
    }
});
document.getElementById('task-date').value = formatDate(new Date());
updateTaskIndicators();
