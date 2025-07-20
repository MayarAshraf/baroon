import { FormlyExtension, FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";

export class FormlyTranslateExtension implements FormlyExtension {
  constructor(private translate: TranslateService) { }

  prePopulate(field: FormlyFieldConfig) {
    const props = field.props || {};
    field.expressions = field.expressions || {};

    if (props.label) {
      field.expressions['props.label'] = this.translate.stream(props.label);
    };

    if (props.placeholder) {
      field.expressions['props.placeholder'] = this.translate.stream(props.placeholder);
    };
  }
};
