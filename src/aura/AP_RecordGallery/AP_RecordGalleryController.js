({
    doInit : function(component) {
        let action = component.get("c.getAttachments");
        let baseUrl = '/servlet/servlet.FileDownload?file=';
        action.setParams({objectId: component.get("v.recordId")});
        action.setCallback(this, function(act) {
            let state = act.getState();
            if(state === 'SUCCESS' || state === 'DRAFT') {
                let atts = act.getReturnValue();
                if (atts.length > 0) {
                    component.set('v.mainSrc', baseUrl + atts[0].Id);
                    for(let i=0; i<atts.length; i++) {
                        if(atts[i].Description == 'main'){
                            component.set('v.mainSrc', baseUrl + atts[i].Id);
                        }
                    }
                    let srcs = [];
                    for (let i = 0; i < atts.length; i++) {
                        let singleSource = baseUrl + atts[i].Id;
                        srcs.push(singleSource);
                    }
                    component.set('v.sources', srcs);
                }
            } else if (state === 'ERROR') {
                helper.handleError(component, event, helper);
            }
        });
        $A.enqueueAction(action);
    },
    selectPhoto : function(component, event) {
        var selectedItem = event.currentTarget;
        var elementSource = selectedItem.getAttribute('src');
        component.set('v.mainSrc', elementSource);
        console.log(elementSource);
    },

})