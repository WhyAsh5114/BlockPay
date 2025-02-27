import { moonpayConfig } from './moonpay.config';
import axios from 'axios';
import crypto from 'crypto';

export class MoonpayService {
  private apiKey: string;
  private secretKey: string;
  private apiBaseUrl: string;
  private widgetBaseUrl: string;
  private currencyCode: string;

  constructor() {
    this.apiKey = moonpayConfig.apiKey;
    this.secretKey = moonpayConfig.secretKey;
    this.apiBaseUrl = moonpayConfig.apiBaseUrl;
    this.widgetBaseUrl = moonpayConfig.widgetBaseUrl;
    this.currencyCode = moonpayConfig.currencyCode;
  }

  // Generate signature for security
  private generateSignature(params: any): string {
    const queryParams = new URLSearchParams(params).toString();
    const message = queryParams;
    const hmac = crypto.createHmac('sha256', this.secretKey);
    hmac.update(message);
    return hmac.digest('hex');
  }

  // Function to generate the MoonPay widget URL for buying crypto (on-ramp)
  public async getBuyWidgetUrl(walletAddress: string, redirectUrl: string): Promise<string> {
    const params = {
      apiKey: this.apiKey,
      currencyCode: this.currencyCode,
      walletAddress: walletAddress,
      redirectURL: redirectUrl,
    };

    const signature = this.generateSignature(params);

    const widgetUrl = `${this.widgetBaseUrl}?${new URLSearchParams(params).toString()}&signature=${signature}`;
    return widgetUrl;
  }

  // Function to generate the MoonPay widget URL for selling crypto (off-ramp)
  public async getSellWidgetUrl(walletAddress: string, redirectUrl: string): Promise<string> {
      const params = {
          apiKey: this.apiKey,
          currencyCode: this.currencyCode,
          walletAddress: walletAddress,
          redirectURL: redirectUrl,
          // Add other necessary parameters for selling, like the desired fiat currency
      };

      const signature = this.generateSignature(params);

      const widgetUrl = `${this.widgetBaseUrl}/sell?${new URLSearchParams(params).toString()}&signature=${signature}`;
      return widgetUrl;
  }

  // Fetch transaction status from MoonPay API
  public async getTransactionStatus(transactionId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/transactions/${transactionId}?apiKey=${this.apiKey}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching transaction status:', error.message);
      throw error;
    }
  }
}
