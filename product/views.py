from django.views.generic import CreateView,UpdateView
from django.db import IntegrityError
from django import forms
from django.core.urlresolvers import reverse_lazy
from django.conf import settings

from product.models import Category,Department

#-UPDATE CATEGORY
class CategoryUpdateForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name']
        
class CategoryUpdateView(UpdateView):
    model = Category
    form_class = CategoryUpdateForm
    success_url = reverse_lazy('department:index')
    template_name = settings.DEFAULT_TEMPLATE_FORM

#-UPDATE DEPARTMENT-------------------------------------------------
class DepartmentUpdateForm(forms.ModelForm):
    class Meta:
        model = Department
        fields = ['name']

class DepartmentUpdateView(UpdateView):
    model = Department
    form_class = DepartmentUpdateForm
    success_url = reverse_lazy('department:index')
    template_name = settings.DEFAULT_TEMPLATE_FORM

#-CREATE DEPARTMENT-------------------------------------------------
class DepartmentCreateForm(forms.ModelForm):
    create_category_field = forms.CharField()
    class Meta:
        model = Department
        fields = ['create_category_field','category','name']
        exclude = []
        
    def __init__(self,*args,**kwargs):
        #ARGS
        self.cur_login_store = kwargs.pop('cur_login_store')
        
        #SUPER
        super(DepartmentCreateForm,self).__init__(*args,**kwargs)
        
        #OVERRIDE CATEGORY REQUIRED FIELD
        self.fields['category'].required = False
        self.fields['create_category_field'].required = False
    
        #LABEL
        self.fields['create_category_field'].label = "add new category"
        self.fields['category'].label = "or select old category"
        self.fields['name'].label = "department"
        
    def clean(self):
        #SUPER
        cleaned_data = super(DepartmentCreateForm,self).clean()
        
        #GET DATA
        category = cleaned_data['category']
        create_category = cleaned_data['create_category_field']
        
        if category and create_category:
            del cleaned_data['category']
            del cleaned_data['create_category_field']
            raise forms.ValidationError('Can not both select category and create new category')
        
        elif not category and not create_category:
            del cleaned_data['category']
            del cleaned_data['create_category_field']
            raise forms.ValidationError('Please select OR create new category')
            
        elif not category: #Create category. If it is exist, we will use it instead of creating it
            try:
                cat = Category.objects.get(creator=self.cur_login_store,name=create_category)
                cleaned_data['category'] = cat
                del cleaned_data['create_category_field']
            except Category.DoesNotExist:
                del cleaned_data['category']
                
        return cleaned_data
    
    def save(self):
        create_category = self.cleaned_data.get('create_category_field')
        #PROCESS CATEGORY
        if create_category:
            try:
                category = Category.objects.create(name = create_category,creator=self.cur_login_store)
            except IntegrityError:
                raise forms.ValidationError('Please select OR create new category')
        else:
            category = self.cleaned_data.get('category')
        
        #CREATE DEPARTMENT
        department = super(DepartmentCreateForm,self).save(commit=False)
        department.category = category
        department.save()
        
        return department

class DepartmentCreateView(CreateView):
    model = Department
    template_name = 'product/department_form.html'
    form_class = DepartmentCreateForm
    success_url = reverse_lazy('department:index')
    
    def get_form_kwargs(self):
        kwargs = super(DepartmentCreateView,self).get_form_kwargs()
        kwargs['cur_login_store'] = self.request.session.get('cur_login_store')
        return kwargs
    
    def get_context_data(self,**kwargs):
        cur_login_store = self.request.session.get('cur_login_store')
        context = super(DepartmentCreateView,self).get_context_data(**kwargs)
        context['department_lst'] = Department.objects.filter(category__creator=cur_login_store)
        return context
    
    
    
    
    
    
    