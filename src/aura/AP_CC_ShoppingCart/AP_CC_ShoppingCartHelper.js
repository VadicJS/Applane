({
    handleError : function(component, response, helper) {
        console.log(response.getError()[0]);
        let errToast = $A.get("e.force:showToast");
        errToast.setParams({
            "message":  response.getError()[0],
            "type": 'error'
        });
        errToast.fire();
    },

    downloadEvents : function(component, event, helper) {
        let action = component.get('c.getEvts');
        action.setCallback(this, function(response) {
            let state = response.getState();
            if(state === 'SUCCESS' || state === 'DRAFT') {
                let wrapper = response.getReturnValue();
                component.set('v.appointments', wrapper);
             } else if (state === 'ERROR') {
                helper.handleError(component, event, helper);
            }
        });
        $A.enqueueAction(action);
    },

    removeAll : function(component, event, helper) {
        let action = component.get('c.clearCache');
        action.setCallback(this, function(response) {
            let state = response.getState();
            if(state === 'SUCCESS' || state === 'DRAFT') {
                helper.downloadEvents(component, event, helper);
            } else {
                helper.handleError(component, response, helper);
            }
        });
        $A.enqueueAction(action);
    },

    downloadExistingEvents : function(component, event, helper) {
        let action = component.get('c.getExistingEvents');
        action.setCallback(this, function(response) {
            let state = response.getState();
            if(state === 'SUCCESS' || state === 'DRAFT') {
                            console.log('EVENTS: ' + response.getReturnValue());

                component.set('v.events', response.getReturnValue());
            } else if(state === 'ERROR') {
                helper.handleError(component, response, helper);
            }
        });
        $A.enqueueAction(action);
    }
})