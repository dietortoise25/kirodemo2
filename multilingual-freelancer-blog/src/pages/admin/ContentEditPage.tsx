import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';

interface ContentFormData {
    title: string;
    content: string;
    language: string;
    status: 'draft' | 'published';
}

export function ContentEditPage() {
    const { t, i18n } = useTranslation('admin');
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isPreview, setIsPreview] = useState(false);
    const [formData, setFormData] = useState<ContentFormData>({
        title: '',
        content: '',
        language: i18n.language,
        status: 'draft'
    });

    // 模拟从API加载数据
    useEffect(() => {
        if (id && id !== 'new') {
            // 这里应该从API获取数据
            // 模拟异步加载
            setTimeout(() => {
                setFormData({
                    title: '示例文章标题',
                    content: '# 示例文章内容\n\n这是一个示例文章，用于测试Markdown编辑器。\n\n## 二级标题\n\n- 列表项1\n- 列表项2\n- 列表项3\n\n```js\nconsole.log("Hello World");\n```',
                    language: 'zh',
                    status: 'draft'
                });
            }, 500);
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (value?: string) => {
        setFormData(prev => ({ ...prev, content: value || '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 这里应该调用API保存数据
        console.log('保存内容:', formData);

        // 模拟保存成功后返回列表页
        // navigate('/admin/content');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {id === 'new' ? t('createNewPost') : t('editPost')}
                    </h1>
                    <p className="text-muted-foreground">
                        {id === 'new' ? t('createPostDescription') : t('editPostDescription')}
                    </p>
                </div>
                <Button variant="outline" size="icon" onClick={() => navigate('/admin/content')}>
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">{t('back')}</span>
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium mb-1">
                                {t('title')}
                            </label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder={t('titlePlaceholder')}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="language" className="block text-sm font-medium mb-1">
                                {t('language')}
                            </label>
                            <select
                                id="language"
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            >
                                <option value="en">English</option>
                                <option value="zh">中文</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium mb-1">
                                {t('status')}
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            >
                                <option value="draft">{t('draft')}</option>
                                <option value="published">{t('published')}</option>
                            </select>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="content" className="block text-sm font-medium">
                                    {t('content')}
                                </label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsPreview(!isPreview)}
                                >
                                    {isPreview ? (
                                        <>
                                            <EyeOff className="h-4 w-4 mr-2" />
                                            {t('hidePreview')}
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="h-4 w-4 mr-2" />
                                            {t('showPreview')}
                                        </>
                                    )}
                                </Button>
                            </div>
                            <div data-color-mode="light">
                                <MDEditor
                                    value={formData.content}
                                    onChange={handleContentChange}
                                    preview={isPreview ? 'preview' : 'edit'}
                                    height={400}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/admin/content')}>
                        {t('cancel')}
                    </Button>
                    <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        {t('save')}
                    </Button>
                </div>
            </form>
        </div>
    );
} 