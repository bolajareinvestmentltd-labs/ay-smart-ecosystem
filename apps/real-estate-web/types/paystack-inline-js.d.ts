declare module '@paystack/inline-js' {
  type PaystackResult = { reference: string };
  type PaystackOptions = {
    onSuccess?: (result: PaystackResult) => void;
    onCancel?: () => void;
  };

  export default class Paystack {
    resumeTransaction(accessCode: string, options?: PaystackOptions): void;
  }
}
