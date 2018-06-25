({
    doInit : function(component, event, helper) {
        component.find("caseRecordCreator").getNewRecord(
            "Case",
            null,
            false,
            $A.getCallback(function() {
                var rec = component.get("v.newCase");
                var error = component.get("v.newCase");
                if(error || (rec === null)) {
                    console.log(error);
                    return;
                }
                console.log("Record template initialized: " + rec.sobjectType);
            })
        );

        helper.retrieveOrders(component, event, helper);
    },

    submit : function(component, event, helper) {
        if(component.get('v.simpleNewCase').Subject == undefined) {
            let errToast = $A.get("e.force:showToast");
            errToast.setParams({
                "message":  $A.get('$Label.c.AP_Fill_Required'),
                "type": 'error'
            });
            errToast.fire();
            return;
        }
        let action = component.get('c.submitNewCase');
        action.setParams({
            'newCase' : component.get('v.simpleNewCase')
        });
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === 'SUCCESS' || state === 'DRAFT'){
                let successToast = $A.get("e.force:showToast");
                successToast.setParams({
                    "subject": $A.get("$Label.c.AP_Message_success"),
                    "message": $A.get("$Label.c.AP_Case_submit_message"),
                    "type": 'success'
                });
                successToast.fire();
            } else if (state === 'ERROR') {
                helper.handleError(component, response, helper);
            }
        });
        $A.enqueueAction(action);
    },
    openModal : function(component, event, helper) {
        document.getElementById('backdrop').classList.add("slds-backdrop_open");
        document.getElementById('modal').classList.add("slds-slide-down-cancel");
    },

    closeModal : function(component, event, helper) {
        document.getElementById('backdrop').classList.remove("slds-backdrop_open");
        document.getElementById('modal').classList.remove("slds-slide-down-cancel");
    },

    selectOrder : function(component, event, helper) {
        let selectedItem = event.currentTarget;
        let elementId = selectedItem.dataset.id;
        let selected;
        let ords = component.get('v.orders');
        for(let i=0; i<ords.length; i++) {
            if(ords[i].Id == elementId) {
                selected = ords[i];
            }
        }
        let orderString = '$' + selected.TotalAmount + ': ';
        for(let i=0; i<selected.OrderItems.length; i++){
            orderString += selected.OrderItems[i].Product2.Model__r.Name + ', ';
        }
        orderString = orderString.substring(0, orderString.length - 2);
        component.set('v.selectedOrder', orderString);
        let caseToSave = component.get('v.simpleNewCase');
        console.log(selected.Id);
        caseToSave.Order__c = selected.Id;
        component.set('v.simpleNewCase', caseToSave);
        document.getElementById('backdrop').classList.remove("slds-backdrop_open");
        document.getElementById('modal').classList.remove("slds-slide-down-cancel");
    }
})