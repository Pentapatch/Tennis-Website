// This script will set the closest available booking time
// as a default value

// Setup the default values
const timeAheadAllowed = 14;
const firstAvailableTime = 8;
const lastAvailableTime = 20;
const lengthOfBooking = 2;

// Get todays date
let now = new Date();
let day = now.getDate();
let month = now.getMonth();
let year = now.getYear();

// Set the maximum allowed date (two weeks from now)
let maxDate = new Date();
maxDate.setDate(maxDate.getDate() + timeAheadAllowed);

// Get the current time
let hour = now.getHours() + 1; // Add one hour so we get the next closest time

// Set the minimum time to the closest free hour
if (hour % lengthOfBooking == 1) hour += lengthOfBooking - 1;

// Make sure that the time falls within the set limits
if (hour > lastAvailableTime) {
  hour = firstAvailableTime; // Set to the first available time
  day += 1;                  // Increment to the next day
}
if (hour < firstAvailableTime) hour = firstAvailableTime;

// Format the output
let hh = String(hour).padStart(2, "0");
let dd = String(day).padStart(2, "0");
let mm = String(now.getMonth() + 1).padStart(2, "0");
let yyyy = String(now.getFullYear()).padStart(4, "0");
let ddMax = String(maxDate.getDate()).padStart(2, "0");
let mmMax = String(maxDate.getMonth() + 1).padStart(2, "0");
let yyyyMax = String(maxDate.getFullYear()).padStart(4, "0");

// Get the affected controls
const dateControl = document.getElementById('booking-date');
const timeControl = document.getElementById('booking-time');

// Update the date control
dateControl.value = yyyy + "-" + mm + "-" + dd;
dateControl.min = dateControl.value;
dateControl.max = yyyyMax + "-" + mmMax + "-" + ddMax;

// Update the time control
timeControl.value = hh + ":00";

function setFocus(id){
  let element = document.getElementById(id);
  collapseAll();
  element.scrollIntoView({behavior: 'smooth'});
}