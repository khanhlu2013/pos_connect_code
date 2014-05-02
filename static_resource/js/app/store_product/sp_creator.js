define(
	[
		 'lib/async'
		,'app/store_product/sp_prompt'
		,'app/local_db_initializer/sync_if_nessesary'
		,'app/product/product_json_helper'
		,'app/sku/product_sku_online_adder'

	]
	,function
	(
		 async
		,sp_prompt
		,sync_if_nessesary
		,product_json_helper
		,sku_adder
	)
{
   	var ERROR_CANCEL_select_product_option = 'ERROR_CANCEL_select_product_option';
   	
   	function _create(product_id,prompt_result,callback){
        var data = {
             name : prompt_result.name
            ,price : prompt_result.price
            ,crv : prompt_result.crv
            ,is_taxable : prompt_result.is_taxable
            ,is_sale_report : prompt_result.is_sale_report
            ,sku_str : prompt_result.sku_str
            ,p_type : prompt_result.p_type
            ,p_tag : prompt_result.p_tag
            ,cost: prompt_result.cost
            ,vendor: prompt_result.vendor
            ,buydown: prompt_result.buydown
        }
        
        var url = null;
 		if(product_id){
        	data['product_id'] = product_id;
        	url = '/product/insert_old_sp';
        }else{
        	url = '/product/insert_new_sp';
        }   

        $.ajax({
             url:url
            ,method: "POST" 
            ,data : data
            ,dataType:'json'
            ,success:function(data,status_str,xhr){
                callback(null/*error*/,data);
            }
            ,error:function(xhr,status_str,err){
                callback(xhr);
            }
        });
   	}

    function exit_btn_handler(callback){
        $("#select_product_option_dialog").dialog("close");
        callback(ERROR_CANCEL_select_product_option);
    }

	function select_option(prodStore_prodSku_1_0,prodStore_prodSku_0_0,store_id,callback){
		if(prodStore_prodSku_1_0.length == 0 && prodStore_prodSku_0_0.length == 0){
			callback(null/*error*/,null/*result*/);
		}else{

			$('#product_option_create_new_btn').off('click').click(function(){
				callback(null,null);
				$("#select_product_option_dialog").dialog("close");
			});

			var product_option_tbl = document.getElementById('select_product_option_tbl');
			product_option_tbl.innerHTML='';

			var td;
			var tr;

			tr = product_option_tbl.insertRow(-1);
			
			td = tr.insertCell(-1);
			td.innerHTML = 'product';

			td = tr.insertCell(-1);
			td.innerHTML = 'add';

			for(var i =0;i<prodStore_prodSku_1_0.length;i++){
				var cur_prod = prodStore_prodSku_1_0[i];
				var cur_sp = product_json_helper.get_sp_from_p(cur_prod,store_id);

				tr = product_option_tbl.insertRow(-1);
				
				td = tr.insertCell(-1);
 				td.innerHTML = cur_sp.name;

 				td = tr.insertCell(-1);
 				td.innerHTML = 'sku';

	            (function(v){
	 				td.addEventListener('click',function(){
	 					$("#select_product_option_dialog").dialog("close");
	 					callback(null,v);
	 				});
	            })(cur_prod);
 			}

			for(var i =0;i<prodStore_prodSku_0_0.length;i++){
				
				var cur_prod = prodStore_prodSku_0_0[i];
				tr = product_option_tbl.insertRow(-1);
				
				td = tr.insertCell(-1);
 				td.innerHTML = cur_prod.name;

 				td = tr.insertCell(-1);
 				td.innerHTML = 'product';

	            (function(v){
	 				td.addEventListener('click',function(){
	 					$("#select_product_option_dialog").dialog("close");
	 					callback(null,v);
	 				});
	            })(cur_prod);
 			} 

			var exit_btn_handler_b = exit_btn_handler.bind(exit_btn_handler,callback);
			$('#select_product_option_dialog').dialog(
				{
					 title:'create new product or select option'
					,buttons:[{ text:'cancel',click:exit_btn_handler_b }] 
					,modal:true
				}
			); 		
 		}
	}

 	function exe(sku_str,prod_lst,lookup_type_tag,store_id,couch_server_url,callback){
 		
 		var prodStore_prodSku_0_0 = product_json_helper.extract_prod_store__prod_sku(prod_lst,store_id,false/*is_prod_store*/,false/*is_prod_sku*/,sku_str);
 		var prodStore_prodSku_0_1 = product_json_helper.extract_prod_store__prod_sku(prod_lst,store_id,false/*is_prod_store*/,true/*is_prod_sku*/,sku_str);
 		var prodStore_prodSku_1_0 = product_json_helper.extract_prod_store__prod_sku(prod_lst,store_id,true/*is_prod_store*/,false/*is_prod_sku*/,sku_str);
 		var prodStore_prodSku_1_1 = product_json_helper.extract_prod_store__prod_sku(prod_lst,store_id,true/*is_prod_store*/,true/*is_prod_sku*/,sku_str);

 		if(prodStore_prodSku_1_1.length != 0){
 			callback('there is error: attempt to create a product that is already exist');
 		}else if(prodStore_prodSku_0_1.length != 0){
 			callback('there is error. please report bug: data integrity constrain failed');
 		}else{

 			var select_option_b = select_option.bind(select_option,prodStore_prodSku_1_0,prodStore_prodSku_0_0,store_id);
			async.waterfall([select_option_b],function(error,result){
				if(error){
					callback(error);
					return;
				}

				var selected_product = result;

				if(selected_product != null && product_json_helper.get_p_from_lst(selected_product.product_id,prodStore_prodSku_1_0) ) {
					//if product is already exist in our store, but the sku is not, then we just add sku
					var sku_adder_b = sku_adder.bind(sku_adder,selected_product.product_id,sku_str);
					async.waterfall([sku_adder_b],function(error,result){
						callback(error,result);
					});
				}else{
					//ajax to create
					var sp_prompt_b = sp_prompt.show_prompt.bind(
						 sp_prompt.show_prompt
						,null//name
						,null//price
						,null//crv
						,false//is_taxable
						,true//is_sale_report
						,null//p_type
						,null//p_tag
						,sku_str//sku_str
						,true//is_prompt_sku
						,null//cost
						,null//vendor
						,null//buydown
						,lookup_type_tag
						,false//is_sku_management
						,selected_product
					); 		
					var product_id = (selected_product == null ? null : selected_product.product_id);
					var create_b = _create.bind(_create,product_id);
					async.waterfall([sp_prompt_b,create_b],function(error,result){
						if(error){
							callback(error);
							return;
						}
						
						product = result;
						var sync_if_nessesary_b = sync_if_nessesary.bind(sync_if_nessesary,store_id,couch_server_url);
						async.waterfall([sync_if_nessesary_b],function(error,result){
							callback(error,product);
						});
 					});
				}
			});
 		}
 	}

	return{
		 exe:exe
		,ERROR_CANCEL_select_product_option : ERROR_CANCEL_select_product_option
	}
});