import { Button } from "./button";
import { cn } from "../../lib/utils";
import { useTranslation } from "react-i18next";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

/**
 * 分页组件
 */
export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: PaginationProps) {
    const { t } = useTranslation();

    // 生成页码数组
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // 如果总页数小于等于最大显示页数，显示所有页码
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // 否则，显示当前页附近的页码
            let startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

            // 调整起始页，确保显示maxPagesToShow个页码
            if (endPage - startPage + 1 < maxPagesToShow) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            // 添加第一页
            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) {
                    pages.push("ellipsis-start");
                }
            }

            // 添加中间页码
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // 添加最后一页
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push("ellipsis-end");
                }
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className={cn("flex items-center justify-center space-x-2", className)}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                {t('common:pagination.previous')}
            </Button>

            <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) => {
                    if (page === "ellipsis-start" || page === "ellipsis-end") {
                        return (
                            <div key={`ellipsis-${index}`} className="px-2">
                                ...
                            </div>
                        );
                    }

                    return (
                        <Button
                            key={`page-${page}`}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPageChange(page as number)}
                            className="w-8 h-8 p-0"
                        >
                            {page}
                        </Button>
                    );
                })}
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
            >
                {t('common:pagination.next')}
            </Button>
        </div>
    );
}