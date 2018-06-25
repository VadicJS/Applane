({
    doInit : function(component, event, helper) {
        helper.downloadExistingEvents(component, event, helper);
        helper.downloadEvents(component, event, helper);
    },

    removeTile : function(component, event, helper) {
        let action = component.get('c.removeCustEvt');
        action.setParams({
            'indx' : event.getParam('index').toString()
        });
        component.set('v.showSpinner', true);
        action.setCallback(this, function(response) {
            let state = response.getState();
            if(state === 'SUCCESS' || state === 'DRAFT') {
                helper.downloadEvents(component, event, helper);
                if(component.get('v.appointments').length > 0) {
                    document.getElementById('modal').style.display = 'none';
                }
            } else if(state === 'ERROR') {
                helper.handleError(component, event, helper);
            }
            component.set('v.showSpinner', false);
        });
        $A.enqueueAction(action);
    },

    insertEvents : function(component, event, helper) {
        let action = component.get('c.insertAppointments');
        component.set('v.showSpinner', true);
        action.setCallback(this, function(response) {
            let state = response.getState();
            if(state === 'SUCCESS' || state === 'DRAFT') {
                helper.removeAll(component, event, helper);
                helper.downloadExistingEvents(component, event, helper);
                var toast = $A.get("e.force:showToast");
                toast.setParams({
                'title' : 'SUCCESS!',
                'message' : $A.get('$Label.c.AP_Appointments_made'),
                'type' : 'success'
                });
                toast.fire();
                let emptyList = [];
                component.set('v.appointments', emptyList);
                $A.get('e.force:refreshView').fire();
            } else  {
                helper.handleError(component, event, helper);
            }
            component.set('v.showSpinner', false);
        });
        $A.enqueueAction(action);
    },

    openModal : function(component, event, helper) {
        document.getElementById('modal').style.display = 'block';
    },

    closeModal : function(component, event, helper) {
        document.getElementById('modal').style.display = 'none';
    }
})