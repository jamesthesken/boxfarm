/**
 * @constructor
 * To make time "readable" by UI.
 * 
 * @param {string} timeStr Time in hh:mm:ss or hh:mm
 */
function Time( timeStr ) {
  var self = this;
  
  // Parse time string.
  var timeArr = timeStr.split(":");
  
  // 0: hour, 1: minute, 2: second.
  var hhmmss = [];
  
  // Assume it is in the order of hours, minutes, and seconds.
  for( var i = 0; i < timeArr.length; i++ ) {
    // Convert each hour, minute, and second from string to integer.
    hhmmss.push( timeArr[ i ]|0 )
  }
  
  // Check if there are enough digits that represent time.
  if( hhmmss.length === 3 ) {
    // No need to do anything.
  } else if( hhmmss.length === 2 ) {
    // Set the seconds (should be the last entry) to zero.
    hhmmss.push( 0 );
  } else {
    console.error( "Time Format Error: Time string is not parsed correctly." );
    
    // End here.
    return;
  }
  
  // Check if hours, minutes, and seconds are valid values.
  /* Add here. */
  
  this.getTime = function() {
    return {
       hr: hhmmss[ 0 ],
      min: hhmmss[ 1 ],
      sec: hhmmss[ 2 ]
    };
  };
  
  // In { hr: ..., min: ..., sec: ... }
  this.setTime = function( hhmmssObj ) {
    hhmmss[ 0 ] = hhmmssObj.hr;
    hhmmss[ 1 ] = hhmmssObj.min;
    
    // Set the seconds to zero if unspecified.
    if( typeof hhmmssObj.sec === "number" ) {
      hhmmss[ 2 ] = hhmmssObj.sec;
    } else {
          hhmmss[ 2 ] = 0;
    }
  };
  
  this.setHr = function( hr ) {
    hhmmss[ 0 ] = hr;
  };
  
  this.setMin = function( min ) {
    hhmmss[ 1 ] = min;
  };
  
  this.setSec = function( sec ) {
    hhmmss[ 2 ] = sec;
  };
  
  // Utility functions.
  // Add zero in front of time digits. Always returns a string.
  this.doubleDigit = function( timeVal ) {
    return timeVal < 10 ? "0" + timeVal : timeVal;
  }
}