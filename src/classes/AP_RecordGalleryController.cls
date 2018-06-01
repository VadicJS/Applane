public with sharing class AP_RecordGalleryController {

    @AuraEnabled
    public static List<Attachment> getAttachments(String objectId) {
        try {
            List<Attachment> atts = [SELECT Id, Description FROM Attachment WHERE ParentId = :objectId];
            return atts;
        } catch (Exception exc) {
            AP_CustomExc custExc = new AP_CustomExc(exc.getTypeName(), exc.getMessage(), 0);
            throw new AuraHandledException(JSON.serialize(custExc));
        }
    }
}