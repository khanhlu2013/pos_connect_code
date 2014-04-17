define(
	[
		'constance'
	]
	,function
	(
		constance
	)
{
 	function Receipt
 	(
 		 _id
 		,_rev 
 		,_doc_id_rev
 		,key
 		,time_stamp
 		,tax_rate
 		,ds_lst
 		,collect_amount
 	)
 	{
 		if(_id != null && _rev != null && _doc_id_rev != null){
 			//this is the case when we create new object to insert into pouch. These properties will handle by pouch.
 			this._id = _id;
 			this._rev = _rev;
 			this._doc_id_rev = _doc_id_rev;
 			
 		}
		
		this.key = key;
        this.time_stamp = time_stamp;
        this.tax_rate = tax_rate;
		this.ds_lst = ds_lst;
		this.collect_amount = collect_amount
		this.d_type = constance.RECEIPT_TYPE
	};
    
    return Receipt;
});