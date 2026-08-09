from core_api.models import Property
for p in Property.objects.all()[:20]:
    print(p.id, getattr(p, 'title', str(p)))
