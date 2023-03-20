import { gql } from "@apollo/client";

export const updateNoteDocument = gql`
  mutation UpdateNote($id: String!, $input: NoteInput!) {
    updateNote(id: $id, input: $input) {
      id
      createdAt
      updatedAt
      authorId
      title
      content
    }
  }
`;

export default updateNoteDocument;
