define(
[
	 'lib/async'
	,'app/store_product/store_product_getter'
	,'app/sale/pending_scan/Pending_scan'
    ,'app/sale/pending_scan/pending_scan_inserter'
    ,'app/sale/displaying_scan/displaying_scan_2_ui'
]
,function
(
	 async
	,sp_getter
	,Pending_scan
    ,ps_inserter
    ,ds_2_ui
)
{
	function exe(pid,store_id,store_idb,store_pdb,couch_server_url,mm_lst,table){
        var sp_getter_b = sp_getter.by_product_id.bind(sp_getter.by_product_id,pid,store_idb);
        async.waterfall([sp_getter_b],function(error,result){
            if(error){
                error_lib.allert(error);
                return;
            }
            var sp = result;
            var ps = new Pending_scan(null/*key*/,1/*qty*/,sp.price,null/*discount*/,sp._id,null/*non_product_name*/);
            var ps_inserter_b = ps_inserter.bind(ps_inserter,store_idb,ps)
            var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,mm_lst,store_idb,store_pdb,table,store_id,couch_server_url);
            async.waterfall([ps_inserter_b,ds_2_ui_b],function(error,result){
                if(error){alert(error);}
            });
        }); 
	}

	return {
		exe:exe
	}
});