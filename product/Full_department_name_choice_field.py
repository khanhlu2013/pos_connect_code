from django.forms.models import ModelChoiceField

class Full_department_name_choice_field(ModelChoiceField):
    def label_from_instance(self,obj):
        return obj.full_name

