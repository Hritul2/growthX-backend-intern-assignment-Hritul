// utils/db.ts
import { PrismaClient } from "@prisma/client";

class Db {
  private static instance: PrismaClient;

  private constructor() {} // Private constructor to prevent instantiation

  public static getInstance(): PrismaClient {
    if (!Db.instance) {
      Db.instance = new PrismaClient();
    }
    Db.instance
      .$connect()
      .then(() => {
        console.log("Connected to Database");
      })
      .catch((err) => {
        console.error("Error connecting to database", err);
      });
    return Db.instance;
  }
}

export default Db;
