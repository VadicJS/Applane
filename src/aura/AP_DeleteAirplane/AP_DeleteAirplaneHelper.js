({
    gotoURL : function (component, event, helper) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/one/one.app#/sObject/Product2/list?filterName=recent"
        });
        urlEvent.fire();
    }
})