<template>
  <vue-form v-slot="{ valid }" on-blur @submit="onSubmit">
    <vue-stack>
      <vue-stack space="8">
        <vue-text look="h1" as="h1">Form example</vue-text>
        <vue-tiles :columns="[1, 2]">
          <vue-text look="description"> This example shows the basic usage of vuesions form validation. </vue-text>
        </vue-tiles>
      </vue-stack>

      <vue-card>
        <vue-stack>
          <vue-columns>
            <vue-column>
              <vue-stack space="24">
                <vue-input
                  id="firstname"
                  v-model="model.firstname"
                  name="firstname"
                  required
                  label="First name"
                  placeholder="First name"
                  description="The name people call you."
                  error-message="This field is required."
                  autofocus
                />
                <vue-input
                  id="lastname"
                  v-model="model.lastname"
                  name="lastname"
                  required
                  label="Last name"
                  placeholder="Last name"
                  description="Your family name."
                  error-message="This field is required."
                />
                <vue-input
                  id="email"
                  v-model="model.email"
                  name="email"
                  required
                  type="email"
                  label="E-mail"
                  placeholder="E-mail"
                  :validation="{ email: true }"
                  description="Your email address."
                  error-message="This field is required and requires an @ symbol."
                />
                <vue-stack>
                  <vue-checkbox
                    id="acceptTerms"
                    v-model="model.acceptTerms"
                    name="acceptTerms"
                    label="I accept the terms"
                    required
                  />
                  <vue-toggle
                    id="newsletterYes"
                    name="newsletterYes"
                    label="I want to subscribe to the newsletter"
                    :checked="model.newsletter === true"
                    required
                    @click="model.newsletter = !model.newsletter"
                  />
                </vue-stack>
                <vue-inline>
                  <vue-radio
                    id="yearly-subscription"
                    v-model="model.subscription"
                    name="subscription"
                    label="Yearly subscription"
                    :validation="{ custom: (value) => value !== 'none' }"
                  />
                  <vue-radio
                    id="monthly-subscription"
                    v-model="model.subscription"
                    name="subscription"
                    label="Monthly subscription"
                    :validation="{ custom: (value) => value !== 'none' }"
                  />
                  <vue-radio
                    id="none"
                    v-model="model.subscription"
                    name="subscription"
                    label="None"
                    :validation="{ custom: (value) => value !== 'none' }"
                  />
                </vue-inline>
              </vue-stack>
            </vue-column>

            <vue-column>
              <vue-stack space="24">
                <vue-input
                  id="street"
                  v-model="model.street"
                  name="street"
                  required
                  label="Street"
                  placeholder="Street"
                  :disabled="addressDisabled"
                  description="The street you live in."
                  error-message="This field is required."
                />

                <vue-input
                  id="zipCode"
                  v-model="model.zipCode"
                  name="zipCode"
                  required
                  label="Zip code"
                  placeholder="Zip code"
                  :validation="{ integer: true }"
                  :error-message="$t('components.formExample.zipCode.error' /* Please enter a Number */)"
                  :disabled="addressDisabled"
                  description="The postal code of the city you live in."
                />

                <vue-input
                  id="city"
                  v-model="model.city"
                  name="city"
                  required
                  label="City"
                  placeholder="City"
                  :disabled="addressDisabled"
                  description="The city you live in."
                  error-message="This field is required."
                />

                <vue-select
                  id="country"
                  v-model="model.country"
                  label="Choose Country"
                  name="country"
                  :items="countryOptions"
                  required
                  :disabled="addressDisabled"
                  description="The country you live in."
                  error-message="This field is required."
                />
              </vue-stack>
            </vue-column>
          </vue-columns>

          <vue-textarea
            id="notes"
            v-model="model.notes"
            name="notes"
            label="Notes"
            placeholder="Please leave some notes..."
            required
            description="Please add some notes."
            error-message="This field is required."
          />

          <vue-inline align="right">
            <vue-button look="secondary" type="reset"> Cancel </vue-button>
            <vue-button look="primary" :disabled="!valid" :loading="isLoading" type="submit"> Save </vue-button>
          </vue-inline>
        </vue-stack>
      </vue-card>
    </vue-stack>
  </vue-form>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import VueInput from '@/components/input-and-actions/VueInput/VueInput.vue';
import VueSelect from '@/components/input-and-actions/VueSelect/VueSelect.vue';
import VueCheckbox from '@/components/input-and-actions/VueCheckbox/VueCheckbox.vue';
import VueButton from '@/components/input-and-actions/VueButton/VueButton.vue';
import VueText from '@/components/typography/VueText/VueText.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import VueTiles from '@/components/layout/VueTiles/VueTiles.vue';
import VueInline from '@/components/layout/VueInline/VueInline.vue';
import { addToast } from '@/components/utils';
import VueCard from '@/components/data-display/VueCard/VueCard.vue';
import VueColumns from '@/components/layout/VueColumns/VueColumns.vue';
import VueColumn from '@/components/layout/VueColumns/VueColumn/VueColumn.vue';
import VueForm from '@/components/forms/VueForm/VueForm.vue';
import VueRadio from '@/components/input-and-actions/VueRadio/VueRadio.vue';
import VueTextarea from '@/components/input-and-actions/VueTextarea/VueTextarea.vue';
import VueToggle from '@/components/input-and-actions/VueToggle/VueToggle.vue';

export default defineComponent({
  name: 'FormExample',
  components: {
    VueToggle,
    VueTextarea,
    VueRadio,
    VueForm,
    VueColumn,
    VueColumns,
    VueCard,
    VueInline,
    VueTiles,
    VueStack,
    VueText,
    VueButton,
    VueCheckbox,
    VueSelect,
    VueInput,
  },
  setup(_, { emit }) {
    // refs
    const isLoading = ref(false);
    const model = ref({
      firstname: '',
      lastname: '',
      email: '',
      street: '',
      zipCode: '',
      city: '',
      country: 'gl',
      acceptTerms: false,
      newsletter: false,
      subscription: null,
      notes: '',
    });

    // computed
    const countryOptions = computed(() => [
      { label: 'None', value: '' },
      { label: 'Brasil', value: 'br' },
      { label: 'Germany', value: 'de' },
      { label: 'Great Britain', value: 'uk' },
      { label: 'Greece', value: 'gr' },
      { label: 'Greenland', value: 'gl' },
      { label: 'Japan', value: 'jp' },
      { label: 'Spain', value: 'es' },
      { label: 'USA', value: 'us' },
      { label: 'Other', value: 'other' },
    ]);
    const addressDisabled = computed(
      () => model.value.firstname === '' || model.value.lastname === '' || model.value.email === '',
    );

    // event handler
    const onSubmit = () => {
      isLoading.value = true;

      // eslint-disable-next-line no-console
      console.log(JSON.parse(JSON.stringify(model.value)));

      emit('submit', model.value);

      /* istanbul ignore next */
      setTimeout(() => {
        isLoading.value = false;

        addToast({
          title: 'Data has been saved!',
          text: 'Have a look at the console!',
          type: 'success',
        });
      }, 1000);
    };

    return {
      isLoading,
      model,
      countryOptions,
      addressDisabled,
      onSubmit,
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/_design-system';
</style>
