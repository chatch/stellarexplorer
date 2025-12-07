declare module "*.css";
declare module "*.svg" {
    const content: string;
    export default content;
}

declare module "*.css?url" {
    const content: string;
    export default content;
}
