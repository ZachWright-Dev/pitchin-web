// ============================================================================
// Types & Constants
// ============================================================================

export type LineItem = { id: string; name: string; qty: string; price: string };
export type AmountMode = "percent" | "dollar";

export const NUMBER_INPUT_CLASS = "no-spinner";

export function newItem(): LineItem {
  return { id: crypto.randomUUID(), name: "", qty: "1", price: "" };
}

// ============================================================================
// Helpers
// ============================================================================

export const num = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};

export const itemTotal = (item: LineItem) => num(item.price) * (num(item.qty) || 0);

export const computeAmount = (value: string, mode: AmountMode, base: number) =>
  mode === "percent" ? base * (num(value) / 100) : num(value);

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}