define(
[
     'app/store_product/sp_online_getter'
]
,function
(
     sp_online_getter
)
{
    describe('sp_online_getter',function(){
        beforeEach(function() {
            jasmine.Ajax.install();
        });

        afterEach(function() {
            jasmine.Ajax.uninstall();
        });

        it('should make ajax request to get sp info',function(){
            var product_id = 1;
            var store_id = 1;
            var is_include_other_store = false;
            var is_lookup_type_tag = false;

            var callback = jasmine.createSpy('success');
            sp_online_getter(product_id,is_include_other_store,is_lookup_type_tag,callback);
            expect(callback).not.toHaveBeenCalled();
            expect(jasmine.Ajax.requests.mostRecent().url).toBe('/product/getter_ajax?product_id=1');
            response = 
            {
                "sp": 
                        {
                             "product_id": 15
                            , "store_id": 4
                            , "name": "my one"
                            , "p_type": "ab"
                            , "p_tag": "b"
                            , "price": "2.00"
                            , "is_taxable": false
                            , "is_sale_report": true
                            , "crv": "3.210"
                        }
                , "lookup_type_tag": {"ab": ["b"]}
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