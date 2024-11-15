export default interface IPostFromDataBase {
    post_id: number;
    content: string;
    publication_date_time: any;
    post_author_id: number;
    children_post_id: number | null;
}
