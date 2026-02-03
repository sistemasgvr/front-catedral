import { isAxiosError } from "axios";
import axios from "axios";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://vznzemijoprwsqflcvob.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.API_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6bnplbWlqb3Byd3NxZmxjdm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwODYzNDIsImV4cCI6MjA4NDY2MjM0Mn0.L4FhiyUXXqBlSn5M7BoxqG8s6yghJEt6TfV0k0f8taI";

const BUCKET_NAME = "vouchers";

/**
 * Sube el comprobante de pago a Supabase Storage
 * @param file - Archivo a subir (imagen o PDF)
 * @returns URL pública del archivo subido
 *
 * Nota: Cree el bucket 'vouchers' en Supabase Storage y configúrelo como público.
 */
export const uploadVoucher = async (file: File): Promise<string> => {
  try {
    const timestamp = Date.now();
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `voucher_${timestamp}_${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const formData = new FormData();
    formData.append("file", file);

    await axios.post(
      `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${fileName}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
          "x-upsert": "true",
          // ⚠️ NO pongas Content-Type acá
        },
      }
    );

    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${fileName}`;
  } catch (error) {
    if (isAxiosError(error)) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error al subir el comprobante";
      throw new Error(typeof msg === "string" ? msg : "Error al subir el comprobante");
    }
    throw new Error("No se pudo subir el comprobante. Intente nuevamente.");
  }
};

