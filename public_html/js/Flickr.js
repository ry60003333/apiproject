/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


window.Flickr = (function() {
    
    /**
     * Creats a new Flickr object.
     * @param {String} key The key for the Flickr API.
     * @param {String} secret The shared secret for the Flickr API.
     * @returns {Flickr} The new Flickr object.
     */
    function Flickr(key, secret)
    {
        this.key = key;
        this.secret = secret;
    }
    
    Flickr.prototype.debug = function(text) {
        
    };
    
    /**
     * Get the URL to a method in the Flickr API.
     * @param {String} method The name of the method.
     * @param {String} parameters The parameters for the method.
     * @returns {String} The method URL.
     */
    Flickr.prototype.getMethodUrl = function(method, parameters) {
        // Construct our base URL with the API key
        // and also specify we want JSON because we are bias against XML ;)
        var apiUrl = "http://api.flickr.com/services/rest/?&api_key=" + this.key + "&format=json&method=" + method;
        
        // Add in all the method parameters
        for (var key in parameters) {
            apiUrl += "&" + key + "=" + parameters[key];
        }
        
        // Return the full API url
        return apiUrl;
    };
    
    /**
     * Call a Flickr API method.
     * @param {String} method The name of the method.
     * @param {String} parameters The parameters for the method.
     * @param {String} callback The callback for when the method completes.
     * @returns {undefined}
     */
    Flickr.prototype.call = function(method, parameters, callback) {
        $.ajax({
            url: this.getMethodUrl(method, parameters), 
            success: callback, 
            dataType: "jsonp", 
            jsonp: "jsoncallback"
        });
    };
    
    /**
     * Get a user ID from a username.
     * @param {String} username The username.
     * @param {Function} callback The callback to handle the ID.
     * @returns {undefined}
     */
    Flickr.prototype.getUserIdByName = function(username, callback) {
        this.call("flickr.people.findByUsername", {username : username}, function(data) {
            callback(data.user.id);
        });
    };
    
    /**
     * Get the array of public photos for a user.
     * @param {String} username The username.
     * @param {Function} callback The callback to handle the array of photos.
     * @returns {undefined}
     */
    Flickr.prototype.getPublicPhotos = function(username, callback) {
        var self = this;
        this.getUserIdByName(username, function(id) {
            self.call("flickr.people.getPublicPhotos", {user_id : id}, function (data) {
                var photos = data.photos.photo;
                callback(photos);
            });
        });
    };
    
    /**
     * Get the location data for a photo.
     * @param {String} photoId The ID of the photo.
     * @param {Function} callback The callback to handle the Location.
     * @returns {undefined}
     */
    Flickr.prototype.getLocationData = function(photoId, callback) {
        this.call("flickr.photos.geo.getLocation", {photo_id : photoId}, function(data) {
            var location = null;
            if (data.stat !== "fail")
            {
                location = new Location(
                        parseFloat(data.photo.location.latitude), 
                        parseFloat(data.photo.location.longitude)
                        );
            }
            callback(location);
        });
    };
    
    /**
     * Get the data for a photo.
     * @param {String} photoId The ID of the photo.
     * @param {Function} callback The callback to handle the Photo.
     * @returns {undefined}
     */
    Flickr.prototype.getPhotoData = function(photoId, callback) {
        var self = this;
        this.call("flickr.photos.getInfo", {photo_id : photoId}, function(data) {
            var photo = data.photo;
            var title = photo.title._content;
            var description = photo.description._content;
            var url = "";
            var location = null;
            
            // See if the photo has location data
            if (photo.location)
            {
                location = new Location(
                        parseFloat(photo.location.latitude), 
                        parseFloat(photo.location.longitude)
                        );
            }
            
            // Grab the URL to the thumbnail of the photo
            self.getSizes(photoId, function(sizes) {
                
                for (var i = 0 ; i < sizes.length; i++) {
                    var next = sizes[i];
                    if (next.label === "Small") {
                        url = next.source;
                    }
                }
                
                // Create the actual Photo object
                var photoObject = new Photo(
                        photo.id,
                        title, 
                        description, 
                        url, 
                        location
                        );
                
                // And notify our callback
                callback(photoObject);
            });
            
            
        });
    };
    
    /**
     * Get the available sizes for a photo.
     * @param {String} photoId The ID of the photo.
     * @param {Function} callback The callback to handle the sizes.
     * @returns {undefined}
     */
    Flickr.prototype.getSizes = function(photoId, callback) {
        this.call("flickr.photos.getSizes", {photo_id : photoId}, function(data) {
            var sizes = data.sizes.size;
            callback(sizes);
        });
    };
    
    /**
     * Get all the public photos of a user with data.
     * @param {String} username The username.
     * @param {Function} callback The callback to handle the array of Photos.
     * @returns {undefined}
     */
    Flickr.prototype.getPublicPhotosWithData = function(username, callback) {
        var self = this;
        this.getPublicPhotos(username, function(photos) {
            var photoObjects = [];
            for (var i = 0; i < photos.length; i++) {
                var id = photos[i].id;
                self.getPhotoData(id, function(photoObject) {
                    photoObjects.push(photoObject);
                    console.log("Adding photo " + photoObject.id);
                    if (photoObjects.length === photos.length) {
                        callback(photoObjects);
                    }
                });
            }
        });
    };
    
    return Flickr;
})();