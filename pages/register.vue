<template>
  <main>
    <article>
      <h1>Register</h1>
      <form @submit.prevent="submitForm" novalidate v-if="!successMsg">

        <div>
          <label for="label-full-name">Name: * <span class="sr-only">required field</span>
            <span v-if="showErrors && !contactForm.name">This field is required</span>
          </label>
          <input type="text" id="label-full-name" v-model="contactForm.name" placeholder="" autocomplete="name" required>
        </div>

        <div class="form-group">
          <label>Email: * <span class="sr-only">required field</span>
            <span v-if="showErrors && !isValidEmail">Valid email is required</span>
            <input name="email" type="email" v-model="contactForm.email" placeholder="" autocomplete="email" required />
          </label>
        </div>

        <div>
          <label for="label-password">Password: * <span class="sr-only">required field</span>
            <span v-if="showErrors && !contactForm.password">This field is required</span>
            <span v-else-if="contactForm.password && contactForm.password.length < 8">The minimum password length is 8</span>
          </label>
          <input type="password" id="label-password" v-model="contactForm.password" placeholder="" autocomplete="" required>
        </div>

        <div>
          <label for="label-repeat-password">Repeat password: * <span class="sr-only">required field</span>
            <span v-if="showErrors && !repeat_password">This field is required</span>
            <span v-else-if="contactForm.password !== repeat_password">Password is not same</span>
          </label>
          <input type="password" id="label-repeat-password" v-model="repeat_password" placeholder="" autocomplete="" required >
        </div>

        <button class="btn-2" type="submit">Submit</button>

      </form>

      <p v-if="successMsg"><span>{{ successMsg }}</span></p>
      <p v-if="errorMsg"><span>{{ errorMsg }}</span></p>
      
      <p>Or login if you have an account</p>
      <NuxtLink class="btn-2" to="/login">Login</NuxtLink>
    </article>
  </main>
</template>

<script lang="ts" setup>
const client = useSupabaseClient();
const errorMsg = ref("");
const successMsg = ref("");
const repeat_password = ref<string>('');

// Define the shape of the form state
interface ContactForm {
  name: string;
  email: string;
  password: string;
  // message?: string; // Message is optional
}

// Initialize form state with default properties
const contactForm = ref<ContactForm>({
  name: '',
  email: '',
  password: '',
});

// State to trigger error display after form submission
const showErrors = ref<boolean>(false);

// Success and error message states
// const successMessage = ref<string>('');
// const errorMessage = ref<string>('');

// Computed property to validate email format
const isValidEmail = computed((): boolean => {
  const emailPattern = /\S+@\S+\.\S+/;
  return emailPattern.test(contactForm.value.email);
});

// Define optional fields (e.g., message)
// const optionalFields: (keyof ContactForm)[] = ['message'];

// Dynamic form validation function
const isFormValid = (): boolean => {
  // Loop through each field in contactForm and check if it's empty
  for (const key in contactForm.value) {
    // Skip optional fields from validation
    // if (optionalFields.includes(key as keyof ContactForm)) {
    //   continue;
    // }

    // If a required field is empty, the form is invalid
    if (!contactForm.value[key as keyof ContactForm]) {
      return false;
    }
  }

  // Additional custom validation for email field
  if (!isValidEmail.value) {
    return false;
  }

  // Additional custom validation for password field
  if (contactForm.value.password.length < 8) {
    const passwordField = document.querySelector('form input#label-password') as HTMLElement;
    if (passwordField) {
      passwordField.focus();
    }
    return false;
  }

  if (contactForm.value.password !== repeat_password.value) {
    const repeatPasswordField = document.querySelector('form input#label-repeat-password') as HTMLElement;
    if (repeatPasswordField) {
      repeatPasswordField.focus();
    }
    return false;
  }

  // If all fields are valid
  return true;
};

// Form submission handler
const submitForm = async (): Promise<void> => {
  showErrors.value = true;

  if (!isFormValid()) {
    const firstInvalidInput = document.querySelector('form [required]:invalid') as HTMLElement;
    if (firstInvalidInput) {
      firstInvalidInput.focus();
    }
    return;
  }

  try {
    const { data, error } = await client.auth.signUp({
      email: contactForm.value.email,
      password: contactForm.value.password,
    });

    if (error) {
      // Handle Supabase error explicitly
      errorMsg.value = error.message;
    } else {
      errorMsg.value = '';
      successMsg.value = 'Check your email to confirm your account.';
    }
  } catch (err) {
    if (err instanceof Error) {
      // Safely access the error message
      errorMsg.value = err.message;
    } else {
      // Fallback for non-Error types
      errorMsg.value = 'An unknown error occurred.';
    }
  }
};
</script>