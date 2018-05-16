({
    jsLoaded : function(component, event, helper) {
        var map = L.map('map', {zoomControl: true,zoom:1,zoomAnimation:false,fadeAnimation:true,markerZoomAnimation:true, center: [51.505, -0.09]})
                      .setView([51.5, -0.09], 6);
          L.tileLayer(
           'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
           {
             attribution: '© Applane'
           }).addTo(map);
          component.set("v.map", map);
        },
    setLocations : function(component, event, helper) {
        let map = component.get('v.map');
        let oldMarks = component.get('v.mapMarkers');
        for(let i=0; i<oldMarks.length; i++) {
            console.log(oldMarks[i]);
            map.removeLayer(oldMarks[i]);
        }
        let hangars = component.get('v.hangars');
        var markers = [];
        for(var i=0; i<hangars.length; i++){
            let marker = L.marker([hangars[i].loc.lat, hangars[i].loc.lng]);
            marker.bindPopup(hangars[i].hangar.Name);
            markers.push(marker);
        }
        component.set('v.mapMarkers', markers);
        let bounds = L.featureGroup(markers).addTo(map);
        if(bounds.getBounds().isValid()){
            map.fitBounds(bounds.getBounds());
        }
    },

    setSingleLocation : function(component, event, helper) {
        let hangWrapper = component.get('v.hangar');
        if(hangWrapper != undefined) {
            let map = component.get('v.map');
            let oldMarks = component.get('v.mapMarkers');
            for(let i=0; i<oldMarks.length; i++) {
                console.log(oldMarks[i]);
                map.removeLayer(oldMarks[i]);
            }
            var markers = [];
            let marker = L.marker([hangWrapper.loc.lat, hangWrapper.loc.lng]);
            marker.bindPopup(hangWrapper.hangar.Name);
            markers.push(marker);
            component.set('v.mapMarkers', markers);
            let bounds = L.featureGroup(markers).addTo(map);
            if(bounds.getBounds().isValid()){
                map.setView([hangWrapper.loc.lat, hangWrapper.loc.lng], 4);
                map.fitBounds(bounds.getBounds());
            }
        }
    }
})