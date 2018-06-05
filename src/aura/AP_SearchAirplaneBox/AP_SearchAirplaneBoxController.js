({
    doSearch : function(component, event, helper) {
        let evt = $A.get('e.c:AP_OnSearchAirplane');

        if(component.get('v.family') == undefined) {
            component.set('v.family', '');
        }
        if(component.get('v.numberOfEngines') == undefined) {
            component.set('v.numberOfEngines', '');
        }
        if(component.get('v.driveType') == undefined) {
            component.set('v.driveType', '');
        }
        evt.setParams({
            family: component.get('v.family'),
            engNo: component.get('v.numberOfEngines'),
            dType: component.get('v.driveType'),
            name: component.get('v.name')
        });
        evt.fire();
    }
})