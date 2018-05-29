public with sharing class AP_RecordGalleryController {

    @AuraEnabled
    public static List<Attachment> getAttachments(String objectId) {
        List<Attachment> atts = [ SELECT Id, Description FROM Attachment WHERE ParentId=:objectId];
        return atts;
    }
}