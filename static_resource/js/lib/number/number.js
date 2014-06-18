define(
[
    'lib/ui/button'
]
,function
(
    ui_button
)
{

    function trim(number){
        return +number.toFixed(5);
    }

    function round_2_decimal(number){
        if(number == null){
            return null;
        }else{
            return +number.toFixed(2);
        }
    }

    function prompt_integer(message,prefill,is_null_allow,callback){
        var html_str = 
            '<div>' +
                '<div><h3>' + message + '</h3></div>' +
                '<input type="text" id="_prompt_int_dlg_input_txt">' +
            '</div>'
        ;

        $(html_str).appendTo('body').dialog(
        {
            modal: true,
            title: 'prompt',
            zIndex: 10000,
            autoOpen: true,
            width: 'auto',
            resizable: false,
            buttons: {
                ok_btn:{
                    id : '_ui_prompt_ok_btn',
                    click : function () {
                        var result = $('#_prompt_int_dlg_input_txt').val().trim();
                        if(!is_null_allow && result.length == 0){
                            $('#_prompt_int_dlg_input_txt').addClass("error");
                            return;
                        }

                        if(!is_positive_integer(result)){
                            $('#_prompt_int_dlg_input_txt').addClass("error");
                            return;                         
                        }

                        callback(null,parseInt(result));
                        $(this).dialog("close");
                    },
                },
                cancel_btn:{
                    id : '_ui_prompt_cancel_btn',
                    click : function () {
                        callback('ERROR_CANCEL_');
                        $(this).dialog("close");
                    }
                }
            },
            open: function(event,ui){
                ui_button.set_css('_ui_prompt_ok_btn','green','ok',true);
                ui_button.set_css('_ui_prompt_cancel_btn','orange','remove',true);
                $('#_prompt_int_dlg_input_txt').val(prefill);
            },
            close: function (event, ui) {
                $(this).remove();
            }
        });             
    }


    function is_integer(str) {
        return parseInt(str) % 1 == 0;
    }

    function prompt_positive_integer(message,prefill,error_message){
        var str = prompt(message,prefill);
        if(str == null){
            return null;
        }else if(is_positive_integer(str)){
            return parseInt(str);
        }else{
            if(error_message){
                alert(error_message);
            }
            return null;
        }
    }
    
    function prompt_positive_double(message,prefill,error_message){
        var str = prompt(message,prefill);
        if(str == null){
            return null;
        }else{
            if(is_positive_double(str)){
                return parseFloat(str);
            }else if(error_message){
                alert(error_message);
                return null;
            }
        }
    }

    function is_positive_double(str){
        if(str == null){
            return false;
        }else{
            if(isNaN(str)){
                return false;
            }else{
                var number = parseFloat(str);
                if(number >= 0){
                    return true;
                }else{
                    return false;
                }
            }
        }
    }

    function is_positive_integer(str){
        var intRegex = /^\d+$/;
        return intRegex.test(str)
    }

    function get_mode(array)
    {
        if(array.length == 0)
            return null;
        
        var modeMap = {};
        var maxEl = array[0], maxCount = 1;
        for(var i = 0; i < array.length; i++)
        {
            var el = array[i];
            if(modeMap[el] == null)
                modeMap[el] = 1;
            else
                modeMap[el]++;  
            if(modeMap[el] > maxCount)
            {
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        return maxEl;
    }

    function get_median(values) {

        if(values.length == 0){
            return null;
        }

        values.sort( function(a,b) {return a - b;} );
        var half = Math.floor(values.length/2); 
        if (values.length % 2) { return values[half]; } 
        else { return (values[half-1] + values[half]) / 2.0; } 
    } 

    function str_2_float(str){
        /*
            if null return 0
            if "" return 0
            return parseFloat
        */
        if(str == null){
            return 0.0;
        }
        if(str.trim().length == 0){
            return 0.0;
        }
        return parseFloat(str.trim())
    }

    return {
         prompt_positive_integer:prompt_positive_integer
        ,is_positive_integer:is_positive_integer
        ,prompt_positive_double:prompt_positive_double
        ,is_positive_double:is_positive_double
        ,round_2_decimal:round_2_decimal
        ,trim:trim
        ,prompt_integer:prompt_integer
        ,get_mode:get_mode
        ,get_median:get_median
        ,str_2_float:str_2_float
    }
})
