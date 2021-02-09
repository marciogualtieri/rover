from django.contrib.admin import AdminSite
from django.utils.translation import ugettext_lazy


class CustomAdminSite(AdminSite):
    site_title = ugettext_lazy('Rover.com')
    site_header = ugettext_lazy('Rover.com')
    index_title = ugettext_lazy('Rover.com')


admin_site = CustomAdminSite()
