/**
 * @file Place for interface controls and logic.
 * Can directly manipulate webpages.
 * @projectname Box Farm GUI
 * @version 0.5.4
 * @author Control Subsystem
 * @copyright 2018-2019
 */
 
/**
 * Enable button functionality.
 * @constructor
 * @param {DOMElement} button The DIV element object you want the dropdowns to be in. 
 * It needs to have "dropdown" as the first parameter of the class attribute. Passed as reference.
 * @param {function} action What the button will do when the button is released (after pressing down).
 * The MouseEvent object would be passed to this function.
 */
function Button( button, action ) {
  // Attach the button functionality.
  button.addEventListener(
    "mouseup",
    action
  );
}

/**
 * Generate graphics for the time selector.
 * Make sure its parent element is a block element.
 * @constructor
 * @requires module:Bootstrap
 * @requires module:data_types
 * @param {DOMElement} container The DIV element object you want the dropdowns to be in. 
 * It needs to have "dropdown" as the first parameter of the class attribute. Passed as reference.
 * @param {string} type Specify if the dropdown value is in hours (hr), minutes (min), or seconds (sec).
 * @param {Time} timeObj The time object you want to control. Passed as reference.
 */
function InputTimeDropdown( container, type, timeObj ) {
  // Constants.
  var N_HH = 24;
  var STEP_HH = 1;
  var N_MM = 60;
  var STEP_MM = 5;
  var N_SS = 60;
  var STEP_SS = 5;
  
  // States.
  var currentValue = 0;
  var hasChanged = false;
  
  // Check if the container is not for the dropdown. Make sure this is specified first.
  if( container.classList[ 0 ] !== "dropdown" ) {
    console.error( "DOM Selection Error: This does not have the class \"dropdown.\"" );
  }
  
  // Dropdown face in the container.
  var face = document.createElement( "button" );
  face.type = "button";
  
  // Dropdown color here. ----V
  face.classList.add( "btn", "btn-light", "dropdown-toggle" );
  face.setAttribute( "data-toggle", "dropdown" );
  
  // Dropdown menu in the container.
  var menu = document.createElement( "div" );
  menu.classList.add( "dropdown-menu" );
  
  // Dropdown entries inside the menu.
  // List of entries as anchor elements.
  var entryList = [];
  
  // Set the time.
  var selectAction = function( event ) {};
  
  // Show changes on the dropdown button.
  var updateVisuals = function() {};
  
  switch( type ) {
    case "hr":
      // Fill up the menu with entries.
      for( var i = 0; i < N_HH/STEP_HH; i++ ) {
        entryList[ i ] = document.createElement( "div" );
        entryList[ i ].classList.add( "dropdown-item" );
        entryList[ i ].setAttribute( "data-number", STEP_HH*i );
        entryList[ i ].textContent = timeObj.doubleDigit( STEP_HH*i );
      }
      
      // Set the hour value.
      currentValue = timeObj.getTime().hr;
      
      // Show the hour value.
      face.textContent = timeObj.doubleDigit( currentValue );
      
      selectAction = function( event ) {
        var selectedValue = event.target.getAttribute( "data-number" );
        
        // Convert from string to integer.
        var selectedValueNumber = selectedValue|0;
          
        // Only do something when it selects an entry from the menu.
        if( typeof selectedValue !== "object" ) {
          // Modify the timeObj.
          timeObj.setHr( selectedValueNumber );
          
          // Set current value;
          currentValue = timeObj.getTime().hr;
          
          // Show the hour value.
          face.textContent = timeObj.doubleDigit( currentValue );
        }
      };
      
      updateVisuals = function() {
        // Set the hour value.
        currentValue = timeObj.getTime().hr;
        
        // Update the hour value.
        face.textContent = timeObj.doubleDigit( currentValue );
      };
      
      break;
    case "min":
      // Fill up the menu with entries.
      for( var i = 0; i < N_MM/STEP_MM; i++ ) {
        entryList[ i ] = document.createElement( "div" );
        entryList[ i ].classList.add( "dropdown-item" );
        entryList[ i ].setAttribute( "data-number", STEP_MM*i );
        entryList[ i ].textContent = timeObj.doubleDigit( STEP_MM*i );
      }
      
      // Set the minute value.
      currentValue = timeObj.getTime().min;
      
      // Show the minute value.
      face.textContent = timeObj.doubleDigit( currentValue );
      
      selectAction = function( event ) {
        var selectedValue = event.target.getAttribute( "data-number" );
        
        // Convert from string to integer.
        var selectedValueNumber = selectedValue|0;
          
        // Only do something when it selects an entry from the menu and
        // not anywhere else on the menu.
        if( typeof selectedValue !== "object" ) {
          // Modify the timeObj.
          timeObj.setMin( selectedValueNumber );
          
          // Set current value;
          currentValue = timeObj.getTime().min;
          
          // Show the minute value.
          face.textContent = timeObj.doubleDigit( currentValue );
        }
      };
      
      updateVisuals = function() {
        // Set current value;
        currentValue = timeObj.getTime().min;
        
        // Update the minute value.
        face.textContent = timeObj.doubleDigit( currentValue );
      };
      
      break;
    case "sec":
      // Fill up the menu with entries.
      for( var i = 0; i < N_SS/STEP_SS; i++ ) {
        entryList[ i ] = document.createElement( "div" );
        entryList[ i ].classList.add( "dropdown-item" );
        entryList[ i ].setAttribute( "data-number", STEP_SS*i );
        entryList[ i ].textContent = timeObj.doubleDigit( STEP_SS*i );
      }
      
      // Set the second value.
      currentValue = timeObj.getTime().sec;
      
      // Show the second value.
      face.textContent = timeObj.doubleDigit( currentValue );
      
      selectAction = function( event ) {
        var selectedValue = event.target.getAttribute( "data-number" );
        
        // Convert from string to integer.
        var selectedValueNumber = selectedValue|0;
          
        // Only do something when it selects an entry from the menu.
        if( typeof selectedValue !== "object" ) {
          // Modify the timeObj.
          timeObj.setSec( selectedValueNumber );
          
          // Set current value;
          currentValue = timeObj.getTime().sec;
          
          // Show the hour value.
          face.textContent = timeObj.doubleDigit( currentValue );
        }
      };
      
      updateVisuals = function() {
        // Set the second value.
        currentValue = timeObj.getTime().sec;
        
        // Update the second value.
        face.textContent = timeObj.doubleDigit( currentValue );
      };
      
      break;
    default:
      console.error( "Time error: Type is not either in hours, minutes, or seconds." );
  }

  // Set the time based on which menu entry is clicked.
  menu.addEventListener( "mouseup", selectAction );
  
  /**
   * Add the dropdown to the container element. It is recommended to call this along with 
   * the addition of other elements for maximum performance.
   * @method applyAndShow
   * @memberof InputTimeDropdown
   * @instance
   */
  this.applyAndShow = function() {
    // Append the time entries in the menu.
    for( var i = 0; i < entryList.length; i++ ) {
      menu.appendChild( entryList[ i ] );
    }
      
    // Append these elements to the container element.
    container.appendChild( face );
    container.appendChild( menu );
  };
  
  /**
   * Update the appearance of the dropdowns after making value changes via Time.prototype.setTime(), etc. 
   * It is recommended to call this along with other appearance updates for maximum performance.
   * @method updateVisuals
   * @memberof InputTimeDropdown
   * @instance
   */
  this.updateVisuals = updateVisuals;
  
  this.onmouseup = function( event ) {
    
  };
}

/**
 * Creates and controls the alert modal with the messages stored in a stack.
 * There can only be a single instance of this per page.
 * @constructor
 */
function AlertModals() {
  var self = this;
  
  var msgStack = [];
  
  /**
   * Show the remaining amount of messages.
   * @method msgCount
   * @memberof AlertModals
   * @instance
   */
  this.msgCount = function() {
    return msgStack.length;
  };
  
  /**
   * Store an alert message and associated action.
   * @method add
   * @memberof AlertModals
   * @instance
   * @param {string} msgData The message.
   */
  this.add = function( msgData ) {
    msgStack.push( msgData );
  };
  
  /**
   * Open the alert modals one-by-one. When the modal is closed, 
   * its record will be removed.
   * @method open
   * @memberof AlertModals
   * @instance
   * @return {object} Contains {msg: ..., okAction: fn, cancelAction: fn}.
   */
  this.open = function() {
    // The confirmation message to show.
    // Also removes it from stack when used.
    var currentMsg = "";
    
    if( msgStack.length !== 0 ) {
      currentMsg = msgStack.pop();
      
      // Show alert.
      alert( currentMsg );
      
      self.open();
    } else {
      console.warn( "There are no alert messages to show." );
    }
    
    /*
    return {
      msg: currentMsg
    };
    */
  };
}

/**
 * Creates and controls the confirmation modal with the messages stored in a stack.
 * There can only be a single instance of this per page.
 * @constructor
 */
function ConfirmModals() {
  var self = this;
  
  var msgStack = [];
  var okFnStack = [];
  var cancelFnStack = [];
  
  /**
   * Show the remaining amount of messages.
   * @method msgCount
   * @memberof ConfirmModals
   * @instance
   */
  this.msgCount = function() {
    return msgStack.length;
  };
  
  /**
   * Store a confirmation message and associated actions.
   * @method add
   * @memberof ConfirmModals
   * @instance
   * @param {object} msgData Contains {msg: ..., okAction: fn, cancelAction: fn}.
   */
  this.add = function( msgData ) {
    msgStack.push( msgData.msg );
    okFnStack.push( msgData.okAction );
    cancelFnStack.push( msgData.cancelAction );
  };
  
  /**
   * Open the confirmation modal one-by-one. When the confirmation modal is closed, 
   * its record will be removed.
   * @method open
   * @memberof ConfirmModals
   * @instance
   * @return {object} Contains {msg: ..., okAction: fn, cancelAction: fn}.
   */
  this.open = function() {
    // The confirmation message to show.
    // Also removes it from stack when used.
    var currentMsg = "";
    var currentOkAction = function() {};
    var currentCancelAction = function() {};
    
    if( msgStack.length !== 0 ) {
      currentMsg = msgStack.pop();
      currentOkAction = okFnStack.pop();
      currentCancelAction = cancelFnStack.pop();
      
      // Show confirmation.
      if( confirm( currentMsg ) ) {
        currentOkAction();
      } else {
        currentCancelAction();
      }
      
      // Open the next one.
      self.open();
    } else {
      console.warn( "There are no confirmation messages to show." );
    }
    
    /*
    return {
      msg: currentMsg,
      okAction: currentOkAction,
      cancelAction: currentCancelAction
    };
    */
  };
}

function ProgressAnimation() {
  /*
  var circle = document.getElementById('one');
  var text = document.getElementById('percent-one');
  var angle = 0;
  var percent = 70*4.7

  window.timer = window.setInterval(function () {
    circle.setAttribute("stroke-dasharray", angle + ", 20000");
    text.innerHTML = parseInt(angle/471*100);

    if (angle >= percent) {
      window.clearInterval(window.timer);
    }
    angle += 6;
  }.bind(this), 30);
  */

  //---
  var radius = 90; // px.
  var realPercent = 0.5;
  var targetValue = 60;

  var circle1 = document.getElementById('two');
  var text1 = document.getElementById('percent-two');
  
  var angle1 = 0; // Changes with time.
  var percent1 = realPercent*2*Math.PI*radius; // End limit.
  
  var sPerFrame = 1000/60;
  
  function animate() {
    circle1.setAttribute("stroke-dasharray", angle1*radius + ", 20000");
    text1.innerHTML = Math.round(0.5*angle1*targetValue/Math.PI);
    
    angle1 += 0.015*Math.PI;
    
    if (angle1 >= 2*Math.PI*realPercent) {
      window.clearInterval(timer1);
    }
  }
  
  // Run every 33 ms.
  var timer1 = window.setInterval( function() {
    requestAnimationFrame( animate );
  }, sPerFrame );

  //---
  /*
  var circle2 = document.getElementById('three');
  var text2 = document.getElementById('percent-three');
  var angle2 = 0;
  var percent2 = 40*4.7

  window.timer2 = window.setInterval(function () {
    circle2.setAttribute("stroke-dasharray", angle2 + ", 20000");
    text2.innerHTML = parseInt(angle2/471*100);

    if (angle2 >= percent2) {
      window.clearInterval(window.timer2);
    }
    angle2 += 6;
  }.bind(this), 30);
  */
  
  this.setPercent = function( n ) {
    if( !isNaN( n ) ) {
      if( n >= 0 && n <= 1 ) {
        realPercent = n;
      } else if( n > 1 ) {
        realPercent = 1;
      } else {
        realPercent = 0;
      }
    }
  };
  
  this.setTarget = function( n ) {
    if( !isNaN( n ) ) {
      targetValue = n;
    }
  };
  
  this.restart = function() {
    // Reset.
    angle1 = 0;
    
    timer1 = window.setInterval( animate, sPerFrame );
  };
}