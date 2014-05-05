/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


window.Photo = (function() {
    
    /**
     * Creates a new Photo.
     * @param {String} name The name of the photo.
     * @param {String} description The description of the photo.
     * @param {String} url The URL of the photo.
     * @param {Location} location The location of the photo.
     * @returns {Photo} The new Photo object.
     */
    function Photo(name, description, url, location) {
        this.name = name;
        this.description = description;
        this.url = url;
        this.location = location;
    };
    
    /**
     * Get the HTML to display in the info window of the photo.
     * @returns {String} The HTML.
     */
    Photo.prototype.getHtml = function() {
        return "<img src=\"" + this.url + "\" />";
    };
    
    return Photo;
})();