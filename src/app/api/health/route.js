import { NextResponse } from 'next/server';

export async function GET() {
	return NextResponse.json({
		status: 'ok',
		timestamp: new Date().toISOString(),
		message: 'Health check from Next.js API route'
	});
}


