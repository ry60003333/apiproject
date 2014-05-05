/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


window.Location = (function() {
    
    /**
     * Creates a new Location.
     * @param {Number} latitude The latitude value.
     * @param {Number} longitude The longitude value.
     * @returns {Location} The new location object
     */
    function Location(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    };
    
    /**
     * Get the google maps version of the location.
     * @returns {google.maps.LatLng} The Google LatLng object.
     */
    Location.prototype.getGooglePosition = function() {
        return new google.maps.LatLng(this.latitude, this.longitude);
    };
    
    return Location;
})();