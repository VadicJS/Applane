({
    hideStandardFlexipageHeader: function (component) {
        $A.createComponents([['aura:html', {
                        tag: 'style',
                        body: '.oneAnchorHeader { display: none; }',
                        HTMLAttributes: {}
                    }
                ]], function (components, status, errorMessage) {
            if (status === 'SUCCESS') {
                component.set('v.CustomStyles', components);
            }
        });
    },

    openModal : function(component, event, helper) {
        component.set('v.showModal', true);
    },

})