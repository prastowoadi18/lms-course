import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import { CourseSidebar } from "./_component/course-sidebar";
import CourseNavar from "./_component/course-navbar";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const progressCount = await getProgress(userId, course.id);

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavar course={course} progressCount={progressCount} />
      </div>
      <div className="fixed inset-y-0 z-50 flex-col hidden h-full md:flex w-80">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="h-full pt-[80px] md:pl-80">{children}</main>
    </div>
  );
};

export default CourseLayout;
