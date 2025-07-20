import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Plus, Search, Edit, Trash } from 'lucide-react';
import { useContent } from '../../hooks/useContent';
import type { Content } from '../../types';

export function ContentManagementPage() {
    const { t } = useTranslation('admin');
    const [searchQuery, setSearchQuery] = useState('');
    const { contents, loading, loadAllContents } = useContent();

    useEffect(() => {
        loadAllContents();
    }, [loadAllContents]);

    const handleDelete = async (contentId: string) => {
        if (window.confirm(t('confirmDelete'))) {
            try {
                const response = await fetch(`/api/contents/${contentId}`, {
                    method: 'DELETE',
                });
                
                if (!response.ok) {
                    throw new Error('Failed to delete content');
                }
                
                // 重新加载内容列表
                loadAllContents();
            } catch (error) {
                console.error('删除失败:', error);
                alert(t('deleteFailed'));
            }
        }
    };

    const filteredPosts = searchQuery
        ? contents.filter(content => 
            content.translations.some(translation => 
                translation.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
          )
        : contents;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">{t('loading')}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('contentManagement')}</h1>
                    <p className="text-muted-foreground">{t('contentManagementDescription')}</p>
                </div>
                <Link to="/admin/content/new">
                    <Button className="sm:self-end">
                        <Plus className="mr-2 h-4 w-4" />
                        {t('createNewPost')}
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={t('searchPosts')}
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead>
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <th className="h-12 px-4 text-left align-middle font-medium">{t('title')}</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">{t('status')}</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">{t('date')}</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPosts.length > 0 ? (
                                    filteredPosts.map((content) => {
                                        const primaryTranslation = content.translations[0];
                                        const title = primaryTranslation?.title || t('untitled');
                                        return (
                                            <tr key={content.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-middle">{title}</td>
                                                <td className="p-4 align-middle hidden md:table-cell">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                        content.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {content.published ? t('published') : t('draft')}
                                                    </span>
                                                </td>
                                                <td className="p-4 align-middle hidden md:table-cell">
                                                    {new Date(content.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 align-middle text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link to={`/admin/content/${content.id}`}>
                                                            <Button size="icon" variant="ghost">
                                                                <Edit className="h-4 w-4" />
                                                                <span className="sr-only">{t('edit')}</span>
                                                            </Button>
                                                        </Link>
                                                        <Button 
                                                            size="icon" 
                                                            variant="ghost"
                                                            onClick={() => handleDelete(content.id)}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                            <span className="sr-only">{t('delete')}</span>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                            {searchQuery ? t('noSearchResults') : t('noPostsYet')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        </div>
    );
}