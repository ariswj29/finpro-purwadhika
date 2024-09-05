import { uploadPayment } from '@/api/order';
import { useState } from 'react';

export default function UploadPaymentPage(props: any) {
  const [preview, setPreview] = useState<string | null>('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  const handlePayment = async () => {
    if (!file) {
      showToast('Please upload payment proof');
      return;
    }

    const formData = new FormData();
    formData.append('paymentProof', file);

    try {
      const response = await uploadPayment(props.order.id, formData);
      if (response.status === 'success') {
        showToast('Payment Proof Uploaded');
        setTimeout(() => {
          props.onClose(false);
          window.location.reload();
        }, 3000);
      } else {
        showToast('Failed to upload payment proof');
      }
    } catch (error) {
      showToast('Error uploading payment proof');
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 5000);
  };

  return (
    <div className="relative bg-white p-4 rounded-lg shadow-lg z-10 max-w-md mx-auto">
      {toastVisible && (
        <div className="toast toast-top toast-end top-[3rem]">
          <div className="alert alert-info">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
      <h1 className="text-xl font-bold mb-4">Upload Payment</h1>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Payment Proof
          </label>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {preview && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Image Preview"
                className="w-48 h-auto max-h-96 rounded-lg border"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <a
            className="p-2 mr-2 border border-secondary rounded-md cursor-pointer hover:font-bold"
            onClick={() => props.onClose(false)}
          >
            Close
          </a>
          <a
            className="p-2 border bg-secondary rounded-md cursor-pointer hover:font-bold"
            onClick={handlePayment}
          >
            Submit
          </a>
        </div>
      </form>
    </div>
  );
}
