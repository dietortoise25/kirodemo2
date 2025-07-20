import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { useContent } from '../../hooks/useContent';
import type { Content, ContentTranslation } from '../../types';

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
    const isEditing = id !== 'new';
    const { contents, loading, loadContentById } = useContent();
    const [isPreview, setIsPreview] = useState(false);
    const [formData, setFormData] = useState<ContentFormData>({
        title: '',
        content: '',
        language: i18n.language,
        status: 'draft'
    });

    const [saving, setSaving] = useState(false);
    const [currentContent, setCurrentContent] = useState<Content | null>(null);

    useEffect(() => {
        if (isEditing && id) {
            const content = contents.find(c => c.id === id);
            if (content) {
                setCurrentContent(content);
                const translation = content.translations.find(t => t.language === formData.language) || content.translations[0];
                if (translation) {
                    setFormData({
                        title: translation.title,
                        content: translation.content,
                        language: translation.language,
                        status: content.published ? 'published' : 'draft'
                    });
                }
            } else {
                // 如果内容不在当前列表中，尝试加载
                loadContentById(id);
            }
        }
    }, [id, isEditing, contents, formData.language, loadContentById]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (value?: string) => {
        setFormData(prev => ({ ...prev, content: value || '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            if (isEditing && id) {
                // 更新现有内容
                const response = await fetch(`/api/contents/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        published: formData.status === 'published'
                    }),
                });
                
                if (!response.ok) {
                    throw new Error('Failed to update content');
                }
                
                // 更新翻译
                const translation = currentContent?.translations.find(t => t.language === formData.language);
                if (translation) {
                    const translationResponse = await fetch(`/api/contents/${id}/translations/${translation.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: formData.title,
                            content: formData.content
                        }),
                    });
                    
                    if (!translationResponse.ok) {
                        throw new Error('Failed to update translation');
                    }
                }
            } else {
                // 创建新内容
                const contentResponse = await fetch('/api/contents', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: 'admin', // 临时硬编码
                        slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
                        defaultLanguage: formData.language,
                        published: formData.status === 'published'
                    }),
                });
                
                if (!contentResponse.ok) {
                    throw new Error('Failed to create content');
                }
                
                const newContent = await contentResponse.json();
                
                // 创建翻译
                const translationResponse = await fetch(`/api/contents/${newContent.id}/translations`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        language: formData.language,
                        title: formData.title,
                        content: formData.content
                    }),
                });
                
                if (!translationResponse.ok) {
                    throw new Error('Failed to create translation');
                }
            }
            
            navigate('/admin/content');
        } catch (error) {
            console.error('保存失败:', error);
            alert(t('saveFailed'));
        } finally {
            setSaving(false);
        }
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
                    <Button type="submit" disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? t('saving') : (isEditing ? t('update') : t('create'))}
                    </Button>
                </div>
            </form>
        </div>
    );
}