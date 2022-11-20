// ¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤
// ¤¤ This file handles the functionallity needed ¤¤
// ¤¤ for the session booking form.               ¤¤
// ¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤

// Setup the default values
const timeAheadAllowed = 14;  // The maximum number of days ahead of today, that a customer can book a session
const firstAvailableTime = 8; // The first hour in a day that a session can begin
const lastAvailableTime = 20; // The last hour in a day that a session can begin
const lengthOfBooking = 2;    // The length (in hours) of each session

const debugFormValidation = true; // Set to true in order to print debug-related information to the console

// ###############
// ## Main code ##
// ###############

// Store references to elements we will be needing to access
const dateControl = document.getElementById('booking-date');
const timeControl = document.getElementById('booking-time');

// Set an initial date and time to the booking controls
setInitialDateAndTime();

// ###############
// ## Functions ##
// ###############

function setInitialDateAndTime() {
  // This function will set the closest available booking time
  // as the initial value to the booking form datetime control
  // when the document is loaded.

  // Get todays date
  let now = new Date();
  let day = now.getDate();

  // Set the maximum allowed date (i.e. two weeks from now)
  let maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + timeAheadAllowed);

  // Get the current time
  let hour = now.getHours() + 1; // Add one hour so we get the next available session time

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

  // Update the date control
  dateControl.value = yyyy + "-" + mm + "-" + dd;
  dateControl.min = dateControl.value;
  dateControl.max = yyyyMax + "-" + mmMax + "-" + ddMax;

  // Update the time control
  timeControl.value = hh + ":00";
}

// Set focus to a input field and scroll the element into view
function setFocus(id){
    let element = document.getElementById(id);
    collapseAll();

    if (window.innerWidth >= 550){
      element.scrollIntoView({behavior: 'smooth'}); 
    }
}

function validateTime(control) {
  // This function will validate the value of the time field
  let timeArray = control.value.split(":");
  
  let hour = parseInt(timeArray[0]);
  let minute = parseInt(timeArray[1]);

  // Reset the class
  timeControl.className = "";

  if (minute != 0){
      setErrorDescription(control, "Endast hela timmar kan väljas.");
  }
  else if (hour < firstAvailableTime){
      setErrorDescription(control, "Välj en tid som är lika med eller senare än " + String(firstAvailableTime).padStart(2, "0") + ":00.");
  }
  else if (hour > lastAvailableTime){
      setErrorDescription(control, "Välj en tid som är lika med eller tidigare än " + String(lastAvailableTime).padStart(2, "0") + ":00.");
  }
  else if (hour % lengthOfBooking != 0){
      setErrorDescription(control, "Den valda tiden passerar ett annat pass.");
  }
  
}

function validateEmail(control)
{
  let prefix = "";
  let assignerCount = 0;
  let domain = "";
  let extension = "";
  let mode = 0;

  let value = control.value;

  // Analyze the value
  // Iterate through all characters of the input
  for (var i = 0; i < value.length; i++)
  {
      let c = value.charAt(i);

      if (c == "@")
      {
          assignerCount++;
          if (mode == 0) {
            mode = 1;
          }
      }
      else if (c == "." && mode == 1)
      {
          mode = 2;
      }
      else
      {
          if (mode === 0)
          {
              prefix += c;
          }
          else if (mode === 1)
          {
              domain += c;
          }
          else if (mode === 2)
          {
              extension += c;
          }
      }
  }

  if (debugFormValidation) {
    // For debug
    console.log("Prefix: '" + prefix + "'");
    console.log("Domain: '" + domain + "'");
    console.log("Extension: '" + extension + "'");
  }

  // Set and display validation error description
  let formatString = "[format: prefix@domän.ändelse].";
  if (prefix == "")
  {
      setErrorDescription(control, "Email-addressen saknar en prefix " + formatString);
  }
  else if (assignerCount === 0)
  {
    setErrorDescription(control, "Email-addressen saknar ett snabel-a (@) " + formatString);
  }
  else if (assignerCount > 1)
  {
    setErrorDescription(control, "Email-addressen innehåller för många snabel-a (@) " + formatString);
  }
  else if (domain === "")
  {
    setErrorDescription(control, "Email-addressen saknar ett domän " + formatString);
  }
  else if (extension === "")
  {
    setErrorDescription(control, "Email-addressen saknar en ändelse " + formatString);
  }

}

function setErrorDescription(control, message){
  // Display an validation error description below the control that
  // failed the validation check.
  control.className = "error";
  const errorDescControl = document.getElementById(control.id + "-error-desc");
  errorDescControl.textContent = message;
  errorDescControl.style.display = "block";
}

function resetError(control){
  // Hide the validation error description below the specified control
  control.className = "";
  const errorDescControl = document.getElementById(control.id + "-error-desc");
  errorDescControl.textContent = "";
  errorDescControl.style.display = "none";
}

function validateDate(control){
  // As of now, there is no need for custom validation as min and max is set
}

function validatePhoneNumber(control){
  // As of now, there is no need for custom validation of the phone number
}