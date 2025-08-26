import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { storedSession } = await request.json();

    if (!storedSession || !storedSession.user) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    // Check if the stored session is still valid by comparing with server session
    const serverSession = await getServerSession(authOptions);

    if (serverSession?.user?.id === storedSession.user.id) {
      // Session is valid
      return NextResponse.json({
        valid: true,
        session: serverSession,
      });
    }

    // Session is invalid
    return NextResponse.json({ valid: false });
  } catch (error) {
    console.error("Session restoration error:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Simply return the current server session
    const session = await getServerSession(authOptions);

    if (session) {
      return NextResponse.json({
        valid: true,
        session,
      });
    }

    return NextResponse.json({ valid: false });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
