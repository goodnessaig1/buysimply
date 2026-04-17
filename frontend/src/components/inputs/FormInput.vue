<script setup lang="ts">
interface Props {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  modelValue?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false
});

defineEmits(['update:modelValue', 'blur', 'togglePassword']);
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full text-slate-700">
    <label :for="name" class="text-sm font-semibold flex items-center gap-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        :id="name"
        :name="name"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur')"
        class="w-full px-4 py-2.5 bg-white border rounded-lg outline-none transition-all duration-200 text-slate-800"
        :class="[
          error 
            ? 'border-red-500 focus:ring-1 focus:ring-red-100' 
            : 'border-slate-200 focus:border-main-purple focus:ring-1 focus:ring-purple-100'
        ]"
      />
      <slot name="trailing"></slot>
    </div>
    <p v-if="error" class="text-xs text-red-500 mt-1">
      {{ error }}
    </p>
  </div>
</template>
