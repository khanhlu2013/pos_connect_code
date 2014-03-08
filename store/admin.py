from django.contrib import admin
from store.models import Store
from liqUser.models import Membership


class MembershipInline(admin.TabularInline):
    model = Membership
    extra = 1

class StoreAdmin(admin.ModelAdmin):
    inlines = (MembershipInline,)

admin.site.register(Store,StoreAdmin)


