"""Project package initialization.

This project has a compatibility patch for Django template contexts on newer
Python versions. The patch must run during Django startup (including manage.py
and test runs), not only when the WSGI app is loaded.
"""

try:
    from django import template as _django_template

    def _compat_context_copy(self):
        cls = self.__class__
        new = cls.__new__(cls)
        for name, value in getattr(self, '__dict__', {}).items():
            try:
                setattr(new, name, value)
            except Exception:
                pass
        if hasattr(self, 'dicts'):
            try:
                new.dicts = [d.copy() for d in self.dicts]
            except Exception:
                new.dicts = []
                for d in getattr(self, 'dicts', []):
                    try:
                        items = list(d.items())
                    except Exception:
                        new.dicts.append({'__uncopyable_context__': repr(d)})
                        continue
                    copied = {}
                    for k, v in items:
                        try:
                            copied[k] = v
                        except Exception:
                            try:
                                copied[k] = repr(v)
                            except Exception:
                                copied[k] = None
                    new.dicts.append(copied)
        if hasattr(self, 'render_context'):
            try:
                new.render_context = self.render_context.copy()
            except Exception:
                new.render_context = getattr(self, 'render_context', None)
        return new

    BaseContext = _django_template.context.BaseContext
    BaseContext.__copy__ = _compat_context_copy
    Context = _django_template.context.Context
    Context.__copy__ = _compat_context_copy
    RequestContext = _django_template.context.RequestContext
    RequestContext.__copy__ = _compat_context_copy
except Exception:
    pass
