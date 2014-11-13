define(
[
    'angular'
    //--------
    ,'app/sale_app/app'
    ,'angular_mock'
]
,function
(
    angular
)
{
    // $httpBackend.whenGET(/^\/templates\//).passThrough();
    var mod = angular.module('sale_app_offline',['sale_app','ngMockE2E']);
    mod.run(['$httpBackend',function($httpBackend) {

        // var regx = /\/product\/search_by_sku_angular\?sku_str=.+/;
        // $httpBackend.whenGET(regx).respond(0/*status*/,null/*data*/);

        // var regx_2 = /\/receipt\/push/;
        // $httpBackend.whenPOST(regx_2).respond(0/*status*/,null/*data*/);

        var regx = /\/.*/;
        $httpBackend.whenGET(regx).respond(0/*status*/,null/*data*/);
        $httpBackend.whenPOST(regx).respond(0/*status*/,null/*data*/);        
    }]);
})

