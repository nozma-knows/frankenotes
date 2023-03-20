import { gql } from "@apollo/client";

const notesQueriesDocument = gql`
  query NotesQueries($authorId: String!) {
    notesQueries(authorId: $authorId) {
      id
      createdAt
      updatedAt
      authorId
      query
      response
      status
    }
  }
`;

export default notesQueriesDocument;
