({
    display : function(component, event, helper) {


        let evt = $A.get('e.c:AP_CC_OnHangarSelected');
                console.log(component.get('v.hangar').Name);

        evt.setParams({
            hangar: component.get('v.hangar'),
            showModal : true
        });
        console.log(component.get('v.hangar').Name);
        evt.fire();
        component.set('v.showModal', true);
    }
})