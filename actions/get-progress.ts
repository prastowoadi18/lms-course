import { db } from "@/lib/db";
import React from "react";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChpaterIds = publishedChapters.map((chapter) => chapter.id);
    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChpaterIds,
        },
        isCompleted: true,
      },
    });

    const progressPercentage =
      (validCompletedChapters / publishedChpaterIds.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
