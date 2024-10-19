import {
    List,
    Datagrid,
    TextField,
    DateField,
    BooleanField,
} from "react-admin";

export const BooksPosts = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <TextField source="genre" />
            <BooleanField source="commentable" />
        </Datagrid>
    </List>
);
