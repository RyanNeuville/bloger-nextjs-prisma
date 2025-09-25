import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { title, content } = req.body;

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  const email = session?.user?.email;
  if (typeof email !== "string") {
    return res
      .status(400)
      .json({ message: "User email is missing or invalid." });
  }

  const result = await prisma.post.create({
    data: {
      title,
      content: content,
      author: {
        connect: {
          email: email,
        },
      },
    },
  });

  res.json(result);
}
