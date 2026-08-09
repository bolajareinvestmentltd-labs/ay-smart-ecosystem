"""
WSGI config for core_backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core_backend.settings')

# Compatibility monkeypatch: Django's Context.__copy__ may call super().__copy__()
# which can behave differently on some Python versions. Provide a safe fallback
# to avoid errors when template tags call `context.new()`.
try:
	from django import template as _django_template

	def _compat_context_copy(self):
		# Create a new instance without calling __init__ (avoids required-arg
		# constructors such as RequestContext(request)), then copy attributes.
		cls = self.__class__
		new = cls.__new__(cls)

		# Shallow-copy all attributes from the original instance.
		for name, value in getattr(self, '__dict__', {}).items():
			try:
				setattr(new, name, value)
			except Exception:
				# Ignore attributes that can't be set.
				pass

		# Ensure dicts is a shallow copy of the original list with each dict copied.
		if hasattr(self, 'dicts'):
			try:
				new.dicts = [d.copy() for d in self.dicts]
			except Exception:
				from copy import deepcopy
				new.dicts = deepcopy(self.dicts)

		# If there's a render_context, try to shallow-copy it to avoid shared state.
		if hasattr(self, 'render_context'):
			try:
				new.render_context = self.render_context.copy()
			except Exception:
				new.render_context = self.render_context

		return new

	try:
		BaseContext = _django_template.context.BaseContext
		BaseContext.__copy__ = _compat_context_copy
	except Exception:
		pass

	try:
		Context = _django_template.context.Context
		Context.__copy__ = _compat_context_copy
	except Exception:
		pass

	try:
		RequestContext = _django_template.context.RequestContext
		RequestContext.__copy__ = _compat_context_copy
	except Exception:
		pass
except Exception:
	# If anything goes wrong, don't prevent WSGI app from starting
	pass

application = get_wsgi_application()
