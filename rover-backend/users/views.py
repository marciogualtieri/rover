from django.http import HttpResponse


def verified_message(request):
    html = "<html><body>Your e-mail has been verified.</body></html>"
    return HttpResponse(html)

# TODO: Add tests and create views to retrieve CustomUser (MVP doesn't require it)
