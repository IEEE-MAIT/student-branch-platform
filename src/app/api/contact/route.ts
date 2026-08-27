import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sanitizePlainText } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const body: any = await req.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    const safeName = sanitizePlainText(name, 100);
    const safeEmail = sanitizePlainText(email, 150).toLowerCase();
    const safeSubject = sanitizePlainText(subject || 'General Inquiry', 200);
    const safeMessage = sanitizePlainText(message, 3000);

    // Save the inquiry to the dedicated Inquiry table
    await prisma.inquiry.create({
      data: {
        name: safeName,
        email: safeEmail,
        subject: safeSubject,
        message: safeMessage,
        createdAt: new Date().toISOString(),
        status: 'Unread',
      },
    });

    return NextResponse.json(
      { success: true, message: 'Your inquiry has been received. We will respond shortly.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Contact API] Error:', error);
    return NextResponse.json(
      { error: 'Server error. Please try again later.' },
      { status: 500 }
    );
  }
}
