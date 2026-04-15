-- CreateTable
CREATE TABLE "issues" (
    "id" SERIAL NOT NULL,
    "gitlabIid" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "labels" TEXT,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "issues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "issues_gitlabIid_key" ON "issues"("gitlabIid");
