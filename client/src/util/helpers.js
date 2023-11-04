export function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
}


export function getDateOfExpiration(tokenExp) {
  const [value, unit] = tokenExp.match(/\d+|[a-zA-Z]+/g);
  const timeSlip = 5;
  const expirationTimestamp = new Date();

  switch (unit) {
    case "d":
      expirationTimestamp.setDate(expirationTimestamp.getDate() + parseInt(value, 10));
      break;
    case "h":
      expirationTimestamp.setHours(expirationTimestamp.getHours() + parseInt(value, 10));
      break;
    case "y":
      expirationTimestamp.setFullYear(expirationTimestamp.getFullYear() + parseInt(value, 10));
      break;
    default:
      // Handle other units as needed
      break;
  }

  return expirationTimestamp.setMinutes(expirationTimestamp.getMinutes() - timeSlip);
}


// returns true if the time left on token is greater than timeGap defined below
export function checkValidTokenExpiration(tokenTime) {
  // time of expiration
  const expiring = new Date(tokenTime);
  // time now
  const timeNow = new Date();

  // difference in milliseconds
  const timeDifference = expiring - timeNow;
  // difference in minutes
  const timeLeftInMinutes = Math.floor(timeDifference / 60000);

  // The allowable time in minutes before expiration
  const timeGap = 5;

  // if time left is smaller or equal return false
  if (timeLeftInMinutes <= timeGap) {
    return false 
  } 

  return true;

}
