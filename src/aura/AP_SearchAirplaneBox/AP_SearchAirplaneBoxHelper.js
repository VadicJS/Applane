({
    onSearch : function(component, event, helper) {
        let evt = $A.get('e.c:AP_OnSearchAirplane');
        evt.setParams({
            family: component.get('v.family'),
            engNo: component.get('v.numberOfEngines'),
            dType: component.get('v.driveType'),
            name: component.get('v.name')
        });
        evt.fire();
    }
})