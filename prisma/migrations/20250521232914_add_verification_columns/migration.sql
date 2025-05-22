-- Add verificationToken column to User table
ALTER TABLE "User" ADD COLUMN "verificationToken" TEXT UNIQUE;

-- Add verificationExpires column to User table
ALTER TABLE "User" ADD COLUMN "verificationExpires" TIMESTAMP(3);

-- Create index for better performance
CREATE INDEX "User_verificationToken_idx" ON "User"("verificationToken");
