-- CreateTable
CREATE TABLE "GuestIssue" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "labels" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" TEXT,
    "platform" TEXT,
    "gitlabIid" INTEGER,
    "reviewerId" TEXT,

    CONSTRAINT "GuestIssue_pkey" PRIMARY KEY ("id")
);
