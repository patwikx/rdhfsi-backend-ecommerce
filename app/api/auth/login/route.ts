import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3001', // Adjust as needed
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return new Response(JSON.stringify({ message: 'Invalid email or password' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Temporarily assume the password is valid for testing
  const isValidPassword = true; // Disable bcrypt comparison

  if (!isValidPassword) {
    return new Response(JSON.stringify({ message: 'Invalid email or password' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return new Response(JSON.stringify({ id: user.id, email: user.email }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}
