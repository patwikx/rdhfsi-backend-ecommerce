import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { productsId, companyName, poNumber, address, contactNumber } = await req.json();

    // Validate product IDs
    if (!productsId || productsId.length === 0) {
      return new NextResponse("Product ids are required", { status: 400, headers: corsHeaders });
    }

    // Validate delivery information
    if (!companyName || !poNumber || !address || !contactNumber) {
      return new NextResponse("All delivery information fields are required", { status: 400, headers: corsHeaders });
    }

    // Fetch the products
    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productsId
        }
      }
    });

    if (products.length === 0) {
      return new NextResponse("No products found with the given ids", { status: 404, headers: corsHeaders });
    }

    // Create the order with delivery information
    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        companyName,
        poNumber,
        contactNumber,
        address,
        orderItems: {
          create: productsId.map((productId: string) => ({
            product: {
              connect: {
                id: productId
              }
            }
          }))
        }
      }
    });

    // Return success response (could be a redirect URL to a payment page)
    return NextResponse.json(
      {
        message: "Order created successfully",
        orderId: order.id,
        products,
        deliveryInfo: {
          companyName,
          poNumber,
          address,
          contactNumber,
        }
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return new NextResponse("Internal Server Error", { status: 500, headers: corsHeaders });
  }
}
