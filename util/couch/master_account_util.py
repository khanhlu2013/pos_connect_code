from django.conf import settings

def get_master_user_name():
    return settings.COUCH_MASTER_USER_NAME

def get_master_user_password():
    return settings.COUCH_MASTER_USER_PASSWORD