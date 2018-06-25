({
    doInit : function(component, event, helper) {
        let action = component.get('c.getAvailableHangars');
        action.setParams({
            'typeId' : component.get('v.recordId')
        });
        console.log(component.get('v.recordId'));
        component.set('v.showSpinner', true);
        action.setCallback(this, function(response) {
            console.log(response.getState());
            let state = response.getState();
            if(state === 'SUCCESS' || state === 'DRAFT') {
                component.set('v.hangars', response.getReturnValue());
                console.log(response.getReturnValue());
            } else if (state === 'ERROR') {
                helper.handleError(component, response, helper);
            }
            component.set('v.showSpinner', false);
        });
        $A.enqueueAction(action);
    },

})