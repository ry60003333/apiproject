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
    }
    
    /**
     * Initialize the application.
     * @returns {undefined}
     */
    Main.prototype.init = function() {
        
        // Set up the options for our map
        var options = {
          center: new google.maps.LatLng(43.083848,-77.6799),
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        // Create the map
        this.map = new google.maps.Map(document.getElementById("map"), options);
    };
    
    return Main;
})();

$(function(){
    var instance = new Main();
    instance.init();
});
