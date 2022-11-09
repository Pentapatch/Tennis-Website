function validateTime(control) {
    // const timeControl = document.getElementById('booking-time');
    let timeArray = control.value.split(":");
    
    let hour = parseInt(timeArray[0]);
    let minute = parseInt(timeArray[1]);

    // Reset the class
    timeControl.className = "";

    if (minute != 0){
        setErrorMessage(control, "Endast hela timmar kan väljas.");
    }
    else if (hour < firstAvailableTime){
        setErrorMessage(control, "Välj en tid som är lika med eller senare än " + String(firstAvailableTime).padStart(2, "0") + ":00.");
    }
    else if (hour > lastAvailableTime){
        setErrorMessage(control, "Välj en tid som är lika med eller tidigare än " + String(lastAvailableTime).padStart(2, "0") + ":00.");
    }
    else if (hour % lengthOfBooking != 0){
        setErrorMessage(control, "Den valda tiden passerar ett annat pass.");
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
            if (mode == 0)
            {
                prefix += c;
            }
            else if (mode == 1)
            {
                domain += c;
            }
            else if (mode == 2)
            {
                extension += c;
            }
        }
    }

    // Debug
    // alert("Prefix: '" + prefix + "'");
    // alert("Domain: '" + domain + "'");
    // alert("Extension: '" + extension + "'");

    // Set validation error message
    let formatString = "[format: prefix@domän.ändelse].";
    if (prefix == "")
    {
        setErrorMessage(control, "Email-addressen saknar en prefix " + formatString);
    }
    else if (assignerCount == 0)
    {
      setErrorMessage(control, "Email-addressen saknar ett snabel-a (@) " + formatString);
    }
    else if (assignerCount > 1)
    {
      setErrorMessage(control, "Email-addressen innehåller för många snabel-a (@) " + formatString);
    }
    else if (domain == "")
    {
      setErrorMessage(control, "Email-addressen saknar ett domän " + formatString);
    }
    else if (extension == "")
    {
      setErrorMessage(control, "Email-addressen saknar en ändelse " + formatString);
    }

}

function validateDate(control){

}

function validatePhoneNumber(control){
  
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