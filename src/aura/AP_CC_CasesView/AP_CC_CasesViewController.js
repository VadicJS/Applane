({
    doInit: function(component, event, helper){
        let action = component.get('c.getCases');
        action.setCallback(this, function(response){
            let state = response.getState();
            if(state === 'SUCCESS' || state === 'DRAFT'){
                component.set('v.cases', response.getReturnValue());
            } else if(state === 'ERROR'){
                helper.handleError(component, response, helper);
            }
        });
        $A.enqueueAction(action);
    }
})