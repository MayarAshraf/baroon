import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable({ providedIn: 'root' })
export class FieldBuilderService {
  defaultGridClass = 'formgrid grid align-items-end';

  fieldBuilder = (fieldGroup: FormlyFieldConfig[], className = this.defaultGridClass) => {
    fieldGroup.forEach((field) => {
      field.className = field.className || this.getFieldClass(fieldGroup) || '';
    });

    return {
      fieldGroupClassName: className,
      fieldGroup: fieldGroup,
    };
  };

  /*****************************************/

  getFieldClass = (fieldGroup: FormlyFieldConfig[]): string => {
    const fieldGroupLength = fieldGroup.length;
    switch (fieldGroupLength) {
      case 1:
        return "col";
      case 2:
      case 3:
        return "col-12 md:col";
      case 4:
        return "col-12 xl:col lg:col-4 md:col-6";
      case 5:
      case 6:
        return "col-12 lg:col md:col-4";
      default:
        return "col";
    }
  };

  /*****************************************/

  buildInputField = (inputs: any[]): FormlyFieldConfig[] => {
    const dynamicInputs = inputs.map((input) => {
      switch (input.type) {
        case "text":
          return this.buildTextField(input);
        case "select":
          return this.buildSelectField(input);
        case "number":
          return this.buildNumberField(input);
        case "date":
          return this.buildDateField(input);
        default:
          return this.buildMissingField();
      }
    });
    return [this.fieldBuilder(dynamicInputs)];
  };

  /*****************************************/

  buildMissingField = (): FormlyFieldConfig => {
    return {
      type: 'input',
      className: "col-12 lg:col-3 md:col-4 sm:col-6",
      props: {
        placeholder: 'Field Not Found',
        disabled: true,
      },
    };
  };

  /*****************************************/

  buildTextField = (input: any): FormlyFieldConfig => {
    return {
      key: input.name,
      type: 'input',
      className: "col-12 lg:col-3 md:col-4 sm:col-6",
      props: {
        label: input.label,
        placeholder: input.placeholder,
        required: input.is_required ? true : false,
      },
      hooks: {
        onInit: (field: FormlyFieldConfig) => {
          field.formControl?.setValue(input?.value);
        }
      }
    };
  };

  /*****************************************/

  buildSelectField = (input: any): FormlyFieldConfig => {
    return {
      key: input.name,
      type: "select-field",
      className: "col-12 lg:col-3 md:col-4 sm:col-6",
      props: {
        label: input.label,
        multiple: input.is_multiple ? true : false,
        required: input.is_required ? true : false,
        showHeader: input.is_multiple ? true : null,
        filter: true,
        placeholder: input.placeholder,
        options: input.options,
        // options: [
        //   { value: null, text: "--" }, ...input.options
        // ],
        optionValue: 'value',
        optionLabel: 'text'
      },
      hooks: {
        onInit: (field: FormlyFieldConfig) => {
          // set default value in create dialog
          if (!(field.model.id) && !(input.is_multiple)) {
            field.formControl?.setValue(input?.selected_value_id);
          }

          // set value in update dialog (single selection)
          if (field.model.id && !(input.is_multiple) && input?.selected_value) {
            field.formControl?.setValue(input?.selected_value);
          }

          // set values in update dialog (multiple selections)
          if (field.model.id && input.is_multiple && input?.selected_values?.length) {
            field.formControl?.setValue(input.selected_values);
          }
        }
      }
    };
  };

  /*****************************************/

  buildNumberField = (input: any): FormlyFieldConfig => {
    return {
      key: input.name,
      type: 'number',
      className: "col-12 lg:col-3 md:col-4 sm:col-6",
      props: {
        label: input.label,
        required: input.is_required ? true : false,
        placeholder: input.placeholder,
      },
      hooks: {
        onInit: (field: FormlyFieldConfig) => {
          field.formControl?.setValue(input?.value);
        }
      }
    };
  };

  /*****************************************/

  buildDateField = (input: any): FormlyFieldConfig => {
    return {
      key: input.name,
      type: "datepicker",
      className: "col-12 lg:col-3 md:col-4 sm:col-6",
      props: {
        label: input.label,
        required: input.is_required ? true : false,
        placeholder: input.placeholder,
        dateFormat: 'dd/mm/yy',
        hourFormat: '12',
        numberOfMonths: 1,
        selectionMode: 'range',
        readonlyInput: false,
        showButtonBar: true,
        showIcon: true,
      },
      hooks: {
        onInit: (field: FormlyFieldConfig) => {
          field.formControl?.setValue(input?.value);
        }
      }
    };
  };
}
