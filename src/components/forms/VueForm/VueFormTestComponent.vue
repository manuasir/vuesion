<template>
  <vue-form :on-blur="onBlur" @submit="$emit('submit', model)" @reset="$emit('reset')">
    <vue-stack>
      <vue-input id="required" v-model="model.required" name="required" label="required" required />
      <vue-checkbox id="chk-required" v-model="model.chkRequired" name="chk-required" label="chk-required" required />
      <vue-select
        id="multi-select"
        v-model="model.selectRequired"
        name="multi-select"
        label="multi-select"
        required
        multi-select
        :items="[
          { label: 'item 1', value: 'item1' },
          { label: 'item 2', value: 'item2' },
        ]"
      />
      <vue-select
        id="select"
        v-model="model.singleSelectRequired"
        name="select"
        label="select"
        required
        :items="[
          { label: 'none', value: '' },
          { label: 'item 1', value: 'item1' },
        ]"
      />

      <vue-input id="min" v-model="model.min" name="min" label="min" :validation="{ min: 3 }" />
      <vue-input id="max" v-model="model.max" name="max" label="max" :validation="{ max: 6 }" />
      <vue-input id="min-max" v-model="model.minMax" name="min-max" label="min-max" :validation="{ min: 3, max: 6 }" />
      <vue-input id="email" v-model="model.email" name="email" label="email" :validation="{ email: true }" />
      <vue-input
        id="integer"
        v-model.number="model.integer"
        name="integer"
        label="integer"
        :validation="{ integer: true }"
      />
      <vue-input id="regex" v-model.number="model.regex" name="regex" label="regex" :validation="{ regex: /foo/gim }" />
      <vue-input
        id="custom"
        v-model.number="model.custom"
        name="custom"
        label="custom"
        :validation="{ custom: (value) => value === 'foo' }"
      />

      <vue-inline align="right">
        <vue-button look="secondary" type="reset"> Reset </vue-button>
        <vue-button look="primary" type="submit"> Submit </vue-button>
      </vue-inline>
    </vue-stack>
  </vue-form>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import VueForm from '@/components/forms/VueForm/VueForm.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import VueInput from '@/components/input-and-actions/VueInput/VueInput.vue';
import VueInline from '@/components/layout/VueInline/VueInline.vue';
import VueButton from '@/components/input-and-actions/VueButton/VueButton.vue';
import VueCheckbox from '@/components/input-and-actions/VueCheckbox/VueCheckbox.vue';
import VueSelect from '@/components/input-and-actions/VueSelect/VueSelect.vue';

export default defineComponent({
  name: 'VueFormTestComponent',
  components: { VueSelect, VueCheckbox, VueButton, VueInline, VueInput, VueStack, VueForm },
  props: {
    onBlur: { type: Boolean, default: false },
  },
  setup() {
    const model = ref({
      required: '',
      chkRequired: true,
      selectRequired: [{ label: 'item 1', value: 'item1' }],
      singleSelectRequired: [{ label: 'item 1', value: 'item1' }],
      min: '',
      max: '',
      minMax: '',
      email: '',
      integer: null,
      regex: '',
      custom: '',
    });

    return { model };
  },
});
</script>
