import { getBlock } from "@/services/notion/block"
import { ImageBlockExtended } from "@/services/notion/types"
import { NextRequest, NextResponse } from "next/server"

type GetBlockResponse = {
  block: ImageBlockExtended | null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { block: null },
        { status: 400 }
      )
    }
    
    const block = (await getBlock(id)) as ImageBlockExtended
    
    return NextResponse.json(
      { block },
      { status: block ? 200 : 400 }
    )
  } catch (error) {
    console.error('Error fetching block:', error)
    return NextResponse.json(
      { block: null },
      { status: 400 }
    )
  }
}