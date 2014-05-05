/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


"use strict";
window.Main = (function() {
    
    /**
     * Creates a new Main object.
     * @returns {undefined}
     */
    function Main() {
        this.map = null;
        this.windows = [];
    }
    
    /**
     * Initialize the application.
     * @returns {undefined}
     */
    Main.prototype.init = function() {
        
        // Get a reference back to ourself
        var self = this;
        
        // Add a listener for the view button
        $("#view").on("click", function(event) {
            event.preventDefault();
            
            // Make some dummy photos!
            var photos = [];
            photos.push(new Photo("Test", "A test photo.", "http://www.allgofree.org/pics/baby_whale.png", new Location(43.083848, -77.6799)));
            self.populateMap(photos);
        });
        
        // Grab the users current location if possible
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(function(position) {
                self.setupMap(self, position.coords.latitude, position.coords.longitude);
            });
        }
        else
        {
            // By default, focus on RIT
            var latitude = 43.083848;
            var longitude = -77.6799;
            
            this.setupMap(self, latitude, longitude);
        }
        
    };
    
    /**
     * Setup the Google Map view.
     * @param {Main} instance The main instance.
     * @param {Number} latitude The latitude of the current location.
     * @param {Number} longitude The longitude of the current location.
     * @returns {undefined}
     */
    Main.prototype.setupMap = function(instance, latitude, longitude) {
        
        // Set up the options for our map
        var options = {
          center: new google.maps.LatLng(latitude, longitude), 
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        // Create the map
        instance.map = new google.maps.Map(document.getElementById("map"), options);
    };
    
    /**
     * Populate the map with photos.
     * @param {Array} photos The array of Photo objects.
     * @returns {undefined}
     */
    Main.prototype.populateMap = function(photos) {
        
        var self = this;
        
        // Clear all previous photos
        this.windows.forEach(function(next) {
            
            // Close the window
            next.close();
        });
        
        // Add each of the photos to the view
        photos.forEach(function(next) {
            
            var window = new google.maps.InfoWindow({
                    map: self.map, 
                    position: next.location.getGooglePosition(), 
                    content: next.getHtml()
            });
            
            self.windows.push(window);
            
            self.map.panTo(next.location.getGooglePosition());
        });
        
    };
    
    return Main;
})();

$(function(){
    var instance = new Main();
    instance.init();
});
