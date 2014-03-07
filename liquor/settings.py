import os


ROOT_URLCONF = 'liquor.urls'
DEBUG = False
TEMPLATE_DEBUG = False

#database
import dj_database_url
DATABASES['default'] =  dj_database_url.config()


INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)


SECRET_KEY = '&myufun=_r4lsx7v*)rpjyf$9udnwv!#-y)ajjv$3*ty_cwq^4'
WSGI_APPLICATION = 'liquor.wsgi.application'
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
ALLOWED_HOSTS = ['*']



BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_ROOT = ''
STATIC_URL = '/static/'
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static_resource'),
)
