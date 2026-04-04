import dbConnect from "@/lib/db";
import Task from "@/models/tasks";

export async function GET() {
  await dbConnect();
  const tasks = await Task.find().sort({ createdAt: -1 });
  return Response.json(tasks);
}

export async function POST(req) {
  await dbConnect();
  const { text } = await req.json();

  if (!text || text.trim() === "") {
    return new Response(JSON.stringify({ error: "Task text is required" }), {
      status: 400,
    });
  }

  const task = await Task.create({ text: text.trim() });
  return Response.json(task);
}

export async function DELETE(req) {
  await dbConnect();
  const { id } = await req.json();

  if (!id) {
    return new Response(JSON.stringify({ error: "Task ID required" }), {
      status: 400,
    });
  }

  await Task.findByIdAndDelete(id);
  return new Response(JSON.stringify({ message: "Task deleted" }), {
    status: 200,
  });
}
