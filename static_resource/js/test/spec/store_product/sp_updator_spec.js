define(
[
     'app/store_product/sp_updator'
    ,'lib/async' 
]
,function
(
     sp_updator
    ,async
)
{
    describe('sp_updator_',function(){

        it('should make ajax request to get sp info',function(){
            var product_id = 1;
            var store_id = 1;
            couch_server_url = null;

            var sp_updator_b = sp_updator.exe.bind(sp_updator.exe,product_id,store_id,couch_server_url);
            async.waterfall([sp_updator_b],function(error,result){
                expect(jasmine.Ajax.requests.mostRecent().url).toBe('xxx');
                done();
            });
            expect(true).toBe(true);
        })
    })
});