// utils/db.ts
import { PrismaClient } from "@prisma/client";

class Db {
  private static instance: PrismaClient;

  private constructor() {} // Private constructor to prevent instantiation

  public static getInstance(): PrismaClient {
    if (!Db.instance) {
      Db.instance = new PrismaClient();
    }
    return Db.instance;
  }
}

export default Db;
