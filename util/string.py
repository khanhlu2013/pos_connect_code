def strip(string,is_convert_null_if_emtpy):
	if string == None:
		return None

	string = string.strip()
 	if is_convert_null_if_emtpy:
		string = None if len(string) == 0 else string

	return string