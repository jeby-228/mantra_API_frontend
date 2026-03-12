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
			<h2 class="h2">Welcome Back</h2>
		</header>
		<section class="p-4">
			<form method="POST" use:enhance class="space-y-4">
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

				<button type="submit" class="variant-filled-primary btn w-full">Login</button>
			</form>

			<div class="flex items-center space-x-2 py-4">
				<hr class="flex-1 border-surface-500/30" />
				<span class="text-xs text-surface-500">OR</span>
				<hr class="flex-1 border-surface-500/30" />
			</div>

			<a
				href="/auth/line/login"
				class="btn w-full variant-filled flex items-center justify-center"
				style="background-color: #06C755; color: white;"
			>
				<span>Login with LINE</span>
			</a>
		</section>
		<footer class="card-footer text-center p-4">
			<p>Don't have an account? <a href="/register" class="anchor">Register</a></p>
		</footer>
	</div>
</div>
