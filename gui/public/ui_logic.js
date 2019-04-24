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
      
      // Show the hour value.
      face.textContent = timeObj.doubleDigit( timeObj.getTime().hr );
      
      selectAction = function( event ) {
        var selectedValue = event.target.getAttribute( "data-number" );
        
        // Convert from string to integer.
        var selectedValueNumber = selectedValue|0;
          
        // Only do something when it selects an entry from the menu.
        if( typeof selectedValue !== "object" ) {
          // Modify the timeObj.
          timeObj.setHr( selectedValueNumber );
          
          // Show the hour value.
          face.textContent = timeObj.doubleDigit( timeObj.getTime().hr );
        }
      };
      
      updateVisuals = function() {
        // Update the hour value.
        face.textContent = timeObj.doubleDigit( timeObj.getTime().hr );
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
      
      // Show the minute value.
      face.textContent = timeObj.doubleDigit( timeObj.getTime().min );
      
      selectAction = function( event ) {
        var selectedValue = event.target.getAttribute( "data-number" );
        
        // Convert from string to integer.
        var selectedValueNumber = selectedValue|0;
          
        // Only do something when it selects an entry from the menu and
        // not anywhere else on the menu.
        if( typeof selectedValue !== "object" ) {
          // Modify the timeObj.
          timeObj.setMin( selectedValueNumber );
          
          // Show the minute value.
          face.textContent = timeObj.doubleDigit( timeObj.getTime().min );
        }
      };
      
      updateVisuals = function() {
        // Update the minute value.
        face.textContent = timeObj.doubleDigit( timeObj.getTime().min );
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
      
      // Show the second value.
      face.textContent = timeObj.doubleDigit( timeObj.getTime().sec );
      
      selectAction = function( event ) {
        var selectedValue = event.target.getAttribute( "data-number" );
        
        // Convert from string to integer.
        var selectedValueNumber = selectedValue|0;
          
        // Only do something when it selects an entry from the menu.
        if( typeof selectedValue !== "object" ) {
            // Modify the timeObj.
            timeObj.setSec( selectedValueNumber );
            
            // Show the hour value.
            face.textContent = timeObj.doubleDigit( timeObj.getTime().sec );
        }
      };
      
      updateVisuals = function() {
        // Update the second value.
        face.textContent = timeObj.doubleDigit( timeObj.getTime().sec );
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
    } else {
      console.warn( "There are no confirmation messages to show." );
    }
    
    return {
      msg: currentMsg,
      okAction: currentOkAction,
      cancelAction: currentCancelAction
    };
  };
}