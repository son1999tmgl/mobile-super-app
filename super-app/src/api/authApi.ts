import { LoginCredentials, LoginResult } from '../types/auth';

/**
 * Gọi API Đăng nhập inTrace Gateway
 */
export async function loginUser(
  gatewayUrl: string,
  credentials: LoginCredentials
): Promise<LoginResult> {
  const requestUrl = `${gatewayUrl}/login`;
  const payload = {
    tax_code: credentials.taxCode.trim(),
    username: credentials.username.trim(),
    password: credentials.password,
  };

  try {
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const resText = await response.text();
    let resJson: any = null;
    try {
      resJson = JSON.parse(resText);
    } catch {
      resJson = { raw: resText };
    }

    if (response.ok && resJson && resJson.status === 'success') {
      const token =
        resJson.data?.access_token ||
        resJson.data?.token ||
        'intrace_access_token_active';

      const user = resJson.data?.user || {
        name: resJson.data?.name || credentials.username,
        tax_code: credentials.taxCode,
        username: credentials.username,
        companyName: resJson.data?.company_name || 'Doanh nghiệp inTrace',
      };

      return {
        success: true,
        token,
        user,
        statusCode: response.status,
      };
    }

    const errCode = resJson?.code ? `[Mã lỗi: ${resJson.code}] ` : '';
    const errMsg =
      resJson?.message ||
      resJson?.error ||
      resText ||
      'Đăng nhập không thành công.';

    return {
      success: false,
      error: `${errCode}${errMsg}`,
      statusCode: response.status,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.',
      statusCode: 0,
    };
  }
}
