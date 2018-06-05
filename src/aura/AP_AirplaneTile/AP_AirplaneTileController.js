({
    navigate : function(component, event, helper) {
        var sObjectEvent = $A.get("e.force:navigateToSObject");
          sObjectEvent .setParams({
          "recordId": component.get('v.airplane').Id,
        });
        sObjectEvent.fire();
    }
})