import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { BillReaderService } from '../../../../../../lib/apis/bill-reader.service';
import { handleApiError, BillReaderError } from '../../../../../../lib/utils/error-handler';
import type { BillReaderResponse } from '../../../../../../lib/types/bill-reader';

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Parse the form data
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    // Validate the image file
    if (!imageFile) {
      throw new BillReaderError('Image file is required', 400);
    }

    if (!imageFile.type.startsWith('image/')) {
      throw new BillReaderError('File must be an image', 400);
    }

    // Get the bill reader service instance
    const billReaderService = BillReaderService.getInstance();

    // Analyze the bill
    const response: BillReaderResponse = await billReaderService.analyzeBill({
      image: imageFile
    });

    // Return the response
    return json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Bill reader API error:', error);
    
    const apiError = handleApiError(error);
    
    return json({
      status: apiError.status,
      message: apiError.message,
      error: apiError.code
    }, {
      status: apiError.status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 