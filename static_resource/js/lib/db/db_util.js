define(
    [

    ]
    ,function
    (

    )
    {
		function get_store_db_name(store_id){
			return 'liquor_' + store_id
		}

        return {
             get_store_db_name:get_store_db_name
        };
    }
);



