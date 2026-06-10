import { db } from "../db";
import {
  applicationFolders,
  applicationFolderJobApplication,
  jobApplications,
} from "../db/schema";

export async function populateNewUser(userId: string) {
  await db.transaction(async (tx) => {
    const [favorites] = await tx
      .insert(applicationFolders)
      .values({ name: "Favorites", ownerId: userId })
      .returning({ id: applicationFolders.id });

    const [archived] = await tx
      .insert(applicationFolders)
      .values({ name: "Archived", ownerId: userId })
      .returning({ id: applicationFolders.id });

    const [fdm] = await tx
      .insert(jobApplications)
      .values({
        companyName: "FDM Group",
        position: "Social Media Intern.",
        notes: "",
        status: 0,
        ownerId: userId,
        jobPostingUrl: "",
      })
      .returning({ id: jobApplications.id });

    const [google] = await tx
      .insert(jobApplications)
      .values({
        companyName: "Google",
        position: "Software Engineer",
        notes: "Applied through referral",
        status: 1,
        ownerId: userId,
        jobPostingUrl: "https://careers.google.com/jobs/results/1234567890-software-engineer/",
      })
      .returning({ id: jobApplications.id });

    const [microsoft] = await tx
      .insert(jobApplications)
      .values({
        companyName: "Microsoft",
        position: "Data Scientist",
        notes: "Interview scheduled for next week",
        status: 4,
        ownerId: userId,
        jobPostingUrl: "https://careers.microsoft.com/jobs/results/0987654321-data-scientist/",
      })
      .returning({ id: jobApplications.id });

    await tx.insert(applicationFolderJobApplication).values([
      { folderId: favorites.id, applicationId: fdm.id },
      { folderId: favorites.id, applicationId: google.id },
      { folderId: archived.id, applicationId: google.id },
      { folderId: archived.id, applicationId: microsoft.id },
    ]);
  });
}
