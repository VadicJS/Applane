({
    navigate : function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        var selectedItem = event.currentTarget;
        var elementId = selectedItem.dataset.id;
        navEvt.setParams({
          "recordId": elementId,
        });
        navEvt.fire();
    },
})