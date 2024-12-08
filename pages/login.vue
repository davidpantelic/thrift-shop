<template>
  <main>
    <article>
      <h1>Login</h1>
      <form @submit.prevent="submitForm" novalidate v-if="!successMsg">

        <div class="form-group">
          <label>Email: * <span class="sr-only">required field</span>
            <span v-if="showErrors && !isValidEmail">Valid email is required</span>
            <input name="email" type="email" v-model="contactForm.email" autocomplete="email" placeholder="" required />
          </label>
        </div>

        <div>
          <label for="label-password">Password: * <span class="sr-only">required field</span>
            <span v-if="showErrors && !contactForm.password">This field is required</span>
          </label>
          <input type="password" id="label-password" v-model="contactForm.password" placeholder="" autocomplete="" required>
        </div>

        <button class="btn-2" type="submit">Submit</button>

      </form>

      <p v-if="successMsg"><span>{{ successMsg }}</span></p>
      <p v-if="errorMsg"><span>{{ errorMsg }}</span></p>

      <p>Or register if you don't have an account</p>
      <NuxtLink class="btn-2" to="/register">Register</NuxtLink>
    </article>
  </main>
</template>

<script lang="ts" setup>
const router = useRouter();
const client = useSupabaseClient();
const errorMsg = ref("");
const successMsg = ref("");

// Define the shape of the form state
interface ContactForm {
  email: string;
  password: string;
}

// Initialize form state with default properties
const contactForm = ref<ContactForm>({
  email: '',
  password: '',
});

// State to trigger error display after form submission
const showErrors = ref<boolean>(false);

// Computed property to validate email format
const isValidEmail = computed((): boolean => {
  const emailPattern = /\S+@\S+\.\S+/;
  return emailPattern.test(contactForm.value.email);
});

// Dynamic form validation function
const isFormValid = (): boolean => {
  // Loop through each field in contactForm and check if it's empty
  for (const key in contactForm.value) {
    // If a required field is empty, the form is invalid
    if (!contactForm.value[key as keyof ContactForm]) {
      return false;
    }
  }

  // Additional custom validation for email field
  if (!isValidEmail.value) {
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
    const { error } = await client.auth.signInWithPassword({
      email: contactForm.value.email,
      password: contactForm.value.password
    })
    if (error) {
      // Handle Supabase error explicitly
      errorMsg.value = error.message;
      return
    } else {
      errorMsg.value = '';
      successMsg.value = 'You are now signed in'
      router.push('/profile');
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

  // try {
  //   const { data, error } = await client.auth.signUp({
  //     email: contactForm.value.email,
  //     password: contactForm.value.password,
  //   });

  //   if (error) {
  //     // Handle Supabase error explicitly
  //     errorMsg.value = error.message;
  //   } else {
  //     errorMsg.value = '';
  //     successMsg.value = 'Check your email to confirm your account.';
  //   }
  // } catch (err) {
  //   if (err instanceof Error) {
  //     // Safely access the error message
  //     errorMsg.value = err.message;
  //   } else {
  //     // Fallback for non-Error types
  //     errorMsg.value = 'An unknown error occurred.';
  //   }
  // }
};
</script>