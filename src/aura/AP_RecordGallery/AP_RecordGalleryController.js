({
    doInit : function(component) {
        let action = component.get("c.getAttachments");
        action.setParams({objectId: component.get("v.recordId")});
        action.setCallback(this, function(act) {
            let atts = act.getReturnValue();
            if (atts.length > 0) {
                component.set('v.mainSrc', '/servlet/servlet.FileDownload?file=' + atts[0].Id);
                for(let i=0; i<atts.length; i++) {
                    if(atts[i].Description == 'main'){
                        component.set('v.mainSrc', '/servlet/servlet.FileDownload?file=' + atts[i].Id);
                    }
                }
                let srcs = [];
                for (let i = 0; i < atts.length; i++) {
                    let singleSource = '/servlet/servlet.FileDownload?file=' + atts[i].Id;
                    srcs.push(singleSource);
                }
                component.set('v.sources', srcs);
            }
        });
        $A.enqueueAction(action);
    },
    selectPhoto : function(component, event) {
        var selectedItem = event.currentTarget;
        var elementSource = selectedItem.getAttribute('src');
        component.set('v.mainSrc', elementSource);
        console.log(elementSource);
    }
})