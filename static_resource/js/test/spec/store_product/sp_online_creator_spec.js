define(
[
     'app/store_product/sp_online_creator'
]
,function
(
     sp_online_creator
)
{
    describe('sp_online_creator',function(){
        beforeEach(function() {
            jasmine.Ajax.install();
        });

        afterEach(function() {
            jasmine.Ajax.uninstall();
        });

        it('should make ajax request to create sp',function(){
            var product_id = 1;
            var callback = jasmine.createSpy('success');

            sp_online_creator
            (
                 product_id = 1
                ,name = 'name'
                ,price = 1
                ,crv = null
                ,is_taxable = true
                ,is_sale_report = true
                ,sku_str = '1'
                ,p_type = null
                ,p_tag = null                 
                ,callback
            );

            expect(callback).not.toHaveBeenCalled();
            expect(jasmine.Ajax.requests.mostRecent().url).toBe('/product/sp_creator');

            var response = //creating old sp
            {
                 "name": "1"
                , "product_id": 20
                , "store_product_set": 
                    [
                        {
                             "product_id": 20
                            , "store_id": 6
                            , "name": "1"
                            , "p_type": null
                            , "p_tag": null
                            , "price": "1.00"
                            , "is_taxable": false
                            , "is_sale_report": false
                            , "crv": null
                        }
                        , 
                        {
                             "product_id": 20
                            , "store_id": 7
                            , "name": "my 1"
                            , "p_type": null
                            , "p_tag": null
                            , "price": "1.00"
                            , "is_taxable": false
                            , "is_sale_report": false
                            , "crv": null
                        }
                    ]
                , "prodskuassoc_set": [{"sku_str": "1", "popularity": 2}]
            }

            jasmine.Ajax.requests.mostRecent().response({
                 "status":200
                ,"contentType":'application/json'
                ,"responseText":JSON.stringify(response)
            });
            expect(callback).toHaveBeenCalledWith(null,response);
        });
    });
});