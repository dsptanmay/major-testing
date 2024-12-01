import { db } from "@/database/db";
import { organizationGrantedTokens, userNFTsTable } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface OrganizationPostRequest {
  org_name: string;
  token_id: string;
  title: string;
  description: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: OrganizationPostRequest = await request.json();
    const { org_name, token_id } = body;

    if (!org_name || !token_id)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 404 }
      );

    const userData = await db
      .select()
      .from(userNFTsTable)
      .where(eq(userNFTsTable.token_id, token_id));

    if (userData.length === 0)
      return NextResponse.json(
        { error: "Token does not exist" },
        { status: 400 }
      );
    const title = userData[0].title;
    const description = userData[0].description;
    const newRecord = await db
      .insert(organizationGrantedTokens)
      .values({ org_name, token_id, title, description })
      .returning();

    if (newRecord.length === 0)
      return NextResponse.json(
        { error: "Organization already has access to token" },
        { status: 401 }
      );

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}