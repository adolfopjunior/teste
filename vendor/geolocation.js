(function() {

    'use strict';

    function updateLocationDetails(data) {
        var now = new Date();

        $('#location').html(window.locationTemplate(data));
        $('#location').delegate('.help', 'click', function (e) {
            var fieldName = $(e.currentTarget).closest('tr').find('td:nth-child(1)').text();
            alert('This is your ' + fieldName + ' from ISP ' + data.isp + ' at ' + now);
            return false;
        });
        $('#locationTable').removeClass('empty');
    }

    function resetLocation() {
        $('#location').html(window.locationTemplate({
            query: '0.0.0.0'
        }));
        $('#txtWebsite').val('http://');
        $('#googleMap').empty().css('background-color', 'inherit');
        window.map = null;
    }

    function getLocation(address) {
        address = address || '';

        $.getJSON('http://ip-api.com/json/' + address)
        .success(function(response) {
            if(response.status && response.status.toLowerCase() === "success") {
                
                updateLocationDetails(response);

                markOnMap(response.lat, response.lon);
            
            }else {
                
                $('#messageCenter').append(window.messageTemplate({
                    message:response.message
                }));
            }
            
        })
        .error(function() {
            $('#messageCenter').append(window.messageTemplate({
                message:'Location unavailable!'
            }));
        });
    }

    function markOnMap(lat, lon) {
        if (!window.map) {
            window.map = new GMaps({
                el: '#googleMap',
                lat: lat,
                lng: lon
            });
        }
        window.map.addMarker({
            lat: lat,
            lng: lon
        });
        window.map.fitZoom();
    }

    function displayWebsiteLocation(e) {
        e.preventDefault();

        var data = $(e.currentTarget).serializeArray();

        getLocation(data[0].value.replace('http://', ''));
    }

    function initialize() {
        window.locationTemplate = Handlebars.compile($('#locationTemplate').html());
        window.messageTemplate = Handlebars.compile($('#messageTemplate').html());

        resetLocation();

        $('#btnGetMyLocation').click(function() {
            getLocation();
        });
        $('#formGeoLocation').submit(displayWebsiteLocation);
        $('#btnResetLocation').click(resetLocation);
    }

    $(document).ready(initialize);
})();
