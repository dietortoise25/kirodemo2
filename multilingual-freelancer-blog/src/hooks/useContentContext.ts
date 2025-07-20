import { useContext } from "react";
import { ContentContext } from "../contexts/ContentContext";

/**
 * 使用内容上下文的钩子
 * @returns 内容上下文
 */
export function useContentContext() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContentContext must be used within a ContentProvider");
  }
  return context;
}
