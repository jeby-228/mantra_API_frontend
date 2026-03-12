/**
 * GraphQL 自動產生的型別檔案
 *
 * 此檔案會在執行 `pnpm graphql:codegen` 後自動產生
 * 請勿手動編輯此檔案
 *
 * 若要產生此檔案：
 * 1. 確保 GraphQL API 端點可連線
 * 2. 執行 `pnpm graphql:codegen`
 */

export type Scalars = {
	ID: { input: string; output: string };
	String: { input: string; output: string };
	Boolean: { input: boolean; output: boolean };
	Int: { input: number; output: number };
	Float: { input: number; output: number };
};

export type QuoteRecord = {
	__typename?: 'QuoteRecord';
	id: Scalars['ID']['output'];
	jb_name: Scalars['String']['output'];
	quote: Scalars['String']['output'];
	said_at?: Scalars['String']['output'] | null;
	created_at?: Scalars['String']['output'] | null;
	updated_at?: Scalars['String']['output'] | null;
};

export type QuoteRecordsResponse = {
	__typename?: 'QuoteRecordsResponse';
	records: Array<QuoteRecord>;
	total: Scalars['Int']['output'];
	limit: Scalars['Int']['output'];
	offset: Scalars['Int']['output'];
};

export type CreateQuoteRecordInput = {
	jb_name: Scalars['String']['input'];
	quote: Scalars['String']['input'];
	said_at?: Scalars['String']['input'] | null;
};

export type UpdateQuoteRecordInput = {
	jb_name?: Scalars['String']['input'] | null;
	quote?: Scalars['String']['input'] | null;
	said_at?: Scalars['String']['input'] | null;
};

export type GetQuoteRecordQueryVariables = {
	id: Scalars['ID']['input'];
};

export type GetQuoteRecordQuery = {
	__typename?: 'Query';
	quoteRecord?: {
		__typename?: 'QuoteRecord';
		id: string;
		jb_name: string;
		quote: string;
		said_at?: string | null;
		created_at?: string | null;
		updated_at?: string | null;
	} | null;
};

export type GetQuoteRecordsQueryVariables = {
	limit?: Scalars['Int']['input'] | null;
	offset?: Scalars['Int']['input'] | null;
};

export type GetQuoteRecordsQuery = {
	__typename?: 'Query';
	quoteRecords: {
		__typename?: 'QuoteRecordsResponse';
		total: number;
		limit: number;
		offset: number;
		records: Array<{
			__typename?: 'QuoteRecord';
			id: string;
			jb_name: string;
			quote: string;
			said_at?: string | null;
			created_at?: string | null;
			updated_at?: string | null;
		}>;
	};
};

export type CreateQuoteRecordMutationVariables = {
	input: CreateQuoteRecordInput;
};

export type CreateQuoteRecordMutation = {
	__typename?: 'Mutation';
	createQuoteRecord: {
		__typename?: 'QuoteRecord';
		id: string;
		jb_name: string;
		quote: string;
		said_at?: string | null;
		created_at?: string | null;
		updated_at?: string | null;
	};
};

export type UpdateQuoteRecordMutationVariables = {
	id: Scalars['ID']['input'];
	input: UpdateQuoteRecordInput;
};

export type UpdateQuoteRecordMutation = {
	__typename?: 'Mutation';
	updateQuoteRecord: {
		__typename?: 'QuoteRecord';
		id: string;
		jb_name: string;
		quote: string;
		said_at?: string | null;
		created_at?: string | null;
		updated_at?: string | null;
	};
};

export type DeleteQuoteRecordMutationVariables = {
	id: Scalars['ID']['input'];
};

export type DeleteQuoteRecordMutation = {
	__typename?: 'Mutation';
	deleteQuoteRecord: boolean;
};

// Documents for URQL
export const GetQuoteRecordDocument = `
    query GetQuoteRecord($id: ID!) {
  quoteRecord(id: $id) {
    id
    jb_name
    quote
    said_at
    created_at
    updated_at
  }
}
    `;

export const GetQuoteRecordsDocument = `
    query GetQuoteRecords($limit: Int, $offset: Int) {
  quoteRecords(limit: $limit, offset: $offset) {
    records {
      id
      jb_name
      quote
      said_at
      created_at
      updated_at
    }
    total
    limit
    offset
  }
}
    `;

export const CreateQuoteRecordDocument = `
    mutation CreateQuoteRecord($input: CreateQuoteRecordInput!) {
  createQuoteRecord(input: $input) {
    id
    jb_name
    quote
    said_at
    created_at
    updated_at
  }
}
    `;

export const UpdateQuoteRecordDocument = `
    mutation UpdateQuoteRecord($id: ID!, $input: UpdateQuoteRecordInput!) {
  updateQuoteRecord(id: $id, input: $input) {
    id
    jb_name
    quote
    said_at
    created_at
    updated_at
  }
}
    `;

export const DeleteQuoteRecordDocument = `
    mutation DeleteQuoteRecord($id: ID!) {
  deleteQuoteRecord(id: $id)
}
    `;
