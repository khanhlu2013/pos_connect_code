define(
[
     'lib/number/number'
    ,'app/sale/non_inventory/non_inventory_validate'
]
,function
(
     number
    ,non_inventory_validate
)
{

    function ok_btn_handler(callback){
        var price = $('#non_inventory_price_txt').val().trim();
        var description = $('#non_inventory_description_txt').val().trim();

        var error_lst = non_inventory_validate.exe(price,description);
        if(error_lst.length != 0){
            if(error_lst.indexOf(non_inventory_validate.ERROR_NON_INVENTORY_VALIDATION_PRICE) != -1){
                $('#non_inventory_price_txt').addClass("error");  
            }
            return;
        }

        var result={price:price,description:description};
        callback(null,result);
        $('#non_inventory_prompt_dialog').dialog('close');
    }

    function cancel_btn_handler(callback){
        callback('ERROR_CANCEL_NON_INVENTORY_PROMPT_CANCEL');
        $('#non_inventory_prompt_dialog').dialog('close');
    }

    function exe(callback){
        var html_str = 
            '<div id="non_inventory_prompt_dialog">' +
                '<label for="non_inventory_price_txt">Price:</label>' +
                '<input type="text" id = "non_inventory_price_txt">' +
                '<br>' +
                '<label for="non_inventory_description_txt">Description:</label>' +
                '<input type="text" id = "non_inventory_description_txt" value="non inventory">' +
                '<br>' +
            '</div>' ;

        var ok_btn_handler_b = ok_btn_handler.bind(ok_btn_handler,callback);
        var cancel_btn_handler_b = cancel_btn_handler.bind(cancel_btn_handler,callback);
        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'non inventory',
                zIndex: 10000,
                autoOpen: true,
                width: 600,
                height: 400,
                buttons:[{text: "Ok", click: ok_btn_handler_b },{ text: "Cancel", click: cancel_btn_handler_b}],
                open: function( event, ui ) 
                {

                },
                close: function (event, ui) {
                    $(this).remove();
                }
            }); 
    }

    return{
        exe:exe
    }
});