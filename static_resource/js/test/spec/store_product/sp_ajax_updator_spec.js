define(
[
     'app/store_product/sp_online_updator'
    ,'lib/async'
]
,function
(
     sp_online_updator
    ,async
)
{
    describe('sp_online_updator',function(){
        beforeEach(function() {
            jasmine.Ajax.install();
        });

        afterEach(function() {
            jasmine.Ajax.uninstall();
        });

        it('should make ajax request to update sp info',function(){
            var store_id = 1;
            var product_id = 1;
            var couch_server_url = null;
            var name = 'name'
            var price = 1;
            var crv = 1;
            var is_taxable = true;
            var is_sale_report = true;
            var p_type = 'type';
            var p_tag = 'tag';
            
            var callback = jasmine.createSpy('success');
            
            sp_online_updator
            (
                 store_id
                ,product_id
                ,couch_server_url
                ,name
                ,price
                ,crv
                ,is_taxable
                ,is_sale_report
                ,p_type
                ,p_tag
                ,callback
            );

            expect(callback).not.toHaveBeenCalled();
            expect(jasmine.Ajax.requests.mostRecent().url).toBe('/product/updator_ajax');

            var product = 
            {
                 "name": "1"
                , "product_id": 15
                , "store_product_set": 
                    [
                        {
                             "product_id": 15
                            , "store_id": 4
                            , "name": "my one11"
                            , "p_type": "ab"
                            , "p_tag": "b"
                            , "price": "2.00"
                            , "is_taxable": false
                            , "is_sale_report": true
                            , "crv": "3.210"
                        }
                        , 
                        {
                             "product_id": 15
                            , "store_id": 3
                            , "name": "my prod"
                            , "p_type": "aaa"
                            , "p_tag": "b"
                            , "price": "1.00"
                            , "is_taxable": false
                            , "is_sale_report": true
                            , "crv": "1.000"
                        }
                    ]
                , "prodskuassoc_set": [{"sku_str": "1", "popularity": 2}]
            };            
            var response = 
            {
                 "product": product
                ,"error_message": ""
            }

            jasmine.Ajax.requests.mostRecent().response({
                 "status":200
                ,"contentType":'application/json'
                ,"responseText":JSON.stringify(response)
            });
            expect(callback).toHaveBeenCalledWith(null,product);
        });
    });
});