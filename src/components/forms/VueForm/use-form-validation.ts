import { computed, onBeforeUnmount, onMounted, provide, Ref, ref, UnwrapRef, watch } from '@vue/composition-api';
import { IField, IValidationRules } from '@/components/forms/VueForm/IForm';
import isObject from 'lodash/isObject';
import { IItem } from '@/interfaces/IItem';
import { isNullOrUndefined } from '@/components/utils';
import isString from 'lodash/isString';
import debounce from 'lodash/debounce';
import { registerFieldValidation } from '@/components/forms/VueForm/register-field-validation';

interface IUseFormValidationOptions {
  onBlur: boolean;
  validationDelay: number;
  emit: (event: string, ...args: any[]) => void;
}

export const useFormValidation = (options: IUseFormValidationOptions) => {
  const form = ref<Array<Ref<UnwrapRef<IField>>>>([]);
  const errors = computed(() => form.value.filter((field) => field.value.valid === false));
  const sanitizeValue = (value: unknown) => {
    if (isObject(value) && 'value' in value) {
      value = (value as IItem).value;
    }

    return value;
  };
  const valid = computed(() => {
    let allRequiredFieldsFilled = true;

    form.value.forEach((field) => {
      if (allRequiredFieldsFilled && field.value.required) {
        allRequiredFieldsFilled = validateRequired(sanitizeValue(field.value.value));
      }
    });

    return errors.value.length === 0 && allRequiredFieldsFilled === true;
  });
  const validateRequired = (value: any) => {
    if (isNullOrUndefined(value)) {
      return false;
    } else if (isString(value)) {
      return value.trim().length > 0;
    } else if (Array.isArray(value)) {
      return value.length > 0;
    } else {
      return value === true;
    }
  };
  const validateMin = (value: unknown, min: number) => {
    return value.toString().trim().length >= min;
  };
  const validateMax = (value: unknown, max: number) => {
    return value.toString().trim().length <= max;
  };
  const validateRegex = (value: unknown, regex: any) => {
    if (isString(value)) {
      return regex.test(value);
    }
  };
  const validate = (fieldRef: Ref<UnwrapRef<IField>>, value: unknown) => {
    value = sanitizeValue(value);

    const rules = fieldRef.value.rules;
    let valid = true;

    if (valid && rules.required) {
      valid = validateRequired(value);
    }

    if (valid && rules.min) {
      valid = validateMin(value, rules.min);
    }

    if (valid && rules.max) {
      valid = validateMax(value, rules.max);
    }

    if (valid && rules.min && rules.max) {
      valid = validateMin(value, rules.min) && validateMax(value, rules.max);
    }

    if (valid && rules.email) {
      valid = String(value).includes('@');
    }

    if (valid && rules.integer) {
      valid = validateRegex(value, /^-?[0-9]+$/);
    }

    if (valid && rules.regex) {
      valid = validateRegex(value, rules.regex);
    }

    if (valid && rules.custom) {
      valid = rules.custom(value);
    }

    fieldRef.value.valid = valid;

    fieldRef.value.changed = true;
    fieldRef.value.validated = true;

    return valid;
  };
  const debouncedValidate = debounce(validate, options.validationDelay);
  const registerField = (
    id: string,
    value: Ref<unknown>,
    rules: IValidationRules,
    overrideOnBlur = false,
    useDebounce = true,
  ) => {
    const fieldRef = ref<IField>({
      id,
      rules,
      valid: null,
      changed: false,
      touched: false,
      required: rules.required || false,
      validated: false,
      value: value.value,
      reset: () => {
        fieldRef.value.valid = null;
        fieldRef.value.changed = false;
        fieldRef.value.touched = false;
        fieldRef.value.validated = false;
      },
    });

    watch(value, (newValue) => {
      fieldRef.value.value = newValue;

      if (options.onBlur === true && overrideOnBlur === false && fieldRef.value.valid !== false) {
        return;
      }

      if (useDebounce) {
        debouncedValidate(fieldRef, newValue);
      } else {
        validate(fieldRef, newValue);
      }
    });

    form.value.push(fieldRef);

    return fieldRef;
  };

  provide(registerFieldValidation, registerField);

  const onFocus = (fieldRef: Ref<UnwrapRef<IField>>) => {
    fieldRef.value.touched = true;
  };
  const onBlur = (fieldRef: Ref<UnwrapRef<IField>>) => {
    validate(fieldRef, fieldRef.value.value);
  };

  onMounted(() => {
    form.value.forEach((fieldRef) => {
      const el = document.getElementById(fieldRef.value.id) as HTMLInputElement;

      el.addEventListener('focus', () => onFocus(fieldRef));
      el.addEventListener('click', () => onFocus(fieldRef));
      el.addEventListener('blur', () => onBlur(fieldRef));
    });
  });

  onBeforeUnmount(() => {
    form.value.forEach((fieldRef) => {
      const el = document.getElementById(fieldRef.value.id) as HTMLInputElement;

      /* istanbul ignore next */
      if (el) {
        el.removeEventListener('focus', () => onFocus(fieldRef));
        el.removeEventListener('click', () => onFocus(fieldRef));
        el.removeEventListener('blur', () => onBlur(fieldRef));
      }
    });
  });

  const onSubmit = () => {
    form.value.forEach((fieldRef) => {
      validate(fieldRef, fieldRef.value.value);
    });

    if (valid.value) {
      options.emit('submit');
    }
  };

  const onReset = () => {
    form.value.forEach((fieldRef) => fieldRef.value.reset());
    options.emit('reset');
  };

  return { form, errors, valid, onSubmit, onReset };
};
