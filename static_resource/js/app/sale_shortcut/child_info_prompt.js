define(
    [
         'lib/async'
        ,'app/store_product/store_product_getter'
    ]
    ,function
    (
         async
        ,sp_getter
    )
{
    var ERROR_CANCEL = 'ERROR_CANCEL';
	var selected_product_index = null;

	function ok_button_handler(sp_lst,callback){
        var child_caption = $("#caption_txt").val();

		if(selected_product_index == null){
			alert("select product");
		}else if(child_caption.trim().length == 0){
            alert("enter caption ")
        }else
        {
            var result = {child_caption:child_caption,product_id:sp_lst[selected_product_index].product_id};
			callback(null/*error*/,result)
		}
	}

	function cancel_button_handler(callback){
		$("#child_info_prompt_dlg").dialog("close");
		callback(ERROR_CANCEL/*error*/,null/*result*/)
	}

    function table_click_handler(product_name,index){
        $('#product_name_label').val(product_name);
        selected_product_index = index;
    }

    function init_ui(outer_callback,sp_lst,callback){
        
    	//reset ui
    	var table = document.getElementById('product_prompt_tbl');
        $('#caption_txt').val(null);
        while(table.hasChildNodes())
        {
           table.removeChild(table.firstChild);
        }  

        //product option to ui
        for(var i = 0;i<sp_lst.length;i++){
        	var tr = table.insertRow(-1);
        	var td = tr.insertCell(-1);
        	var cur_sp_name = sp_lst[i].name
        	td.innerHTML = (cur_sp_name);
            var table_click_handler_b = table_click_handler.bind(table_click_handler,cur_sp_name,i)
        	td.addEventListener("click",table_click_handler_b);
        }

        //ok, cancel button
 		var ok_button_handler_b = ok_button_handler.bind(ok_button_handler,sp_lst,outer_callback);
        var cancel_button_handler_b = cancel_button_handler.bind(cancel_button_handler,outer_callback);
 		$( "#child_info_prompt_dlg" ).dialog({ buttons: [ { text: "Ok", click: ok_button_handler_b },{ text: "Cancel", click: cancel_button_handler_b } ] });

        //display ui
        $( "#child_info_prompt_dlg" ).dialog("open");
    }


	function exe(store_idb,callback){
		//get info of store product
		//turn on and display input interface
		//handle ok button click: validate input and return input in callback
    	

        var sp_getter_b = sp_getter.by_product_id_not_null.bind(sp_getter.by_product_id_not_null,store_idb);
        var init_ui_b = init_ui.bind(init_ui,callback)
        async.waterfall([sp_getter_b,init_ui_b],function(error,result){
            //do nothing here. this function is done when callback is called inside ok or cancel button press
        });
    }       
	
	return {
		 exe:exe
		,ERROR_CANCEL:ERROR_CANCEL
	}
});