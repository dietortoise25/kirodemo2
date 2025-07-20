import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * 错误边界组件
 * 捕获子组件中的 JavaScript 错误，并显示备用 UI
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        // 更新 state，下次渲染时显示备用 UI
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // 可以在这里记录错误信息
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null
        });
    }

    render(): ReactNode {
        if (this.state.hasError) {
            // 如果提供了自定义的 fallback，则使用它
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // 否则显示默认的错误 UI
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">出错了</h2>
                    <p className="text-muted-foreground mb-6">
                        应用程序遇到了一个错误。
                    </p>
                    {this.state.error && (
                        <div className="bg-muted p-4 rounded-md mb-6 max-w-full overflow-auto">
                            <p className="font-mono text-sm break-all whitespace-pre-wrap">
                                {this.state.error.toString()}
                            </p>
                        </div>
                    )}
                    <Button onClick={this.handleReset}>
                        尝试恢复
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
} 