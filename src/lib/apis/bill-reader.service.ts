import type { BillReaderResponse, BillReaderRequest } from '../types/bill-reader';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export class BillReaderService {
  private static instance: BillReaderService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = API_BASE_URL;
  }

  public static getInstance(): BillReaderService {
    if (!BillReaderService.instance) {
      BillReaderService.instance = new BillReaderService();
    }
    return BillReaderService.instance;
  }

  /**
   * Analyzes a bill image and returns the bill data
   * @param request - The bill reader request containing the image
   * @returns Promise<BillReaderResponse> - The analyzed bill data
   */
  async analyzeBill(request: BillReaderRequest): Promise<BillReaderResponse> {
    try {
      const formData = new FormData();
      formData.append('image', request.image);

      const response = await fetch(`${this.baseUrl}/primary/v1/bills/reader`, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type header when using FormData
          // The browser will set it automatically with the boundary
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BillReaderResponse = await response.json();
      
      // Validate the response structure
      if (!data || !data.data || !data.data.billAnalysis) {
        throw new Error('Invalid response structure from bill reader API');
      }

      return data;
    } catch (error) {
      console.error('Error analyzing bill:', error);
      throw new Error(`Failed to analyze bill: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validates if the response is a valid bill
   * @param response - The bill reader response
   * @returns boolean - True if it's a valid bill
   */
  isValidBill(response: BillReaderResponse): boolean {
    return response.data.billAnalysis.isBill && !response.data.billAnalysis.isBlur;
  }

  /**
   * Gets the total bill amount
   * @param response - The bill reader response
   * @returns number - The total bill amount
   */
  getBillTotal(response: BillReaderResponse): number {
    return response.data.billAnalysis.data.billTotalPrice;
  }

  /**
   * Gets the bill items
   * @param response - The bill reader response
   * @returns BillItem[] - Array of bill items
   */
  getBillItems(response: BillReaderResponse) {
    return response.data.billAnalysis.data.items;
  }
} 