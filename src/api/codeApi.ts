import type { ApiResponse, OptionItem } from '../types/info';

type CodeItem = {
  codeId: string;
  codeName: string;
};

export async function getCodeOptions(kbn: string): Promise<OptionItem[]> {
  const response = await fetch(`/code?codeKbn=${encodeURIComponent(kbn)}`, {
    method: 'GET',
  });

  const json: ApiResponse<CodeItem[]> = await response.json();

  if (json.status !== 200) {
    throw new Error(`コード取得失敗: ${json.status}`);
  }

  return json.data.map((item) => ({
    value: item.codeId,
    label: item.codeName,
  }));
}