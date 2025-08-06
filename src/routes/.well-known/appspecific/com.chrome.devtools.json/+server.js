import { json } from '@sveltejs/kit';

export async function GET() {
	// This endpoint is requested by Chrome DevTools when inspecting web pages
	// Return a response indicating this is not a Chrome extension
	return json({
		error: 'Not a Chrome extension',
		message: 'This is a SvelteKit web application, not a Chrome extension'
	}, {
		status: 200
	});
} 