define(
[
     'app/store_product/sp_online_searcher'
]
,function
(
     sp_online_searcher
)
{
    describe('sp_online_searcher',function(){
        beforeEach(function() {
            jasmine.Ajax.install();
        });

        afterEach(function() {
            jasmine.Ajax.uninstall();
        });

        it('should be able to search by name',function(){
            var name_str = 'abc';
            var callback = jasmine.createSpy('success');
            sp_online_searcher.name_search(name_str,callback);
            expect(callback).not.toHaveBeenCalled();
            expect(jasmine.Ajax.requests.mostRecent().url).toBe('/product/search_by_name?name_str=' + name_str);

            var prod_lst = 
                [
                    {
                         "name": "1"
                        , "product_id": 15
                        , "store_product_set": 
                            [
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
                                ,
                                {
                                     "product_id": 15
                                    , "store_id": 4
                                    , "name": "sadf"
                                    , "p_type": "ab"
                                    , "p_tag": "b"
                                    , "price": "2.00"
                                    , "is_taxable": false
                                    , "is_sale_report": true
                                    , "crv": "3.210"
                                }
                            ]
                        , "prodskuassoc_set": [{"sku_str": "1", "popularity": 2}]
                    }
                ];            

            response = {"prod_lst":prod_lst };

            jasmine.Ajax.requests.mostRecent().response({
                 "status":200
                ,"contentType":'application/json'
                ,"responseText":JSON.stringify(response)
            });
            expect(callback).toHaveBeenCalledWith(null,prod_lst);
        });




        it('should be able to search by sku',function(){
            var sku_str = '1';
            var callback = jasmine.createSpy('success');
            sp_online_searcher.sku_search(sku_str,callback);
            expect(callback).not.toHaveBeenCalled();
            expect(jasmine.Ajax.requests.mostRecent().url).toBe('/product/search_by_sku?sku_str=' + sku_str);

            var prod_lst = 
                [
                    {
                         "name": "1"
                        , "product_id": 15
                        , "store_product_set": 
                            [
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
                                , 
                                {
                                     "product_id": 15
                                    , "store_id": 4
                                    , "name": "sadf"
                                    , "p_type": "ab"
                                    , "p_tag": "b"
                                    , "price": "2.00"
                                    , "is_taxable": false
                                    , "is_sale_report": true
                                    , "crv": "3.210"
                                }
                            ]
                        , "prodskuassoc_set": [{"sku_str": "1", "popularity": 2}]
                    }
                ];            
            var response = 
            {
                 "prod_lst": prod_lst
                ,"lookup_type_tag": null
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