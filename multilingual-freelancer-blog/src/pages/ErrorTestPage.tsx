import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { useToast } from '../contexts/toast-context';
import { ApiError, NetworkError } from '../utils/error-handler';

export function ErrorTestPage() {
    const { showToast } = useToast();
    const [errorTriggered, setErrorTriggered] = useState(false);

    // 触发错误边界错误
    const triggerError = () => {
        setErrorTriggered(true);
        // 这将导致组件崩溃，触发错误边界
        throw new Error('这是一个测试错误');
    };

    // 显示成功提示
    const showSuccessToast = () => {
        showToast({
            type: 'success',
            title: '操作成功',
            message: '您的操作已成功完成',
            duration: 3000,
        });
    };

    // 显示错误提示
    const showErrorToast = () => {
        showToast({
            type: 'error',
            title: '操作失败',
            message: '您的操作未能完成，请重试',
            duration: 3000,
        });
    };

    // 显示警告提示
    const showWarningToast = () => {
        showToast({
            type: 'warning',
            title: '注意',
            message: '请注意这个操作可能有风险',
            duration: 3000,
        });
    };

    // 显示信息提示
    const showInfoToast = () => {
        showToast({
            type: 'info',
            title: '提示信息',
            message: '这是一条提示信息',
            duration: 3000,
        });
    };

    // 模拟API错误
    const simulateApiError = () => {
        try {
            throw new ApiError('API请求失败', 404, { reason: '资源不存在' });
        } catch (error) {
            showToast({
                type: 'error',
                title: '请求失败',
                message: error instanceof Error ? error.message : '未知错误',
                duration: 5000,
            });
        }
    };

    // 模拟网络错误
    const simulateNetworkError = () => {
        try {
            throw new NetworkError('网络连接失败');
        } catch (error) {
            showToast({
                type: 'error',
                title: '网络错误',
                message: error instanceof Error ? error.message : '未知错误',
                duration: 5000,
            });
        }
    };

    if (errorTriggered) {
        // 这将导致组件崩溃，触发错误边界
        throw new Error('这是一个测试错误');
    }

    return (
        <div className="container py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">错误处理测试页面</h1>

                <div className="space-y-8">
                    <section className="p-6 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">错误边界测试</h2>
                        <p className="mb-4 text-muted-foreground">
                            点击下面的按钮将触发一个未捕获的错误，测试错误边界组件的功能。
                        </p>
                        <Button onClick={triggerError} variant="destructive">
                            触发错误
                        </Button>
                    </section>

                    <section className="p-6 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Toast通知测试</h2>
                        <p className="mb-4 text-muted-foreground">
                            点击下面的按钮测试不同类型的Toast通知。
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button onClick={showSuccessToast} variant="default">
                                成功提示
                            </Button>
                            <Button onClick={showErrorToast} variant="destructive">
                                错误提示
                            </Button>
                            <Button onClick={showWarningToast} variant="outline">
                                警告提示
                            </Button>
                            <Button onClick={showInfoToast} variant="secondary">
                                信息提示
                            </Button>
                        </div>
                    </section>

                    <section className="p-6 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">API错误测试</h2>
                        <p className="mb-4 text-muted-foreground">
                            点击下面的按钮模拟API和网络错误。
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button onClick={simulateApiError} variant="outline">
                                模拟API错误
                            </Button>
                            <Button onClick={simulateNetworkError} variant="outline">
                                模拟网络错误
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
} 