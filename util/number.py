def expect_float(x):
    # try:
    #     a = float(x)
    # except ValueError:
    #     return False
    # else:
    #     return True
    pass


def get_double_from_str(num_str):
    """
        if input is None, return None
        if input is not valid float, raise exception
        if input is valid, convert input to float and return
    """
    result = None

    if len(num_str) != 0:
        result = float(num_str) 

    return result

def get_double_from_obj(obj):
    if obj == None:
        return None
    else:
        return float(obj)