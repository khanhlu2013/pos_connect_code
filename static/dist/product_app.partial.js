(function(module) {
try {
  module = angular.module('app.productApp.partial');
} catch (e) {
  module = angular.module('app.productApp.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('model.group.manage.html',
    '<div class="modal-header"><div class="modal-title"><h3>manage group</h3></div></div>\n' +
    '\n' +
    '<div class="modal-body">\n' +
    '    <button id="group_app/service/manage/add_btn" ng-click="add_group()" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span></button>\n' +
    '    <input type="text" ng-model="local_filter.name" placeHolder="local filter">\n' +
    '    <table ng-hide="group_lst.length == 0" class="table table-hover table-bordered table-condensed table-striped">\n' +
    '        <tr>\n' +
    '            <th>group</th>\n' +
    '            <th>execute</th>\n' +
    '            <th>delete</th>\n' +
    '            <th>edit</th>\n' +
    '        </tr>\n' +
    '\n' +
    '        <tr ng-repeat="group in group_lst | filter:local_filter">\n' +
    '            <td>{{group.name}}</td>\n' +
    '            <td class="alncenter"><button id="model.group.manage.template.execute_btn" ng-click="execute_group(group.id)" class="btn btn-primary"><span class="glyphicon glyphicon-play"></span></button></td> \n' +
    '            <td class="alncenter"><button id="model.group.manage.template.delete_btn" ng-click="delete_group(group)" class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span></button></td>\n' +
    '            <td class="alncenter"><button id="model.group.manage.template.edit_btn" ng-click="edit_group(group)"class="btn btn-primary"><span class="glyphicon glyphicon-pencil"></span></button></td>\n' +
    '        </tr>\n' +
    '    </table>\n' +
    '    <pre ng-show="group_lst.length == 0">there is no group</pre>\n' +
    '</div>\n' +
    '\n' +
    '<div class="modal-footer">\n' +
    '    <button id="group_app/service/manage/exit_btn" ng-click="exit()" class="btn btn-warning"><span class="glyphicon glyphicon-remove"></span></button>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app.productApp.partial');
} catch (e) {
  module = angular.module('app.productApp.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('model.group.prompt.html',
    '<div class="modal-header"><h3>{{original_group.name==undefined?\'Create new group\' : \'Edit group \'+ original_group.name}}</h3></div>\n' +
    '<div class="modal-body">\n' +
    '    <div name="form" class="form-group">\n' +
    '        <label>group name:</label>\n' +
    '        <input id="group_app/service/prompt/name_txt" name="name" ng-model="group.name" type="text" focus-me={{true}} required>\n' +
    '        <label class="error" ng-show="form.name.$error.required">required</label>\n' +
    '    </div>\n' +
    '\n' +
    '    <button id="group_app/service/prompt/add_btn" ng-click="add_sp()" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span></button>\n' +
    '    <table ng-hide="group.sp_lst.length == 0" class="table table-hover table-bordered table-condensed table-striped">\n' +
    '        <tr>\n' +
    '            <th>product</th>\n' +
    '            <th>remove</th>\n' +
    '        </tr>\n' +
    '\n' +
    '        <tr ng-repeat="sp in group.sp_lst">\n' +
    '            <td>{{sp.name}}</td>\n' +
    '            <td class="alncenter"><button ng-click="remove_sp(sp)"class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span></button></td>\n' +
    '        </tr>\n' +
    '    </table>\n' +
    '    <pre ng-show="group.sp_lst.length == 0">there is no product in this group</pre>\n' +
    '</div>\n' +
    '<div class="modal-footer">\n' +
    '    <button id="group_app/service/prompt/cancel_btn" ng-click="cancel()" class="btn btn-warning">cancel</button>\n' +
    '    <button ng-disabled="is_unchange()" ng-click="reset()" class="btn btn-primary">reset</button>\n' +
    '    <button id="group_app/service/prompt/ok_btn" ng-disabled="form.$invalid || is_unchange()" ng-click="ok()" class="btn btn-success">ok</button>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('app.productApp.partial');
} catch (e) {
  module = angular.module('app.productApp.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('model.group.execute.input_form.html',
    '<form name="form" novalidate role="form">\n' +
    '    <div class="form-horizontal" >\n' +
    '        <!-- price --> \n' +
    '        <div class="form-group">\n' +
    '            <label class="col-sm-5 control-label">Price:</label>\n' +
    '            <div class="col-sm-7">\n' +
    '                <input id="group_app/service/execute/enable_price_check" ng-click="checkbox_click(\'price\')" ng-model="$parent.enable_price" type="checkbox"></input>\n' +
    '                <input id="group_app/service/execute/price_txt" ng-disabled="!enable_price" ng-required="enable_price" ng-model="option.price" name="price" type="number" min="0.01">\n' +
    '                <label ng-show="form.price.$error.required && !form.price.$error.number && !form.price.$error.min" class="error">required</label>\n' +
    '                <label ng-show="form.price.$error.number" class="error">invalid number</label>\n' +
    '                <label ng-show="form.price.$error.min" class="error">minimum error</label>\n' +
    '            </div>\n' +
    '        </div> \n' +
    '        <!-- crv -->\n' +
    '        <div class="form-group">\n' +
    '            <label class="col-sm-5 control-label">Crv:</label>\n' +
    '            <div class="col-sm-7">\n' +
    '                <input id="group_app/service/execute/enable_crv_check" ng-click="checkbox_click(\'crv\')" ng-model="$parent.enable_crv" type="checkbox"></input>\n' +
    '                <input id="group_app/service/execute/crv_txt" ng-disabled="!enable_crv" ng-model="option.crv" name="crv" type="number" min="0.01">\n' +
    '                <label ng-show="form.crv.$error.number" class="error">invalid number</label>\n' +
    '                <label ng-show="form.crv.$error.min" class="error">minimum error</label>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <!-- is_taxable -->\n' +
    '        <div class="form-group">\n' +
    '            <label class="col-sm-5 control-label">Tax:</label>\n' +
    '            <div class="col-sm-7">\n' +
    '                <input id="group_app/service/execute/enable_is_taxable_check" ng-click="checkbox_click(\'is_taxable\')" ng-model="$parent.enable_is_taxable" type="checkbox"></input>\n' +
    '                <input id="group_app/service/execute/is_taxable_check" ng-disabled="!enable_is_taxable" ng-model="option.is_taxable" name="is_taxable" type="checkbox">\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <!-- cost -->\n' +
    '        <div class="form-group">\n' +
    '            <label class="col-sm-5 control-label">Cost:</label>\n' +
    '            <div class="col-sm-7">\n' +
    '                <input id="group_app/service/execute/enable_cost_check" ng-click="checkbox_click(\'cost\')" ng-model="$parent.enable_cost" type="checkbox"></input>\n' +
    '                <input id="group_app/service/execute/cost_txt" ng-disabled="!enable_cost" ng-model="option.cost" name="cost" type="number" min="0.01">\n' +
    '                <label ng-show="form.cost.$error.number" class="error">invalid number</label>\n' +
    '                <label ng-show="form.cost.$error.min" class="error">minimum error</label>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <!-- is_sale_report -->\n' +
    '        <div class="form-group">\n' +
    '            <label class="col-sm-5 control-label">sale report:</label>\n' +
    '            <div class="col-sm-7">\n' +
    '                <input id="group_app/service/execute/enable_is_sale_report_check" ng-click="checkbox_click(\'is_sale_report\')" ng-model="$parent.enable_is_sale_report" type="checkbox"></input>\n' +
    '                <input id="group_app/service/execute/is_sale_report_check" ng-disabled="!enable_is_sale_report" ng-model="option.is_sale_report" name="is_sale_report" type="checkbox">\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <!-- p_type -->\n' +
    '        <div class="form-group">\n' +
    '            <label class="col-sm-5 control-label">Type:</label>\n' +
    '            <div class="col-sm-7">\n' +
    '                <input id="group_app/service/execute/enable_p_type_check" ng-click="checkbox_click(\'p_type\')" ng-model="$parent.enable_p_type" type="checkbox"></input>\n' +
    '                <input id="group_app/service/execute/p_type_txt" ng-disabled="!enable_p_type" ng-model="option.p_type" name="p_type" type="text">\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <!-- p_tag -->\n' +
    '        <div class="form-group">\n' +
    '            <label class="col-sm-5 control-label">Tag:</label>\n' +
    '            <div class="col-sm-7">\n' +
    '                <input id="group_app/service/execute/enable_p_tag_check" ng-click="checkbox_click(\'p_tag\')" ng-model="$parent.enable_p_tag" type="checkbox"></input>\n' +
    '                <input id="group_app/service/execute/p_tag_txt" ng-disabled="!enable_p_tag" ng-model="option.p_tag" name="p_tag" type="text">\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <!-- vendor -->\n' +
    '        <div class="form-group">\n' +
    '            <label class="col-sm-5 control-label">Vendor:</label>\n' +
    '            <div class="col-sm-7">\n' +
    '                <input id="group_app/service/execute/enable_vendor_check" ng-click="checkbox_click(\'vendor\')" ng-model="$parent.enable_vendor" type="checkbox"></input>\n' +
    '                <input id="group_app/service/execute/vendor_txt" ng-disabled="!enable_vendor" ng-model="option.vendor" name="vendor" type="text">\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <!-- buydown -->\n' +
    '        <div class="form-group">\n' +
    '            <label class="col-sm-5 control-label">Buydown:</label>\n' +
    '            <div class="col-sm-7">\n' +
    '                <input id="group_app/service/execute/enable_buydown_check" ng-click="checkbox_click(\'buydown\')" ng-model="$parent.enable_buydown" type="checkbox"></input>\n' +
    '                <input id="group_app/service/execute/buydown_txt" ng-disabled="!enable_buydown" ng-model="option.buydown" name="buydown" type="number" min="0.01">\n' +
    '                <label ng-show="form.buydown.$error.number" class="error">invalid number</label>\n' +
    '                <label ng-show="form.buydown.$error.min" class="error">minimum error</label>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <!-- value customer price -->\n' +
    '        <div class="form-group">\n' +
    '            <label class="col-sm-5 control-label">value_cus_price:</label>\n' +
    '            <div class="col-sm-7">\n' +
    '                <input id="group_app/service/execute/enable_value_customer_price_check" ng-click="checkbox_click(\'value_customer_price\')" ng-model="$parent.enable_value_customer_price" type="checkbox"></input>\n' +
    '                <input id="group_app/service/execute/value_customer_price_txt" ng-disabled="!enable_value_customer_price" ng-model="option.value_customer_price" name="value_customer_price" type="number" min="0.01">\n' +
    '                <label ng-show="form.value_customer_price.$error.number" class="error">invalid number</label>\n' +
    '                <label ng-show="form.value_customer_price.$error.min" class="error">minimum error</label>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</form>');
}]);
})();

(function(module) {
try {
  module = angular.module('app.productApp.partial');
} catch (e) {
  module = angular.module('app.productApp.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('model.group.execute.main.html',
    '<div class="modal-header"><h3>{{group.name}} - execute</h3></div>\n' +
    '\n' +
    '<div class="modal-body">\n' +
    '    <div ng-hide="group.sp_lst.length === 0">\n' +
    '        <div class="col-sm-5">\n' +
    '            <div ng-include=" \'model.group.execute.input_form.html\' "></div>\n' +
    '            <div ng-hide="is_option_empty()">\n' +
    '                <hr>\n' +
    '                <h3>actions</h3>\n' +
    '                <ul>\n' +
    '                    <li ng-show="value!== undefined" ng-repeat="(key,value) in option">{{key}} : <span ng-class="value===null?\'error\':\'\'">{{value !== null ? value : \'empty\'}}</span></li>\n' +
    '                </ul>\n' +
    '            </div>  \n' +
    '        </div>\n' +
    '        <div class="col-sm-7">\n' +
    '            <table class="table table-hover table-bordered table-condensed table-striped">\n' +
    '                <tr>\n' +
    '                    <th>product</th>\n' +
    '                    <th>price</th>\n' +
    '                    <th>crv</th>\n' +
    '                    <th>tax</th>\n' +
    '                    <th>cost</th>\n' +
    '                </tr>\n' +
    '\n' +
    '                <tr ng-repeat="sp in group.sp_lst">\n' +
    '                    <td>{{sp.name}}</td>\n' +
    '                    <td>{{sp.price|currency}}</td>\n' +
    '                    <td>{{sp.crv|currency}}</td>\n' +
    '                    <td class="alncenter"><span class="glyphicon" ng-class="sp.is_taxable? \'glyphicon-check\' : \'glyphicon-unchecked\'"></span></td>\n' +
    '                    <td>{{sp.cost|currency}}</td>\n' +
    '                </tr>\n' +
    '            </table>\n' +
    '        </div>                     \n' +
    '        <div class="clear"></div>\n' +
    '    </div>\n' +
    '    <pre id="group_app/service/execute/empty_group_warning_lbl" ng-show="group.sp_lst.length === 0" class="error">there is no product in this group</pre>\n' +
    '</div>\n' +
    '\n' +
    '<div class="modal-footer">\n' +
    '    <button id="group_app/service/execute/ok_btn" ng-disabled="is_option_empty() || form.$invalid" ng-click="ok() || group.sp_lst.length === 0" class="btn btn-success">ok</button>\n' +
    '    <button id="group_app/service/execute/exit_btn" ng-click="exit()" class="btn btn-warning">exit</button>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app.productApp.partial');
} catch (e) {
  module = angular.module('app.productApp.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('model.product.network_product.detail.html',
    '<h3>detail</h3>\n' +
    '<table class="table table-hover table-bordered table-condensed table-striped">\n' +
    '    <tr>\n' +
    '        <th>name</th>\n' +
    '        <th>percent</th>\n' +
    '    </tr>\n' +
    '    <tr ng-repeat="name_stat in suggest_extra_name|orderBy:\'-percent\'">\n' +
    '        <td>{{name_stat.value}}</td>\n' +
    '        <td>{{name_stat.percent}}%</td>\n' +
    '    </tr>\n' +
    '</table>\n' +
    '<table ng-hide="suggest_extra_crv.length === 0" class="table table-hover table-bordered table-condensed table-striped">\n' +
    '    <tr>\n' +
    '        <th>crv</th>\n' +
    '        <th>percent</th>\n' +
    '    </tr>\n' +
    '    <tr ng-repeat="crv_stat in suggest_extra_crv|orderBy:\'-percent\'">\n' +
    '        <td>{{crv_stat.value|currency}}</td>\n' +
    '        <td>{{crv_stat.percent}}%</td>\n' +
    '    </tr> \n' +
    '</table>\n' +
    '<table class="table table-hover table-bordered table-condensed table-striped">\n' +
    '    <tr>\n' +
    '        <th class="info" ng-click="column_click(\'get_cost()\')">cost <span ng-class="get_sort_class(\'get_cost()\')"></span></th>\n' +
    '        <th class="info" ng-click="column_click(\'price\')">price <span ng-class="get_sort_class(\'price\')"></span></th>\n' +
    '        <th class="info" ng-click="column_click(\'get_markup()\')">markup% <span ng-class="get_sort_class(\'get_markup()\')"></span></th>\n' +
    '        <th ng-show="is_sale_data" class="info" ng-click="column_click(\'sale\')">sale <span ng-class="get_sort_class(\'sale\')"></span></th>\n' +
    '        <th ng-show="is_sale_data" class="info" ng-click="column_click(\'get_profit()\')">profit <span ng-class="get_sort_class(\'get_profit()\')"></span></th>\n' +
    '    </tr>\n' +
    '    <tr \n' +
    '        ng-repeat="sp in (network_product.get_sp_lst()|orderBy:cur_sort_column:cur_sort_desc|emptyToEnd:cur_sort_column)" \n' +
    '        ng-class="sp.store_id === share_setting.STORE_ID ? \'success\' : \'\'" \n' +
    '    >\n' +
    '        <td class="alnright">{{sp.get_cost()|currency}}</td>\n' +
    '        <td class="alnright">{{sp._get_b4_tax_price()|currency}}</td>\n' +
    '        <td class="alnright">{{sp.get_markup()}}</td>\n' +
    '        <td class="alnright" ng-show="is_sale_data">{{sp.sale}}</td>\n' +
    '        <td class="alnright" ng-show="is_sale_data">{{sp.sale * (sp._get_b4_tax_price() - sp.get_cost()) | currency | not_show_zero}}</td>\n' +
    '    </tr>\n' +
    '</table>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('app.productApp.partial');
} catch (e) {
  module = angular.module('app.productApp.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('model.product.network_product.main.html',
    '<div id="model.product.network_product.html" ng-hide="network_product === undefined || network_product === null">\n' +
    '    <div class="col-md-6">\n' +
    '        <div ng-include=" \'model.product.network_product.summary.html\' "></div>\n' +
    '    </div>\n' +
    '    \n' +
    '    <div class="col-md-6">\n' +
    '        <div ng-include=" \'model.product.network_product.detail.html\' "></div>\n' +
    '    </div>\n' +
    '    \n' +
    '    <div class="clear"></div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app.productApp.partial');
} catch (e) {
  module = angular.module('app.productApp.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('model.product.network_product.summary.html',
    '<h3>average</h3>\n' +
    '<div class="form-horizontal" >\n' +
    '    <div class="form-group">\n' +
    '        <label ng-class="network_product_summary_lbl_class">name:</label>\n' +
    '        <p \n' +
    '            id="product/network_product/summary/name_lbl" \n' +
    '            ng-class="network_product_summary_value_class">\n' +
    '                {{network_product.get_suggest_main(\'name\').value}}\n' +
    '        </p>\n' +
    '    </div>\n' +
    '    <div class="form-group">\n' +
    '        <label ng-class="network_product_summary_lbl_class">member count:</label>\n' +
    '        <p \n' +
    '            ng-class="network_product_summary_value_class">\n' +
    '                {{network_product.get_sp_lst().length}}\n' +
    '        </p>\n' +
    '    </div>    \n' +
    '    <div class="form-group">\n' +
    '        <label ng-class="network_product_summary_lbl_class">price:</label>\n' +
    '        <p \n' +
    '            id="product/network_product/summary/price_lbl" \n' +
    '            ng-class="network_product_summary_value_class">\n' +
    '                {{network_product.get_suggest_main(\'price\')|currency}}\n' +
    '        </p>\n' +
    '    </div>\n' +
    '    <div class="form-group">\n' +
    '        <label ng-class="network_product_summary_lbl_class">tax:</label>\n' +
    '        <p ng-hide="network_product.get_suggest_main(\'is_taxable\').percent === 50" ng-class="network_product_summary_value_class">\n' +
    '            <span\n' +
    '                id="product/network_product/summary/is_taxable/sign_span"\n' +
    '                class="glyphicon"\n' +
    '                ng-class="network_product.get_suggest_main(\'is_taxable\').value === true ? \'glyphicon-check\' : \'glyphicon-unchecked\'">\n' +
    '            </span>\n' +
    '            <span\n' +
    '                id="product/network_product/summary/is_taxable/percent_span"\n' +
    '                ng-hide="network_product.get_suggest_main(\'is_taxable\').percent === 100">\n' +
    '                    ({{network_product.get_suggest_main(\'is_taxable\').percent}}%)\n' +
    '            </span>\n' +
    '        </p>\n' +
    '    </div>\n' +
    '    <div class="form-group">\n' +
    '        <label ng-class="network_product_summary_lbl_class">crv:</label>\n' +
    '        <p \n' +
    '            id="product/network_product/summary/crv_lbl" \n' +
    '            ng-class="network_product_summary_value_class">\n' +
    '                {{network_product.get_suggest_main(\'crv\').value|currency}}\n' +
    '        </p>\n' +
    '    </div>\n' +
    '    <div class="form-group">\n' +
    '        <label ng-class="network_product_summary_lbl_class">cost:</label>\n' +
    '        <p \n' +
    '            id="product/network_product/summary/cost_lbl" \n' +
    '            ng-class="network_product_summary_value_class">\n' +
    '                {{network_product.get_suggest_main(\'cost\')|currency}}\n' +
    '        </p>\n' +
    '    </div>                                                            \n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app.productApp.partial');
} catch (e) {
  module = angular.module('app.productApp.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('model.store_product.prompt.template_name.html',
    '<div class=\'form-group\'>\n' +
    '    <label class=\'col-sm-4 control-label\' >Name:</label>\n' +
    '    <div class=\'col-sm-8\'>\n' +
    '        <input id=\'sp_app/service/prompt/name_txt\' name=\'product_name\' ng-model=\'sp.name\' type=\'text\' size=\'45\' required>\n' +
    '        <div ng-include=\'model.store_product.prompt.template_name_suggestion.html\'></div>\n' +
    '        <label class=\'error\' ng-show=\'form.product_name.$error.required\'>require</label>\n' +
    '    </div>\n' +
    '</div>\n' +
    '    ');
}]);
})();

(function(module) {
try {
  module = angular.module('app.productApp.partial');
} catch (e) {
  module = angular.module('app.productApp.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('model.store_product.prompt.template_name_suggestion.html',
    '<div ng-hide=\'is_no_suggestion("name")\' class=\'btn-group\' dropdown>\n' +
    '    <button\n' +
    '        id=\'sp_app/service/prompt/suggest/main/name\'\n' +
    '        ng-click=\'sp.name=get_suggest_main("name").value\'\n' +
    '        type=\'button\'\n' +
    '        class=\'btn btn-primary\'>\n' +
    '            {{get_suggest_main(\'name\').value}}\n' +
    '    </button>\n' +
    '\n' +
    '    <button\n' +
    '        id=\'sp_app/service/prompt/suggest/extra/name\'\n' +
    '        ng-disabled=\'!is_many_suggestion("name")\'\n' +
    '        type=\'button\'\n' +
    '        class=\'btn btn-primary dropdown-toggle\'>\n' +
    '            <span class=\'caret\'></span>\n' +
    '    </button type=\'button\'>\n' +
    '    <ul class=\'dropdown-menu\' role=\'menu\'>\n' +
    '        <li ng-repeat=\'extra in get_suggest_extra("name")|orderBy:"percent":true\'>\n' +
    '            <a ng-click=\'sp.name=extra.value\' href=\'#\'>{{extra.value}} - ({{extra.percent}}%)</a>\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app.productApp.partial');
} catch (e) {
  module = angular.module('app.productApp.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('model.store_product.prompt.template_price.html',
    '<div class=\'form-group\'>\n' +
    '    <label class=\'col-sm-4 control-label\'>Price:</label>\n' +
    '    <div class=\'col-sm-8\'>\n' +
    '        <input \n' +
    '            id=\'sp_app/service/prompt/price_txt\' \n' +
    '            name=\'price\'\n' +
    '            ng-model=\'sp.price\' \n' +
    '            valid-float=\'gt0\'\n' +
    '            required>\n' +
    '        <div ng-include=\'model.store_product.prompt.template_price_suggestion.html\'></div>\n' +
    '        <label \n' +
    '            class=\'error\' \n' +
    '            ng-show=\'form.price.$error.required\'>\n' +
    '            require\n' +
    '        </label>\n' +
    '        <label \n' +
    '            class=\'error\' \n' +
    '            ng-show=\'form.price.$error.validFloat\'>\n' +
    '            invalid\n' +
    '        </label>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('app.productApp.partial');
} catch (e) {
  module = angular.module('app.productApp.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('model.store_product.prompt.template_price_suggestion.html',
    '<div ng-hide=\'is_no_suggestion("price")\' class=\'btn-group\' dropdown>\n' +
    '    <button\n' +
    '        id=\'sp_app/service/prompt/suggest/main/price\'\n' +
    '        ng-click=\'sp.price=get_suggest_main("price")\'\n' +
    '        type=\'button\'\n' +
    '        class=\'btn btn-primary\'>\n' +
    '            {{get_suggest_main("price")|currency}}\n' +
    '    </button>\n' +
    '    <button\n' +
    '        id=\'sp_app/service/prompt/suggest/extra/price\'\n' +
    '        ng-disabled=\'!is_many_suggestion("price")\'\n' +
    '        type=\'button\'\n' +
    '        class=\'btn btn-primary dropdown-toggle\'>\n' +
    '            <span class=\'caret\'></span>\n' +
    '    </button>\n' +
    '    <ul class=\'dropdown-menu\' role=\'menu\'>\n' +
    '        <li ng-repeat=\'extra in get_suggest_extra("price")|orderBy:"valueOf()\'>\n' +
    '            <a ng-click=\'sp.price=extra\' href=\'#\'>{{extra|currency}}</a>\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('app.productApp.partial');
} catch (e) {
  module = angular.module('app.productApp.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('model.store_product.prompt.template_type_tag.html',
    '<div class="form-group">\n' +
    '    <label class="col-sm-4 control-label">Type - tag:</label>\n' +
    '    <div class="col-sm-8">\n' +
    '        <select \n' +
    '            ng-options="((item.p_type == false ? \'none\' : item.p_type) + \' - \' + (item.p_tag == false ? \'none\' : item.p_tag)) group by item.p_type for item in lookup_type_tag" \n' +
    '            ng-model="selected_type_tag" ng-change="update_selected_type_tag()">\n' +
    '            <option value="">-- select type tag --</option>\n' +
    '        </select>\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '<div class="form-group">\n' +
    '    <label class="col-sm-4 control-label">Type:</label>\n' +
    '    <div class="col-sm-8">\n' +
    '        <input \n' +
    '            id="sp_app/service/prompt/p_type_txt" \n' +
    '            ng-model="sp.p_type" \n' +
    '            typeahead="item for item in lookup_type() | filter:$viewValue | limitTo:8"\n' +
    '            type="text">\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '<div class="form-group">\n' +
    '    <label class="col-sm-4 control-label">Tag:</label>\n' +
    '    <div class="col-sm-8">\n' +
    '        <input \n' +
    '            id="sp_app/service/prompt/p_tag_txt" \n' +
    '            ng-model="sp.p_tag" \n' +
    '            typeahead="item for item in lookup_tag(sp.p_type) | filter:$viewValue | limitTo:8"\n' +
    '            type="text">\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app.productApp.partial');
} catch (e) {
  module = angular.module('app.productApp.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('model.store_product.sku_not_found_handler.select_suggestion.product.template.html',
    '<div \n' +
    '    class=\'alert alert-warning\' \n' +
    '    id=\'sp_app/service/suggest/select_product_dlg\' \n' +
    '    class=\'modal-header\'>\n' +
    '    <h3>sku not found - {{sku}}</h3>\n' +
    '</div>\n' +
    '<div class=\'modal-body\'>\n' +
    '    <h3>Option 1: </h3>\n' +
    '    <div class=\'indent_40px\'>\n' +
    '        <table class=\'table table-hover table-bordered table-condensed table-striped\'>\n' +
    '            <label>add products from pos_connect network</label>\n' +
    '            <tr>\n' +
    '                <th>member count</th>\n' +
    '                <th>name</th>\n' +
    '                <th>price</th>\n' +
    '                <th>crv</th>\n' +
    '                <th>tax</th>\n' +
    '                <th>cost</th>\n' +
    '                <th>add</th>\n' +
    '            </tr>\n' +
    '            <tr ng-repeat="product in product_lst |orderBy:\'-get_sp_lst().length\'">\n' +
    '                <td id="model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.member_count">{{product.get_sp_lst().length}}</td>\n' +
    '                <td id="model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.name">{{product.get_suggest_main(\'name\').value}}</td>\n' +
    '                <td id="model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.price">{{product.get_suggest_main(\'price\')|currency}}</td>\n' +
    '                <td id="model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.crv">{{product.get_suggest_main(\'crv\').value|currency}}</td>\n' +
    '                <td id="model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.is_taxable" class="alncenter">\n' +
    '                    <div ng-hide="product.get_suggest_main(\'is_taxable\').percent === 50">\n' +
    '                        <span\n' +
    '                            class=\'glyphicon\'\n' +
    '                            ng-attr-id=\'sp_app/service/suggest/select_product_dlg/lst/is_taxable/sign/{{product.id}}\'\n' +
    '                            ng-class="product.get_suggest_main(\'is_taxable\').value === true ? \'glyphicon-check\' : \'glyphicon-unchecked\'">\n' +
    '                        </span>\n' +
    '                        <span\n' +
    '                            ng-attr-id=\'sp_app/service/suggest/select_product_dlg/lst/is_taxable/percent/{{product.id}}\'\n' +
    '                            ng-hide="product.get_suggest_main(\'is_taxable\').percent === 100 ">\n' +
    '                                ({{product.get_suggest_main(\'is_taxable\').percent}}%)\n' +
    '                        </span>\n' +
    '                    </div>\n' +
    '                </td>\n' +
    '                <td id="model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.cost">{{product.get_suggest_main(\'cost\')|currency}}</td>\n' +
    '                <td class=\'alncenter\'>\n' +
    '                    <button \n' +
    '                        ng-click=\'select_product(product)\' \n' +
    '                        id="model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.select_btn" \n' +
    '                        class=\'btn btn-primary glyphicon glyphicon-plus\'></button>\n' +
    '                </td>\n' +
    '            </tr>\n' +
    '        </table>\n' +
    '\n' +
    '    </div>\n' +
    '\n' +
    '    <h3>Option 2:</h3>\n' +
    '    <div class=\'indent_40px\'>\n' +
    '        <button \n' +
    '            id=\'sp_app/service/suggest/select_product_dlg/create_new_product_btn\' \n' +
    '            ng-click=\'create_new_product()\'\n' +
    '            class=\'btn btn-primary\'>create new product\n' +
    '        </button>\n' +
    '    </div>\n' +
    '\n' +
    '</div>\n' +
    '<div class=\'modal-footer\'>\n' +
    '    <button \n' +
    '        id=\'sp_app/service/suggest/select_product_dlg/select_sp\'\n' +
    '        ng-click=\'select_sp()\'\n' +
    '        ng-hide=\'my_sp_lst.length === 0\'\n' +
    '        class=\'btn btn-primary btn-float-left\'>back\n' +
    '    </button>\n' +
    '    <button ng-click=\'cancel()\' class=\'btn btn-warning\'>cancel</button>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('app.productApp.partial');
} catch (e) {
  module = angular.module('app.productApp.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('model.store_product.sku_not_found_handler.select_suggestion.store_product.template.html',
    '<div id=\'sp_app/service/suggest/select_sp_dlg\' class=\'modal-header\'><h3>sku: {{sku}} not found</h3></div>\n' +
    '<div class=\'modal-body\'>\n' +
    '    <h3>Option 1</h3>\n' +
    '    <div class=\'indent_40px\'>\n' +
    '        <label>These products are <mark>already inside</mark> your database. If scanned product is found here, you can <mark>simply</mark> add sku.</label>\n' +
    '        <table class=\'table table-hover table-bordered table-condensed table-striped\'>\n' +
    '            <tr>\n' +
    '                <th>your product</th>\n' +
    '                <th>price</th>\n' +
    '                <th>taxable</th>\n' +
    '                <th>crv</th>\n' +
    '                <th>cost</th>\n' +
    '                <th>buydown</th>\n' +
    '                <th><span class=\'glyphicon glyphicon-plus\'> sku</span></th>\n' +
    '            </tr>\n' +
    '            <tr ng-repeat=\'sp in my_sp_lst\' id=\'model.store_product.sku_not_found_handler.select_suggestion.store_product.lst\'>\n' +
    '                <td>{{sp.name}}</td>\n' +
    '                <td>{{sp.price | currency}}</td>\n' +
    '                <td class=\'alncenter\'><span class=\'glyphicon\' ng-class="sp.is_taxable ? \'glyphicon-check\' : \'glyphicon-unchecked\'"></span></td>\n' +
    '                <td>{{sp.get_crv()}}</td>\n' +
    '                <td>{{sp.get_cost()}}</td>\n' +
    '                <td>{{sp.get_buydown()}}</td>\n' +
    '                <td class=\'alncenter\'>\n' +
    '                    <button \n' +
    '                        ng-click = \'return_sp(sp)\' \n' +
    '                        id = \'model.store_product.sku_not_found_handler.select_suggestion.store_product.lst.return_sp_btn\'\n' +
    '                        class = \'btn btn-primary glyphicon glyphicon-plus\'> sku\n' +
    '                    </button>\n' +
    '                </td>\n' +
    '            </tr>\n' +
    '        </table>\n' +
    '    </div>\n' +
    '    <h3>Option 2</h3>\n' +
    '    <div class=\'indent_40px\'>\n' +
    '        <label>If scanned product is <mark>not</mark> found:</label>\n' +
    '        <button \n' +
    '            id=\'sp_app/service/suggest/select_sp_dlg/create_new_product_btn\' \n' +
    '            ng-click=\'create_new_product()\' \n' +
    '            ng-hide=\'product_lst.length !== 0\' \n' +
    '            class=\'btn btn-primary\'>create new product</button>\n' +
    '        <button \n' +
    '            id=\'sp_app/service/suggest/select_sp_dlg/select_product_btn\' \n' +
    '            ng-click=\'select_product()\' \n' +
    '            ng-hide=\'product_lst.length === 0\' \n' +
    '            class=\'btn btn-primary\'>see network suggestion</button>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<div class=\'modal-footer\'>\n' +
    '    <button ng-click=\'cancel()\' class=\'btn btn-warning\'>cancel</button>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app.productApp.partial');
} catch (e) {
  module = angular.module('app.productApp.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('model.store_product.search.online.multiple.template.html',
    '<div class=\'modal-header\'>\n' +
    '    <h3 class=\'modal-title\'>search</h3>\n' +
    '</div>\n' +
    '<div class=\'modal-body\'>\n' +
    '    <input\n' +
    '        id=\'sp_ll_app/service/search/name_sku_online_dlg/multiple/search_txt\'\n' +
    '        type=\'text\'\n' +
    '        ng-model=\'search_str\'\n' +
    '        ng-enter=\'search()\'\n' +
    '        placeholder=\'name/sku\'\n' +
    '        focus-me=\'{{true}}\'\n' +
    '        blur-me=\'is_blur_infinite_scroll_triggerer_textbox\'\n' +
    '    >\n' +
    '    <input ng-model=\'local_filter\' type=\'text\' placeholder=\'local filter\'>\n' +
    '    <div>\n' +
    '        <div \n' +
    '            class=\'col-sm-6\' \n' +
    '            style="overflow:auto;min-height:650px;max-height:650px" \n' +
    '            id="inifnite_scroll_parent_sp_search_multiple">\n' +
    '            <div ng-hide=\'message.length == 0\'>\n' +
    '                <pre>{{message}}</pre>\n' +
    '            </div>\n' +
    '            <table \n' +
    '                class=\'table table-hover table-bordered table-condensed table-striped\' \n' +
    '                infinite-scroll-container="\'#inifnite_scroll_parent_sp_search_multiple\'"\n' +
    '                infinite-scroll="infinite_scroll_handler()" \n' +
    '                infinite-scroll-distance=\'0\'\n' +
    '                infinite-scroll-parent="true">\n' +
    '                <tr>\n' +
    '                    <th>name</th>\n' +
    '                    <th>price</th>\n' +
    '                    <th>select</th>          \n' +
    '                </tr>\n' +
    '\n' +
    '                <tr \n' +
    '                    id=\'model.store_product.search.online.multiple.search_result_lst\'\n' +
    '                    ng-repeat=\'sp_multiple in sp_lst | orderBy:"name" | filter:local_filter\'>\n' +
    '                    <td>{{sp_multiple.name}}</td>\n' +
    '                    <td class=\'alnright\'>{{sp_multiple.price | currency}}</td>\n' +
    '                    <td class=\'alncenter\'>\n' +
    '                        <button \n' +
    '                            id=\'model.store_product.search.online.multiple.search_result_lst.toggle_btn\'\n' +
    '                            ng-class=\'is_sp_selected(sp_multiple) ? "btn-warning glyphicon-check" : "btn-primary glyphicon-unchecked"\' \n' +
    '                            class=\'btn glyphicon btn-xs\' \n' +
    '                            ng-click=\'toggle_select(sp_multiple)\' \n' +
    '                            onclick=\'this.blur()\'>\n' +
    '                        </button>\n' +
    '                    </td>\n' +
    '                </tr>\n' +
    '            </table>\n' +
    '        </div>\n' +
    '\n' +
    '        <div class=\'col-sm-6\'>\n' +
    '            <table class=\'table table-hover table-bordered table-condensed table-striped\'>\n' +
    '                <tr>\n' +
    '                    <th>name</th>\n' +
    '                    <th>price</th>                        \n' +
    '                    <th>remove</th>\n' +
    '                </tr>\n' +
    '\n' +
    '                <tr ng-repeat=\'sp_select in result_sp_lst | orderBy:"name"\'>\n' +
    '                    <td>{{sp_select.name}}</td>\n' +
    '                    <td class=\'alnright\'>{{sp_select.price|currency}}</td>\n' +
    '                    <td class=\'alncenter\'>\n' +
    '                        <button \n' +
    '                            id=\'model.store_product.search.online.multiple.selected_sp_lst.remove_btn\'\n' +
    '                            class=\'btn btn-warning glyphicon glyphicon-trash\' ng-click=\'remove(sp_select)\'></button>\n' +
    '                    </td>\n' +
    '                </tr>\n' +
    '            </table>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class=\'clear\'></div>\n' +
    '</div>\n' +
    '\n' +
    '<div class=\'modal-footer\'>\n' +
    '    <button\n' +
    '        id=\'model.store_product.search.online.multiple.cancel_btn\' \n' +
    '        class=\'btn btn-warning\' ng-click=\'cancel()\'>cancel</button>\n' +
    '    <button \n' +
    '        id=\'model.store_product.search.online.multiple.reset_btn\'\n' +
    '        ng-disabled=\'result_sp_lst.length==0\' \n' +
    '        class=\'btn btn-primary\' \n' +
    '        ng-click=\'reset()\'>reset</button>\n' +
    '    <button \n' +
    '        id=\'sp_ll_app/service/search/name_sku_online_dlg/multiple/ok_btn\' \n' +
    '        ng-disabled=\'result_sp_lst.length==0\' \n' +
    '        class=\'btn btn-success\' \n' +
    '        ng-click=\'ok()\'>ok</button>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app.productApp.partial');
} catch (e) {
  module = angular.module('app.productApp.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('model.store_product.search.online.single.template.html',
    '<div class=\'modal-header\'>\n' +
    '    <h3 class=\'modal-title\'>search</h3>\n' +
    '</div>\n' +
    '\n' +
    '<div \n' +
    '    style="overflow:auto;min-height:650px;max-height:650px"\n' +
    '    id="inifnite_scroll_parent_sp_search_single"\n' +
    '    class=\'modal-body\'>\n' +
    '    <input\n' +
    '        id=\'sp_ll_app/service/search/name_sku_online_dlg/single/search_txt\'\n' +
    '        type=\'text\'\n' +
    '        ng-model=\'search_str\'\n' +
    '        ng-enter=\'search("user")\'\n' +
    '        placeholder=\'name/sku\'\n' +
    '        focus-me={{true}}\n' +
    '        blur-me=\'is_blur_infinite_scroll_triggerer_textbox\'>\n' +
    '    <input ng-model=\'local_filter\' type=\'text\' placeholder=\'local filter\'>\n' +
    '    <table \n' +
    '        class=\'table table-hover table-bordered table-condensed table-striped\'\n' +
    '        infinite-scroll-container="\'#inifnite_scroll_parent_sp_search_single\'"\n' +
    '        infinite-scroll="infinite_scroll_handler()" \n' +
    '        infinite-scroll-parent="true"\n' +
    '        infinite-scroll-distance=\'0\'>\n' +
    '        <tr>\n' +
    '            <th>name</th>\n' +
    '            <th>price</th>\n' +
    '            <th>select</th>\n' +
    '        </tr>\n' +
    '\n' +
    '        <tr ng-repeat=\'search_sp_single in sp_lst | filter:local_filter\'>\n' +
    '            <td>{{search_sp_single.name}}</td>\n' +
    '            <td>{{search_sp_single.price|currency}}</td>\n' +
    '            <td class=\'alncenter\'>\n' +
    '                <button \n' +
    '                    class=\'btn btn-primary btn-xs\' \n' +
    '                    ng-click=\'select(search_sp_single)\'>select\n' +
    '                </button>\n' +
    '            </td>\n' +
    '        </tr>\n' +
    '    </table>\n' +
    '\n' +
    '    <div ng-hide=\'message.length == 0\'>\n' +
    '        <pre>{{message}}</pre>\n' +
    '    </div>        \n' +
    '</div>\n' +
    '\n' +
    '<div class=\'modal-footer\'>\n' +
    '    <button class=\'btn btn-warning\' ng-click=\'cancel()\'>cancel</button>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('app.productApp.partial');
} catch (e) {
  module = angular.module('app.productApp.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('model.store_product.sku_not_found_handler.select_suggestion.product.confirm.template.html',
    '<div \n' +
    '    id="sp_app/service/suggest/select_product_confirm_dlg" \n' +
    '    class="modal-header">\n' +
    '    <h3>confirm add product</h3>\n' +
    '</div>\n' +
    '\n' +
    '<div class="modal-body">\n' +
    '    <div \n' +
    '        ng-controller="model.product.network_product.controller" \n' +
    '        ng-init="init(network_product)" \n' +
    '        ng-include=" \'model.product.network_product.main.html\' ">\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '<div class="modal-footer">\n' +
    '    <button \n' +
    '        id=\'model.store_product.sku_not_found_handler.select_suggestion.product.confirm.back_btn\'\n' +
    '        ng-click="select_product()" \n' +
    '        class="btn btn-primary btn-float-left">back\n' +
    '    </button>\n' +
    '    <button\n' +
    '        id="sp_app/service/suggest/select_product_confirm_dlg/ok_btn" \n' +
    '        ng-click="return_product()" \n' +
    '        class="btn btn-success">add product\n' +
    '    </button>\n' +
    '    <button ng-click="cancel()" class="btn btn-warning">cancel</button>\n' +
    '</div>');
}]);
})();
