import { gql } from "@apollo/client";

const notesDocument = gql`
  query Notes($authorId: String!) {
    notes(authorId: $authorId) {
      id
      createdAt
      updatedAt
      authorId
      title
      editorState
    }
  }
`;

export default notesDocument;
