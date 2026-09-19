import { LoginCredentials, LoginResult, UserInfo } from '../types/auth';

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

      const resolvedTaxCode =
        resJson.data?.account?.tax_code ||
        resJson.data?.tax_code ||
        resJson.data?.user?.tax_code ||
        credentials.taxCode.trim();

      const resolvedAccountId =
        resJson.data?.account?.id ? String(resJson.data.account.id) :
        resJson.data?.default_account?.id ? String(resJson.data.default_account.id) :
        resJson.data?.user?.default_account_id ? String(resJson.data.user.default_account_id) :
        undefined;

      const user: UserInfo = {
        ...(resJson.data?.user || {}),
        id: resolvedAccountId || (resJson.data?.user?.id ? String(resJson.data.user.id) : undefined),
        name: resJson.data?.user?.name || resJson.data?.name || credentials.username,
        tax_code: resolvedTaxCode,
        accountId: resolvedAccountId,
        username: resJson.data?.user?.username || resJson.data?.username || credentials.username,
        companyName: resJson.data?.account?.name || resJson.data?.company_name || 'Doanh nghiệp inTrace',
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
