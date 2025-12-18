import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/communications
 * Get email and invitation monitoring data (admin only)
 */
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Fetch invitation statistics
    const [
      totalInvitations,
      pendingInvitations,
      acceptedInvitations,
      expiredInvitations,
    ] = await Promise.all([
      prisma.invitation.count(),
      prisma.invitation.count({
        where: {
          accepted: false,
          expires: { gt: new Date() },
        },
      }),
      prisma.invitation.count({
        where: { accepted: true },
      }),
      prisma.invitation.count({
        where: {
          accepted: false,
          expires: { lte: new Date() },
        },
      }),
    ]);

    // Fetch recent invitations with details
    const recentInvitations = await prisma.invitation.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        accepted: true,
        expires: true,
        createdAt: true,
        createdBy: true,
      },
    });

    // Fetch email logs for invitations and transfers
    const emailLogs = await prisma.systemLog.findMany({
      where: {
        action: {
          in: [
            "invitation_email_queued",
            "invitation_email_sent",
            "invitation_email_failed",
            "email_queued",
            "email_sent",
            "email_failed",
          ],
        },
      },
      orderBy: { timestamp: "desc" },
      take: limit,
      skip: offset,
      select: {
        id: true,
        timestamp: true,
        action: true,
        userId: true,
        userName: true,
        details: true,
        success: true,
        errorMessage: true,
      },
    });

    // Parse email log details (stored as JSON strings)
    const parsedEmailLogs = emailLogs.map((log) => ({
      ...log,
      details: log.details ? JSON.parse(log.details) : null,
    }));

    // Get email statistics
    const [
      totalEmailsSent,
      totalEmailsFailed,
      totalInvitationEmails,
      totalTransferEmails,
    ] = await Promise.all([
      prisma.systemLog.count({
        where: { action: { endsWith: "_sent" } },
      }),
      prisma.systemLog.count({
        where: { action: { endsWith: "_failed" } },
      }),
      prisma.systemLog.count({
        where: { action: { startsWith: "invitation_email_" } },
      }),
      prisma.systemLog.count({
        where: {
          action: { in: ["email_sent", "email_failed"] },
          details: { contains: "internal_transfer" },
        },
      }),
    ]);

    // Get user activity - recent logins
    const recentLogins = await prisma.systemLog.findMany({
      where: {
        eventType: "auth_event",
        action: "login",
        success: true,
      },
      orderBy: { timestamp: "desc" },
      take: 20,
      select: {
        timestamp: true,
        userId: true,
        userName: true,
        details: true,
      },
    });

    // Get unique active users today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const activeUsersToday = await prisma.systemLog.findMany({
      where: {
        eventType: "auth_event",
        action: "login",
        success: true,
        timestamp: { gte: todayStart },
      },
      distinct: ["userId"],
      select: { userId: true },
    });

    // Get total users
    const totalUsers = await prisma.user.count();
    
    // Get users who have never logged in (created but no login logs)
    const usersWithLogins = await prisma.systemLog.findMany({
      where: {
        eventType: "auth_event",
        action: "login",
        success: true,
      },
      distinct: ["userId"],
      select: { userId: true },
    });
    
    const usersWhoLoggedIn = new Set(usersWithLogins.map(l => l.userId).filter(Boolean));
    const usersNeverLoggedIn = totalUsers - usersWhoLoggedIn.size;

    return NextResponse.json({
      success: true,
      data: {
        invitations: {
          total: totalInvitations,
          pending: pendingInvitations,
          accepted: acceptedInvitations,
          expired: expiredInvitations,
          recent: recentInvitations,
        },
        emails: {
          totalSent: totalEmailsSent,
          totalFailed: totalEmailsFailed,
          invitationEmails: totalInvitationEmails,
          transferEmails: totalTransferEmails,
          recentLogs: parsedEmailLogs,
        },
        users: {
          total: totalUsers,
          activeToday: activeUsersToday.length,
          neverLoggedIn: usersNeverLoggedIn,
          recentLogins: recentLogins.map(log => ({
            timestamp: log.timestamp,
            userId: log.userId,
            userName: log.userName,
            email: log.details ? JSON.parse(log.details).email : null,
          })),
        },
      },
      pagination: {
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Error fetching communication data:", error);
    return NextResponse.json(
      { error: "Failed to fetch communication data" },
      { status: 500 }
    );
  }
}
