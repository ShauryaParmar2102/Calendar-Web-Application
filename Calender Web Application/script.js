let nav = 0; //Keeps track of which month we are on
let clicked = null; //Whichever day is clicked on
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

//Gathers HTML elements
const calender = document.getElementById('calender');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput')
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; //Creates an array in JS called weekdays

function openModal(date) {
  clicked = date;
// It decides whether to show a “create event” popup or a “view/delete event” popup when you click a calendar day.
  const eventForDay = events.find(e => e.date === clicked); 

  if (eventForDay) {
    document.getElementById('eventText').innerText = eventForDay.title;
    deleteEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
  }

  backDrop.style.display = 'block';
}

//entire calendar generator
function load() {

  //Get today's date info
  const dt = new Date();

  if(nav !=0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

    const day = dt.getDate(); //gets month
    const month = dt.getMonth(); //gets month 
    const year = dt.getFullYear(); //gets year

    const firstDayOfMonth = new Date(year, month, 1); //What weekday the month starts on
    const daysInMonth = new Date(year, month + 1, 0).getDate(); //how many days in the month

    //Finds how many empty boxes before first day 
    const dateString = firstDayOfMonth.toLocaleDateString('en-AU', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    //Month title display
    document.getElementById('monthDisplay').innerText = `
    ${dt.toLocaleDateString('en-AU', { month: 'long' })} ${year}`;

    //Clear old calender 
    calender.innerHTML = '';

    //Build calender grid 
    for(let i = 1; i <= paddingDays + daysInMonth; i++) {
      const daySquare = document.createElement('div'); //Creates each square
      daySquare.classList.add('day');


      const dayString = `${month + 1}/${i - paddingDays}/${year}`;

      //This loop creates empty boxes (padding) and real day boxes

      if (i > paddingDays) { //Decide empty vs real day
          daySquare.innerText = i - paddingDays; //fixes numbering so it starts with 1

          const eventForDay = events.find(e=> e.date === dayString);

          // Checks which square has today's date
          if (i - paddingDays === day && nav === 0) {  //nav === 0 means you are viewing current month, prevents highlighting today in other months
            daySquare.id = 'currentDay'; // Adds ID to that specific square
          }

          if (eventForDay) {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event');
            eventDiv.innerText = eventForDay.title;
            daySquare.appendChild(eventDiv);
          }

          daySquare.addEventListener('click', () => openModal(dayString)); //placeholder for event system
      } else {
        daySquare.classList.add('padding'); //makes blank spaces invisible
      }

      calender.appendChild(daySquare) //Add to page = inserts each box into calender
    }
}

function closeModal() {
  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
  load();
}

//Saves the event to a specific day
function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');

    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
}

function deleteEvent() {
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

//This function controls month switching
function initButtons() { 
  document.getElementById('nextButton').addEventListener('click', () => { // Next button moves forward by 1 month
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => { //Moves back 1 month
    nav--;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', saveEvent);

  document.getElementById('cancelButton').addEventListener('click', closeModal);

  document.getElementById('deleteButton').addEventListener('click', deleteEvent);

  document.getElementById('closeButton').addEventListener('click', closeModal);


}

//Start everything - set up buttons and draws initial calender
initButtons();
load();