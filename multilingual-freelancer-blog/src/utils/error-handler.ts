/**
 * API 错误类
 */
export class ApiError extends Error {
  status: number;
  data?: Record<string, unknown>;

  constructor(message: string, status: number, data?: Record<string, unknown>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * 网络错误类
 */
export class NetworkError extends Error {
  constructor(message = "Network error occurred") {
    super(message);
    this.name = "NetworkError";
  }
}

/**
 * 处理 API 响应
 * @param response Fetch API 响应
 * @returns 处理后的响应数据
 * @throws ApiError 当响应不成功时
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: Record<string, unknown>;
    try {
      errorData = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      errorData = { message: response.statusText };
    }

    throw new ApiError(
      (errorData.message as string) || `API error: ${response.status}`,
      response.status,
      errorData
    );
  }

  try {
    return (await response.json()) as T;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    throw new Error("Invalid JSON response");
  }
}

/**
 * 处理 API 错误
 * @param error 捕获的错误
 * @returns 格式化的错误信息
 */
export function handleApiError(error: unknown): {
  message: string;
  status?: number;
  details?: Record<string, unknown>;
} {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      status: error.status,
      details: error.data,
    };
  }

  if (error instanceof NetworkError) {
    return {
      message: error.message,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "An unknown error occurred",
  };
}

/**
 * 创建 API 请求
 * @param url 请求 URL
 * @param options 请求选项
 * @returns 响应数据
 * @throws ApiError 当 API 响应不成功时
 * @throws NetworkError 当网络错误发生时
 */
export async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);
    return await handleApiResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new NetworkError(
      error instanceof Error ? error.message : "Network request failed"
    );
  }
}
