({
    remove : function(component, event, helper) {
        let evt = component.getEvent('AP_CC_EventRemoved');
        evt.setParams({
            'index' : component.get('v.index')
        });
        evt.fire();
    },
    navigate : function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
          "recordId": component.get('v.appointment').plane.Id,
        });
        navEvt.fire();
    }
})