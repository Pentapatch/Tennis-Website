// ¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤
// ¤¤ This file handles the functionallity needed ¤¤
// ¤¤ for the session booking form.               ¤¤
// ¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤

// Booking configuration
const timeAheadAllowed = 14; // The maximum number of days ahead of today, that a customer can book a session
const firstAvailableTime = 8; // The first hour in a day that a session can begin
const lastAvailableTime = 20; // The last hour in a day that a session can begin
const sessionLength = 2; // The length (in hours) of each session

// Court configuration
const outdoorCourts = [
  "Bana A1",
  "Bana A2",
  "Bana A3",
  "Bana A4",
  "Bana B1",
  "Bana B2",
  "Bana C1",
];
const indoorCourts = ["Bana I1", "Bana I2", "Bana I3", "Bana I4"];

// Debug configuration
const debugFormValidation = false; // Set to true in order to print debug-related information to the console
const debugBookingSystem = false; //  -- " --

// #############
// ## Classes ##
// #############

class BookingManager {
  #bookings = new Array();
  #history = new Array();
  #sessions = new Array();

  constructor() {}

  book(date, customer, indoors, changeroomMens, changeroomWomens, sauna) {
    // Reset the minutes and seconds of the date
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    // Try to find an entry in bookings that has the date of the specified date
    let booking;
    this.#bookings.forEach((current) => {
      // Note: Using .toLocaleDateString() in order to exclude the time
      if (
        current.getDate().toLocaleDateString() === date.toLocaleDateString()
      ) {
        if (debugBookingSystem)
          console.log(
            `[BookingManager.book()] Found an excisting entry on this day (${date.toLocaleDateString()}).`
          );
        booking = current;
        return;
      }
    });

    // Create a new BookingDay if none was found above
    if (booking === undefined) {
      if (debugBookingSystem)
        console.log(
          `[BookingManager.book()] Created a new entry for this day (${date.toLocaleDateString()}).`
        );
      booking = new BookingDay(date);
      // Add the booking to the bookings array then sort it
      this.#bookings.push(booking);
      this.#bookings.sort();
    }

    let court = booking.canBook(date, indoors);
    if (court !== null) {
      // Create a new session object and assign that session to the court
      let session = new BookingSession(
        customer,
        date,
        changeroomMens,
        changeroomWomens,
        sauna,
        court
      );
      court.setAssignee(session);

      // Append this session to the session array
      this.#sessions.push(session);

      if (debugBookingSystem) {
        console.log("[BookingManager.book()] Booked a new session:");
        console.log(court);
      }
      return session;
    }

    if (debugBookingSystem)
      console.log(
        `[BookingManager.book()] There was no available court on this day and time (${date
          .toLocaleString()
          .slice(0, 16)}).`
      );
    return null;
  }

  getDay(date) {
    // Loop through all registered booking days and return the day if an entry for that day excists
    for (let i = 0; i < this.#bookings.length; i++) {
      const day = this.#bookings[i];
      if (day.getDate().toLocaleDateString() === date.toLocaleDateString()) {
        return day;
      }
    }

    // Return null if no entry was found on that day
    return null;
  }

  isSessionAvailable(date, indoors) {
    let day = this.getDay(date);

    if (!day) {
      // No day registered for that date (all courts are available at all times of the day): Return true
      return true;
    } else {
      // Check if we can book a session on that day then return the result
      return day.canBook(date, indoors);
    }
  }
}

class BookingDay {
  #date;
  #times = new Array();

  constructor(date) {
    this.#date = new Date(new Date(date.toDateString())); // Leave out time

    // Create an array (representing the time of a session) that consists of
    // arrays of BookingCourt for indoor courts and outdoor courts
    for (
      let i = firstAvailableTime;
      i <= lastAvailableTime;
      i += sessionLength
    ) {
      let indoors = new Array();
      let outdoors = new Array();

      indoorCourts.forEach((court) => {
        indoors.push(new BookingCourt(court, null));
      });

      outdoorCourts.forEach((court) => {
        outdoors.push(new BookingCourt(court, null));
      });

      this.#times.push({
        time: i,
        indoorCourts: indoors,
        outdoorCourts: outdoors,
      });
    }
  }

  getDate() {
    return this.#date;
  }

  canBook(dateTime, indoors) {
    // Check if a customer can book a session on this day and time
    // Returns the first available court that is encountered, or null
    // if none is available

    // Get the time entry for this date
    let time;
    for (let i = 0; i < this.#times.length; i++) {
      const current = this.#times[i];
      if (current.time === dateTime.getHours()) {
        time = current;
        break; // Break out of the loop
      }
    }

    // Check for errors
    if (time == null) {
      if (debugBookingSystem)
        console.log(
          `[BookingDay.canBook()] Error: Could not find a session at the time of '${dateTime.getHours()}'.`
        );
      return null; // Exit the method
    }

    // Loop trough all indoor or outdoor courts and see if any of them is available to book
    let courts = indoors ? time.indoorCourts : time.outdoorCourts;

    for (let i = 0; i < courts.length; i++) {
      const court = courts[i];
      if (court.isAvailable()) return court;
    }

    // Return null if the excecution reaches here
    return null;
  }

  cancel() {
    // May not be placed here
  }
}

class BookingCourt {
  #name;
  #assignedTo = null;

  constructor(name, assignedTo) {
    this.#name = name;
    this.#assignedTo = assignedTo;
  }

  getName() {
    return this.#name;
  }

  getAssignee() {
    return this.#assignedTo;
  }

  setAssignee(session) {
    this.#assignedTo = session;
  }

  isBooked() {
    return this.#assignedTo !== null;
  }

  isAvailable() {
    return !this.isBooked();
  }
}

class BookingSession {
  #date;
  #court;

  constructor(customer, date, changeroomMens, changeroomWomens, sauna, court) {
    this.customer = customer;
    this.#date = date;
    this.changeroomMens = changeroomMens;
    this.changeroomWomens = changeroomWomens;
    this.sauna = sauna;
    this.#court = court;
  }

  getDate() {
    return this.#date;
  }

  getCourt() {
    return this.#court;
  }
}

class BookingCustomer {
  constructor(firstName, lastName, email, phone, memberID) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.memberID = memberID;
  }
}

// ###############
// ## Main code ##
// ###############

// Store references to elements we will be needing to access
const dateControl = document.getElementById("booking-date");
const timeControl = document.getElementById("booking-time");
const bookingForm = document.getElementById("booking-form");

// Store all booked sessions in an array
var bookingManager = new BookingManager();

// Give the controls initial values (either stored values, default values or empty)
initializeForm();

// Bind onsubmit event of the form
bookingForm.addEventListener("submit", (event) => onSubmit(event));

// @@@@@@@@@@@@@@@@@@@
// @@ TESTING BELOW @@
// @@@@@@@@@@@@@@@@@@@

if (debugBookingSystem) {
  console.log("bookingManager:");
  console.log(bookingManager);
}

// ###############
// ## Functions ##
// ###############

function initializeForm() {
  // Get a reference to all controls that is contained within the form
  let controls = bookingForm.querySelectorAll("input");

  // Set an initial date and time to the booking controls
  // This can be overridden by stored values below
  setInitialDateAndTime();

  // Loop trough all controls
  controls.forEach((control) => {
    let value = sessionStorage.getItem(control.name);

    // Do not change the submit button
    if (control.type === "submit") return;

    // If a value with the key of the control's name is stored:
    // set the value of the control to the stored value
    if (value) {
      if (control.type === "checkbox") {
        control.checked = value === "true"; // Convert from string to boolean
      } else {
        control.value = value;
      }
    }
  });
}

function resetForm() {
  resetStoredValues();
  bookingForm.reset();
  setInitialDateAndTime();
}

function resetStoredValues() {
  // Get a reference to all controls that is contained within the form
  let controls = bookingForm.querySelectorAll("input");

  // Loop trough all stored values and remove them
  controls.forEach((control) => {
    sessionStorage.removeItem(control.name);
  });
}

function storeValue(control) {
  // Temporary store the accepted input
  // (useful if the site crashes or the user accidentally reloads the page)
  sessionStorage.setItem(
    control.name,
    control.type === "checkbox" ? control.checked : control.value
  );
}

function bookSession() {
  // Create a customer object
  let customer = new BookingCustomer(
    document.getElementById("booking-first-name").value,
    document.getElementById("booking-last-name").value,
    document.getElementById("booking-email").value,
    document.getElementById("booking-phone-number").value,
    document.getElementById("booking-member-id").value
  );

  // Create a date object
  let date = new Date(document.getElementById("booking-date").value);
  date = new Date(
    `${date.toLocaleDateString()} ${
      document.getElementById("booking-time").value
    }`
  );

  let indoors = document.getElementById("booking-indoors").checked;
  let changeroomMens = document.getElementById(
    "booking-changeroom-mens"
  ).checked;
  let changeroomWomens = document.getElementById(
    "booking-changeroom-womens"
  ).checked;
  let sauna = document.getElementById("booking-sauna").checked;

  // Try to book the session and return the result
  return bookingManager.book(
    date,
    customer,
    indoors,
    changeroomMens,
    changeroomWomens,
    sauna
  );
}

function onSubmit(e) {
  // Prevent the page from reloading
  e.preventDefault();

  // Check if all fields are valid
  let error = false;
  if (!validateEmail(document.getElementById("booking-email"))) error = true;
  if (!validatePhoneNumber(document.getElementById("booking-phone-number")))
    error = true;
  if (!validateTime(document.getElementById("booking-time"))) error = true;

  // Give the first input element focus
  document.getElementById("booking-first-name").focus();

  if (error) {
    // Display error message
    alert(
      "Bokningen misslyckades. Vänligen se över alla fält i bokningsformuläret."
    );
  } else {
    // Try to book the session
    let session = bookSession();
    if (session) {
      // Booking was successfull: Display a message

      // Reset the form and all stored values
      resetForm();

      // Display a popup window that confirms the booking
      displayBookingConfirmation(session);
    } else {
      // Fully booked: Display a message
      let indoors = document.getElementById("booking-indoors").checked
        ? "inomhus"
        : "utomhus";
      let time = document.getElementById("booking-time").value;
      alert(
        `Bokingen misslyckades: Tyvärr är alla ${indoors}banor bokade kl ${time}.`
      );
    }
  }
}

function displayBookingConfirmation(session) {
  // Get a reference to the elements that we need to manipulate
  let popup = document.getElementById("popup");
  let name = document.getElementById("confirmation-name");
  let court = document.getElementById("confirmation-court");
  let sauna = document.getElementById("confirmation-sauna");
  let time = document.getElementById("confirmation-time");
  let date = document.getElementById("confirmation-date");
  let saunaTime = document.getElementById("confirmation-sauna-time");
  let courtOverlay = document.getElementById("confirmation-court-image");
  let saunaOverlay = document.getElementById("confirmation-sauna-image");

  // Set the values of the elements
  name.innerText = session.customer.firstName;
  court.innerText = session.getCourt().getName();
  time.innerText = session.getDate().toLocaleTimeString().slice(0, 5);
  date.innerText = session.getDate().toLocaleDateString().slice(0, 10);
  let from = session.getDate().getHours() + sessionLength;
  let to = from + 1;
  saunaTime.innerText = `${from.toString().padStart(2, "0")}-${to
    .toString()
    .padStart(2, "0")}`;

  // Display the sauna message if sauna was booked
  if (session.sauna) sauna.style.display = "block";

  // Bind the document.keydown to a function in order to be able to close the popup via the keyboard
  document.addEventListener("keydown", (e) => onDocumentKeyDown(e));

  // Display the overlays
  courtOverlay.src = `images/facilities_${session
    .getCourt()
    .getName()
    .slice(5, 7)}.png`;
  if (session.sauna) saunaOverlay.classList.add("facilities-overlay-display");

  // Display the popup message
  popup.style.display = "flex";
}

function hideBookingConfirmation() {
  // Get a reference to the elements that we need to manipulate
  let popup = document.getElementById("popup");
  let name = document.getElementById("confirmation-name");
  let court = document.getElementById("confirmation-court");
  let sauna = document.getElementById("confirmation-sauna");
  let time = document.getElementById("confirmation-time");
  let date = document.getElementById("confirmation-date");
  let saunaTime = document.getElementById("confirmation-sauna-time");
  let courtOverlay = document.getElementById("confirmation-court-image");
  let saunaOverlay = document.getElementById("confirmation-sauna-image");

  // Clear the values of the elements
  name.innerText = "[name]";
  court.innerText = "[court]";
  time.innerText = "[time]";
  date.innerText = "[date]";
  saunaTime.innerText = "[sauna-time]";

  // Clear the path to the overlay image
  courtOverlay.src = "";

  // Remove the binding of document.keydown
  // TODO: Cannot remove the binding since I'm passing arguments :@
  //       I'll have to write a wrapper function for this to work..
  //document.removeEventListener("keydown", onDocumentKeyDown);

  // Hide the sauna message
  sauna.style.display = "none";
  saunaOverlay.classList.remove("facilities-overlay-display");

  // Hide the popup message
  popup.style.display = "none";
}

function onDocumentKeyDown(e) {
  // The purpose of this function is to be able to close the booking
  // confirmation popup message by pressing enter or escape

  if (e.key === "Enter" || e.key === "Escape") {
    if (document.getElementById("popup").style.display !== "none") {
      hideBookingConfirmation();
    }
  }
}

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
  if (hour % sessionLength == 1) hour += sessionLength - 1;

  // Make sure that the time falls within the set limits
  if (hour > lastAvailableTime) {
    hour = firstAvailableTime; // Set to the first available time
    day += 1; // Increment to the next day
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

function setFocus(id) {
  // Set focus to a input field and scroll the element into view
  let element = document.getElementById(id);
  collapseAll();

  // Only scroll if on desktop
  let isMobile = window.matchMedia(
    "only screen and (max-width: 1100px)"
  ).matches;
  if (!isMobile) {
    // Workaround: Delay the scrolling by 100ms in order to allow
    // checkboxes to be toggled when clicked.
    setTimeout(function () {
      element.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }
}

function validateTime(control) {
  // This function will validate the value of the time field
  let timeArray = control.value.split(":");

  let hour = parseInt(timeArray[0]);
  let minute = parseInt(timeArray[1]);

  // Reset the class
  timeControl.className = "";

  let date = new Date(document.getElementById("booking-date").value);
  let now = new Date();

  if (date.toLocaleDateString() == now.toLocaleDateString()) {
    // Same day
    if (hour <= now.getHours()) {
      setErrorDescription(control, "Tiden har redan passerat.");
      return false;
    }
  }

  if (minute != 0) {
    setErrorDescription(control, "Endast hela timmar kan väljas.");
    return false;
  } else if (hour < firstAvailableTime) {
    setErrorDescription(
      control,
      "Välj en tid som är lika med eller senare än " +
        String(firstAvailableTime).padStart(2, "0") +
        ":00."
    );
    return false;
  } else if (hour > lastAvailableTime) {
    setErrorDescription(
      control,
      "Välj en tid som är lika med eller tidigare än " +
        String(lastAvailableTime).padStart(2, "0") +
        ":00."
    );
    return false;
  } else if (hour % sessionLength != 0) {
    setErrorDescription(control, "Den valda tiden passerar ett annat pass.");
    return false;
  }

  // Check if there are any available courts this date and time
  if (checkForAvailableSession()) {
    // Store the value of the control
    storeValue(control);
    return true;
  }

  // No session was available at this date and time
  return false;
}

function validateEmail(control) {
  let prefix = "";
  let assignerCount = 0;
  let domain = "";
  let extension = "";
  let mode = 0;

  let value = control.value;

  // Analyze the value
  // Iterate through all characters of the input
  for (var i = 0; i < value.length; i++) {
    let c = value.charAt(i);

    if (c == "@") {
      assignerCount++;
      if (mode == 0) {
        mode = 1;
      }
    } else if (c == "." && mode == 1) {
      mode = 2;
    } else {
      if (mode === 0) {
        prefix += c;
      } else if (mode === 1) {
        domain += c;
      } else if (mode === 2) {
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
  if (prefix == "") {
    setErrorDescription(
      control,
      "Email-addressen saknar en prefix " + formatString
    );
    return false;
  } else if (assignerCount === 0) {
    setErrorDescription(
      control,
      "Email-addressen saknar ett snabel-a (@) " + formatString
    );
    return false;
  } else if (assignerCount > 1) {
    setErrorDescription(
      control,
      "Email-addressen innehåller för många snabel-a (@) " + formatString
    );
    return false;
  } else if (domain === "") {
    setErrorDescription(
      control,
      "Email-addressen saknar ett domän " + formatString
    );
    return false;
  } else if (extension === "") {
    setErrorDescription(
      control,
      "Email-addressen saknar en ändelse " + formatString
    );
    return false;
  }

  // Store the value of the control
  storeValue(control);

  return true;
}

function checkForAvailableSession(control) {
  date = new Date(document.getElementById("booking-date").value);
  time = document.getElementById("booking-time").value;
  date = new Date(`${date.toLocaleDateString()} ${time}`);
  let indoors = document.getElementById("booking-indoors").checked;

  if (bookingManager.isSessionAvailable(date, indoors)) {
    // Store the value of the control
    if (control) storeValue(control);

    // Reset eventual errors
    resetError(document.getElementById("booking-date"));
    resetError(document.getElementById("booking-time"));

    return true;
  }

  // No session was available at this date and time
  let isDateControl = control != null;
  if (!control) control = document.getElementById("booking-time");

  // Set the error description
  setErrorDescription(
    control,
    `Det finns tyvärr inga lediga ${
      indoors ? "inomhus" : "utomhus"
    }banor denna ${isDateControl ? "dag och tid" : "tid och dag"}.`
  );

  return false;
}

function validatePhoneNumber(control) {
  // Make sure no characters are present

  let value = control.value;
  let format = "[format: 070-00 00 00 eller 011-00 00 00]";
  let error = false;

  let numbersOnly = "";
  let separatorCount = 0;
  for (let i = 0; i < value.length; i++) {
    let c = value.charAt(i);

    if (isNaN(parseInt(c, 10))) {
      if (c === "-") {
        if (++separatorCount !== 1) {
          setErrorDescription(
            control,
            `Telefonnummret får endast innehålla ett bindestreck ${format}.`
          );
          error = true;
          return;
        }
      } else if (c === "+") {
        if (i !== 0) {
          setErrorDescription(
            control,
            `Telefonnummret får endast innehålla ett plus tecken i början av strängen ${format}.`
          );
          error = true;
          return;
        }
      } else if (c === " ") {
        // Allowed
      } else {
        setErrorDescription(
          control,
          `Telefonnummret får inte innehålla bokstäver eller tecken (förutom ett bindestreck) ${format}.`
        );
        error = true;
        return;
      }
    } else {
      numbersOnly += c;
    }
  }

  // Check for warnings (does not affect validation status)
  if (
    numbersOnly.length > 0 &&
    (numbersOnly.length < 5 || numbersOnly.length > 15)
  ) {
    setErrorDescription(
      control,
      `Det här verkar inte vara ett riktigt telefonnummer? Vänligen kontrollera att du har fyllt i rätt.`,
      true
    );
  }

  // Store the value of the control
  storeValue(control);

  if (debugFormValidation) console.log("Phone number: " + numbersOnly);

  return !error;
}

function setErrorDescription(control, message, warning = false) {
  // Display an validation error (or warning) description below the control that
  // failed the validation check.
  control.className = !warning ? "error" : "warning";
  const errorDescControl = document.getElementById(control.id + "-error-desc");

  if (!warning) {
    errorDescControl.classList.remove("warning");
  } else {
    errorDescControl.classList.add("warning");
  }

  errorDescControl.textContent = message;
  errorDescControl.style.display = "block";
}

function resetError(control) {
  // Hide the validation error description below the specified control
  control.className = "";
  const errorDescControl = document.getElementById(control.id + "-error-desc");
  errorDescControl.textContent = "";
  errorDescControl.style.display = "none";
}
