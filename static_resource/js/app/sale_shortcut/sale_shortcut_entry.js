requirejs.config({
     baseUrl: STATIC_URL + 'js'
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        ,jquery: ['//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min', 'lib/jquery/jquery-1.11.0.min']
        ,jquery_ui: ['//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min', 'lib/jquery/jquery-ui-1.10.4.min']
        ,jquery_block_ui: ['//cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.66.0-2013.10.09/jquery.blockUI.min', 'lib/jquery/jquery.blockUI']
    }
});

requirejs(["app/sale_shortcut/sale_shortcut"]);