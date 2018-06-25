({
   handleError : function(component, response, helper) {
       console.log(response.getError()[0]);
       let errorData = JSON.parse(response.getError()[0].message);
       console.log(errorData.name +" (code "+ errorData.code +"): "+ errorData.message);
       let errToast = $A.get("e.force:showToast");
       errToast.setParams({
           "message":  errorData.message,
           "type": 'error'
       });
       errToast.fire();
   },

   retrieveOrders : function(component, event, helper) {
       let action = component.get('c.getOrdersForAccount');
       action.setCallback(this, function(response) {
           let state = response.getState();
           if(state === 'SUCCESS' || state === 'DRAFT') {
               component.set('v.orders', response.getReturnValue());
           } else if(state === 'ERROR') {
               helper.handleError(component, response, helper);
           }
       });
       $A.enqueueAction(action);
   }
})