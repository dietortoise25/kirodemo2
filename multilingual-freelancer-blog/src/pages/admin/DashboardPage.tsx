import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/card';

export function DashboardPage() {
    const { t } = useTranslation('admin');

    // 这些数据在实际应用中应该从API获取
    const stats = [
        { title: 'totalPosts', value: 24 },
        { title: 'totalProjects', value: 12 },
        { title: 'totalMessages', value: 48 },
        { title: 'publishedPosts', value: 18 }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('dashboard')}</h1>
                <p className="text-muted-foreground">{t('dashboardDescription')}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="p-4">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">{t(`stats.${stat.title}`)}</p>
                            <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                    <h3 className="text-lg font-medium mb-4">{t('recentPosts')}</h3>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{t('noData')}</p>
                    </div>
                </Card>
                <Card className="p-4">
                    <h3 className="text-lg font-medium mb-4">{t('recentMessages')}</h3>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{t('noData')}</p>
                    </div>
                </Card>
            </div>
        </div>
    );
} 