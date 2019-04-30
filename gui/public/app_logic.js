/**
 * @file Box Farm frontend application.
 * @projectname Box Farm GUI
 * @version 0.5.4
 * @author Control Subsystem
 * @copyright 2018-2019
 */

/**
 * @constructor
 * @description Registers and stores the settings data.
 * Can also send and receive settings data to and from the BoxBrain.
 * @requires module:jQuery
 * @requires Time
 */
function Settings() {
  var self = this;

  // Working storage. Contains Box Farm data.
  var main = {
    pumpCycles: [],
    lightCycles: [],
    robotImaging: {}
  };
  
  // Temporary storage. Contains Box Farm data.
  var temp = {
    pumpCycles: [],
    lightCycles: [],
    robotImaging: {}
  };
  
  // Will be imported from or exported to JSON. Acts like a draft for the settings file.
  // Should only contain primitive data that is compatible with BoxBrain.
  var settingsObj = {
    pumpCycles: [],
    lightCycles: [],
    robotImaging: {}
  };

  var settingsJSON = "";

  function addPumpCycle( settings, startTime, endTime ) {
    settings.pumpCycles.push(
      {
        startTime: startTime,
        endTime: endTime
      }
    );
  }

  /**
   * Add a pump cycle as defined by its start and end times.
   * @method addPumpCycle
   * @memberof Settings
   * @instance
   * @param {Time} startTime
   * @param {Time} endTime
   */
  this.addPumpCycle = function( startTime, endTime ) {
    addPumpCycle( main, startTime, endTime );
  };

  function getPumpCycle( settings, i ) {
    if( i < settings.pumpCycles.length ) {
      return settings.pumpCycles[ i ];
    } else {
      console.warn( "Warning: There is no pump cycle at this index. Amount of cycles: " + pumpCycles.length + "." );
      
      return { empty: true };
    }
  }
  
  /**
   * Get the pump cycle.
   * @method getPumpCycle
   * @memberof Settings
   * @instance
   * @return {object} The pump cycle consisting of a start time (Time instance) and
   * an end time (another Time instance) or an object that indicates if its empty.
   */
  this.getPumpCycle = function( i ) {
    return getPumpCycle( main, i );
  }
  
  function numPumpCycles( settings ) {
    return settings.pumpCycles.length;
  }
  
  /**
   * Get the number of pump cycles.
   * @method numPumpCycles
   * @memberof Settings
   * @instance
   * @return {number} The number of pump cycles.
   */
  this.numPumpCycles = function() {
    return numPumpCycles( main );
  };
  
  function clearPumpCycles( settings ) {
    settings.pumpCycles = [];
  }

  /**
   * Warning: Deletes all of the pump cycles. Used for refreshing the settings.
   * @method clearPumpCycles
   * @memberof Settings
   * @instance
   */
  this.clearPumpCycles = function() {
    clearPumpCycles( main );
  };
  
  function addLightCycle( settings, startTime, endTime ) {
    settings.lightCycles.push(
      {
        startTime: startTime,
        endTime: endTime
      }
    );
  }
  
  /**
   * Add a light cycle as defined by its start and end times.
   * @method addLightCycle
   * @memberof Settings
   * @instance
   * @param {Time} startTime
   * @param {Time} endTime
   */
  this.addLightCycle = function( startTime, endTime ) {
    addLightCycle( main, startTime, endTime );
  };
  
  function getLightCycle( settings, i ) {
    if( i < settings.lightCycles.length ) {
      return settings.lightCycles[ i ];
    } else {
      console.warn( "Warning: There is no light cycle at this index. Amount of cycles: " + lightCycles.length + "." );
      
      return { empty: true };
    }
  }
  
  /**
   * Get the light cycle.
   * @method getLightCycle
   * @memberof Settings
   * @instance
   * @return {object} The pump cycle consisting of a start time (Time instance) and
   * an end time (another Time instance) or an object that indicates if its empty.
   */
  this.getLightCycle = function( i ) {
    return getLightCycle( main, i );
  };
  
  function numLightCycles( settings ) {
    return settings.lightCycles.length;
  };

  /**
   * Get the number of light cycles.
   * @method numLightCycles
   * @memberof Settings
   * @instance
   * @return {number} The number of light cycles.
   */
  this.numLightCycles = function() {
    return numLightCycles( main );
  };
  
  function clearLightCycles( settings ) {
    settings.lightCycles = [];
  }
  
  /**
   * Warning: Deletes all of the light cycles. Used for refreshing the settings.
   * @method clearLightCycles
   * @memberof Settings
   * @instance
   */
  this.clearLightCycles = function() {
    clearLightCycles( main );
  };
  
  // Robot start times.
  function setRobotImagingTime( settings, time ) {
    if( time.constructor === Time ) {
      settings.robotImaging = {
        startTime: time
      };
    } else {
      // Handle error.
    }
  }
  
  /**
   * Set the time the robot would start its tasks.
   * @method setRobotImagingTime
   * @memberof Settings
   * @instance
   * @param {Time} startTime
   */
  this.setRobotImagingTime = function( time ) {
    setRobotImagingTime( main, time );
  };
  
  function getRobotImagingTime( settings ) {
    if( settings.robotImaging ) {
      return settings.robotImaging;
    } else {
      console.warn( "Warning: No robot imaging task start time specified." );
      
      return { empty: true };
    }
  }
  
  /**
   * Get the robot task start time.
   * @method getRobotImagingTime
   * @memberof Settings
   * @instance
   * @return {object} The task time consisting of a start time (Time instance) or 
   * an object that indicates if its empty.
   */
  this.getRobotImagingTime = function() {
    return getRobotImagingTime( main );
  };

  function clearRobotImagingTime( settings ) {
    settings.robotImaging = {};
  }
  
  /**
   * Warning: Deletes the specified robot imaging start time. Used for refreshing the settings.
   * @method clearRobotImagingTime
   * @memberof Settings
   * @instance
   */
  this.clearRobotImagingTime = function() {
    clearRobotImagingTime( main );
  };
  
  function check( settings, successAction, errorAction ) {
    //
    var problemPointer = {
      pass: true,
      pumpCycleProbIndex: [ -1, 0 ],
      lightCycleProbIndex: [ -1, 0 ]
    };
    
    // Check if there are any settings data to begin with.
    if( settings.pumpCycles.length <= 0 ) {
      problemPointer.pass = false;
      
      return problemPointer;
    };
    
    if( settings.lightCycles.length <= 0 ) {
      problemPointer.pass = false;
      
      return problemPointer;
    };
    
    if( !settings.robotImaging ) {
      problemPointer.pass = false;
      
      return problemPointer;
    };

    // Check if the pump cycle times are in order, which
    // means that there are no reversed or overlapping time cycles.
    function orderCheck( cyclesArray, problemIndex ) {
      var cyclesData = {
        timeArrays: []
      };

      for( var iPC = 0; iPC < cyclesArray.length; iPC++ ) {
        // Append all times (in seconds since 00:00) into a single list.
        cyclesData.timeArrays.push( cyclesArray[ iPC ].startTime.getSeconds() );
        cyclesData.timeArrays.push( cyclesArray[ iPC ].endTime.getSeconds() );
      }
      
      for( var iT = 0; iT < cyclesData.timeArrays.length - 1; iT++ ) {
        // Is the selected time later than the previous time?
        if( cyclesData.timeArrays[ iT + 1 ] > cyclesData.timeArrays[ iT ] ) {
          // OK
        } else {
          // Record the cycle that is out of order (comes in time pairs).
          problemIndex[ 0 ] = ( iT/2 )|0;
          // Record if it is the startTime (0) or the endTime (1).
          problemIndex[ 1 ] = iT%2;

          // Mark as a fail.
          problemPointer.pass = false;

          break;
        }
      }
    }

    // Check pump cycles.
    orderCheck( settings.pumpCycles, problemPointer.pumpCycleProbIndex );
    
    // Check light cycles.
    orderCheck( settings.lightCycles, problemPointer.lightCycleProbIndex );
    
    if( typeof successAction === "function" ) {
      if( problemPointer.pass ) {
        successAction( problemPointer );
      }
    }
    
    if( typeof errorAction === "function" ) {
      if( !problemPointer.pass ) {
        errorAction( problemPointer );
      }
    }
    
    return problemPointer;
  }

  /**
   * Check if the settings are in the correct format before saving it.
   * Ex. Find conflicting pump and light cycle times.
   * @method check
   * @memberof Settings
   * @instance
   * @param {function} successAction Call if the check was successful with the status passed to it.
   * @param {function} errorAction Call if the check fails with the status passed to it.
   * @return {object} The status of the check. It also include indices that point to the problem.
   */
  this.check = function( successAction, errorAction ) {
    return check( main, successAction, errorAction );
  };
  
  /**
   * Show where the input error is in the settings form.
   * It will interpret the error information passed from the check() method.
   * @method showInputError
   * @memberof Settings
   * @instance
   * @return An array of strings containing the information.
   */
  this.showInputError = function( problemPointer ) {
    var infoArr = [];
    var infoText = "";
    
    // Format pump cycle error.
    // Note: Index 0 - pump cycle, index 1 - time.
    if( problemPointer.pumpCycleProbIndex[ 0 ] !== -1 ) {
      // Show which pump cycle in the future.
      infoText = "Pump cycle";
      
      // Start of end cycle?
      switch( problemPointer.pumpCycleProbIndex[ 1 ] ) {
        case 0:
          infoText += ", \"on\" time"
          break;
        case 1:
          infoText += ", \"off\" time"
          break;
        default:
          // Do not add to the infoText.
      }
      
      infoText += ".";
      
      infoArr.push( infoText );
      infoText = "";
    }
    
    // Format light cycle error.
    // Note: Index 0 - light cycle, index 1 - time.
    if( problemPointer.lightCycleProbIndex[ 0 ] !== -1 ) {
      // Show which light cycle in the future.
      infoText = "Light cycle";
      
      // Start of end cycle?
      switch( problemPointer.lightCycleProbIndex[ 1 ] ) {
        case 0:
          infoText += ", \"on\" time"
          break;
        case 1:
          infoText += ", \"off\" time"
          break;
        default:
          // Do not add to the infoText.
      }
      
      infoText += ".";
      
      infoArr.push( infoText );
      infoText = "";
    }
    
    return infoArr;
  };
  
  /**
   * Make the settings permanent on the client. It will not send the settings to the BoxBrain.
   * @method save
   * @memberof Settings
   * @instance
   * @param {function} successAction Call if the settings save was successful with the status passed to it.
   * @param {function} errorAction Call if there is a problem during settings save with the status passed to it.
   */
  this.save = function( successAction, errorAction ) {
    var errorCheck = self.check();

    // Start fresh.
    settingsObj.pumpCycles = [];
    settingsObj.lightCycles = [];

    // Write pump cycle times.
    // Index == -1 means no problems in the pump cycles found.
    if( errorCheck.pumpCycleProbIndex[ 0 ] === -1 ) {
      for( var iPC = 0; iPC < main.pumpCycles.length; iPC++ ) {
        // Store times as formatted time strings.
        settingsObj.pumpCycles.push(
          {
            startTime: main.pumpCycles[ iPC ].startTime.getTimeStr(),
            endTime: main.pumpCycles[ iPC ].endTime.getTimeStr(),
          }
        );
      }
    } else {
      console.error( "Save Error: The pump cycle times have conflicts." );
      
      if( typeof errorAction === "function" ) {
        errorAction( errorCheck );
      }
      return false;
    }

    // Write light cycle times.
    // Index == 1 means no problems in the pump cycles found.
    if( errorCheck.lightCycleProbIndex[ 0 ] === -1 ) {
      for( var iPC = 0; iPC < main.lightCycles.length; iPC++ ) {
        // Store times as formatted time strings.
        settingsObj.lightCycles.push(
          {
            startTime: main.lightCycles[ iPC ].startTime.getTimeStr(),
            endTime: main.lightCycles[ iPC ].endTime.getTimeStr(),
          }
        );
      }
    } else {
      console.error( "Save Error: The light cycle times have conflicts." );
      
      if( typeof errorAction === "function" ) {
        errorAction( errorCheck );
      }
      return false;
    }
    
    // Write robot imaging time.
    settingsObj.robotImaging = {
      startTime: main.robotImaging.startTime.getTimeStr()
    };

    // If you make it here, it's going great!

    // Convert to JSON and save.
    settingsJSON = JSON.stringify( settingsObj );
    localStorage.setItem( "settings", settingsJSON );
    
    if( typeof successAction === "function" ) {
      successAction( errorCheck );
    }
    
    console.log( "Settings are saved." );
    
    return true;
  };

  /**
   * Send the current settings to the BoxBrain.
   * @method send
   * @memberof Settings
   * @instance
   */
  this.send = function( successAction, errorAction ) {
    $.ajax(
      {
        type: "POST",
        url: "/save",
        success: function( msg, status ) {
          console.log( "HTTP " + status );
          console.log( msg );

          successAction();
        },
        error: function( xhr, status, err ) {
          console.log( "HTTP " + status );
          console.error( "Comm Error: Bad connection to the BoxBrain." );

          errorAction();
        },
        data: { settingsJSON: localStorage.getItem( "settings" ) }
      }
    );
  };
  
  function load( settings, settingsJSON ) {
    
    try {
      // Fix for the case that a newly opened settings page does not load the
      // default time values.
      if( settingsJSON === null ) {
        // The craig fix.
        throw new Error( "settingsJSON is null, causing the parser to not fail." );
      }
      
      settingsObj = JSON.parse( settingsJSON );
      
      // Error out if the settings values are not there.
      if( settingsObj.pumpCycles.length <= 0 ) {
        // Another craig fix.
        throw new Error( "No pump cycles found. There needs to be one or more." );
      }
    } catch( ex ) {
      // Do this if the JSON parsing fails.
      console.error( "Load Error: Settings data does not exist." );

      // Load default times instead;
      addPumpCycle( settings, new Time( "6:00" ), new Time( "12:00" ) );
      addLightCycle( settings, new Time( "0:00" ), new Time( "6:00" ) );
      setRobotImagingTime( settings, new Time( "14:00" ) );
      
      self.save();

      console.log( "Default values are set instead." );

      return false;
    }

    // Start fresh.
    clearPumpCycles( settings );
    clearLightCycles( settings );
    clearRobotImagingTime( settings );
    
    // Load the pump cycles.
    for( var i = 0; i < settingsObj.pumpCycles.length; i++ ) {
      addPumpCycle(
        settings,
        new Time( settingsObj.pumpCycles[ i ].startTime ),
        new Time( settingsObj.pumpCycles[ i ].endTime )
      );
    }

    // Load the light cycles.
    for( var i = 0; i < settingsObj.lightCycles.length; i++ ) {
      addLightCycle(
        settings,
        new Time( settingsObj.lightCycles[ i ].startTime ),
        new Time( settingsObj.lightCycles[ i ].endTime )
      );
    }
    
    // Load the robot imaging task time.
    setRobotImagingTime( settings, new Time( settingsObj.robotImaging.startTime ) );
    
    return true;
  }
  
  /**
   * Load the settings that was saved. It will not pull settings data from the BoxBrain.
   * @method load
   * @memberof Settings
   * @instance
   */
  this.load = function() {
    console.log( "Settings are loaded." );
    
    return load( main, localStorage.getItem( "settings" ) );
  }
  
  /**
   * Gets the settins data from the BoxBrain and load it if valid.
   * Warning: It will overwrite the previous settings.
   * @method receive
   * @memberof Settings
   * @instance
   */
  this.receive = function( successAction, errorAction ) {
    $.ajax(
      {
        type: "POST",
        url: "/load",
        success: function( msg, status ) {
          console.log( "HTTP " + status );
          
          console.log( "Received the settings from BoxBrain successfully." );
          
          // Temporarily load the sent-in settins JSON and check it.
          load( temp, msg );
          
          if( check( temp ).pass ) {
            // Save this.
            localStorage.setItem( "settings", msg );
            
            // Load the imported settings for real.
            load( main, msg );
            
            console.log( "Settings are loaded successfully." );
            
            // Clean up.
            clearPumpCycles( temp );
            clearLightCycles( temp );
            clearRobotImagingTime( temp );
          } else {
            console.warn( "Import warning: Bad imported settings configuration (ex. conflicting pump times). No changes were made." );
          }
          
          if( typeof successAction === "function" ) {
            successAction();
          }
        },
        error: function( xhr, status, err ) {
          console.log( "HTTP " + status );
          console.error( "Comm Error: Bad connection to the BoxBrain." );

          // Load the last known settings..
          
          //self.load();
          
          if( typeof errorAction === "function" ) {
            errorAction();
          }
        },
        data: { sendMsg: "Settings received by client." }
      }
    );
  };
}
