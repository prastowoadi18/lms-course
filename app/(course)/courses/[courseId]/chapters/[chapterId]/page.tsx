import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import { VideoPlayer } from "./_component/video-player";
import { CourseEnrollButton } from "./_component/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { CourseProgressButton } from "./_component/course-progress-button";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div className="">
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter" />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl pb-2 mx-auto">
        <VideoPlayer
          chapterId={params.chapterId}
          title={chapter.title}
          courseId={params.courseId}
          nextChapterId={nextChapter?.id}
          playbackId={muxData?.playbackId!}
          isLocked={isLocked}
          completeOnEnd={completeOnEnd}
        />
      </div>
      <div className="flex flex-col items-center justify-between p-4 md:flex-row">
        <h2 className="mb-2 text-2xl font-semibold">{chapter.title}</h2>
        {purchase ? (
          <CourseProgressButton
            chapterId={params.chapterId}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            isCompleted={!!userProgress?.isCompleted}
          />
        ) : (
          <CourseEnrollButton
            courseId={params.courseId}
            price={course.price!}
          />
        )}
      </div>
      <Separator />
      <div className="">
        <Preview value={chapter.description!} />
      </div>
      {!!attachments.length && (
        <>
          <Separator />
          <div className="p-4">
            {attachments.map((attachment) => (
              <a
                href={attachment.url}
                target="_blank"
                className="flex items-center w-full p-3 border rounded-md bg-sky-200 text-sky-700 hover:underline"
                key={attachment.id}
              >
                <File />
                <p>{attachment.name}</p>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ChapterIdPage;
