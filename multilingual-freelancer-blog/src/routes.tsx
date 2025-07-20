import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './layouts/main-layout';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { LoginPage } from './pages/admin/LoginPage';
import { ProtectedRoute } from './pages/admin/ProtectedRoute';
import { AdminLayout } from './pages/admin/AdminLayout';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ContentManagementPage } from './pages/admin/ContentManagementPage';
import { ContentEditPage } from './pages/admin/ContentEditPage';
import { ErrorTestPage } from './pages/ErrorTestPage';
import { ErrorBoundary } from './components/error-boundary';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <NotFoundPage />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'blog',
                element: <BlogListPage />,
            },
            {
                path: 'blog/:slug',
                element: <BlogDetailPage />,
            },
            {
                path: 'error-test',
                element: (
                    <ErrorBoundary>
                        <ErrorTestPage />
                    </ErrorBoundary>
                ),
            },
        ],
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/admin',
        element: <ProtectedRoute />,
        children: [
            {
                path: '',
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <DashboardPage />,
                    },
                    {
                        path: 'content',
                        element: <ContentManagementPage />,
                    },
                    {
                        path: 'content/new',
                        element: <ContentEditPage />,
                    },
                    {
                        path: 'content/:id',
                        element: <ContentEditPage />,
                    },
                    // 在这里添加其他受保护的管理后台路由
                    // 例如:
                    // { path: 'projects', element: <ProjectManagementPage /> },
                ]
            }
        ]
    }
]);