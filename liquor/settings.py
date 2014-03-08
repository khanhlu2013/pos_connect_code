"""
Django settings for liquor project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

import os
PROJECT_PATH = os.path.dirname(os.path.abspath(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '&myufun=_r4lsx7v*)rpjyf$9udnwv!#-y)ajjv$3*ty_cwq^4'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []


# Application definition
# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
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

ROOT_URLCONF = 'liquor.urls'

WSGI_APPLICATION = 'liquor.wsgi.application'

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True




# Parse database configuration from $DATABASE_URL
import dj_database_url
# DATABASES['default'] =  dj_database_url.config()
DATABASES = {'default': dj_database_url.config(default='postgres://localhost')}
# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allow all host headers
ALLOWED_HOSTS = ['*']

# STATIC_ROOT = 'staticfiles'
STATIC_URL = '/static_resource/'
# STATICFILES_DIRS = (
#     os.path.join(PROJECT_PATH, 'static_resource'),
# )

# STATICFILES_FINDERS = (
#     'django.contrib.staticfiles.finders.FileSystemFinder',
#     'django.contrib.staticfiles.finders.AppDirectoriesFinder',
# #    'django.contrib.staticfiles.finders.DefaultStorageFinder',
# )

from unipath import Path
PROJECT_ROOT = Path(__file__).ancestor(2)
# TEMPLATE_DIRS = (
#     os.path.join(PROJECT_PATH, 'templates'),
# )
TEMPLATE_DIRS = (
    PROJECT_ROOT.child('templates'),
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

SITE_ID = 1

#AUTH_USER_MODEL = 'liqUser.LiqUser'
LOGIN_URL = 'liquor_login_named_url'
LOGOUT_URL = 'liquor_logout_named_url'
LOGIN_REDIRECT_URL  = 'liquor_home'

DEFAULT_TEMPLATE_FORM = 'liquor/default_template_form.html'

#COUCHDB-----------------------------------------------------------------

#URL
# COUCHDB_URL = '127.0.0.1:5984'
COUCHDB_URL = 'app22826128.heroku.cloudant.com'

#USER
USER_ID_PREFIX = 'org.couchdb.user:'

#ADMIN USER
# MASTER_USER_NAME = 'server_admin'
# MASTER_USER_PASSWORD = 'server_admin'
MASTER_USER_NAME = 'app22826128.heroku'
MASTER_USER_PASSWORD = 'j1t7ipeyhuVAq7JDP5eNfk3H'

#LIQUOR USER
CLIENT_USER_NAME_PREFIX = 'liquor_'

#STORE DB
STORE_DB_PREFIX = 'liquor_'
PROD_BUS_ASSOC_DOCUMENT_TYPE = 'prod_bus_assoc'
SALE_RECORD_DOCUMENT_TYPE = 'sale_record'


TAX_DOCUMENT_ID = "tax_document"