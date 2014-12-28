define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('store/model',
    [

    ]);
    mod.factory('store/model/Store',
    [
        //dependency
    function(
        //dependency_alias
    ){
        function Store(id,name,tax_rate,phone,street,city,state,zip_code
            ,display_is_report
            ,display_type
            ,display_tag
            ,display_group
            ,display_deal
            ,display_vendor
            ,display_buydown
            ,display_vc_price
            ,display_stock
        ){
            this.id = id;
            this.name = name;
            this.tax_rate = tax_rate
            this.phone = phone;
            this.street = street;
            this.city = city;
            this.state = state;
            this.zip_code = zip_code;

            this.display_is_report = display_is_report;
            this.display_type = display_type;
            this.display_tag = display_tag;
            this.display_group = display_group;
            this.display_deal = display_deal;
            this.display_vendor = display_vendor;
            this.display_buydown = display_buydown;
            this.display_vc_price = display_vc_price;
            this.display_stock = display_stock;
        }
        Store.build = function(raw_json){
            return new Store(
                 raw_json.id
                ,raw_json.name
                ,parseFloat(raw_json.tax_rate)
                ,raw_json.phone
                ,raw_json.street
                ,raw_json.city
                ,raw_json.state
                ,raw_json.zip_code

                ,raw_json.display_is_report
                ,raw_json.display_type
                ,raw_json.display_tag
                ,raw_json.display_group
                ,raw_json.display_deal
                ,raw_json.display_vendor
                ,raw_json.display_buydown
                ,raw_json.display_vc_price
                ,raw_json.display_stock                
            )
        }
        return Store;
    }])
})
