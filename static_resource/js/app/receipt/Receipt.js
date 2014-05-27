define(
	[
		 'constance'
		,'app/sale/displaying_scan/displaying_scan_util'
	]
	,function
	(
		 constance
		,ds_util
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
 		,tender_lst
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
		this.tender_lst = tender_lst
		this.d_type = constance.RECEIPT_TYPE
	};

    return Receipt;
});