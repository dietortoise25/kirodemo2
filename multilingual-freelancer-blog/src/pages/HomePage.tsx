import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Settings } from 'lucide-react';

/**
 * 首页组件
 */
export function HomePage() {
    const { t } = useTranslation();
    const [count, setCount] = useState(0);

    return (
        <div className="container mx-auto px-4 py-8">
            <section className="py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                                {t('home:hero.title')}
                            </h1>
                            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                                {t('home:hero.description')}
                            </p>
                        </div>
                        <div className="space-x-4">
                            <Button>{t('home:hero.learnMore')}</Button>
                            <Button variant="outline">{t('home:hero.contactMe')}</Button>
                            <Link to="/admin">
                                <Button variant="secondary" size="sm" className="ml-4">
                                    <Settings className="w-4 h-4 mr-2" />
                                    管理后台
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-24 lg:py-32 bg-muted/50">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                                {t('home:features.title')}
                            </h2>
                            <p className="mx-auto max-w-[700px] text-muted-foreground">
                                {t('home:features.description')}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('home:features.multilingual.title')}</CardTitle>
                                    <CardDescription>{t('home:features.multilingual.subtitle')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>{t('home:features.multilingual.description')}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('home:features.projects.title')}</CardTitle>
                                    <CardDescription>{t('home:features.projects.subtitle')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>{t('home:features.projects.description')}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('home:features.jobInvites.title')}</CardTitle>
                                    <CardDescription>{t('home:features.jobInvites.subtitle')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>{t('home:features.jobInvites.description')}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="space-y-2 text-center">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                                {t('home:demo.title')}
                            </h2>
                            <p className="mx-auto max-w-[700px] text-muted-foreground">
                                {t('home:demo.description')}
                            </p>
                        </div>
                        <Card className="w-full max-w-sm">
                            <CardHeader>
                                <CardTitle>{t('home:demo.counter.title')}</CardTitle>
                                <CardDescription>{t('home:demo.counter.subtitle')}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                <div className="text-4xl font-bold">{count}</div>
                            </CardContent>
                            <CardFooter className="flex justify-center">
                                <Button onClick={() => setCount((count) => count + 1)}>
                                    {t('home:demo.counter.button')}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}