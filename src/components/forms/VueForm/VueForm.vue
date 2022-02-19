<template>
  <form :class="$style.vueForm" @submit.prevent="onSubmit" @reset="onReset">
    <slot :errors="errors" :valid="valid" />
  </form>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useFormValidation } from '@/components/forms/VueForm/use-form-validation';

export default defineComponent({
  name: 'VueForm',
  props: {
    validationDelay: { type: Number, default: 190 },
    onBlur: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const { form, errors, valid, onSubmit, onReset } = useFormValidation({
      validationDelay: props.validationDelay,
      onBlur: props.onBlur,
      emit,
    });

    return { form, errors, valid, onSubmit, onReset };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';

.vueForm {
  // this class is only applied if you add css properties
}
</style>
