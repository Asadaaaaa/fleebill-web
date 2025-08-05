import { BillReaderResponse, BillReaderRequest } from '../types/bill-reader.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export class BillReaderService {
  static instance;
  baseUrl;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  static getInstance() {
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
  async analyzeBill(request) {
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

      const data = await response.json();
      
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
} 