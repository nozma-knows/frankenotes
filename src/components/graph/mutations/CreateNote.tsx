import { gql } from "@apollo/client";

export const createNoteDocument = gql`
  mutation CreateNote($input: NoteInput!) {
    createNote(input: $input) {
      id
      createdAt
      updatedAt
      authorId
      title
      editorState
    }
  }
`;

export default createNoteDocument;
