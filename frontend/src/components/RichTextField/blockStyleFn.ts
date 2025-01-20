import { ContentBlock } from "draft-js";

export default function blockStyleFn(contentBlock: ContentBlock) {
    const type = contentBlock.getType();
    if (type === "left") {
        return "left";
    }
    if (type === "center") {
        return "center";
    }
    if (type === "right") {
        return "right";
    }
    if (type === "justify") {
        return "justify";
    }
    return "left";
}