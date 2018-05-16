({
    addClass : function (component, event, helper) {
        var selectedItem = event.currentTarget;
        var elementId = selectedItem.dataset.id;

        var Elements = component.find('listItem');

        for(var i = 0; i<Elements.length; i++) {
            var value = Elements[i].getElement().getAttribute('data-id');

            if (value != elementId) {
                console.log('id not pass');
               $A.util.removeClass(Elements[i], 'itemSelect');
            }else{
                console.log('ID PASS');
                $A.util.addClass(Elements[i], 'itemSelect');
            }
        }
    }
})