export interface BillItem {
  amount: number;
  name: string;
  totalPrice: number;
  type: string;
  unitPrice: number;
  discount: number | null;
}

export interface BillAnalysisData {
  billDate: number;
  billTotalPrice: number;
  name: string;
  billDiscounts: any | null;
  items: BillItem[];
  otherCosts: any | null;
}

export interface BillAnalysis {
  data: BillAnalysisData;
  isBill: boolean;
  isBlur: boolean;
  isHandwriting: boolean;
}

export interface BillReaderResponse {
  status: number;
  message: string;
  data: {
    billAnalysis: BillAnalysis;
    imageUsed: boolean;
    imageFileName: string;
    timestamp: string;
  };
}

export interface BillReaderRequest {
  image: File;
  // Add other request parameters as needed
} 