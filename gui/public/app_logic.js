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
  var pumpCycles = [];
  var lightCycles = [];

  // Temporary storage. Contains Box Farm data.
  var tempPumpCycles = [];
  var tempPlightCycles = [];

  // Will be imported from or exported to JSON. Acts like a draft for the settings file.
  // Should only contain primitive data that is compatible with BoxBrain.
  var settingsObj = {
    pumpCycles: [],
    lightCycles: []
  };

  var settingsJSON = "";

  /**
   * Add a pump cycle as defined by its start and end times.
   * @method addPumpCycle
   * @memberof Settings
   * @instance
   * @param {Time} startTime
   * @param {Time} endTime
   */
  this.addPumpCycle = function( startTime, endTime ) {
    pumpCycles.push(
      {
        startTime: startTime,
        endTime: endTime
      }
    );
  };

  /**
   * Get the pump cycle.
   * @method getPumpCycle
   * @memberof Settings
   * @instance
   * @return {object} The pump cycle consisting of a start time (Time instance) and
   * an end time (another Time instance) or an object that indicates if its empty.
   */
  this.getPumpCycle = function( i ) {
    if( i < pumpCycles.length ) {
      return pumpCycles[ i ];
    } else {
      console.warn( "Warning: There is no pump cycle at this index. Amount of cycles: " + pumpCycles.length + "." );

      return { empty: true };
    }
  };

  /**
   * Get the number of pump cycles.
   * @method numPumpCycles
   * @memberof Settings
   * @instance
   * @return {number} The number of pump cycles.
   */
  this.numPumpCycles = function() {
    return pumpCycles.length;
  };

  /**
   * Warning: Deletes all of the pump cycles. Used for refreshing the settings.
   * @method clearPumpCycles
   * @memberof Settings
   * @instance
   */
  this.clearPumpCycles = function() {
    pumpCycles = [];
  };

  /**
   * Add a light cycle as defined by its start and end times.
   * @method addLightCycle
   * @memberof Settings
   * @instance
   * @param {Time} startTime
   * @param {Time} endTime
   */
  this.addLightCycle = function( startTime, endTime ) {
    lightCycles.push(
      {
        startTime: startTime,
        endTime: endTime
      }
    );
  };

  /**
   * Get the light cycle.
   * @method getLightCycle
   * @memberof Settings
   * @instance
   * @return {object} The pump cycle consisting of a start time (Time instance) and
   * an end time (another Time instance) or an object that indicates if its empty.
   */
  this.getLightCycle = function( i ) {
    if( i < lightCycles.length ) {
      return lightCycles[ i ];
    } else {
      console.warn( "Warning: There is no light cycle at this index. Amount of cycles: " + lightCycles.length + "." );

      return { empty: true };
    }
  };

  /**
   * Get the number of light cycles.
   * @method numLightCycles
   * @memberof Settings
   * @instance
   * @return {number} The number of light cycles.
   */
  this.numLightCycles = function() {
    return lightCycles.length;
  };

  /**
   * Warning: Deletes all of the light cycles. Used for refreshing the settings.
   * @method clearLightCycles
   * @memberof Settings
   * @instance
   */
  this.clearLightCycles = function() {
    lightCycles = [];
  };

  /**
   * Check if the settings are in the correct format before saving it.
   * Ex. Find conflicting pump and light cycle times.
   * @method check
   * @memberof Settings
   * @instance
   * @return {object} Indices that point to the problem.
   */
   // Still need a way to check imported settings.
  this.check = function() {
    //
    var problemPointer = {
      pass: true,
      pumpCycleProbIndex: [ -1, 0 ],
      lightCycleProbIndex: [ -1, 0 ]
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

      for( iT = 0; iT < cyclesData.timeArrays.length - 1; iT++ ) {
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
    orderCheck( pumpCycles, problemPointer.pumpCycleProbIndex );

    // Check light cycles.
    orderCheck( lightCycles, problemPointer.lightCycleProbIndex );

    return problemPointer;
  }

  /**
   * Make the settings permanent on the client. It will not send the settings to the BoxBrain.
   * Call the send() method after saving.
   * @method save
   * @memberof Settings
   * @instance
   */
  this.save = function() {
    var errorCheck = self.check();

    // Start fresh.
    settingsObj.pumpCycles = [];
    settingsObj.lightCycles = [];

    // Write pump cycle times.
    // Index == -1 means no problems in the pump cycles found.
    if( errorCheck.pumpCycleProbIndex[ 0 ] === -1 ) {
      for( var iPC = 0; iPC < pumpCycles.length; iPC++ ) {
        // Store times as formatted time strings.
        settingsObj.pumpCycles.push(
          {
            startTime: pumpCycles[ iPC ].startTime.getTimeStr(),
            endTime: pumpCycles[ iPC ].endTime.getTimeStr(),
          }
        );
      }
    } else {
      console.error( "Save Error: The pump cycle times have conflicts." );

      return false;
    }

    // Write light cycle times.
    // Index == 1 means no problems in the pump cycles found.
    if( errorCheck.lightCycleProbIndex[ 0 ] === -1 ) {
      for( var iPC = 0; iPC < lightCycles.length; iPC++ ) {
        // Store times as formatted time strings.
        settingsObj.lightCycles.push(
          {
            startTime: lightCycles[ iPC ].startTime.getTimeStr(),
            endTime: lightCycles[ iPC ].endTime.getTimeStr(),
          }
        );
      }
    } else {
      console.error( "Save Error: The light cycle times have conflicts." );

      return false;
    }

    // If you make it here, it's going great!

    // Convert to JSON and save.
    settingsJSON = JSON.stringify( settingsObj );
    localStorage.setItem( "settings", settingsJSON );

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

  /**
   * Load the settings that was saved. It will not pull settings data from the BoxBrain.
   * @method load
   * @memberof Settings
   * @instance
   */
  this.load = function() {
    settingsJSON = localStorage.getItem( "settings" );

    try {
      if( settingsJSON === null ) {
        throw new Error( "Empty settings JSON." );
      }

      settingsObj = JSON.parse( settingsJSON );
    } catch( ex ) {
      // Do this if the JSON parsing fails.
      console.error( "Load Error: Settings data does not exist." );

      // Load default times instead;
      self.addPumpCycle( new Time( "6:00" ), new Time( "12:00" ) );
      self.addLightCycle( new Time( "0:00" ), new Time( "6:00" ) );

      self.save();

      console.log( "Default values are set instead." );

      return false;
    }

    // Start fresh.
    self.clearPumpCycles();
    self.clearLightCycles();

    // Load the pump cycles.
    for( var i = 0; i < settingsObj.pumpCycles.length; i++ ) {
      self.addPumpCycle(
        new Time( settingsObj.pumpCycles[ i ].startTime ),
        new Time( settingsObj.pumpCycles[ i ].endTime )
      );
    }

    // Load the light cycles.
    for( var i = 0; i < settingsObj.lightCycles.length; i++ ) {
      self.addLightCycle(
        new Time( settingsObj.lightCycles[ i ].startTime ),
        new Time( settingsObj.lightCycles[ i ].endTime )
      );
    }

    console.log( "Settings are loaded successfully." );

    return true;
  };

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
          console.log( msg );

          // Load the local copy of settings JSON.
          var oldSettingsJSON = localStorage.getItem( "settings" );

          // Temporarily load the sent-in settins JSON and check it.
          localStorage.setItem( "settings", msg );
          self.load();

          if( self.check().pass ) {
            // Keep it.
          } else {
            console.error( "Load Error: Bad imported settings configuration. Loaded the previous version." );
            localStorage.setItem( "settings", oldSettingsJSON );
            self.load();
          }

          //successAction();
        },
        error: function( xhr, status, err ) {
          console.log( "HTTP " + status );
          console.error( "Comm Error: Bad connection to the BoxBrain." );

          // Load the last known settings..
          self.load();

          //errorAction();
        },
        data: { sendMsg: "Settings received by client." }
      }
    );
  };
}
