define(
    [
        'constance'
    ],
    function
    (
        constance
    )
    {
        function get_pending_scan_os(is_read_only,index_db){
            return _get_os(constance.PENDING_SCAN_OS_NAME,is_read_only,index_db);
        }

        function get_main_os(is_read_only,index_db){
            return _get_os(constance.MAIN_OS_NAME,is_read_only,index_db);
        }

        function _get_os(name,is_read_only,index_db){
            var access_mode = (is_read_only ? "readonly" : "readwrite");
            return index_db.transaction(name,access_mode).objectStore(name);
        }

        return {
             get_main_os:get_main_os
            ,get_pending_scan_os:get_pending_scan_os
        };
    }
);