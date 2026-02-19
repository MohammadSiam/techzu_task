import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/utils/password";
import dotenv from "dotenv";
dotenv.config();

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || "5432";
const DB_NAME = process.env.DB_NAME || "social_feed";
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "postgres";

const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create users
  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      username: "alice",
      email: "alice@example.com",
      passwordHash: await hashPassword("password123"),
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      username: "bob",
      email: "bob@example.com",
      passwordHash: await hashPassword("password123"),
    },
  });

  const charlie = await prisma.user.upsert({
    where: { email: "charlie@example.com" },
    update: {},
    create: {
      username: "charlie",
      email: "charlie@example.com",
      passwordHash: await hashPassword("password123"),
    },
  });

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      content: "Just joined the social feed! Excited to connect with everyone.",
      userId: alice.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      content:
        "Working on a new React Native project today. The Expo ecosystem is amazing!",
      userId: bob.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      content: "Beautiful sunset today. Sometimes you just need to stop and appreciate the little things.",
      userId: charlie.id,
    },
  });

  const post4 = await prisma.post.create({
    data: {
      content: "TypeScript + Prisma is such a powerful combo for backend development.",
      userId: alice.id,
    },
  });

  // Create likes
  await prisma.like.createMany({
    data: [
      { userId: bob.id, postId: post1.id },
      { userId: charlie.id, postId: post1.id },
      { userId: alice.id, postId: post2.id },
      { userId: charlie.id, postId: post2.id },
      { userId: alice.id, postId: post3.id },
      { userId: bob.id, postId: post4.id },
    ],
  });

  // Create comments
  await prisma.comment.createMany({
    data: [
      { content: "Welcome aboard!", userId: bob.id, postId: post1.id },
      { content: "Great to have you here!", userId: charlie.id, postId: post1.id },
      { content: "Expo is the best!", userId: alice.id, postId: post2.id },
      { content: "Couldn't agree more!", userId: bob.id, postId: post3.id },
    ],
  });

  console.log("Seed complete!");
  console.log(`Created ${3} users, ${4} posts, ${6} likes, ${4} comments`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
