public with sharing class AP_CC_CaseFormController {
    @AuraEnabled
    public static void submitNewCase(Case newCase) {
        try {
            Contact cnt = getUserContact();
            newCase.AccountId = cnt.AccountId;
            newCase.ContactId = cnt.Id;
            newCase.Origin = 'Web';
            newCase.Status = 'New';
            insert newCase;
        } catch (Exception exc) {
            throw new AuraHandledException(JSON.serialize(exc));
        }
    }
    @AuraEnabled
    public static List<Order> getOrdersForAccount(){
        try {
            return [
                    SELECT Id, TotalAmount, CreatedDate, (SELECT Id, Quantity, Product2.Model__r.Name FROM OrderItems)
                    FROM Order
                    WHERE AccountId = :getUserContact().AccountId
            ];
        } catch (Exception exc) {
            AP_CustomExc cusExc = new AP_CustomExc('Error', exc.getMessage() , 0);
            throw new AuraHandledException(JSON.serialize(cusExc));
        }
    }
    @AuraEnabled
    public static List<Case> getCases() {
        return [SELECT CreatedDate, ClosedDate, Description, Status, CaseNumber, Subject, Reason FROM Case WHERE ContactId = :getUserContact().Id ORDER BY CreatedDate DESC];
    }
    private static Contact getUserContact(){
        User contactUser = [SELECT Id, ContactId FROM User WHERE Id = :UserInfo.getUserId()];
        return [SELECT AccountId FROM Contact WHERE Id = :contactUser.ContactId];
    }
}