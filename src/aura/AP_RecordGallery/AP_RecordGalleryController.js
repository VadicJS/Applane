({
    doInit : function(component) {
        let action = component.get("c.getAttachments");
        action.setParams({objectId: component.get("v.recordId")});
        action.setCallback(this, function(act) {
            let state = act.getState();
            if(state === 'SUCCESS' || state === 'DRAFT') {
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
            } else if (state === 'ERROR') {
                console.log(response.getError()[0].message);
                let errorData = JSON.parse(response.getError()[0].message);
                console.log(errorData.name +" (code "+ errorData.code +"): "+ errorData.message);
                let resultToast = $A.get("e.force:showToast");
                resultToast.setParams({
                "message" : errorData.name +" (code "+ errorData.code +"): "+ errorData.message,
                "type" : 'error',
                "mode" : 'sticky'
                });
                resultToast.fire();
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