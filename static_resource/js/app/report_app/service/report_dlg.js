define(
[
    'angular'
    //--------
    ,'app/receipt_app/service/api'
    ,'app/receipt_app/service/push'
    ,'service/ui'
]
,function
(
    angular
)
{
    var mod = angular.module('report_app/service/report_dlg',
    [
         'receipt_app/service/api'
        ,'receipt_app/service/push'
        ,'service/ui'
    ]);
    mod.factory('report_app/service/report_dlg',
    [
         '$modal'
        ,'receipt_app/service/api'
        ,'receipt_app/service/push'
        ,'service/ui/alert'
    ,function(
         $modal
        ,receipt_api
        ,push_receipt
        ,alert_service
    ){
        var TYPE_SALE_LIVE = 'TYPE_SALE_LIVE';
        var TYPE_SALE_STAMP = 'TYPE_SALE_STAMP';
        var TYPE_NON_REPORT_LIVE = 'TYPE_NON_REPORT_LIVE';
        var TYPE_PAYMENT_TYPE = 'TYPE_PAYMENT_TYPE';

        return function(){
            
            var button_toolbar_template = 
                '<div class="row">' +
                    '<div class="col-lg-3">' +
                        '<div class="input-group">' +
                            '<input type="text" class="form-control" datepicker-popup="MM-dd-yyyy" ng-model="from_date" is-open="$parent.opened_from" close-text="close" datepicker-options="dateOptions"></input>' +
                            '<span class="input-group-btn">' +
                                '<button type="button" class="btn btn-default" ng-click="open($event,\'opened_from\')"><i class="glyphicon glyphicon-calendar"></i></button>' +
                            '</span>' +
                        '</div>' +
                    '</div>' +     

                    '<div class="col-lg-3">' +
                        '<div class="input-group">' +
                            '<input type="text" class="form-control" datepicker-popup="MM-dd-yyyy" ng-model="to_date" is-open="$parent.opened_to" close-text="close" datepicker-options="dateOptions"></input>' +
                            '<span class="input-group-btn">' +
                                '<button type="button" class="btn btn-default" ng-click="open($event,\'opened_to\')"><i class="glyphicon glyphicon-calendar"></i></button>' +                        
                            '</span>' +
                        '</div>' +
                    '</div>' +

                    '<div class="col-lg-6">' +
                        '<div class="btn-toolbar">' +
                            '<div class="btn-group" dropdown is-open="status.isopen">' +
                                '<button type="button" class="btn btn-primary dropdown-toggle">{{report_type_2_string(cur_report_type)}} <span class="caret"></span></button>' +
                                '<ul class="dropdown-menu" role="menu">' +
                                    '<li class={{get_active_class(\'TYPE_SALE_STAMP\')}} ng-click="set_report_type(\'TYPE_SALE_STAMP\')"><a href="#">{{report_type_2_string(\'TYPE_SALE_STAMP\')}}</a></li>' +         
                                    '<li class={{get_active_class(\'TYPE_SALE_LIVE\')}} ng-click="set_report_type(\'TYPE_SALE_LIVE\')"><a href="#">{{report_type_2_string(\'TYPE_SALE_LIVE\')}}</a></li>' +
                                    '<li class={{get_active_class(\'TYPE_NON_REPORT_LIVE\')}} ng-click="set_report_type(\'TYPE_NON_REPORT_LIVE\')"><a href="#">{{report_type_2_string(\'TYPE_NON_REPORT_LIVE\')}}</a></li>' +
                                    '<li class={{get_active_class(\'TYPE_PAYMENT_TYPE\')}} ng-click="set_report_type(\'TYPE_PAYMENT_TYPE\')"><a href="#">{{report_type_2_string(\'TYPE_PAYMENT_TYPE\')}}</a></li>' +
                                '</ul>' +
                            '</div>' +
          
                            '<div class="btn-group">' +
                                '<button ng-disabled="from_date==null||to_date==null" ng-click="refresh_report()" class="btn btn-primary"><i class="glyphicon glyphicon-refresh"></i></button>' +                
                            '</div>' +   
                                
                            '<div class="btn-group">' +
                                '<button ng-click="refresh_today_report()" class="btn btn-primary"><i class="glyphicon glyphicon-refresh"></i> today</button>' +                
                            '</div>' +                                                                   
                        '</div>' +
                    '</div>' +                    
                '</div>'
            ;

            var type_tag_report_section_template =
                '<div ng-hide="cur_report_type===\'TYPE_PAYMENT_TYPE\' || receipt_lst===null || receipt_lst.length === 0">' +
                    '<table class="table table-hover table-bordered table-condensed table-striped">' +
                        '<tr>' +
                            '<th>type</th>' +
                            '<th>tag</th>' +
                            '<th>sub_total</th>' +                            
                            '<th>total</th>' +
                        '</tr>' +

                        '<tr ng-repeat="report_item in get_type_tag_report_data()">' +
                            '<td>{{report_item.tag === null ? report_item.type : ""}}</td>' +
                            '<td>{{report_item.tag}}</td>' +
                            '<td>{{report_item.sub_total | currency}}</td>' +
                            '<td>{{report_item.total | currency}}</td>' +
                        '</tr>' +
                    '</table>' +
                '</div>'
            ;
            var payment_type_report_section_template = 
                '<div ng-show="cur_report_type===\'TYPE_PAYMENT_TYPE\'">' +
                    '<table class="table table-hover table-bordered table-condensed table-striped">' +
                        '<tr>' +
                            '<th>type</th>' +
                            '<th>amount</th>' +
                        '</tr>' +

                        '<tr ng-repeat="report_item in payment_type_report_data">' +
                            '<td>{{report_item.pt === null ? \'cash\' : report_item.pt.name}}</td>' +
                            '<td>{{report_item.amount | currency}}</td>' +
                        '</tr>' +
                    '</table>' +                
                '</div>'
            ;
            var template = 
                '<div class="modal-header"><h3>sale report</h3></div>' +
                '<div class="modal-body">' + 
                    button_toolbar_template +
                    type_tag_report_section_template + 
                    payment_type_report_section_template +
                    '<div ng-show="receipt_lst !== null && receipt_lst.length === 0"><pre>there is no data in this range</pre></div>' +
                '</div>' +
                '<div class="modal-footer">' + 
                    '<button class="btn btn-warning" ng-click="exit()">exit</button>'
                '</div>'                                
            ;

            var controller = function($scope,$modalInstance){
                var UNDEFINED_TYPE_STR = 'undefined';
                var NON_INVENTORY_TYPE_STR = 'non inventory';
                var TAXALBE = 'tax';
                var NON_TAXABLE = 'non_tax';

                $scope.cur_report_type = TYPE_SALE_STAMP;
                $scope.from_date = null;
                $scope.to_date = null;
                $scope.receipt_lst = null;

                $scope.sale_live_report_data = [];
                $scope.sale_stamp_report_data = [];
                $scope.non_report_live_report_data = [];
                $scope.payment_type_report_data = [];
                push_receipt().then(
                     function(){/*do nothing*/}
                    ,function(reason){ alert_service('alert',reason,'red'); }
                )

                $scope.refresh_report = function(){
                    receipt_api.get_receipt($scope.from_date,$scope.to_date).then(
                         function(data){ $scope.receipt_lst = data; }
                        ,function(reason){ alert_service('alert',reason,'red');}
                    )
                }
                $scope.report_type_2_string = function(type){
                    if(type === TYPE_SALE_LIVE){ return 'report live'; }
                    else if(type === TYPE_SALE_STAMP){ return 'report stamp'; }
                    else if(type === TYPE_NON_REPORT_LIVE){ return 'no report'; }
                    else if(type === TYPE_PAYMENT_TYPE){ return 'payment type'; }
                }
                $scope.refresh_today_report = function(){ $scope.from_date = new Date(); $scope.to_date = new Date(); $scope.refresh_report(); }
                $scope.open = function($event,from_or_to) { $event.preventDefault(); $event.stopPropagation(); $scope[from_or_to] = true; };                
                $scope.get_active_class = function(type){ var result = ""; if(type === $scope.cur_report_type){ result = 'active'}; return result; }
                $scope.set_report_type = function(type){ $scope.cur_report_type = type; }
                $scope.get_type_tag_report_data = function(){
                    if($scope.cur_report_type === TYPE_SALE_LIVE){ return $scope.sale_live_report_data; }
                    else if($scope.cur_report_type === TYPE_SALE_STAMP){ return $scope.sale_stamp_report_data; }
                    else if($scope.cur_report_type === TYPE_NON_REPORT_LIVE){ return $scope.non_report_live_report_data; }
                }
                function _update_type_tag_dic(type,tag,sub_total,total,dic){ 
                    /*
                        type: must not be null
                        tag : nullable
                    */
                    var index = null;
                    if(tag === null){

                    }
                    for(var i = 0;i<dic.length;i++){
                        if(dic[i].type === type && dic[i].tag === tag){
                            index = i;
                            break;
                        }
                    }

                    if(index === null){ dic.push({type:type,tag:tag,sub_total:sub_total,total:total}) }
                    else{ 
                        if(sub_total !==null){
                            dic[index].sub_total += sub_total; 
                        }
                        if(total !== null){
                            dic[index].total += total;
                        }
                    }
                }                
                function _pop_report_item_base_on_p_type_only(p_type,report_item_lst){
                    var result = null;
                    for(var i = 0;i<report_item_lst.length;i++){
                        if(report_item_lst[i].type === p_type && report_item_lst[i].tag === null){
                            result = report_item_lst.splice(i,1)[0];
                            break;
                        }
                    }
                    return result;
                }
                function _sort_p_type_function(a,b){
                    if(a.type === b.type){
                        return a.tag > b.tag;
                    }else{
                        return a.type > b.type;
                    }
                }
                function _sort_report(report_item_lst){
                    var result = [];

                    //tax item
                    var tax_item = _pop_report_item_base_on_p_type_only(TAXALBE,report_item_lst);
                    if(tax_item !== null){ result.push(tax_item)};

                    //non tax item
                    var non_tax_item = _pop_report_item_base_on_p_type_only(NON_TAXABLE,report_item_lst);
                    if(non_tax_item !== null){ result.push(non_tax_item)};

                    //non inventory item
                    var non_inventory_item = _pop_report_item_base_on_p_type_only(NON_INVENTORY_TYPE_STR,report_item_lst);
                    if(non_inventory_item !== null){ result.push(non_inventory_item)};    

                    //undefined item
                    var undefined_item = _pop_report_item_base_on_p_type_only(UNDEFINED_TYPE_STR,report_item_lst);
                    if(undefined_item !== null){ result.push(undefined_item)};            

                    //p_type
                    report_item_lst.sort(_sort_p_type_function);
                    for(var i = 0;i<report_item_lst.length;i++){
                        result.push(report_item_lst[i]);
                    }             

                    return result;
                }
                function _calculate_type_tag_report(is_stamp,is_sale_report){
                    var dic = [];if($scope.receipt_lst === null){ return dic;}
                    for (var i = 0;i<$scope.receipt_lst.length;i++){ 
                        for(var j = 0;j<$scope.receipt_lst[i].receipt_ln_lst.length;j++){
                            var ln = $scope.receipt_lst[i].receipt_ln_lst[j];
                            var amount = ln.get_line_total($scope.receipt_lst[i].tax_rate);

                            //this section take care of is_sale_report filter which is only apply for live report. we can turn on and off is_sale_report any time to include or exclude them from live report. when it is a stamp report, we ignore this feature
                            if(!is_stamp){
                                if(is_sale_report === false){
                                    if(ln.is_non_inventory()){
                                        continue;
                                    }else if(ln.store_product.is_sale_report === true){
                                        continue;
                                    }
                                }else{
                                    if(ln.is_non_inventory()){
                                        /*do nothing*/
                                    }else if(ln.store_product.is_sale_report === false){
                                        continue;
                                    }                                
                                }
                            }

                            if (ln.is_non_inventory()){ _update_type_tag_dic(NON_INVENTORY_TYPE_STR,null/*tag*/,null/*sub_total*/,amount,dic) }
                            else {
                                //TAX - NON_TAX
                                var key;
                                if(is_stamp){
                                    if(ln.store_product_stamp.is_taxable){ key = TAXALBE; }
                                    else{ key = NON_TAXABLE }
                                }else{
                                    if(ln.store_product.is_taxable){ key = TAXALBE; }
                                    else{ key = NON_TAXABLE }                                
                                }
                                _update_type_tag_dic(key,null/*tag*/,null/*sub_total*/,amount,dic);

                                //P_TYPE
                                var p_type;var p_tag;
                                if(is_stamp){ p_type = ln.store_product_stamp.p_type; p_tag = ln.store_product_stamp.p_tag; }
                                else{ p_type = ln.store_product.p_type; p_tag = ln.store_product.p_tag;}
                                
                                if (p_type !== null){ 
                                    _update_type_tag_dic(p_type,null/*tag*/,null/*sub_total*/,amount,dic); 
                                    if(p_tag !== null){
                                        _update_type_tag_dic(p_type,p_tag,amount/*sub_total*/,null/*total*/,dic); 
                                    }else{
                                        _update_type_tag_dic(p_type,UNDEFINED_TYPE_STR/*p_tag*/,amount/*sub_total*/,null/*total*/,dic);
                                    }
                                }
                                else{ _update_type_tag_dic(UNDEFINED_TYPE_STR,null/*tag*/,null/*sub_total*/,amount,dic); }
                            }
                        }
                    }
                    return _sort_report(dic);                    
                }
                function _update_pt_dic(pt,amount,dic){
                    var item = null;

                    for(var i = 0;i<dic.length;i++){
                        var temp = dic[i];
                        if( (temp.pt === null && pt === null)  
                            ||  
                            (temp.pt !== null && pt !== null && temp.pt.id === pt.id) ){
                            item = temp;
                            break;
                        }
                    }

                    if(item === null){ dic.push({pt:pt,amount:amount}) }
                    else{ item.amount += amount }
                }
                function _calculate_payment_type_report(){
                    var dic = [];if($scope.receipt_lst === null){ return dic;}

                    for (var i = 0;i<$scope.receipt_lst.length;i++){ 
                        var receipt = $scope.receipt_lst[i];
                        for(var j = 0;j<receipt.tender_ln_lst.length;j++){
                            var ln = receipt.tender_ln_lst[j];
                            var amount = null;
                            if(ln.pt === null){
                                //cash pt calculate by a different formular: bill_amount - all_non_cash_pt
                                amount = receipt.get_otd_price() - receipt.get_total_non_cash_payment_type();
                            }else{
                                amount = ln.amount;
                            }
                            _update_pt_dic(ln.pt,amount,dic);                            
                        }
                    }
                    return dic;                    
                }
                $scope.calculate_report = function(){
                    $scope.sale_live_report_data = _calculate_type_tag_report(false/*is_stamp*/,true/*is_sale_report*/);
                    $scope.sale_stamp_report_data = _calculate_type_tag_report(true/*is_stamp*/,true/*is_sale_report*/);
                    $scope.non_report_live_report_data = _calculate_type_tag_report(false/*is_stamp*/,false/*is_sale_report*/);
                    $scope.payment_type_report_data = _calculate_payment_type_report();
                }
                $scope.$watchGroup(
                    [
                         function(){return $scope.receipt_lst;}//the reason i return a string representation of ps_lst is that get_ps_lst() always return a new created ps_lst which have a new identity all the time. This cause the watch to do infinite loop
                        ,
                    ]
                    ,function(newVal,oldVal,scope){$scope.calculate_report();}
                );                
                $scope.exit = function(){ $modalInstance.close(); }
            }

            var dlg = $modal.open({
                 template: template
                ,controller : controller
                ,size : 'lg'
                ,backdrop : 'static'
            });
        }    
    }])
})