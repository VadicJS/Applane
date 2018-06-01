({
    onSearch : function(component, event, helper) {
        let action = component.get('c.searchAirplanes');
        action.setParams({
            aFamily : event.getParam('family'),
            dType : event.getParam('dType'),
            engNo : event.getParam('engNo'),
            name : event.getParam('name')
        })
        component.set('v.showSpinner',true);
        action.setCallback(this, function(response) {
            let state = response.getState();
            console.log(state);
            if(state === 'SUCCESS' || state === 'DRAFT') {
                console.log(response.getReturnValue());
                component.set('v.airplanes', response.getReturnValue());
                if(response.getReturnValue().length === 0) {
                    let resultToast = $A.get("e.force:showToast");
                    resultToast.setParams({
                    "message": $A.get("$Label.c.No_results"),
                    "type": 'warning'
                    });
                    resultToast.fire();
                }
            }
            if(state === 'ERROR') {
                console.log(response.getError()[0].message);
                let errorData = JSON.parse(response.getError()[0].message);
                console.log(errorData.name +" (code "+ errorData.code +"): "+ errorData.message);
                let resultToast = $A.get("e.force:showToast");
                resultToast.setParams({
                "message": errorData.name +" (code "+ errorData.code +"): "+ errorData.message,
                "type": 'error'
                });
                resultToast.fire();

            }
            component.set('v.showSpinner', false);
        });
        $A.enqueueAction(action);
    }
})