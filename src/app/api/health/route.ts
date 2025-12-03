import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'quantalyze-digital-agency'
    },
    { status: 200 }
  );
}
