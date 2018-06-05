({
    doInit: function(component, event, helper) {
        component.find('forceRecord').getNewRecord(
            "Product2",
            null,
            false,
            $A.getCallback(function() {

            })
        )
    },


    saveRecord : function(component, event, helper) {
        let action = component.get('c.createNewAirplane');
        action.setParams({
            'plane' : component.get('v.airplaneRecord'),
            'base64Data' : component.get('v.images')
        });
        component.set('v.showSpinner', true);
        action.setCallback(this, function(response) {
            let state = response.getState();
            if(state === 'SUCCESS' || state === 'DRAFT') {
                var toast = $A.get("e.force:showToast");
                toast.setParams({
                'title' : 'SUCCESS!',
                'message' : 'New airplane created.',
                'type' : 'success'
                });
                toast.fire();
                let evt = component.getEvent('AP_OnCreateNewAirplane');
                evt.fire();
                helper.hide(component, event, helper);
                var sObjectEvent = $A.get("e.force:navigateToSObject");
                  sObjectEvent .setParams({
                  "recordId": response.getReturnValue()
                });
                sObjectEvent.fire();
            } else if (state === 'ERROR') {
                helper.handleError(component, event, helper);
            }
            component.set('v.showSpinner', false);
        });
        $A.enqueueAction(action);

    },

    setImages : function(component, event, helper) {
        component.set('v.images', event.getParam('data'));
    },

    displayModal : function (component, event, helper) {
        helper.display(component, event, helper);
    },

    hideModal : function (component, event, helper) {
        helper.hide(component, event, helper);
    }
})