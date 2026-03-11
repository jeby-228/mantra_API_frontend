import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: process.env.PUBLIC_GRAPHQL_ENDPOINT || 'https://member-api-0-0-4.onrender.com/graphql',
	documents: ['src/**/*.graphql', 'src/**/*.gql'],
	generates: {
		'src/lib/graphql/generated.ts': {
			plugins: ['typescript', 'typescript-operations', 'typescript-urql'],
			config: {
				withHooks: false,
				withComponent: false,
				skipTypename: false,
				enumsAsTypes: true
			}
		}
	},
	ignoreNoDocuments: true
};

export default config;
