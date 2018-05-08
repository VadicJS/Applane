({
    search : function(component, event, helper) {
        let country = component.get('v.country');
        let capacity = component.get('v.capacity');
        if(capacity == null)
        capacity = 0;
        let action = component.get('c.searchHangars');
        console.log(country);
        action.setParams({country: country, capacity: capacity});
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                let hangars = response.getReturnValue();
                console.log(hangars);
                component.set("v.hangars", hangars);
            }
        });
              $A.enqueueAction(action);
    },

    clear : function(component, event, helper) {
        component.set('v.country', null);
        component.set('v.capacity', null);
    },
})