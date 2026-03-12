import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
	[_ in K]?: never;
};
export type Incremental<T> =
	| T
	| { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string };
	String: { input: string; output: string };
	Boolean: { input: boolean; output: boolean };
	Int: { input: number; output: number };
	Float: { input: number; output: number };
};

export type CreateMantraInput = {
	content: Scalars['String']['input'];
	description?: InputMaybe<Scalars['String']['input']>;
};

export type CreateMantraRecordInput = {
	location?: InputMaybe<Scalars['String']['input']>;
	mantra_id: Scalars['ID']['input'];
	said_at?: InputMaybe<Scalars['String']['input']>;
};

export type CreateMemberInput = {
	email: Scalars['String']['input'];
	name: Scalars['String']['input'];
	password: Scalars['String']['input'];
};

export type CreateMessageBoardInput = {
	message: Scalars['String']['input'];
	quote_record_id: Scalars['ID']['input'];
};

export type CreateProductInput = {
	product_description?: InputMaybe<Scalars['String']['input']>;
	product_image?: InputMaybe<Scalars['String']['input']>;
	product_name: Scalars['String']['input'];
	product_price: Scalars['Float']['input'];
	product_stock: Scalars['Int']['input'];
};

export type CreateQuoteRecordInput = {
	jb_name: Scalars['String']['input'];
	quote: Scalars['String']['input'];
	said_at?: InputMaybe<Scalars['String']['input']>;
};

export type EditMessageBoardInput = {
	message: Scalars['String']['input'];
};

export type Mantra = {
	__typename?: 'Mantra';
	content: Scalars['String']['output'];
	created_at?: Maybe<Scalars['String']['output']>;
	description?: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	updated_at?: Maybe<Scalars['String']['output']>;
};

export type MantraDailyStat = {
	__typename?: 'MantraDailyStat';
	count: Scalars['Int']['output'];
	mantra_id: Scalars['ID']['output'];
	stat_date: Scalars['String']['output'];
};

export type MantraRecord = {
	__typename?: 'MantraRecord';
	created_at?: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	location?: Maybe<Scalars['String']['output']>;
	mantra_id: Scalars['ID']['output'];
	said_at?: Maybe<Scalars['String']['output']>;
	updated_at?: Maybe<Scalars['String']['output']>;
};

export type MantraRecordsResponse = {
	__typename?: 'MantraRecordsResponse';
	limit: Scalars['Int']['output'];
	offset: Scalars['Int']['output'];
	records: Array<MantraRecord>;
	total: Scalars['Int']['output'];
};

export type MantrasResponse = {
	__typename?: 'MantrasResponse';
	limit: Scalars['Int']['output'];
	mantras: Array<Mantra>;
	offset: Scalars['Int']['output'];
	total: Scalars['Int']['output'];
};

/**
 * GraphQL Schema for Member API.
 * This SDL mirrors the implemented queries in the Go resolvers.
 */
export type Member = {
	__typename?: 'Member';
	created_at?: Maybe<Scalars['String']['output']>;
	email: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	updated_at?: Maybe<Scalars['String']['output']>;
};

export type MessageBoard = {
	__typename?: 'MessageBoard';
	created_at?: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	is_edited: Scalars['Boolean']['output'];
	message: Scalars['String']['output'];
	quote_record_id: Scalars['ID']['output'];
	updated_at?: Maybe<Scalars['String']['output']>;
};

export type MessageBoardsResponse = {
	__typename?: 'MessageBoardsResponse';
	limit: Scalars['Int']['output'];
	messages: Array<MessageBoard>;
	offset: Scalars['Int']['output'];
	total: Scalars['Int']['output'];
};

export type Mutation = {
	__typename?: 'Mutation';
	createMantra: Mantra;
	createMantraRecord: MantraRecord;
	/** Create a new member */
	createMember: Member;
	createMessageBoard: MessageBoard;
	/** Create a new product */
	createProduct: Product;
	createQuoteRecord: QuoteRecord;
	deleteMantra: Scalars['Boolean']['output'];
	deleteMantraRecord: Scalars['Boolean']['output'];
	/** Delete a member (soft delete) */
	deleteMember: Scalars['Boolean']['output'];
	deleteMessageBoard: Scalars['Boolean']['output'];
	/** Delete a product (soft delete) */
	deleteProduct: Scalars['Boolean']['output'];
	deleteQuoteRecord: Scalars['Boolean']['output'];
	editMessageBoard: MessageBoard;
	updateMantra: Mantra;
	/** Update an existing member */
	updateMember: Member;
	/** Update an existing product */
	updateProduct: Product;
	updateQuoteRecord: QuoteRecord;
};

export type MutationCreateMantraArgs = {
	input: CreateMantraInput;
};

export type MutationCreateMantraRecordArgs = {
	input: CreateMantraRecordInput;
};

export type MutationCreateMemberArgs = {
	input: CreateMemberInput;
};

export type MutationCreateMessageBoardArgs = {
	input: CreateMessageBoardInput;
};

export type MutationCreateProductArgs = {
	input: CreateProductInput;
};

export type MutationCreateQuoteRecordArgs = {
	input: CreateQuoteRecordInput;
};

export type MutationDeleteMantraArgs = {
	id: Scalars['ID']['input'];
};

export type MutationDeleteMantraRecordArgs = {
	id: Scalars['ID']['input'];
};

export type MutationDeleteMemberArgs = {
	id: Scalars['ID']['input'];
};

export type MutationDeleteMessageBoardArgs = {
	id: Scalars['ID']['input'];
};

export type MutationDeleteProductArgs = {
	id: Scalars['ID']['input'];
};

export type MutationDeleteQuoteRecordArgs = {
	id: Scalars['ID']['input'];
};

export type MutationEditMessageBoardArgs = {
	id: Scalars['ID']['input'];
	input: EditMessageBoardInput;
};

export type MutationUpdateMantraArgs = {
	id: Scalars['ID']['input'];
	input: UpdateMantraInput;
};

export type MutationUpdateMemberArgs = {
	id: Scalars['ID']['input'];
	input: UpdateMemberInput;
};

export type MutationUpdateProductArgs = {
	id: Scalars['ID']['input'];
	input: UpdateProductInput;
};

export type MutationUpdateQuoteRecordArgs = {
	id: Scalars['ID']['input'];
	input: UpdateQuoteRecordInput;
};

export type Product = {
	__typename?: 'Product';
	created_at?: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	product_description?: Maybe<Scalars['String']['output']>;
	product_image?: Maybe<Scalars['String']['output']>;
	product_name: Scalars['String']['output'];
	product_price: Scalars['Float']['output'];
	product_stock: Scalars['Int']['output'];
	updated_at?: Maybe<Scalars['String']['output']>;
};

export type ProductsResponse = {
	__typename?: 'ProductsResponse';
	limit: Scalars['Int']['output'];
	offset: Scalars['Int']['output'];
	products: Array<Product>;
	total: Scalars['Int']['output'];
};

export type Query = {
	__typename?: 'Query';
	mantra?: Maybe<Mantra>;
	mantraDailyStats: Array<MantraDailyStat>;
	mantraRecord?: Maybe<MantraRecord>;
	mantraRecords: MantraRecordsResponse;
	mantras: MantrasResponse;
	/** Fetch a single member by ID */
	member?: Maybe<Member>;
	/** Fetch a list of members (default limit: 50) */
	members: Array<Member>;
	messageBoard?: Maybe<MessageBoard>;
	messageBoards: MessageBoardsResponse;
	/** Fetch a single product by ID */
	product?: Maybe<Product>;
	/** Fetch a list of products with pagination */
	products: ProductsResponse;
	quoteRecord?: Maybe<QuoteRecord>;
	quoteRecords: QuoteRecordsResponse;
};

export type QueryMantraArgs = {
	id: Scalars['ID']['input'];
};

export type QueryMantraDailyStatsArgs = {
	days: Scalars['Int']['input'];
	mantra_id: Scalars['ID']['input'];
};

export type QueryMantraRecordArgs = {
	id: Scalars['ID']['input'];
};

export type QueryMantraRecordsArgs = {
	limit?: InputMaybe<Scalars['Int']['input']>;
	mantra_id?: InputMaybe<Scalars['ID']['input']>;
	offset?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryMantrasArgs = {
	limit?: InputMaybe<Scalars['Int']['input']>;
	offset?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryMemberArgs = {
	id: Scalars['ID']['input'];
};

export type QueryMembersArgs = {
	limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryMessageBoardArgs = {
	id: Scalars['ID']['input'];
};

export type QueryMessageBoardsArgs = {
	limit?: InputMaybe<Scalars['Int']['input']>;
	offset?: InputMaybe<Scalars['Int']['input']>;
	quote_record_id: Scalars['ID']['input'];
};

export type QueryProductArgs = {
	id: Scalars['ID']['input'];
};

export type QueryProductsArgs = {
	limit?: InputMaybe<Scalars['Int']['input']>;
	offset?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryQuoteRecordArgs = {
	id: Scalars['ID']['input'];
};

export type QueryQuoteRecordsArgs = {
	limit?: InputMaybe<Scalars['Int']['input']>;
	offset?: InputMaybe<Scalars['Int']['input']>;
};

export type QuoteRecord = {
	__typename?: 'QuoteRecord';
	created_at?: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	jb_name: Scalars['String']['output'];
	quote: Scalars['String']['output'];
	said_at?: Maybe<Scalars['String']['output']>;
	updated_at?: Maybe<Scalars['String']['output']>;
};

export type QuoteRecordsResponse = {
	__typename?: 'QuoteRecordsResponse';
	limit: Scalars['Int']['output'];
	offset: Scalars['Int']['output'];
	records: Array<QuoteRecord>;
	total: Scalars['Int']['output'];
};

export type UpdateMantraInput = {
	content?: InputMaybe<Scalars['String']['input']>;
	description?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMemberInput = {
	email: Scalars['String']['input'];
	name: Scalars['String']['input'];
};

export type UpdateProductInput = {
	product_description?: InputMaybe<Scalars['String']['input']>;
	product_image?: InputMaybe<Scalars['String']['input']>;
	product_name?: InputMaybe<Scalars['String']['input']>;
	product_price?: InputMaybe<Scalars['Float']['input']>;
	product_stock?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateQuoteRecordInput = {
	jb_name?: InputMaybe<Scalars['String']['input']>;
	quote?: InputMaybe<Scalars['String']['input']>;
	said_at?: InputMaybe<Scalars['String']['input']>;
};

export type CreateQuoteRecordMutationVariables = Exact<{
	input: CreateQuoteRecordInput;
}>;

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

export type UpdateQuoteRecordMutationVariables = Exact<{
	id: Scalars['ID']['input'];
	input: UpdateQuoteRecordInput;
}>;

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

export type DeleteQuoteRecordMutationVariables = Exact<{
	id: Scalars['ID']['input'];
}>;

export type DeleteQuoteRecordMutation = { __typename?: 'Mutation'; deleteQuoteRecord: boolean };

export type PlaceholderMutationQueryVariables = Exact<{ [key: string]: never }>;

export type PlaceholderMutationQuery = { __typename: 'Query' };

export type GetQuoteRecordQueryVariables = Exact<{
	id: Scalars['ID']['input'];
}>;

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

export type GetQuoteRecordsQueryVariables = Exact<{
	limit?: InputMaybe<Scalars['Int']['input']>;
	offset?: InputMaybe<Scalars['Int']['input']>;
}>;

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

export type PlaceholderQueryVariables = Exact<{ [key: string]: never }>;

export type PlaceholderQuery = { __typename: 'Query' };

export const CreateQuoteRecordDocument = gql`
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
export const UpdateQuoteRecordDocument = gql`
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
export const DeleteQuoteRecordDocument = gql`
	mutation DeleteQuoteRecord($id: ID!) {
		deleteQuoteRecord(id: $id)
	}
`;
export const PlaceholderMutationDocument = gql`
	query PlaceholderMutation {
		__typename
	}
`;
export const GetQuoteRecordDocument = gql`
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
export const GetQuoteRecordsDocument = gql`
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
export const PlaceholderDocument = gql`
	query Placeholder {
		__typename
	}
`;
