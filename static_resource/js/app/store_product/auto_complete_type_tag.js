$(function() {
    var lookup_type_tag = {{ lookup_type_tag|safe }};
    var type_lst = Object.keys(lookup_type_tag)

    $('#id_p_type').on('autocompletechange', function() {
        var tag_lst = lookup_type_tag[$(this).val()];
        $( "#id_p_tag" ).autocomplete({
             source: tag_lst
            ,minLength: 0
        })
        .bind('focus', function () {
            $(this).autocomplete("search");
        });
    });

    $( "#id_p_type" ).autocomplete({
         source: type_lst
        ,minLength: 0
    })
    .bind('focus', function () {
        $(this).autocomplete("search");
    });
});