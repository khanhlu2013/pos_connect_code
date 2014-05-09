define(
[
	 'lib/async'
	,'app/store_product/store_product_getter'
	,'app/sale/pending_scan/Pending_scan'
    ,'app/sale/pending_scan/pending_scan_inserter'
]
,function
(
	 async
	,sp_getter
	,Pending_scan
    ,ps_inserter
)
{
	function exe(pid,store_idb,callback){
        var sp_getter_b = sp_getter.by_product_id.bind(sp_getter.by_product_id,pid,store_idb);
        async.waterfall([sp_getter_b],function(error,result){
            if(error){
                error_lib.allert(error);
                return;
            }
            var sp = result;
            var ps = new Pending_scan(null/*key*/,1/*qty*/,sp.price,null/*discount*/,sp._id,null/*non_product_name*/);
            var ps_inserter_b = ps_inserter.bind(ps_inserter,store_idb,ps)
            async.waterfall([ps_inserter_b],function(error,result){
                callback(error);
            });
        }); 
	}

	return {
		exe:exe
	}
});