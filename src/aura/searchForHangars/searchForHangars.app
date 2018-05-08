<aura:application description="searchForHangars">
    <aura:attribute name="hangars" type="AP_Hangar__c[]"/>
    <c:hangarsSearch hangars="{!v.hangars}"/>
    <c:hangarsSearchResults hangars="{!v.hangars}"/>
</aura:application>