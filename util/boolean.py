def get_boolean_from_str(bool_str):
    result = None

    if bool_str == 'true':
        result = True
    elif bool_str == 'false':
        result = False
    else:
        raise Exception('bug')

    return result

def py_2_js_str(py_bool_var):
	if py_bool_var:
		return 'true'
	else:
		return 'false'