/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateLoginInput = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
};

export type CreateNotesQueryInput = {
  authorId: Scalars['ID'];
  query: Scalars['String'];
};

export type Login = {
  __typename?: 'Login';
  email: Scalars['String'];
  id: Scalars['ID'];
  user: User;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createLogin: Login;
  createNote: Note;
  createNotesQuery: NotesQuery;
  deleteNote: Note;
  deleteNotesQueries: Scalars['Boolean'];
  deleteNotesQuery: NotesQuery;
  login: Session;
  logout: Session;
  updateNote: Note;
  updateNotesQuery: NotesQuery;
};


export type MutationCreateLoginArgs = {
  input: CreateLoginInput;
};


export type MutationCreateNoteArgs = {
  input: NoteInput;
};


export type MutationCreateNotesQueryArgs = {
  input: CreateNotesQueryInput;
};


export type MutationDeleteNoteArgs = {
  id: Scalars['String'];
};


export type MutationDeleteNotesQueriesArgs = {
  authorId: Scalars['String'];
};


export type MutationDeleteNotesQueryArgs = {
  id: Scalars['String'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationUpdateNoteArgs = {
  id: Scalars['String'];
  input: NoteInput;
};


export type MutationUpdateNotesQueryArgs = {
  id: Scalars['String'];
  input: UpdateNotesQueryInput;
};

export type Note = {
  __typename?: 'Note';
  author: User;
  authorId: Scalars['String'];
  createdAt: Scalars['String'];
  editorState: Scalars['String'];
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

export type NoteInput = {
  authorId: Scalars['ID'];
  editorState: Scalars['String'];
  title?: InputMaybe<Scalars['String']>;
};

export type NotesQuery = {
  __typename?: 'NotesQuery';
  author: User;
  authorId: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  query: Scalars['String'];
  response?: Maybe<Scalars['String']>;
  status?: Maybe<NotesQueryStatus>;
  updatedAt: Scalars['String'];
};

export enum NotesQueryStatus {
  Error = 'ERROR',
  Pending = 'PENDING',
  Successful = 'SUCCESSFUL'
}

export type Query = {
  __typename?: 'Query';
  note?: Maybe<Note>;
  notes?: Maybe<Array<Maybe<Note>>>;
  notesQueries?: Maybe<Array<Maybe<NotesQuery>>>;
  session?: Maybe<Session>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryNoteArgs = {
  id: Scalars['String'];
};


export type QueryNotesArgs = {
  authorId: Scalars['String'];
};


export type QueryNotesQueriesArgs = {
  authorId: Scalars['String'];
};


export type QuerySessionArgs = {
  id: Scalars['String'];
};

export type Session = {
  __typename?: 'Session';
  id: Scalars['ID'];
  token: Scalars['String'];
};

export type UpdateNotesQueryInput = {
  response: Scalars['String'];
  status: NotesQueryStatus;
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']>;
  emailVerified?: Maybe<Scalars['Boolean']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
  notes?: Maybe<Array<Maybe<Note>>>;
  notesQueries?: Maybe<Array<Maybe<NotesQuery>>>;
};
