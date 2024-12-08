<template>
  <main>
    <article>
      <h1>Profile</h1>
      <p>Email: {{ user?.email }}</p>
      <button class="btn-2" @click="logOut" type="button">Log out</button>
    </article>
  </main>
</template>

<script lang="ts" setup>
// Define page metadata with middleware
definePageMeta({
  middleware: 'auth',
});

// User and client objects
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

console.log(user.value);

// Type-safe logOut function
async function logOut(): Promise<void> {
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;

    // Redirect to login page after successful logout
    await router.push('/login');
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('An unknown error occurred during logout.');
    }
  }
}
</script>