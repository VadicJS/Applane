({
    search : function(component, event, helper) {
        let ctry = component.get('v.country');
        let capacity = component.get('v.capacity');
        let action = component.get('c.searchHangars');
        console.log(ctry);
        action.setParams({country: ctry, capacity: capacity});
        component.set('v.showSpinner', true);
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                let hangs = response.getReturnValue();
                console.log(hangs);
                if(hangs.length === 1) {
                    console.log('hangsLength' + hangs.length);
                    component.set("v.hangar", hangs[0]);
                }else{
                    component.set("v.hangar", undefined)
                }
                if(hangs.length === 0) {
                    let resultToast = $A.get("e.force:showToast");
                    resultToast.setParams({
                    "message": $A.get("$Label.c.No_results"),
                    "type": 'warning'
                });
                resultToast.fire();
                }
                component.set("v.hangars", hangs);
            }
            component.set('v.showSpinner', false);
        });
              $A.enqueueAction(action);
    },

    clear : function(component, event, helper) {
        component.set('v.country', null);
        component.set('v.capacity', null);
    },

    showWaiting: function (component, event, helper) {
                component.set('v.showSpinner', true);
            },
    doneWaiting: function (component, event, helper) {
             component.set('v.showSpinner', false);
            }
})