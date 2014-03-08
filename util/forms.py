from django import forms

class StripCharField(forms.CharField):
    def clean(self, value):
        """ return none if field contain only whitespace. Otherwise, return stripped field"""
        stripped_val = value.strip()
        if len(stripped_val) == 0: return None
        else: return stripped_val