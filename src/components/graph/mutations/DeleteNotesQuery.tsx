import { gql } from "@apollo/client";

const deleteNotesQueryDocument = gql`
  mutation DeleteNotesQuery($id: String!) {
    deleteNotesQuery(id: $id) {
      id
    }
  }
`;

export default deleteNotesQueryDocument;
