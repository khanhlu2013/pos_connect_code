from unipath import Path
PROJECT_ROOT = Path(__file__).ancestor(2)
import os

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
    ,'storages'
    ,'south'
    # ,'django_nose'
    ,'helper'
    ,'util'
    ,'liqUser'
    ,'bus'
    ,'product'
    ,'invoice'
    ,'vendor_subscription'
    ,'vendor'
    ,'store'
    ,'store_product'
    ,'sale'
    ,'tax'
    ,'sale_shortcut'
)

DEBUG = os.environ['DEBUG']
TEMPLATE_DEBUG = os.environ['TEMPLATE_DEBUG']
SECRET_KEY = os.environ['SECRET_KEY']

import dj_database_url
DATABASES = {'default': dj_database_url.config()}

STATICFILES_STORAGE = os.environ['STATICFILES_STORAGE']
STATIC_URL = os.environ['STATIC_URL']


COUCHDB_URL = os.environ['COUCHDB_URL']
COUCH_MASTER_USER_NAME = os.environ['COUCH_MASTER_USER_NAME']
COUCH_MASTER_USER_PASSWORD = os.environ['COUCH_MASTER_USER_PASSWORD']



#QUESTION----------------------------------------------------------------------------------------------------------------------------------
SITE_ID = 1 #is this related to staging?
STATIC_ROOT = ''
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
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
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





#NEED CLEAN UP ----------------------------------------------------------------------------------------------------------------------------------
#AUTH_USER_MODEL = 'liqUser.LiqUser'
LOGIN_URL = 'liquor_login_named_url'
LOGOUT_URL = 'liquor_logout_named_url'
LOGIN_REDIRECT_URL  = 'liquor_home'
DEFAULT_TEMPLATE_FORM = 'liquor/default_template_form.html'

#COUCHDB-
#URL

#USER
USER_ID_PREFIX = 'org.couchdb.user:'


#LIQUOR USER
CLIENT_USER_NAME_PREFIX = 'liquor_'
#STORE DB
STORE_DB_PREFIX = 'liquor_'
PROD_BUS_ASSOC_DOCUMENT_TYPE = 'prod_bus_assoc'
SALE_RECORD_DOCUMENT_TYPE = 'sale_record'
TAX_DOCUMENT_ID = "tax_document"