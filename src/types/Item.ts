import { Category } from "./Category";
import { FileUpload } from "./FileUpload";
import User from "./User";

export interface Item {
    id?: number;
    category_id?: number;
    title?: string;
    description?: string;
    condition?: string;
    price?: number;
    location?: string;

    file_uploads?: FileUpload[];
    category?: Category

    uploaded_files?: FileUpload[];

    added_by?: User;
}
