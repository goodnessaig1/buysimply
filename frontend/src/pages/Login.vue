<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { useAuthStore } from "../store/auth";
import FormInput from "../components/inputs/FormInput.vue";
import { Eye, EyeOff, Loader2 } from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();
const showPassword = ref(false);

const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const { handleSubmit, isSubmitting, setFieldError } = useForm({
  validationSchema: schema,
});

const { value: email, errorMessage: emailError } = useField<string>("email");
const { value: password, errorMessage: passwordError } =
  useField<string>("password");

const onSubmit = handleSubmit(async (values) => {
  authStore.error = null;
  const success = await authStore.login(values);
  if (success) {
    router.push("/");
  } else if (authStore.error) {
    const errorMsg = (authStore.error as string).toLowerCase();
    if (errorMsg.includes("account")) {
      setFieldError("email", authStore.error as string);
    } else if (errorMsg.includes("password")) {
      setFieldError("password", authStore.error as string);
    }
  }
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="min-h-screen w-full flex flex-col md:flex-row bg-white">
    <div
      class="hidden md:flex md:w-1/2 bg-purple-light flex-col items-center justify-center p-8 lg:p-[65px] md:rounded-[20px]"
    >
      <div class="w-full flex flex-col text-center">
        <div class="mb-12">
          <img
            src="../assets/team-logo.png"
            alt="Team Achieve Logo"
            class="h-16 lg:h-20 w-auto"
          />
        </div>

        <div class="w-full rounded-[2rem] overflow-hidden shadow-xl mb-8">
          <img
            src="../assets/team.png"
            alt="Happy Team"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="space-y-2">
          <h3 class="text-xl font-bold font-serif text-main-purple">
            Team Achieve
          </h3>
          <p class="text-slate-600 font-medium">
            Your perfect solution for funding your desires
          </p>
        </div>
      </div>
    </div>

    <div
      class="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20"
    >
      <div class="md:hidden flex flex-col items-center mb-8">
        <img
          src="../assets/team-logo.png"
          alt="Team Achieve Logo"
          class="h-16 w-auto"
        />
      </div>

      <div class="w-full max-w-md font-sans">
        <div class="text-center mb-10">
          <h1
            class="text-3xl md:text-4xl font-serif font-bold text-main-purple mb-3"
          >
            Welcome Back
          </h1>
          <p class="text-slate-500 font-medium">
            Enter your email address and password to access your account.
          </p>
        </div>

        <form @submit.prevent="onSubmit" class="space-y-6">
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email"
            v-model="email"
            required
            :error="emailError"
          />

          <div class="relative">
            <FormInput
              label="Password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              v-model="password"
              required
              :error="passwordError"
            >
              <template #trailing>
                <button
                  type="button"
                  @click="togglePassword"
                  class="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none border-l border-slate-200"
                >
                  <Eye v-if="!showPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </template>
            </FormInput>
          </div>

          <div class="flex items-center justify-between mt-2">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                class="w-4 h-4 rounded border-slate-300 text-main-purple focus:ring-main-purple"
              />
              <span class="text-sm text-slate-500 font-medium"
                >Remember me</span
              >
            </label>
            <a
              href="#"
              class="text-sm font-semibold text-main-purple hover:underline"
              >Forgot Password?</a
            >
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-3.5 px-4 bg-main-purple hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-purple-200 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
            <span v-else>Sign in</span>
          </button>

          <p class="text-center text-slate-500 font-medium mt-6">
            Don't have an account?
            <a href="#" class="text-main-purple font-bold hover:underline"
              >Sign up</a
            >
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
