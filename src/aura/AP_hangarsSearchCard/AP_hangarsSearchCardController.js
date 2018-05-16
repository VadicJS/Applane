({
    getRecord : function(component, event, helper) {
        let recId = component.get("v.hangarId");
        let action = component.get('c.fetchHangar');
        action.setParams({hangarId: recId});
        action.setCallback(this, function(response) {
                    let state = response.getState();
                    if (state === 'SUCCESS') {
                        let hang = response.getReturnValue();
                        console.log(hang);
                        component.set("v.hangar", hang);
                    }
                });
                      $A.enqueueAction(action);
        },

})