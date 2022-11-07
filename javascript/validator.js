function validateTime(control) {
    // const timeControl = document.getElementById('booking-time');
    let timeArray = control.value.split(":");
    
    let hour = parseInt(timeArray[0]);
    let minute = parseInt(timeArray[1]);

    // Reset the class
    timeControl.className = "";

    if (minute != 0){
        setErrorMessage(timeControl, "Endast hela timmar kan väljas.");
    }
    else if (hour < firstAvailableTime){
        setErrorMessage(timeControl, "Välj en tid som är lika med eller senare än " + String(firstAvailableTime).padStart(2, "0") + ":00.");
    }
    else if (hour > lastAvailableTime){
        setErrorMessage(timeControl, "Välj en tid som är lika med eller tidigare än " + String(lastAvailableTime).padStart(2, "0") + ":00.");
    }
    else if (hour % lengthOfBooking != 0){
        setErrorMessage(timeControl, "Den valda tiden passerar ett annat pass.");
    }
    
  }

  function resetError(control){
    control.className = "";
    const errorDescControl = document.getElementById(control.id + "-error-desc");
    errorDescControl.textContent = "";
    errorDescControl.style.display = "none";
  }

  function setErrorMessage(control, message){
    control.className = "error";
    const errorDescControl = document.getElementById(control.id + "-error-desc");
    errorDescControl.textContent = message;
    errorDescControl.style.display = "block";
  }