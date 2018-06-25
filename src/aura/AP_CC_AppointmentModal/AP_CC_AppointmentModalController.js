({
    closeModal : function(component) {
        component.set('v.showModal', false);
    },
    handleSelectedHangar : function(component, event, helper) {
        console.log(event.getParam('hangar'));
        component.set('v.showModal', true);
        component.set('v.hangar', event.getParam('hangar'));
    },
    saveToCacheMemory : function(component, event, helper) {
        console.log(component.get('v.eventDate'));
        if(component.get('v.eventDate') == null) {
            let toast = $A.get("e.force:showToast");
            toast.setParams({
                "message":  $A.get("$Label.c.AP_Select_Date"),
                "type": 'warning'
            });
            toast.fire();
            return;
        }
        let action = component.get('c.saveToCacheEvents');
        action.setParams({
            'hang' : component.get('v.hangar'),
            'dateOfEvent' : component.get('v.eventDate'),
            'plane' : component.get('v.airplane')
        });
        component.set('v.showSpinner', true);
        action.setCallback(this, function(response) {
            let state = response.getState();
            if(state === 'SUCCESS') {
                let toast = $A.get("e.force:showToast");
                toast.setParams({
                    "message":  $A.get("$Label.c.AP_Meeting_Added"),
                    "type": 'success'
                });
                toast.fire();
                $A.get('e.c:AP_CC_AppointmentAdded').fire();
                component.set('v.showModal', false);
            } else  {
                helper.handleError(component, response, helper);
            }
            component.set('v.showSpinner', false);
        });
        $A.enqueueAction(action);
    },


})