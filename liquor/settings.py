from unipath import Path
PROJECT_ROOT = Path(__file__).ancestor(2)
import os
import sys

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        }
    },
    'handlers': {
        'console': {
            'level':'DEBUG',
            'class':'logging.StreamHandler',
            'stream': sys.stdout,
            'formatter':'simple'
        },
    },
    'loggers': {
        'django': {
            'handlers':['console'],
            'filters': [],   
            'propagate': True,
            'level':'INFO',
        }, 
    },
}

INSTALLED_APPS = (
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
     'django.contrib.auth'
    ,'django.contrib.contenttypes'
    ,'django.contrib.sessions'
    ,'django.contrib.sites'
    ,'django.contrib.messages'
    ,'django.contrib.staticfiles'
    ,'django.contrib.admin'
    ,'django.contrib.sites'
    ,'rest_framework'
    ,'django_extensions'
    ,'storages'
    ,'south'
    ,'django_nose' 
    ,'liqUser'
    ,'bus'
    ,'product'
    ,'store'
    ,'store_product'
    ,'sale'
    ,'tax'
    ,'sale_shortcut'
    ,'mix_match'
    ,'receipt'
    ,'group'
    ,'payment_type'
)

DEBUG = os.environ.get('DEBUG')
TEMPLATE_DEBUG = os.environ.get('TEMPLATE_DEBUG')
SECRET_KEY = os.environ.get('SECRET_KEY')

import dj_database_url
DATABASES = {'default': dj_database_url.config()}

STATICFILES_STORAGE = os.environ.get('STATICFILES_STORAGE')
STATIC_URL = os.environ.get('STATIC_URL')
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')

COUCH_DB_HTTP_S = True if os.environ.get('COUCH_DB_HTTP_S') == 'True' else False
COUCH_LOCAL_ADMIN_NAME = os.environ.get('COUCH_LOCAL_ADMIN_NAME')
COUCH_LOCAL_ADMIN_PWRD = os.environ.get('COUCH_LOCAL_ADMIN_PWRD')
COUCH_LOCAL_URL = os.environ.get('COUCH_LOCAL_URL')

#TEST
TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'
TEST_DISCOVER_TOP_LEVEL = PROJECT_ROOT
TEST_DISCOVER_ROOT = PROJECT_ROOT
TEST_DISCOVER_PATTERN = "test_*"
SOUTH_TESTS_MIGRATE = False

#WHAT ARE THESE----------------------------------------------------------------------------------------------------------------------------------
STATIC_ROOT = ''
SITE_ID = 1 #is this related to staging?
ALLOWED_HOSTS = []
ALLOWED_HOSTS = ['*']
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')



#STATIC SETTING ----------------------------------------------------------------------------------------------------------------------------------

TEMPLATE_DIRS = (
    PROJECT_ROOT.child('templates'),
)
STATICFILES_DIRS = (
    PROJECT_ROOT.child('static_resource'),
)
ROOT_URLCONF = 'liquor.urls'
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    # 'compressor.finders.CompressorFinder',
   # 'django.contrib.staticfiles.finders.DefaultStorageFinder',
)
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)
TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.static",
    "django.core.context_processors.tz",
    "django.contrib.messages.context_processors.messages",
    'django.core.context_processors.request',
)
MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.transaction.TransactionMiddleware',
)

SESSION_SERIALIZER='django.contrib.sessions.serializers.PickleSerializer'
WSGI_APPLICATION = 'liquor.wsgi.application'
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

SP_PAGE_NAME_SEARCH_PAGINATION_SIZE = 30

#sale shortcut
SHORTCUT_ROW_COUNT = 5
SHORTCUT_COLUMN_COUNT = 3

#couch settings
VIEW_DOCUMENT_ID = "_design/views"
STORE_DB_VIEW_NAME_BY_PRODUCT_ID = "by_product_id"
STORE_DB_VIEW_NAME_BY_SKU = "by_sku"
STORE_DB_VIEW_NAME_BY_D_TYPE = "by_d_type"
STORE_PRODUCT_DOCUMENT_TYPE = 'prod_bus_assoc'
RECEIPT_DOCUMENT_TYPE = 'receipt'


#NEED CLEAN UP ----------------------------------------------------------------------------------------------------------------------------------
#AUTH_USER_MODEL = 'liqUser.LiqUser'
LOGIN_URL = 'liquor_login_named_url'
LOGOUT_URL = 'liquor_logout_named_url'
LOGIN_REDIRECT_URL  = 'sp_search'

#COUCHDB-
#URL


#STORE DB
STORE_DB_PREFIX = os.environ.get('STORE_DB_PREFIX')
PROD_BUS_ASSOC_DOCUMENT_TYPE = 'prod_bus_assoc'
SALE_RECORD_DOCUMENT_TYPE = 'sale_record'

IS_LOCAL_ENV = os.environ.get('IS_LOCAL_ENV') == '1'
