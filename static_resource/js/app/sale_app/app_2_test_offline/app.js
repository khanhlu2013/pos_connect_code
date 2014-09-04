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
    var mod = angular.module('sale_app_offline',['sale_app','ngMockE2E']);
    mod.run(function($httpBackend) {
        var regx = /\/product\/search_by_sku_angular\?sku_str=.+/;
        $httpBackend.whenGET(regx).respond(0/*status*/,null/*data*/);

        // $httpBackend.whenGET(/^\/templates\//).passThrough();
    });
})
