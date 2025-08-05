# FleeBill Web - Bill Reader API

A SvelteKit application that provides bill analysis functionality through image processing.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Route      │    │   Service       │    │   External      │
│   (Hero.svelte) │───▶│   (+server.ts)   │───▶│   Layer         │───▶│   API/Service   │
└─────────────────┘    └──────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📊 Data Flow Documentation

### 1. **User Interaction Flow**

```
User clicks "Bill" button
         ↓
File picker opens
         ↓
User selects image file
         ↓
File validation (image type check)
         ↓
Loading state activated
         ↓
API call to /api/bill-reader
         ↓
Server processes image
         ↓
Response returned to frontend
         ↓
Success/Error state displayed
```

### 2. **Frontend Components**

#### Hero.svelte
- **Location**: `src/lib/components/Hero.svelte`
- **Purpose**: Main UI component for bill analysis
- **Key Functions**:
  - `openImagePicker()`: Triggers file selection
  - `handleFileChange()`: Processes selected file
  - `readBill()`: Initiates bill analysis
  - `handleRetry()`: Retry failed requests
  - `handleCloseError()`: Clear error state

#### ErrorHandler.svelte
- **Location**: `src/lib/components/ErrorHandler.svelte`
- **Purpose**: Displays errors and provides retry functionality
- **Props**:
  - `error`: Error message string
  - `onRetry`: Retry callback function
  - `onClose`: Close error callback function

### 3. **API Route Layer**

#### `/api/bill-reader/+server.ts`
- **Endpoint**: `POST /api/bill-reader`
- **Purpose**: Server-side API handler for bill analysis
- **Process**:
  1. Receives multipart form data with image
  2. Validates file type (must be image)
  3. Calls BillReaderService
  4. Returns JSON response or error

```typescript
// Request Format
FormData {
  image: File (image/*)
}

// Response Format
{
  status: 200,
  message: "OK",
  data: {
    billAnalysis: { /* bill data */ },
    imageUsed: boolean,
    imageFileName: string,
    timestamp: string
  }
}
```

### 4. **Service Layer**

#### BillReaderService
- **Location**: `src/lib/apis/bill-reader.service.ts`
- **Pattern**: Singleton service
- **Methods**:
  - `analyzeBill(request)`: Main analysis method
  - `isValidBill(response)`: Validates bill response
  - `getBillTotal(response)`: Extracts total amount
  - `getBillItems(response)`: Extracts bill items

#### Error Handling
- **Location**: `src/lib/utils/error-handler.ts`
- **Classes**:
  - `ApiError`: Base error class
  - `BillReaderError`: Specific bill reader errors
- **Utilities**:
  - `handleApiError()`: Consistent error handling
  - `isNetworkError()`: Network error detection

### 5. **Type Definitions**

#### Bill Reader Types
- **Location**: `src/lib/types/bill-reader.ts`
- **Interfaces**:
  - `BillItem`: Individual bill items
  - `BillAnalysisData`: Bill analysis data
  - `BillAnalysis`: Complete bill analysis
  - `BillReaderResponse`: API response structure
  - `BillReaderRequest`: API request structure

## 🔄 Detailed Data Flow

### Step 1: User Initiates Analysis
```typescript
// Hero.svelte
const openImagePicker = () => {
  fileInput.click(); // Triggers hidden file input
};
```

### Step 2: File Selection & Validation
```typescript
// Hero.svelte
const handleFileChange = async (event: Event) => {
  const file = event.target.files[0];
  
  // Client-side validation
  if (!file.type.startsWith('image/')) {
    error = 'Please select an image file';
    return;
  }
  
  await readBill(); // Proceed with analysis
};
```

### Step 3: API Request
```typescript
// Hero.svelte
const readBill = async () => {
  isAnalyzing = true;
  
  try {
    const response = await billReaderService.analyzeBill({ image: file });
    billResult = response;
  } catch (err) {
    error = handleApiError(err).message;
  } finally {
    isAnalyzing = false;
  }
};
```

### Step 4: Service Layer Processing
```typescript
// BillReaderService
async analyzeBill(request: BillReaderRequest): Promise<BillReaderResponse> {
  const formData = new FormData();
  formData.append('image', request.image);
  
  const response = await fetch('/api/bill-reader', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
}
```

### Step 5: Server-Side Processing
```typescript
// +server.ts
export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData();
  const imageFile = formData.get('image') as File;
  
  // Server-side validation
  if (!imageFile.type.startsWith('image/')) {
    throw new BillReaderError('File must be an image', 400);
  }
  
  // Process through service
  const response = await billReaderService.analyzeBill({ image: imageFile });
  
  return json(response);
};
```

### Step 6: Response Handling
```typescript
// Frontend receives response
{
  status: 200,
  message: "OK",
  data: {
    billAnalysis: {
      data: {
        billDate: 1533808925000,
        billTotalPrice: 60500,
        name: "McDonald's Bandung Indah Plaza",
        items: [/* bill items */]
      },
      isBill: true,
      isBlur: false,
      isHandwriting: false
    },
    imageUsed: true,
    imageFileName: "image-1754367911008-6515398.jpg",
    timestamp: "2025-08-05T04:25:13.527Z"
  }
}
```

## 🛠️ Error Handling Flow

### Client-Side Errors
1. **File Type Validation**: Non-image files rejected
2. **Network Errors**: Connection issues handled
3. **API Errors**: Server errors displayed to user

### Server-Side Errors
1. **Missing File**: 400 Bad Request
2. **Invalid File Type**: 400 Bad Request
3. **Processing Errors**: 500 Internal Server Error
4. **External API Errors**: Propagated with status codes

## 📁 File Structure

```
src/
├── lib/
│   ├── apis/
│   │   ├── bill-reader.service.ts    # Service layer
│   │   └── index.ts                  # API exports
│   ├── components/
│   │   ├── Hero.svelte              # Main UI component
│   │   ├── ErrorHandler.svelte      # Error display
│   │   └── AppButton.svelte         # Button component
│   ├── types/
│   │   ├── bill-reader.ts           # Type definitions
│   │   └── index.ts                 # Type exports
│   └── utils/
│       ├── error-handler.ts         # Error utilities
│       └── index.ts                 # Utility exports
└── routes/
    └── api/
        └── bill-reader/
            └── +server.ts           # API endpoint
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Test Bill Reader**
   - Navigate to the homepage
   - Click the "Bill" button
   - Select an image file
   - View the analysis results

## 🔧 Configuration

### API Base URL
- **Location**: `src/lib/apis/bill-reader.service.ts`
- **Default**: `http://localhost:3000`
- **Customization**: Update `API_BASE_URL` constant

### Error Handling
- **Location**: `src/lib/utils/error-handler.ts`
- **Customization**: Extend `ApiError` class for specific error types

## 📝 API Documentation

### POST /api/bill-reader

**Request:**
- Content-Type: `multipart/form-data`
- Body: `{ image: File }`

**Response:**
```json
{
  "status": 200,
  "message": "OK",
  "data": {
    "billAnalysis": {
      "data": {
        "billDate": 1533808925000,
        "billTotalPrice": 60500,
        "name": "Restaurant Name",
        "items": [...]
      },
      "isBill": true,
      "isBlur": false,
      "isHandwriting": false
    },
    "imageUsed": true,
    "imageFileName": "image.jpg",
    "timestamp": "2025-08-05T04:25:13.527Z"
  }
}
```

## 🧪 Testing

The implementation includes:
- **Type Safety**: Full TypeScript support
- **Error Handling**: Comprehensive error management
- **Validation**: Client and server-side validation
- **User Feedback**: Loading states and error messages

## 🔒 Security Considerations

1. **File Validation**: Server-side image type validation
2. **Error Sanitization**: Errors don't expose internal details
3. **Input Validation**: All inputs validated before processing
4. **CORS**: Proper cross-origin handling through SvelteKit

## 📈 Scalability

The architecture supports:
- **Service Layer**: Easy to extend with new services
- **Type Safety**: Prevents runtime errors
- **Error Handling**: Consistent error management
- **Component Reusability**: Modular component structure
