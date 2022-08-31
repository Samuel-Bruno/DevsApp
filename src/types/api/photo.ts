export type Photo = {
  name: string;
  url: string;
  author?: {
    name: string;
    id: string;
    ref: string;
  };
}