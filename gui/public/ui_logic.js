/**
 * @constructor
 * Generate graphics for the time selector.
 * Make sure its parent element is a block element.
 *
 * @requires module:data_types
 * 
 * @param {DOMElement} container The element object you want this to be in.
 * @param {string} type Specify if it is for hours (hr), minutes (min), or seconds (sec).
 * @param {Time} timeObj The time object you want to control. Passed as reference.
 */
function InputTimeDropdown( container, type, timeObj ) {
  // Constants.
  var nHh = 24;
  var nMm = 60;
  var nSs = 60;
  
  // Check if the container is not for the dropdown. Make sure this is specified first.
  if( container.classList[ 0 ] !== "dropdown" ) {
    console.error( "DOM Selection Error: This does not have the class \"dropdown.\"" );
  }
  
  // Dropdown face in the container.
  var face = document.createElement( "button" );
  face.type = "button";
  face.classList.add( "btn", "btn-primary", "dropdown-toggle" );
  face.setAttribute( "data-toggle", "dropdown" );
  
  // Dropdown menu in the container.
  var menu = document.createElement( "div" );
  menu.classList.add( "dropdown-menu" );
  
  // Dropdown entries inside the menu.
  // List of entries as anchor elements.
  var entryList = [];
  
  // Set the time.
  var selectAction = function( event ) {};
  
  switch( type ) {
	case "hr":
	  for( var i = 0; i < nHh; i++ ) {
        entryList[ i ] = document.createElement( "div" );
		entryList[ i ].classList.add( "dropdown-item" );
		entryList[ i ].setAttribute( "data-number", i );
		entryList[ i ].textContent = i;
	  }
	  
	  // Show the hour value.
	  face.textContent = timeObj.getTime().hr;
	  
	  selectAction = function() {
		var selectedValue = event.target.getAttribute( "data-number" );
	  
		// Convert from string to integer.
		var selectedValueNumber = selectedValue|0;
		  
		// Only do something when it selects an entry from the menu.
		if( typeof selectedValue !== "object" ) {
		  // Modify the timeObj.
		  timeObj.setHr( selectedValueNumber );
		  
		  // Show the hour value.
		  face.textContent = timeObj.getTime().hr;
		}
	  }
	  
	  break;
	case "min":
	  for( var i = 0; i < nMm; i++ ) {
        entryList[ i ] = document.createElement( "div" );
		entryList[ i ].classList.add( "dropdown-item" );
		entryList[ i ].setAttribute( "data-number", i );
		entryList[ i ].textContent = i;
	  }
	  
	  // Show the minute value.
	  face.textContent = timeObj.getTime().min;
	  
	  selectAction = function() {
		var selectedValue = event.target.getAttribute( "data-number" );
	  
		// Convert from string to integer.
		var selectedValueNumber = selectedValue|0;
		  
		// Only do something when it selects an entry from the menu.
		if( typeof selectedValue !== "object" ) {
		  // Modify the timeObj.
		  timeObj.setMin( selectedValueNumber );
		  
		  // Show the minute value.
		  face.textContent = timeObj.getTime().min;
		}
	  }
	  
	  break;
	case "sec":
	  for( var i = 0; i < nSs; i++ ) {
        entryList[ i ] = document.createElement( "div" );
		entryList[ i ].classList.add( "dropdown-item" );
		entryList[ i ].setAttribute( "data-number", i );
		entryList[ i ].textContent = i;
	  }
	  
	  // Show the second value.
	  face.textContent = timeObj.getTime().sec;
	  
	  selectAction = function() {
		var selectedValue = event.target.getAttribute( "data-number" );
	  
		// Convert from string to integer.
		var selectedValueNumber = selectedValue|0;
		  
		// Only do something when it selects an entry from the menu.
		if( typeof selectedValue !== "object" ) {
		  // Modify the timeObj.
		  timeObj.setSec( selectedValueNumber );
		  
		  // Show the hour value.
		  face.textContent = timeObj.getTime().sec;
		}
	  }
	  
	  break;
    default:
	  console.error( "Time error: Type is not either in hours, minutes, or seconds." )
  }

  // Set the time based on which menu entry is clicked.
  menu.addEventListener( "mouseup", selectAction );
  
  // Append the time entries in the menu.
  for( var i = 0; i < entryList.length; i++ ) {
	menu.appendChild( entryList[ i ] );
  }
  
  // Append these elements to the container element.
  container.appendChild( face );
  container.appendChild( menu );
}