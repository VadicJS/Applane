({
    doInit : function(component) {
        let action = component.get('c.getPicklistValues');
        action.setParams({
            objectType: component.get("v.sObjectName"),
            selectedField: component.get("v.fieldName")
        });
        action.setCallback(this, function(response) {
            let list = response.getReturnValue();
            component.set("v.pickListValues", list);
        })
        $A.enqueueAction(action);
    }
})