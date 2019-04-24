/**
 * @file Box Farm data types used by the GUI internally.
 * It can also convert from non-Box Farm types.
 * Has no external dependencies.
 * @projectname Box Farm GUI
 * @version 0.5
 * @author Control Subsystem
 * @copyright 2018-2019
 */

/**
 * Time
 * @constructor
 * @description Stores the time with hours, minutes, and seconds from 00:00:00 to 23:59:59.
 * It is modifiable and can convert to select data formats.
 * Make sure the time values do not exceed +/-( 2^32/2 - 1 ).
 * @param {string} timeStr Time in hh:mm:ss or hh:mm.
 */
function Time( timeStr ) {
  var self = this;
  
  // Any bitwise operations on numbers are treated as 32-bit signed integers.
  var MAX_VALUE = Math.pow( 2, 32 )/2 - 1;
  
  // Check input.
  if( typeof timeStr !== "string" ) {
    console.error( "Time Input Error: This is not a time string." );
    
    return;
  }
  
  // Parse time string.
  var timeArr = timeStr.split( ":" );
  
  // *The time information is stored here.*
  // 0: hour, 1: minute, 2: second.
  var hhmmss = [];
  
  // Check if time value is good (true) or bad (false).
  // Type: 0 - hour, 1 - minute, 2 - second.
  function isValidTime( val, type ) {
    // Check if val is a value that cannot be converted to number.
    if( isNaN( val ) ) {
      console.error( "Time Input Error: Value is not allowed." );
      
      // Use to cancel.
      return false;
    }
    
    // Check if val exceeds +/-( 2^32/2 - 1 ).
    if( Math.abs( val ) > MAX_VALUE ) {
      console.error( "Time Input Error: Value exceeds the allowed limit." );
      
      // Use to cancel.
      return false;
    }
    
    // Check the hour value.
    if( type === 0 && ( val < 0 || val > 23 ) ) {
      console.error( "Time Input Error: Value is not in between 0 and 23." );
      
      // Use to cancel.
      return false;
    // Check other values.
    } else if( val < 0 || val > 59 ) {
      console.error( "Time Input Error: Value is not in between 0 and 59." );
      
      // Use to cancel.
      return false;
    } else {
      return true;
    }
  }
  
  // Assume it is in the order of hours, minutes, and seconds.
  for( var i = 0, val = 0; i < timeArr.length; i++ ) {
    // The time digit.
    val = timeArr[ i ];
    
    // Cancel if the time string is invalid.
    if( !isValidTime( val, i ) ) {
      return;
    }
    
    // Convert each hour, minute, and second from string to integer.
    hhmmss.push( val|0 );
  }
  
  // Check if there are enough digits that represent time.
  if( hhmmss.length === 3 ) {
    // No need to do anything.
  } else if( hhmmss.length === 2 ) {
    // Set the seconds (should be the last entry) to zero.
    hhmmss.push( 0 );
  } else {
    console.error( "Time Format Error: Time string is not parsed correctly." );
    
    // Cancel.
    return;
  }
  
  // Utility functions.
  /**
   * Add zero in front of time digits (if single digit). 
   * @method doubleDigit
   * @memberof Time
   * @instance
   * @param {number} timeVal The hour, minute, or second value.
   * @return {string} The hour, minute, or second value.
   */
  this.doubleDigit = function( timeVal ) {
    return timeVal < 10 ? "0" + timeVal : "" + timeVal;
  }
  
  // Obtain the stored time.
  /**
   * Get the stored time as an object.
   * @method getTime
   * @memberof Time
   * @instance
   * @return {object} Stored time in { hr: ..., min: ..., sec: ... }.
   */
  this.getTime = function() {
    return {
       hr: hhmmss[ 0 ],
      min: hhmmss[ 1 ],
      sec: hhmmss[ 2 ]
    };
  };
  
  /**
   * Get the stored time as a formatted time string.
   * @method getTimeStr
   * @memberof Time
   * @instance
   * @param {boolean} withSec If true, include the seconds.
   * @return {string} Stored time in "hh:mm" or "hh:mm:ss".
   */
  this.getTimeStr = function( withSec ) {
    var fmtdHmhhss = [];
    
    for( var i = 0; i < hhmmss.length; i++ ) {
      // Exclude the second value if requested.
      if( !withSec && i >= 2 ) {
        break;
      }
      
      fmtdHmhhss.push( self.doubleDigit( hhmmss[ i ] ) );
    }
    
    return fmtdHmhhss.join( ":" );
  };
  
  /**
   * Get the stored time and convert to amount of seconds since 00:00.
   * Can be used to compare which time is earlier than the other.
   * @method getSeconds
   * @memberof Time
   * @instance
   * @return {number} Amount of seconds since 00:00.
   */
  this.getSeconds = function() {
    // 1 hr = 3600 s.
    // 1 min = 60 s.
    return 3600*hhmmss[ 0 ] + 60*hhmmss[ 1 ] + hhmmss[ 2 ];
  };
  
  // Modify the time.
  /**
   * Change the stored time via an object.
   * @method setTime
   * @memberof Time
   * @instance
   * @param {object} hhmmssObj Time in { hr: ..., min: ..., sec: ... }.
   * @return {object} Stored time in { hr: ..., min: ..., sec: ... } or empty object if the time is invalid.
   */
  this.setTime = function( hhmmssObj ) {
    // Ensure that the digits are stored as integers.
    var hh = hhmmssObj.hr;
    var mm = hhmmssObj.min;
    var ss = hhmmssObj.sec; // Sets to zero if undefined.
    
    // Check the input.
    if( !isValidTime( hh, 0 ) ) {
      // Cancel.
      return {};
    }
    if( !isValidTime( mm, 1 ) ) {
      // Cancel.
      return {};
    }
    if( !isValidTime( ss, 2 ) ) {
      // Cancel.
      return {};
    }
    
    // Fill it in.
    hhmmss[ 0 ] = hh|0;
    hhmmss[ 1 ] = mm|0;
    hhmmss[ 2 ] = ss|0;
    
    return self.getTime();
  };
  
  /**
   * Change the hour value.
   * @method setHr
   * @memberof Time
   * @instance
   * @param {number} hr The hour value.
   * @return {boolean} If true, the time is updated. 
   * If false, the value is invalid and the time would not be updated.
   */
  this.setHr = function( hr ) {
    if( !isValidTime( hr, 0 ) ) {
      return false;
    } else {
      hhmmss[ 0 ] = hr|0;
      return true;
    }
  };
  
  /**
   * Change the minute value.
   * @method setMin
   * @memberof Time
   * @instance
   * @param {number} min The minute value.
   * @return {boolean} If true, the time is updated. 
   * If false, the value is invalid and the time would not be updated.
   */
  this.setMin = function( min ) {
    if( !isValidTime( min, 1 ) ) {
      return false;
    } else {
      hhmmss[ 1 ] = min|0;
      return true;
    }
  };
  
  /**
   * Change the second value.
   * @method setSec
   * @memberof Time
   * @instance
   * @param {number} hr The second value.
   * @return {boolean} If true, the time is updated. 
   * If false, the value is invalid and the time would not be updated.
   */
  this.setSec = function( sec ) {
    if( !isValidTime( sec, 2 ) ) {
      return false;
    } else {
      hhmmss[ 2 ] = sec|0;
      return true;
    }
  };
}