/**
 * @file src/app/api/contact/route.ts
 * @description Contact form submission API route.
 * Validates input, logs the inquiry to audit_logs, and returns a JSON response.
 * 
 * To add real email delivery, integrate with Resend or Nodemailer and
 * forward messages to mait.ieee.sb@gmail.com.
 *
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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

    // Log the inquiry to the audit trail so admins can see it in /admin
    await prisma.auditLog.create({
      data: {
        id: `contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        performedBy: `${name} <${email}>`,
        actionType: 'CONTACT_INQUIRY',
        entityType: 'ContactForm',
        entityTitle: subject || 'General Inquiry',
        changeSummary: `Message: ${message.slice(0, 300)}${message.length > 300 ? '...' : ''}`,
      },
    });

    // TODO: Integrate with an email delivery service (e.g. Resend):
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@yourdomain.com',
    //   to: 'mait.ieee.sb@gmail.com',
    //   subject: `[IEEE MAIT Contact] ${subject}`,
    //   text: `From: ${name} <${email}>\n\n${message}`,
    // });

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
