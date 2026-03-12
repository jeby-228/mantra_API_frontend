<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { EyeIcon, EyeOffIcon } from '@lucide/svelte';

	let { form }: { form: ActionData } = $props();
	let showPassword = $state(false);

	function togglePassword() {
		showPassword = !showPassword;
	}
</script>

<div class="container mx-auto flex h-full items-center justify-center p-4">
	<div class="card w-full max-w-sm p-4 shadow-xl">
		<header class="card-header text-center">
			<h2 class="h2">Create Account</h2>
		</header>
		<section class="p-4">
			<form method="POST" use:enhance class="space-y-4">
				<label class="label">
					<span>Name</span>
					<input
						class="input"
						type="text"
						name="name"
						placeholder="Your Name"
						required
					/>
				</label>
				<label class="label">
					<span>Email</span>
					<input
						class="input"
						type="email"
						name="email"
						placeholder="user@example.com"
						required
					/>
				</label>
				<label class="label">
					<span>Password</span>
					<div class="relative">
						<input
							class="input pr-10"
							type={showPassword ? 'text' : 'password'}
							name="password"
							placeholder="••••••••"
							required
							minlength="6"
						/>
						<button
							type="button"
							class="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-surface-500 hover:text-primary-500"
							onclick={togglePassword}
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							{#if showPassword}
								<EyeOffIcon class="size-5" />
							{:else}
								<EyeIcon class="size-5" />
							{/if}
						</button>
					</div>
				</label>

				{#if form?.error}
					<div class="variant-filled-error alert">
						{form.error}
					</div>
				{/if}

				<button type="submit" class="variant-filled-primary btn w-full">Register</button>
			</form>

			<div class="flex items-center space-x-2 py-4">
				<hr class="flex-1 border-surface-500/30" />
				<span class="text-xs text-surface-500">OR</span>
				<hr class="flex-1 border-surface-500/30" />
			</div>

			<a
				href="/auth/line/login"
				class="btn w-full variant-filled"
				style="background-color: #06C755; color: white;"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					class="w-6 h-6 mr-2 fill-current"
				>
					<path
						d="M20.2 10.5c0-4.4-4.8-8-10.8-8s-10.8 3.6-10.8 8c0 3.9 3.4 7.2 8.5 7.9.3 0 .7.1.8.2.2.1.2.3.1.5-.1.4-.2 1.3-.3 1.9-.1.4-.3.9 0 1.2.4.3.8.3 1.4-.1 5.9-3.4 5.9-3.5 8.3-6 2.3-2.3 2.8-5.1 2.8-7.6zm-14.7.3c0-.8.7-1.5 1.5-1.5h.6c.8 0 1.5.7 1.5 1.5v2.8h1.8c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-3.9c-.8 0-1.5-.7-1.5-1.5v-4.3zm6.8 4.3c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5v-4.3c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v4.3zm5.7-2.6c.7.4 1.1 1.2 1.1 2v.6c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5v-2.3l-1.6 2.3c-.3.4-.7.6-1.1.6s-1.5-.7-1.5-1.5v-4.3c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v2.3l1.6-2.3c.3-.4.7-.6 1.1-.6.8 0 1.4.7 1.4 1.4v2.5z"
					/>
				</svg>
				Login with LINE
			</a>
		</section>
		<footer class="card-footer text-center p-4">
			<p>Already have an account? <a href="/login" class="anchor">Login</a></p>
		</footer>
	</div>
</div>
