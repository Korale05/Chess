import bcrypt from "bcrypt";
export async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}
export async function comparePassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
}
//# sourceMappingURL=hashPassword.js.map