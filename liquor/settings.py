from unipath import Path
PROJECT_ROOT = Path(__file__).ancestor(2)
import os
import sys

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
    # ,'debug_toolbar'
    ,'rest_framework'
    ,'django_extensions'
    ,'south'
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
    ,'report'
)

DEBUG = os.environ.get('DEBUG') == '1'
TEMPLATE_DEBUG = os.environ.get('TEMPLATE_DEBUG') == '1'
IS_USE_CDN = os.environ.get('IS_USE_CDN') == '1' #we only use Content Deliver Network CDN when deploy. for local developmet we are not.
SECRET_KEY = os.environ.get('SECRET_KEY')
STATIC_URL = os.environ.get('STATIC_URL')
TEMPLATE_DIRS = ( PROJECT_ROOT.child('templates'), )
ROOT_URLCONF = 'liquor.urls'
TEMPLATE_LOADERS = ( 'django.template.loaders.filesystem.Loader', )

#- this will read the environment variable DATABASE_URL and translate it for django to understand
import dj_database_url
DATABASES = {'default': dj_database_url.config()}

#- STATICFILES_DIRS and STATICFILES_FINDERS are ONLY need for LOCAL development because Django will host these static file on its local server for us. In deployment, we will host this static file our self using amazon s3, and access it though the static_url setting
STATICFILES_DIRS = ( PROJECT_ROOT.child('static'), )
STATICFILES_FINDERS = ( 'django.contrib.staticfiles.finders.FileSystemFinder', )

#- COUCH, POUCH
STORE_DB_PREFIX = os.environ.get('STORE_DB_PREFIX') # I should have named this as pouch-store-db-prefix instead. this variable is used for local development only. Before i protractor, i hardcode pouchdb prefix. the came protractor, and i want to separte pouchdb used by protractor and local-without-protractor. But then only care about protractor. so i guess i could hardcode this again. 
VIEW_DOCUMENT_ID = "_design/views"
STORE_PRODUCT_DOCUMENT_TYPE = 'prod_bus_assoc'
STORE_DB_VIEW_NAME_BY_PRODUCT_ID = "by_product_id"
STORE_DB_VIEW_NAME_BY_SKU = "by_sku"
STORE_DB_VIEW_NAME_BY_D_TYPE = "by_d_type"
COUCH_DB_HTTP_S = os.environ.get('COUCH_DB_HTTP_S') == '1'
IS_USE_COUCH_VS_BIG_COUCH = os.environ.get('IS_USE_COUCH_VS_BIG_COUCH') == '1' #when we use big couch, we are using the deploy/online/cloudant db. when we use couch, we use development/local apache couch db
COUCH_LOCAL_ADMIN_NAME = os.environ.get('COUCH_LOCAL_ADMIN_NAME') #only apply when we use local-apache-couch
COUCH_LOCAL_ADMIN_PWRD = os.environ.get('COUCH_LOCAL_ADMIN_PWRD') #only apply when we use local-apache-couch
COUCH_LOCAL_URL = os.environ.get('COUCH_LOCAL_URL') #only apply when we use local-apache-couch
RECEIPT_DOCUMENT_TYPE = 'receipt'

#- infinite scroll pagination
SP_PAGE_NAME_SEARCH_PAGINATION_SIZE = 50

#- sale shortcut
SHORTCUT_ROW_COUNT = 5
SHORTCUT_COLUMN_COUNT = 3

#- average sale data for network_product info
NETWORK_PRODUCT_SALE_DAY_OFFSET = 20 # 20 days is buffer time that we are sure the last receipt is push. this way the sale data is more accurate due to most recent receipt are mostly not yet pushed
NETWORK_PRODUCT_SALE_DAY_LOOKBACK = 3 * 30 #3 months of data is the look back

#----------------------------------------------------------------------------------------------------------------------------
#----------------------------------------------------------------------------------------------------------------------------
#----------------------------------------------------------------------------------------------------------------------------

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
    # 'debug_toolbar.middleware.DebugToolbarMiddleware',#debug toolbar        
)

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

SESSION_SERIALIZER='django.contrib.sessions.serializers.PickleSerializer'
WSGI_APPLICATION = 'liquor.wsgi.application'
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

STATIC_ROOT = ''
SITE_ID = 1 #is this related to staging?
ALLOWED_HOSTS = []
ALLOWED_HOSTS = ['*']
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

