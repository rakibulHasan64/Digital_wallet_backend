
import { envVars } from "../config/env";
import { IAuthProvider, Role } from "../modules/user/user.interface";
import bcryptjs from "bcryptjs";
import { User } from "../modules/user/user.model";

export const seedSuPerAdmin = async () => {
  try {
    // 1️⃣ Check env values
    if (!envVars.ADMIN_EMAIL || !envVars.ADMIN_PASSWORD || !envVars.BCRYPT_SALT_ROUND) {
      console.error("❌ Missing ADMIN_EMAIL, ADMIN_PASSWORD or BCRYPT_SALT_ROUND in .env");
      return;
    }

    // 2️⃣ Check if super admin already exists
    const isSuperAdminExist = await User.findOne({ email: envVars.ADMIN_EMAIL });
    if (isSuperAdminExist) {
      console.log("✅ Super admin already exists:", envVars.ADMIN_EMAIL);
      return;
    }

    // 3️⃣ Hash password
    const saltRounds = Number(envVars.BCRYPT_SALT_ROUND);
    if (isNaN(saltRounds)) {
      throw new Error("BCRYPT_SALT_ROUND must be a number");
    }

    const hashedPassword = await bcryptjs.hash(envVars.ADMIN_PASSWORD, saltRounds);

    // 4️⃣ Auth provider
    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.ADMIN_EMAIL,
    };

    // 5️⃣ Create super admin payload
    const payload = {
      name: "ADMIN",
      role: Role.ADMIN,
      email: envVars.ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider],
    };

    const superAdmin = await User.create(payload);

    console.log("🎉 Super admin created successfully!");
    console.log("Super Admin Email:", envVars.ADMIN_EMAIL);
    console.log("Super Admin Password (raw):", envVars.ADMIN_PASSWORD); 
  } catch (error) {
    console.error("❌ Error seeding super admin:", error);
  }
};
